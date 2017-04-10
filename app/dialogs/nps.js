define([],
    function () {
        var steps = {
            rating: 'rating',
            thankYou: 'thankYou'
        };

        var viewModel = {
            activate: activate,
            submit: submit,
            rating: ko.observable(),
            currentStep: ko.observable(),
            callbacks: {}
        };

        viewModel.isRatingStepShown = ko.computed(function(){
            return viewModel.currentStep() === steps.rating;
        });

        viewModel.isThankYouStepShown = ko.computed(function(){
            return viewModel.currentStep() === steps.thankYou;
        });

        return viewModel;

        function activate(data) {
            if (!data.close)
                throw 'Nps dialog activation data close() method is not specified';

            viewModel.close = data.close;
            if (data.callbacks)
                viewModel.callbacks = data.callbacks;

            viewModel.rating(1);
            viewModel.currentStep(steps.rating);
        }

        function submit() {
            viewModel.currentStep(steps.thankYou);

            if (_.isFunction(viewModel.callbacks.reported)){
                viewModel.callbacks.reported();
            }
        }
    });