define(['plugins/router', 'routing/routes', 'templateSettings', 'publishSettings',
        './limitAccess/accessLimiter', './routing/guardRoute', './routing/routes', 'modules/progress/progressStorage/auth', 'modules/publishModeProvider'
    ],
    function (router, mainRoutes, templateSettings, publishSettings, accessLimiter, guardRoute, routes, auth, publishModeProvider) {
        'use strict';

        return {
            enable: enable
        };

        function enable() {
            var xAPI = templateSettings.xApi.enabled;
            var crossDeviceSaving = templateSettings.allowCrossDeviceSaving;
            
            if (publishModeProvider.isScormEnabled) {
                return;
            }

            if (publishModeProvider.isPreview || publishModeProvider.isReview) {
               return;
            }
            
            accessLimiter.initialize(publishSettings.accessLimitation);

            if (xAPI || crossDeviceSaving || accessLimiter.accessLimitationEnabled()) {
                guardRoute.createGuard();
                mainRoutes.add(routes);
            }
        }

    });