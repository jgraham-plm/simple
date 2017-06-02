define(['eventManager', 'guard', 'plugins/http', 'constants'], function (eventManager, guard, http, constants) {
    "use strict";

    function Question(spec, _protected) {
        if (typeof spec == typeof undefined) {
            throw 'You should provide a specification to create an Question';
        }

        this.id = spec.id;
        this.shortId = spec.shortId;
        this.sectionId = spec.sectionId;
        this.title = spec.title;
        this.type = spec.type;
        this.score = ko.observable(spec.score);
        this.learningContents = spec.learningContents;
        this.questionInstructions = spec.questionInstructions;
        this.isAnswered = false;
        this.isCorrectAnswered = false;
        this.affectProgress = true;
        this.isInformationContent = spec.type === constants.questionTypes.informationContent;

        if(spec.hasOwnProperty('isSurvey')){
            this.isSurvey = spec.isSurvey;
            this.affectProgress = !this.isSurvey;
        }

        this.feedback = {
            hasCorrect: spec.hasCorrectFeedback,
            correct: null,

            hasIncorrect: spec.hasIncorrectFeedback,
            incorrect: null
        };
        this.loadFeedback = loadFeedback,

        this.loadLearningContent = loadLearningContent;
        this.loadQuestionInstructions = loadQuestionInstructions;
        this.load = load;

        this.voiceOver = spec.voiceOver;

        this.learningContentExperienced = learningContentExperienced;

        this.progress = function (data) {
            if (!this.affectProgress && !this.hasOwnProperty('isSurvey'))
                return 0;

            if (!_.isNullOrUndefined(data)) {
                _protected.restoreProgress.call(this, data);

                this.isAnswered = true;
                this.isCorrectAnswered = this.score() === 100;
            } else {
                return _protected.getProgress.call(this);
            }
        };

        this.submitAnswer = function () {
            this.isAnswered = true;
            
            if (!this.affectProgress && !this.hasOwnProperty('isSurvey'))
                return;
                
            this.score(_protected.submit.apply(this, arguments));

            this.isCorrectAnswered = this.score() === 100;

            eventManager.answersSubmitted(this, true);
        }
    }

    return Question;

    function learningContentExperienced(spentTime) {
        eventManager.learningContentExperienced(this, spentTime);
    }
    
    function loadQuestionInstructions() {
        var that = this;
        var requests = [];
        _.each(that.questionInstructions, function (item) {
            if (_.isNullOrUndefined(item.content)) {
                requests.push(http.get('content/' + that.sectionId + '/' + that.id + '/' + item.id + '.html')
                    .then(function (response) {
                        item.content = response;
                    }));
            }
        });
        
        return Q.allSettled(requests);
    }

    function loadLearningContent() {
        var that = this;
        var requests = [];
        _.each(that.learningContents, function (item) {
            if (_.isNullOrUndefined(item.content)) {
                requests.push(http.get('content/' + that.sectionId + '/' + that.id + '/' + item.id + '.html')
                    .then(function (response) {
                        item.content = response;
                    }));
            }
        });

        return Q.allSettled(requests);
    }

    function load() {
        var that = this;
        return that.loadQuestionInstructions().then(function () {
            return that.loadLearningContent().then(function () {
                return that.loadFeedback();
            });
        });
    }

    function loadFeedback() {
        var
            that = this,
            requests = [],
            feedbackUrlPath = 'content/' + that.sectionId + '/' + that.id + '/',
            correctFeedbackContentUrl = feedbackUrlPath + 'correctFeedback.html',
            incorrectFeedbackContentUrl = feedbackUrlPath + 'incorrectFeedback.html';

        if (that.feedback.hasCorrect) {
            requests.push(http.get(correctFeedbackContentUrl).then(function (content) {
                that.feedback.correct = content;
            }));
        }
        if (that.feedback.hasIncorrect) {
            requests.push(http.get(incorrectFeedbackContentUrl).then(function (content) {
                that.feedback.incorrect = content;
            }));
        }

        return Q.allSettled(requests);
    }

});