define(['durandal/app', 'plugins/router', './routingManager', './requestManager', './activityProvider', './configuration/xApiSettings', './constants', './statementQueueHandler',
        './errorsHandler', 'context', 'progressContext', 'userContext', 'eventManager'
    ],
    function(app, router, routingManager, requestManager, activityProvider, xApiSettingsConfig, constants, statementQueueHandler, errorsHandler, context, progressContext,
        userContext, eventManager) {
        "use strict";

        var
            npsEnabled = false,
            xApiEnabled = false,
            isUserAuthenticated = false,
            npsSettings = null,
            xApiSettings = null,

            xApiInitializer = {
                initialize: initialize,
                deactivate: deactivate,
                deactivateLrsReporting: deactivateLrsReporting,
                isLrsReportingInitialized: false,
                isNpsReportingInitialized: false,
                isInitialized: isInitialized,
                activate: activate
            };

        return xApiInitializer;

        function isInitialized() {
            return xApiInitializer.isLrsReportingInitialized || xApiInitializer.isNpsReportingInitialized;
        }

        //Initialization function for moduleManager
        function initialize(xApiReportingSettings, npsReportingSettings) {
            return Q.fcall(function() {
                xApiSettings = xApiReportingSettings;
                npsSettings = npsReportingSettings;

                xApiEnabled = xApiSettings.enabled;
                npsEnabled = npsSettings.enabled;

                if (!xApiEnabled && !npsEnabled)
                    return;

                return initializeTracking()
                    .then(function() {
                        if (xApiEnabled && isUserAuthenticated) {
                            activateXapiReporting();
                        }

                        if (npsEnabled) {
                            activateNpsReporting();
                        }
                    })
                    .fail(function(reason) {
                        if (xApiEnabled)
                            errorsHandler.handleError(reason);
                    });
            });
        }

        function activate(user) {
            return initializeActor(user).then(function() {
                if (xApiEnabled) {
                    activateXapiReporting();
                }
            });
        }

        function initializeTracking() {
            return initializeActorFromContext().then(function() {
                initializeActivity();

                return requestManager.init().fail(function() {
                    deactivate();
                });
            });
        }

        function activateXapiReporting() {
            xApiSettingsConfig.initxApi(xApiSettings);
            activityProvider.subscribeToxApiEvents();
            routingManager.mapRoutes();

            statementQueueHandler.handle();
            xApiInitializer.isLrsReportingInitialized = true;
        }

        function activateNpsReporting() {
            xApiSettingsConfig.initNps(npsSettings);
            activityProvider.subscribeToNpsEvents();

            xApiInitializer.isNpsReportingInitialized = true;
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

        function initializeActorFromContext() {
            return Q.fcall(function() {
                var user = userContext.getCurrentUser(),
                    progress = progressContext.get();

                if (user && user.username && (constants.patterns.email.test(user.email) || user.account)) {
                    return initializeActor(user).then(function() {
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
                    return activityProvider.initActor(xApiSettingsConfig.anonymousActor.username, xApiSettingsConfig.anonymousActor.email);
                }
            });
        }

        function initializeActor(user) {
            return Q.fcall(function() {
                var actor = {};

                actor.username = user.username;
                actor.email = user.email || (user.account ? user.account.name : '');
                if (user.account)
                    actor.account = user.account;

                isUserAuthenticated = true;
                app.trigger('user:authenticated', user);

                return activityProvider.initActor(actor.username, actor.email, actor.account);
            });
        }

        function initializeActivity() {
            return Q.fcall(function() {
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
            });
        }
    }
);