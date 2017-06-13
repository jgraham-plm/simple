define([], function () {
    return {
        getLocalizedText: function(value) {
            if (_.isString(value)) {
                return TranslationPlugin.getTextByKey(value);
            } else if (_.isObject(value)) {
                var text = TranslationPlugin.getTextByKey(value.key);

                for (var replacement in value.replace) {
                    text = text.replace('{' + replacement + '}', value.replace[replacement]);
                }

                return text;
            }
        }
    }
});