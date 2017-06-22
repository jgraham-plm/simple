define(function () {
    'use strict';

    var SETTINGS_PATH = 'https://s3.amazonaws.com/easy-generator-settings/plmSettings.json';
    var DEFAULT_BACK_BUTTON_LABEL = 'Done';

    return {
        getBackButtonLabel: function () {
            var dfd = Q.defer();
            $.ajax({
                url: SETTINGS_PATH,
                dataType: 'json'
            }).done(function (data) {
                if (data) {
                    dfd.resolve(data.back_to_learning_button_label || DEFAULT_BACK_BUTTON_LABEL);
                } else {
                    dfd.resolve(DEFAULT_BACK_BUTTON_LABEL);
                }
            }).fail(function () {
                dfd.resolve(DEFAULT_BACK_BUTTON_LABEL);
            });

            return dfd.promise;
        },

	showBackToLearning: window.self !== window.top,

        backToLearning: function () {
            // Post a message for the PLM app.
            window.parent.postMessage({name: 'backToLearning'}, '*');
        }
    };
});
