define(['knockout', 'localizationManager'], function (ko, localizationManager) {
    ko.bindingHandlers.localize = {
        update: function (element, valueAccessor) {
            localizeValue(element, valueAccessor);
        }
    };

    function localizeValue(element, valueAccessor) {
        var value = valueAccessor();

        if (_.isEmpty(value)) {
            return;
        }

        if (!_.isUndefined(value['text'])) {
            $(element).text(localizationManager.getLocalizedText(value['text']));
        }
        if (!_.isUndefined(value['placeholder'])) {
            $(element).attr('placeholder', localizationManager.getLocalizedText(value['placeholder']));
        }
        if (!_.isUndefined(value['value'])) {
            $(element).prop('value', localizationManager.getLocalizedText(value['value']));
        }
        if (!_.isUndefined(value['title'])) {
            $(element).prop('title', localizationManager.getLocalizedText(value['title']));
        }
        if (!_.isUndefined(value['html'])) {
            $(element).html(localizationManager.getLocalizedText(value['html']));
        }
        if (!_.isUndefined(value['data-text'])) {
            $(element).attr('data-text', localizationManager.getLocalizedText(value['data-text']));
        }
    }
});