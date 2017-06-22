define(['knockout', 'plmUtils'], function (ko, plmUtils) {

    var activate = function () {
        var self = this;
        plmUtils.getBackButtonLabel().finally(function (label) {
            self.backToLearningButtonLabel(label);
        });
    };

    var viewModel = {
        showBackToLearning: plmUtils.showBackToLearning,
        backToLearning: plmUtils.backToLearning,
        backToLearningButtonLabel: ko.observable(''),
        activate: activate
    };

    return viewModel;
});