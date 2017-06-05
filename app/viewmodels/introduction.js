define(['durandal/app', 'context', 'plugins/router', 'plugins/http', 'templateSettings'],
    function (app, context, router, http, templateSettings) {

        var courseTitle = null,
            content = null,
            copyright = templateSettings.copyright,

            canActivate = function () {
                //if (context.course.hasIntroductionContent == false) {
                //    return { redirect: '#sections' };
                //}
                return true;
            },

            activate = function () {
                this.courseTitle = context.course.title;

                var that = this;
                return Q.fcall(function () {
                    return http.get('content/content.html').then(function (response) {
                        that.content = response;
                    }).fail(function () {
                        that.content = '';
                    });
                });

            },

            startCourse = function () {
                if (router.isNavigationLocked()) {
                    return;
                }
                router.navigate('sections');

            };

        return {
            courseTitle: courseTitle,
            content: content,
            copyright: copyright,
            isNavigationLocked: router.isNavigationLocked,

            startCourse: activate,
            canActivate: canActivate,
            activate: activate
        };
    }
);