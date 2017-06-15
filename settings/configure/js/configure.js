(function (app) {

    var
        currentSettings = null,
        currentExtraData = null;

    var viewModel = {
        isError: ko.observable(false),

        trackingData: null,
        masteryScore: null,
        languages: null,
        pdfExport: null,
        nps: null,
        showConfirmationPopup: ko.observable(true),
        allowContentPagesScoring: ko.observable(false),
        allowCrossDeviceSaving: ko.observable(true),
        allowSocialLogin: ko.observable(true),
        copyright: ko.observable('')
    };

    viewModel.getCurrentSettingsData = function (settings) {
        return $.extend({}, settings || currentSettings, {
            pdfExport: viewModel.pdfExport.getData(),
            nps: viewModel.nps.getData(),
            xApi: viewModel.trackingData.getData(),
            masteryScore: viewModel.masteryScore.getData(),
            languages: viewModel.languages.getData(),
            showConfirmationPopup: viewModel.showConfirmationPopup(),
            allowContentPagesScoring: viewModel.allowContentPagesScoring(),
            allowCrossDeviceSaving: viewModel.allowCrossDeviceSaving(),
            allowLoginViaSocialMedia: viewModel.allowSocialLogin(),
            copyright: viewModel.copyright()
        });
    };

    viewModel.getCurrentExtraData = function () {
        return {};
    };

    viewModel.saveChanges = function () {
        var settings = viewModel.getCurrentSettingsData(),
            extraData = viewModel.getCurrentExtraData(),
            newSettings = JSON.stringify(settings),
            newExtraData = JSON.stringify(extraData);

        if (JSON.stringify(currentSettings) === newSettings && JSON.stringify(currentExtraData) === newExtraData) {
            return;
        }

        window.egApi.saveSettings(newSettings, newExtraData, app.localize('changes are saved'), app.localize('changes are not saved'))
            .done(function () {
                currentSettings = settings;
                currentExtraData = extraData;
            });
    };

    viewModel.init = function () {
        var api = window.egApi;
        return api.init().then(function () {
            var manifest = api.getManifest(),
                settings = api.getSettings();

            var defaultTemplateSettings = manifest && manifest.defaultTemplateSettings ? manifest.defaultTemplateSettings : {};
          
            viewModel.pdfExport = new app.PdfExport(settings.pdfExport || defaultTemplateSettings.pdfExport);     
            viewModel.nps = new app.Nps(settings.nps || defaultTemplateSettings.nps);           
            viewModel.masteryScore = new app.MasteryScore(settings.masteryScore || defaultTemplateSettings.masteryScore);      
            viewModel.trackingData = new app.TrackingDataModel(settings.xApi || defaultTemplateSettings.xApi);

            viewModel.languages = new app.LanguagesModel(manifest.languages, settings.languages || defaultTemplateSettings.languages);
            
            if (settings.hasOwnProperty('showConfirmationPopup')) {            
                viewModel.showConfirmationPopup(settings.showConfirmationPopup);
            } else if(defaultTemplateSettings.hasOwnProperty('showConfirmationPopup')){                
                viewModel.showConfirmationPopup(defaultTemplateSettings.showConfirmationPopup);
            }

            if (settings.hasOwnProperty('allowContentPagesScoring')) {
                viewModel.allowContentPagesScoring(settings.allowContentPagesScoring);
            } else if (defaultTemplateSettings.hasOwnProperty('allowContentPagesScoring')) {
                viewModel.allowContentPagesScoring(defaultTemplateSettings.allowContentPagesScoring);
            }

            if (settings.hasOwnProperty('allowCrossDeviceSaving')){
                viewModel.allowCrossDeviceSaving(settings.allowCrossDeviceSaving);
            } else if (defaultTemplateSettings.hasOwnProperty('allowCrossDeviceSaving')){
                viewModel.allowCrossDeviceSaving(defaultTemplateSettings.allowCrossDeviceSaving);
            }
            
            if (settings.hasOwnProperty('allowLoginViaSocialMedia')) {
                viewModel.allowSocialLogin(settings.allowLoginViaSocialMedia);
            } else if (defaultTemplateSettings.hasOwnProperty('allowLoginViaSocialMedia')) {
                viewModel.allowSocialLogin(defaultTemplateSettings.allowLoginViaSocialMedia);
            }

            if (settings.hasOwnProperty('copyright')) {
                viewModel.copyright(settings.copyright);
            } else if (defaultTemplateSettings.hasOwnProperty('copyright')) {
                viewModel.copyright(defaultTemplateSettings.copyright);
            }

            currentSettings = viewModel.getCurrentSettingsData(settings);
            currentExtraData = viewModel.getCurrentExtraData();

        }).fail(function () {
            viewModel.isError(true);
        });
    };

    viewModel.init().always(function () {
        $(document).ready(function () {
            ko.applyBindings(viewModel, $('.settings-container')[0]);
            $(window).on('blur', viewModel.saveChanges);
        });
    });

})(window.app = window.app || {});
