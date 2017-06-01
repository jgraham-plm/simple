define(['knockout', 'underscore', 'repositories/courseRepository'],
    function (ko, _, courseRepository) {
        var steps = {
            evaluation: 'evaluation',
            feedback: 'feedback',
            end: 'end'
        };

        var course = courseRepository.get();

        var viewModel = {
            activate: activate,
            submit: submit,
            score: ko.observable(),
            currentStep: ko.observable(),
            callbacks: {},
            isReporting: ko.observable(false),
            compositionComplete: compositionComplete,
            isCompositionComplete: ko.observable(false)
        };

        viewModel.isEvaluationStep = ko.computed(function () {
            return viewModel.currentStep() === steps.evaluation;
        });

        viewModel.isFeedbackStep = ko.computed(function(){
            return viewModel.currentStep() === steps.feedback;
        });

        viewModel.isLastStep = ko.computed(function(){
            return viewModel.currentStep() === steps.end;
        });

        return viewModel;

        function activate(data) {
            if (!data.close)
                throw 'Nps dialog activation data close() method is not specified';

            viewModel.close = data.close;
            if (data.callbacks)
                viewModel.callbacks = data.callbacks;

            viewModel.isReporting(false);
            viewModel.score(0);
            viewModel.currentStep(steps.evaluation);
        }

        function compositionComplete() {
            viewModel.isCompositionComplete(true);
        }

        function submit() {
            viewModel.isReporting(true);

            course.evaluate({
                score: viewModel.score() / 10,
                response: ''
            }, {
                success: function () {
                },
                fail: function (reason) {
                },
                fin: function () {
                    viewModel.isReporting(false);
                    viewModel.currentStep(steps.end);
                    if (_.isFunction(viewModel.callbacks.finalized)) {
                        viewModel.callbacks.finalized();
                    }
                }
            });
        }
    });