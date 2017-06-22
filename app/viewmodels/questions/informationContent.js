define(['knockout', 'modules/questionsNavigation', 'plugins/router', 'templateSettings', 'plmUtils'], function (ko, navigationModule, router, templateSettings, plmUtils) {
    "use strict";

    var viewModel = {
        title: null,
        learningContents: null,
        navigateNext: navigateNext,
        copyright: templateSettings.copyright,
        activate: activate,
        isNavigationLocked: router.isNavigationLocked,

        showBackToLearning: plmUtils.showBackToLearning,
        backToLearning: plmUtils.backToLearning,
        backToLearningButtonLabel: ko.observable('')
    };

    return viewModel;

    function navigateNext() {
        if (router.isNavigationLocked()) {
            return;
        }

        var nextUrl = !_.isNullOrUndefined(viewModel.navigationContext.nextQuestionUrl) ? viewModel.navigationContext.nextQuestionUrl : 'sections';
        router.navigate(nextUrl);
    }

    function activate(sectionId, question) {
        var self = this;
        plmUtils.getBackButtonLabel().then(function (label) {
            self.backToLearningButtonLabel(label);
        });

        return Q.fcall(function () {
            viewModel.navigationContext = navigationModule.getNavigationContext(sectionId, question.id);
            viewModel.id = question.id;
            viewModel.title = question.title;
            viewModel.learningContents = question.learningContents;
            question.submitAnswer();
        });
    }
});