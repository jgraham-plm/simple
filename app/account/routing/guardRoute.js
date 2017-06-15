define(['plugins/router', 'underscore', 'templateSettings', 'userContext', '../limitAccess/accessLimiter',
        'modules/progress/progressStorage/auth', 'progressContext'],
 function (router, _, templateSettings, userContext, accessLimiter, auth, progressContext) {
    'use strict';

    var defaultGuard = null,
        loginGuardSkipped = false;


    function guardViewUrl(route, guardView) {
        return route.queryString ? guardView + '?' + route.queryString : guardView;
    }

    return {
        createGuard: function () {
            defaultGuard = router.guardRoute;
            var loginGuardView = 'login',
                registerGuardView = 'register',
                signinGuardView = 'signin',
                noAccessGuardView = 'noaccess';

            router.guardRoute = function (model, route) {
                var user = userContext.getCurrentUser(),
                    accessLimitationEnabled = accessLimiter.accessLimitationEnabled(),
                    xapiEnabled = templateSettings.xApi.enabled,
                    npsEnabled = templateSettings.nps.enabled,
                    allowCrossDeviceSaving = templateSettings.allowCrossDeviceSaving,
                    currentRoute = route.config.route;
                    
                if (currentRoute === loginGuardView) {
                    var checkUserPermission = user && accessLimiter.userHasAccess(user);
                    if(allowCrossDeviceSaving){
                        return checkUserPermission && auth.authenticated ? '/': true;
                    }
                    return checkUserPermission  ? '/' : true;
                }

                if((currentRoute === registerGuardView || currentRoute === signinGuardView)
                    && userContext.user.email){
                        return accessLimiter.userHasAccess({email:userContext.user.email});
                    }

                if (!userContext.user.email && !loginGuardSkipped && (xapiEnabled || npsEnabled || allowCrossDeviceSaving || accessLimitationEnabled)) {
                    return guardViewUrl(route, loginGuardView);
                }

                if (currentRoute === noAccessGuardView) {
                    return accessLimitationEnabled && (!user || !accessLimiter.userHasAccess(user)) ? true : '/';
                }

                if (accessLimitationEnabled && (!user || !accessLimiter.userHasAccess(user))) {
                    return guardViewUrl(route, noAccessGuardView);
                }

                if(userContext.user.email && allowCrossDeviceSaving && !auth.authenticated){
                    return guardViewUrl(route, loginGuardView);
                }

                if (_.isFunction(defaultGuard)) {
                    return defaultGuard(model, route);
                }
                return true;
            };
        },
        skipLoginGuard: function () {
            loginGuardSkipped = true;
        }
    };
});