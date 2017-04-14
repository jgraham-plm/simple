define(['durandal/app', 'plugins/router', './routingManager', './requestManager', './activityProvider', './configuration/xApiSettings', './constants', './statementQueueHandler',
    './errorsHandler', 'context', 'progressContext', 'userContext', 'eventManager'],
    function (app, router, routingManager, requestManager, activityProvider, xApiSettings, constants, statementQueueHandler, errorsHandler, context, progressContext,
        userContext, eventManager) {
        "use strict";

        var
            npsEnabled = false,
            xApiEnabled = false,

            xApiInitializer = {
                initialize: initialize,
                deactivate: deactivate,
                deactivateLrsReporting: deactivateLrsReporting,
                isLrsReportingInitialized: false,
                isNpsReportingInitialized: false,
                isInitialized: isInitialized
            };

        return xApiInitializer;

        function isInitialized() {
            return xApiInitializer.isLrsReportingInitialized || xApiInitializer.isNpsReportingInitialized;
        }

        function deactivate() {
            deactivateLrsReporting();
            deactivateNpsReporting();
        }

        function deactivateLrsReporting() {
            activityProvider.turnOffxApiSubscriptions();
            xApiInitializer.isLrsReportingInitialized = false;
            app.trigger('user:authentication-skipped');
        }

        function deactivateNpsReporting() {
            activityProvider.turnOffNpsSubscriptions();
            xApiInitializer.isNpsReportingInitialized = false;
        }

        //Initialization function for moduleManager
        function initialize(xApiReportingSettings, npsReportingSettings) {
            return Q.fcall(function () {
                xApiEnabled = xApiReportingSettings.enabled;
                npsEnabled = npsReportingSettings.enabled;

                if (!xApiEnabled && !npsEnabled)
                    return;

                return initializeTracking()
                    .then(function () {
                        if (xApiEnabled) {
                            xApiSettings.initxApi(xApiReportingSettings);
                            activityProvider.subscribeToxApiEvents();
                            routingManager.mapRoutes();

                            statementQueueHandler.handle();
                            xApiInitializer.isLrsReportingInitialized = true;
                        }

                        if (npsEnabled) {
                            xApiSettings.initNps(npsReportingSettings);
                            activityProvider.subscribeToNpsEvents();

                            xApiInitializer.isNpsReportingInitialized = true;
                        }
                    })
                    .fail(function () {
                        if (xApiEnabled)
                            errorsHandler.handleError(reason);
                    });
            });
        }

        function initializeTracking() {
            return initializeActorFromContext().then(function () {
                initializeActivity();

                return requestManager.init().fail(function () {
                    deactivate();
                });
            });
        }

        function initializeActorFromContext() {
            return Q.fcall(function () {
                var user = userContext.getCurrentUser(),
                         progress = progressContext.get();

                if (user && user.username && (constants.patterns.email.test(user.email) || user.account)) {
                    return initializeActor(user).then(function () {
                        var isCourseStarted = _.isObject(progress) && _.isObject(progress.user);
                        if (!isCourseStarted) {
                            return eventManager.courseStarted();
                        }
                    });
                }

                if (_.isObject(progress)) {
                    if (_.isObject(progress.user)) {
                        return initializeActor(progress.user);
                    }
                    if (progress.user === 0) {
                        deactivateLrsReporting();
                        return;
                    }
                }

                if (npsEnabled) {
                    return initializeActor();
                }
            });
        }

        function initializeActor(user) {
            var actor = {
                username: xApiSettings.anonymousActor.username,
                email: xApiSettings.anonymousActor.email
            };

            if (user) {
                actor.username = user.username;
                actor.email = user.email || (user.account ? user.account.name : '');
                if (user.account)
                    actor.account = user.account;

                app.trigger('user:authenticated', user);
            }

            return activityProvider.initActor(actor.username, actor.email, actor.account);
        }

        function initializeActivity() {
            var id = context.course.id;
            var title = context.course.title;

            var url = "";
            if (window != window.top && ('referrer' in document)) {
                url = document.referrer;
            } else {
                url = window.location.toString();
            }

            url = url + '?course_id=' + context.course.id;


            activityProvider.initActivity(id, title, url);
        }
    }
);