define(function () {
    "use strict";

    function RankingText() {
        this.question = null;
        this.questionInstructions = [];

        this.isAnswered = ko.observable(false);
        this.rankingItems = ko.observableArray([]);
    };

    RankingText.prototype.initialize = function(question, isPreview) {
        var self = this;

        return Q.fcall(function () {
            self.question = question;

            self.questionInstructions = question.questionInstructions;
            self.isAnswered(question.isAnswered);

            self.rankingItems(question.rankingItems);
            self.isPreview = ko.observable(_.isUndefined(isPreview) ? false : isPreview);
        });
    };

    RankingText.prototype.submit = function() {
        var self = this;

        return Q.fcall(function () {
            self.question.submitAnswer(self.rankingItems());

            self.isAnswered(true);
        });
    };

    RankingText.prototype.tryAnswerAgain = function() {
        var self = this;

        return Q.fcall(function () {
            self.isAnswered(false);
        });
    };

    return RankingText;    
});