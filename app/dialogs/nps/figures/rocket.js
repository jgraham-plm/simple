define(['templateSettings'], function(templateSettings) {
    return {
        textColor: templateSettings.getColorValue('@text-color'),
        mainColor: templateSettings.getColorValue('@main-color'),
        contentBodyColor: templateSettings.getColorValue('@content-body-color')
    };
});