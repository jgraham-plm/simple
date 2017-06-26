define(['durandal/app', 'knockout', 'context', 'repositories/courseRepository', 'plugins/router', 'plugins/http', 'templateSettings', 'plmUtils'],
    function (app, ko, context, repository, router, http, templateSettings, plmUtils) {

        var getFirstQuestionPath = function () {
	    var course = repository.get();
            if (course) {
                var firstSection = course.sections[0];
                return '#/section/' + firstSection.id + '/question/' + firstSection.questions[0].id;
            }
        };

        var courseTitle = null,
            content = null,
            copyright = ko.observable(),

            canActivate = function () {
                if (context.course.hasIntroductionContent == false) {
                    return {redirect: getFirstQuestionPath()};
                }
                return true;
            },

            activate = function () {
                this.courseTitle = context.course.title;

                var self = this;
                plmUtils.getShowCopyrightSetting().then(function (showCopyright) {
                    self.copyright(showCopyright && templateSettings.copyright);
                });

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

                var questionPath = getFirstQuestionPath();
                if (!questionPath) {
                    router.navigate('404');
                } else {
                    router.navigate(questionPath);
                }
            };

        return {
            courseTitle: courseTitle,
            content: content,
            copyright: copyright,
            isNavigationLocked: router.isNavigationLocked,

            startCourse: startCourse,
            canActivate: canActivate,
            activate: activate
        };
    }
);