define(['guard', 'models/questions/question', 'models/answers/answerGroup', 'models/answers/answer'],
    function (guard, Question, AnswerGroup, Answer) {
        "use strict";

        function FillInTheBlankQuestion(spec) {

            Question.call(this, spec, {
                getProgress: getProgress,
                restoreProgress: restoreProgress,

                submit: submitAnswer
            });

            this.answerGroupsValues = null;

            this.answerGroups = (function () {
                var index = 0;
                return _.map(spec.answerGroups, function (answerGroup) {
                    return new AnswerGroup({
                        id: answerGroup.id,
                        shortId: index++,
                        type: answerGroup.type,
                        answers: _.map(answerGroup.answers, function (answer) {
                            return new Answer({
                                id: answer.id,
                                isCorrect: answer.isCorrect,
                                text: answer.text,
                                matchCase: answer.matchCase
                            });
                        })
                    });
                });
            })();
        }

        return FillInTheBlankQuestion;

        function submitAnswer(inputValues) {
            guard.throwIfNotArray(inputValues, 'Input values is not array.');

            saveAnsweredTexts(inputValues, this.answerGroups);
            this.answerGroupsValues = inputValues;

            return calculateScore(inputValues, this.answerGroups);
        }

        function calculateScore(answerGroupValues, pointer) {
            var hasIncorrectAnswer = _.some(answerGroupValues, function (answerGroupValue) {
                return _.some(pointer, function (answerGroup) {
                    if (_.isFunction(answerGroup.checkIsCorrect) && answerGroupValue.id == answerGroup.id) {
                        return !answerGroup.checkIsCorrect(answerGroupValue);
                    }
                    return false;
                });
            });

            return hasIncorrectAnswer ? 0 : 100;
        }

        function saveAnsweredTexts(answerGroupValues, answerGroups) {
            _.each(answerGroupValues, function (answerGroupValue) {
                var answerGroup = _.find(answerGroups, function (answerGroup) {
                    return answerGroup.id === answerGroupValue.id;
                });

                answerGroup.answeredText = answerGroupValue.value;
            });
        }

        function getProgress() {
            if (this.isCorrectAnswered) {
                return 100;
            } else {
                return _.chain(this.answerGroups)
                    .filter(function (group) {
                        return !!group.answeredText;
                    })
                    .reduce(function (obj, ctx) {
                        obj[ctx.shortId] = ctx.answeredText;
                        return obj;
                    }, {})
                    .value();
            }
        }

        function restoreProgress(progress) {
            var inputValues = _.chain(this.answerGroups)
                .map(function (answerGroup) {
                    var correct = _.chain(answerGroup.answers)
                        .find(function (answer) {
                            return answer.isCorrect;
                        }).value();

                    return {
                        id: answerGroup.id,
                        value: progress === 100 ? correct.text : progress[answerGroup.shortId],
                        answers: answerGroup.answers
                    };
                }).value();

            saveAnsweredTexts(inputValues, this.answerGroups);
            this.score(calculateScore(inputValues, this.answerGroups));
        }

    });