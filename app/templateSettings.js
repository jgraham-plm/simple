define(function() {
    'use strict';

    return {
        init: function(settings) {
            for (var key in settings) {
                this[key] = settings[key];
            }
        },
        getColorValue: function(color) {
            var settingColor = _.find(this.colors, function(c) {
                return c.key === color;
            });

            if (!settingColor) {
                throw 'Variable "' + color + '" does not exist in template settings';
            }

            return settingColor.value;
        }
    };
});