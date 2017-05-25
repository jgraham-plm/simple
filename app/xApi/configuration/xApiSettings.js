define(['../constants', 'publishSettings'],
    function (constants, publishSettings) {

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


        var lrsHost = publishSettings.defaultLRSUrl || 'test1.easygenerator.com';

        var defaultXapi = {
            lrs: {
                uri: '//' + lrsHost + '/xApi/statements',
                authenticationRequired: false,
                credentials: {
                    username: '',
                    password: ''
                }
            },
            allowedVerbs: ['started', 'stopped', 'experienced', 'mastered', 'answered', 'passed', 'failed', 'progressed']
        };

        var npsHost = publishSettings.defaultNPSUrl || 'nps-staging.easygenerator.com';

        var defaultNps = {
            nps: {
                uri: '//' + npsHost + '/xApi/statements',
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

    }
);