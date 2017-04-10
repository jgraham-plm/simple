var css = {
    ratingContainer: 'rating-container',
    ratingItem: 'rating-item',
    checked: 'checked',
    highlighted: 'highlighted'
},
keys = {
    rating: 'rating'
};

ko.bindingHandlers.rating = {
    init: function(element, valueAccessors) {
        var value = ko.utils.unwrapObservable(valueAccessors().value) || 0,
            max = ko.utils.unwrapObservable(valueAccessors().max) || 5,
            onValueUpdated = valueAccessors().onValueUpdated,
            $element= $(element)
        ;

        var $container = $("<div></div>");
        $container.addClass(css.ratingContainer);
        $container.appendTo($element);
        $container.mouseleave(function () {
            $container.children().each(function(index, item){
                $(item).removeClass(css.highlighted);
            });
        });

        for (var i = 0; i < max; i++) {
            var $item = $("<div></div>");
            $item.addClass(css.ratingItem);
            $item.data(keys.rating, i + 1);
            $item.appendTo($container);
            $item.click(function() {
                var rating = $(this).data(keys.rating);
                valueAccessors().value(rating);
                applyRatingStyles(rating, css.checked);
                if (_.isFunction(onValueUpdated)) {
                    onValueUpdated();
                }
            });
            $item.hover(function () {
                var rating = $(this).data(keys.rating);
                applyRatingStyles(rating, css.highlighted);
            });
        }

        applyRatingStyles(value, css.checked);

        function applyRatingStyles(rating, className){
            $container.children().each(function(index, item){
                var $item = $(item);
                if(index < rating) {
                    $item.addClass(className);
                }else {
                    $item.removeClass(className);
                }
            });
        }
    }
};