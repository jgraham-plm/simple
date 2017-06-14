define(['modules/questionsNavigation', 'plugins/router', 'templateSettings'], function (navigationModule, router, templateSettings) {
    "use strict";

    var viewModel = {
        title: null,
        learningContents: null,
        navigateNext: navigateNext,
	showBackToLearning: window.self !== window.top,
        backToLearning: backToLearning,
        copyright: templateSettings.copyright,

        activate: activate,
        isNavigationLocked: router.isNavigationLocked
    };

    return viewModel;

    function navigateNext() {
        if (router.isNavigationLocked()) {
            return;
        }

        var nextUrl = !_.isNullOrUndefined(viewModel.navigationContext.nextQuestionUrl) ? viewModel.navigationContext.nextQuestionUrl : 'sections';
        router.navigate(nextUrl);
    }

    function backToLearning() {
        // Post a message for the PLM app.
        window.parent.postMessage({name: 'backToLearning'}, '*');
    }

    function activate(sectionId, question) {
        return Q.fcall(function () {
            viewModel.navigationContext = navigationModule.getNavigationContext(sectionId, question.id);
            viewModel.id = question.id;
            viewModel.title = question.title;
            viewModel.learningContents = question.learningContents;
            question.submitAnswer();
        });
    }
});