define(function(){
    'use strict';

    return {
        init: init
    };

    function init(templateSettings, manifest, publishSettings){
        var promises = [];

        window.WebFontLoader && promises.push(window.WebFontLoader.load(templateSettings.fonts, manifest, publishSettings));
        window.LessProcessor && promises.push(window.LessProcessor.load(templateSettings.colors, templateSettings.fonts));

        return Q.all(promises);
    }
});
