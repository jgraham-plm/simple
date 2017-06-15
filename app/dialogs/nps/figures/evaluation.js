define(['templateSettings'], function(templateSettings) {
    return {
        textColor: templateSettings.getColorValue('@text-color'),
        correctColor: templateSettings.getColorValue('@correct-color'),
        contentBodyColor: templateSettings.getColorValue('@content-body-color')
    };
});