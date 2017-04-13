define(['durandal/app', 'plugins/router', './routingManager', './requestManager', './activityProvider', './configuration/xApiSettings', './constants', './statementQueueHandler',
    './errorsHandler', 'context', 'progressContext', 'userContext', 'eventManager'],
    function (app, router, routingManager, requestManager, activityProvider, xApiSettings, constants, statementQueueHandler, errorsHandler, context, progressContext,
        userContext, eventManager) {
        "use strict";

        var
            npsEnabled = false,
            xApiEnabled = false,
            isRequestManagerInitialized = false,

            xApiInitializer = {
                initialize: initialize,
                activate: activate,
                deactivate: deactivate,
                deactivateLrsReporting: deactivateLrsReporting,
                isLrsReportingInitialized: false,
                isNpsReportingInitialized: false,
            };

        return xApiInitializer;

        function deactivate() {
            activityProvider.turnOffSubscriptions();
            xApiInitializer.isLrsReportingInitialized = false;
            xApiInitializer.isNpsReportingInitialized = false;
            app.trigger('user:authentication-skipped');
        }

        function deactivateLrsReporting() {
            activityProvider.turnOffxApiSubscriptions();
            xApiInitializer.isLrsReportingInitialized = false;
            app.trigger('user:authentication-skipped');
        }

        //Initialization function for moduleManager
        function initialize(xApiReportingSettings, npsReportingSettings) {
            return Q.fcall(function () {
                xApiEnabled = xApiReportingSettings.enabled;
                npsEnabled = npsReportingSettings.enabled;
                if (!xApiEnabled && !npsEnabled)
                    return;

                if (xApiEnabled) {
                    xApiSettings.initxApi(xApiReportingSettings);
                    activityProvider.subscribeToxApiEvents();
                }

                if (npsEnabled) {
                    xApiSettings.initNps(npsReportingSettings);
                    activityProvider.subscribeToNpsEvents();
                }

                initializeActivity();

                var user = userContext.getCurrentUser(),
                        progress = progressContext.get();

                routingManager.mapRoutes();

                if (user && user.username && (constants.patterns.email.test(user.email) || user.account)) {
                    return activate(user.username, user.email, user.account).then(function () {
                        var isCourseStarted = _.isObject(progress) && _.isObject(progress.user);
                        if (!isCourseStarted) {
                            return eventManager.courseStarted();
                        }
                    });
                }

                if (_.isObject(progress)) {
                    if (_.isObject(progress.user)) {
                        return activate(progress.user.username, progress.user.email, progress.user.account);
                    }
                    if (progress.user === 0) {
                        activityProvider.turnOffxApiSubscriptions();
                        app.trigger('user:authentication-skipped');
                        return;
                    }
                }

                if (npsEnabled) {
                    return initializeRequestManager().then(function () {
                        return initializeActor(xApiSettings.anonymousActor.username, xApiSettings.anonymousActor.email).then(function () {
                            xApiInitializer.isNpsReportingInitialized = true;
                        });
                    });
                }
            });
        }

        function activate(username, email, account) {
            return initializeRequestManager().then(function () {
                return initializeActor(username, email, account).then(function () {
                    if (xApiEnabled)
                        xApiInitializer.isLrsReportingInitialized = true;

                    if (npsEnabled)
                        xApiInitializer.isNpsReportingInitialized = true;

                    var user = {
                        username: username,
                        email: email || account.name
                    };
                    if (account) {
                        user.account = account;
                    }
                    app.trigger('user:authenticated', user);
                });
            });
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

        function initializeActor(username, email, account) {
            return activityProvider.initActor(username, email, account);
        }

        function initializeRequestManager() {
            if (isRequestManagerInitialized)
                return Q.fcall(function () { });

            return requestManager.init().then(function() {
                isRequestManagerInitialized = true;
                statementQueueHandler.handle();
            }).fail(function() {
                xApiInitializer.deactivate();
                errorsHandler.handleError(reason);
            });
        }
    }
);