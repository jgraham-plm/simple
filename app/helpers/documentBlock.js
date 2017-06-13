define(['localizationManager', 'constants'], function (localizationManager, constants) {
    return {
        getDocumentBlockContent: function(html) {
            var $output = $('<output>').html(html);
            var downloadText = localizationManager.getLocalizedText(constants.documents.downloadLocalizationKey);
            var $container = $output.find(constants.documents.containerSelector);
            var documentType = $container.attr(constants.documents.typeAttrName);
            var documentSizeValue = $container.attr(constants.documents.sizeAttrName);
            var documentSize = getSize(documentSizeValue);
            var downloadBtnText = downloadText + ' (' + documentSize + ')';
            var $downloadBtn = $output.find(constants.documents.downloadBtnSelector);
            $downloadBtn.text(downloadBtnText);
            var $typeIcon = $('<div class="icon-container"></div>');
            $typeIcon.append('<span class="document-type-text">' + documentType + '</span>');
            switch (documentType) {
                case constants.documents.types.zip: {
                    $typeIcon.addClass('icon-zip');
                    break;
                }
                default: {
                    $typeIcon.addClass('icon-file');
                    break;
                }
            }
            var $typeIconWrapper = $('<div class="document-icon"></div>');
            $typeIconWrapper.append($typeIcon);
            $container.prepend($('<div class="separator"></div>'));
            $container.prepend($typeIconWrapper);
            var content = $output.children()[0];
            return content;
        }
    };

    function getSize(sizeKb) {
        var size = '';
        if (!sizeKb) {
            return '0 Kb';
        }
        if (sizeKb > 1024) {
            size = (sizeKb / 1024).toFixed(2);
        }
        return size + ' MB';
    }
});