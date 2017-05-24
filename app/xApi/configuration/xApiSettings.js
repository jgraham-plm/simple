﻿define(['../constants'],
    function (constants) {

        var settings = {
            scoresDistribution: {
                positiveVerb: constants.verbs.passed
            },

            anonymousCredentials: {
                username: "",
                password: ""
            },

            anonymousActor: {
                username: 'Anonymous',
                email: 'anonymous@anonymous.com'
            },

            xApi: {
                allowedVerbs: []
            },

            timeout: 120000,//2 minutes

            defaultLanguage: "en-US",
            xApiVersion: "1.0.0",

            initxApi: initxApi,
            initNps: initNps
        };

       
        var defaultXapi = {
            lrs: {
                 // todo: change it back 
                uri: '//' + getxApiHost('test1.easygenerator.com', 'test1.easygenerator.com') + '/xApi/statements',
                // uri: '//' + getxApiHost('reports-staging.easygenerator.com', 'reports.easygenerator.com') + '/xApi/statements',
                authenticationRequired: false,
                credentials: {
                    username: '',
                    password: ''
                }
            },
            allowedVerbs: ['started', 'stopped', 'experienced', 'mastered', 'answered', 'passed', 'failed', 'progressed']
        };

        var defaultNps = {
            nps: {
                uri: '//' + getxApiHost('nps-staging.easygenerator.com', 'nps.easygenerator.com') + '/xApi/statements',
                authenticationRequired: false,
                credentials: {
                    username: '',
                    password: ''
                }
            }
        };

        return settings;

        function initxApi(templateSettings) {
            $.extend(settings.xApi, templateSettings);

            if (templateSettings.selectedLrs == 'default') {
                $.extend(settings.xApi, defaultXapi);
            }
        }

        function initNps() {
            $.extend(settings.xApi, defaultNps);
        }

        function getxApiHost(stagingEnvHost, liveEnvHost) {
            var host = window.location.host;
            var xApiHost = (host.indexOf('localhost') === 0 || host.indexOf('elearning-staging') === 0 || host.indexOf('elearning-branches') === 0) ?
                stagingEnvHost : liveEnvHost;

            return xApiHost;
        }
    }
);