define(['repositories/courseRepository'],
    function (courseRepository) {
        var steps = {
            score: 'score',
            thankYou: 'thankYou'
        };

        var course = courseRepository.get();

        var viewModel = {
            activate: activate,
            submit: submit,
            score: ko.observable(),
            currentStep: ko.observable(),
            callbacks: {},
            isReporting: ko.observable(false)
        };

        viewModel.isScoreStepShown = ko.computed(function () {
            return viewModel.currentStep() === steps.score;
        });

        viewModel.isThankYouStepShown = ko.computed(function () {
            return viewModel.currentStep() === steps.thankYou;
        });

        return viewModel;

        function activate(data) {
            if (!data.close)
                throw 'Nps dialog activation data close() method is not specified';

            viewModel.close = data.close;
            if (data.callbacks)
                viewModel.callbacks = data.callbacks;

            viewModel.score(1);
            viewModel.currentStep(steps.score);
        }

        function submit() {
            viewModel.isReporting(true);

            course.evaluate(
                {
                    score: viewModel.score() / 10,
                    response: ''
                },
                {
                    success: function() {
                        viewModel.isReporting(false);
                        viewModel.currentStep(steps.thankYou);
                    },
                    fail: function(reason) {
                        viewModel.isReporting(false);
                        alert('Nps fail((( ' + reason);
                    },
                    fin: function () {
                        if (_.isFunction(viewModel.callbacks.finalized)) {
                            viewModel.callbacks.finalized();
                        }
                    }
                }
            );
        }
    });