﻿define(['context', 'constants'], function (context, constants) {

    var pregressKey = constants.localStorageProgressKey + context.course.id + context.course.createdOn,
        resultKey = constants.localStorageResultKey + context.course.id + context.course.createdOn;

    var module = {
        initialize: initialize,

        progressProvider: {
            getProgress: getProgress,
            saveProgress: saveProgress,
            saveResult: saveResult
        }
    }

    return module;

    function initialize() {
        console.log('LocalStorage progress provider initialized');
    }

    function getProgress() {
        var progress = {};
        try {
            progress = JSON.parse(localStorage.getItem(pregressKey));
        } catch (e) {
            console.log('Unable to restore progress from localStorage');
        }
        return progress;
    }

    function saveProgress(progress) {
        var string = JSON.stringify(progress);

        localStorage.setItem(pregressKey, string);
        console.log('Progress was saved (' + string.length + ' length):');
        console.dir(progress);
        return true;
    }

    function saveResult() {
        var result = {
            score: context.course.score(),
            isCompleted: context.course.isCompleted()
        };

        var string = JSON.stringify(result);
        localStorage.setItem(resultKey, string);
        return true;
    }

});