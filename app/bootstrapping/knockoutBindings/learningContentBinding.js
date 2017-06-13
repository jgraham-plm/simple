define(['durandal/composition', 'helpers/documentBlock'], function (composition, documentBlockHelper) {
    ko.bindingHandlers.learningContent = {
        init: function (element, valueAccessor) {
            var $element = $(element),
                html = valueAccessor();
            
            var dataType = getLearningContentType(html);
            
            switch(dataType){
                case 'hotspot': {
                    var hotspotOnImage = HotspotStorage.create($(html)[0]);
                        
                    $element.addClass('hotspot-on-image-container');
                    $element.html(hotspotOnImage.element);

                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        HotspotStorage.remove(hotspotOnImage);
                    });

                    break;
                }
                case 'document': {
                    var content = documentBlockHelper.getDocumentBlockContent(html);
                    $element.append(content);
                    break;
                }
                default: {
                    $element.html(html);
                    return ko.bindingHandlers.elementsWrap.init(element, valueAccessor);
                }
            }
        }
    };
    
    composition.addBindingHandler('learningContent');
    
    function getLearningContentType(data) {
        var $output = $('<output>').html(data),
            dataType = $('[data-type]', $output).attr('data-type');
        
        return dataType;
    }
});