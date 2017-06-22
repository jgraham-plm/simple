define(['underscore'], function (_) {
    'use strict';

    var SETTINGS_PATH = 'https://s3.amazonaws.com/easy-generator-settings/plmSettings.json';

    var SETTINGS = {
        BACK_TO_LEARNING_BUTTON_LABEL: 'back_to_learning_button_label',
        SHOW_COPYRIGHT: 'show_copyright'
    };

    var DEFAULT_SETTINGS = {};
    DEFAULT_SETTINGS[SETTINGS.BACK_TO_LEARNING_BUTTON_LABEL] = 'Done';
    DEFAULT_SETTINGS[SETTINGS.SHOW_COPYRIGHT] = true;

    function getSettings () {
        var dfd = Q.defer();
        $.ajax({
            url: SETTINGS_PATH,
            dataType: 'json'
        }).done(function (data) {
            if (_.isObject(data)) {
                dfd.resolve(_.extend({}, DEFAULT_SETTINGS, data));
            } else {
                dfd.resolve(DEFAULT_SETTINGS);
            }
        }).fail(function () {
            dfd.resolve(DEFAULT_SETTINGS);
        });

        return dfd.promise;
    }

    function getSetting (setting) {
        var dfd = Q.defer();
        getSettings().then(function (settings) {
            dfd.resolve(settings[setting]);
        });

        return dfd.promise;
    }

    return {
        SETTINGS: SETTINGS,

        getSettings: getSettings,

        getBackButtonLabel: function () {
            return getSetting(SETTINGS.BACK_TO_LEARNING_BUTTON_LABEL);
        },

        getShowCopyrightSetting: function () {
            return getSetting(SETTINGS.SHOW_COPYRIGHT);
        },

	showBackToLearning: window.self !== window.top,

        backToLearning: function () {
            // Post a message for the PLM app.
            window.parent.postMessage({name: 'backToLearning'}, '*');
        }
    };
});
