define(['knockout', 'lib/plmUtils'], function (ko, plmUtils) {

    var activate = function () {
        var self = this;
        plmUtils.getErrorPageButtonLabel().then(function (label) {
            self.buttonLabel(label);
        });
    };

    var viewModel = {
        showBackToLearning: plmUtils.showBackToLearning,
        backToLearning: plmUtils.backToLearning,
        buttonLabel: ko.observable(''),
        activate: activate
    };

    return viewModel;
});