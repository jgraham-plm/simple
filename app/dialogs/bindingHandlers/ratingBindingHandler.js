var css = {
        ratingContainer: 'rating-container',
        ratingItem: 'rating-item',
        ratingItemBtn: 'rating-item-btn',
        ratingTipContainer: 'rating-tip-container',
        checked: 'checked',
        highlighted: 'highlighted'
    },
    keys = {
        rating: 'rating'
    };

ko.bindingHandlers.rating = {
    init: function(element, valueAccessors) {
        var $element = $(element),
            value = ko.utils.unwrapObservable(valueAccessors().value) || 0,
            max = ko.utils.unwrapObservable(valueAccessors().max) || 5,
            onValueUpdated = valueAccessors().onValueUpdated;

        var $container = $('<ul>');
        $container.addClass(css.ratingContainer)
            .appendTo($element)
            .mouseleave(function() {
                $container.children().each(function(index, item) {
                    $(item).removeClass(css.highlighted);
                });
            });

        for (var i = 0; i < max; i++) {
            var $li = $('<li>');
            $li.appendTo($container);
            $li.addClass(css.ratingItem)

            var $item = $('<button>');
            $item.addClass(css.ratingItemBtn)
                .data(keys.rating, i + 1)
                .text(i + 1)
                .click(function() {
                    var rating = $(this).data(keys.rating);
                    valueAccessors().value(rating);
                    applyRatingStyles(rating, css.checked);
                    if (_.isFunction(onValueUpdated)) {
                        onValueUpdated();
                    }
                })
                .hover(function() {
                    var rating = $(this).data(keys.rating);
                    applyRatingStyles(rating, css.highlighted);
                })
                .appendTo($li);
        }

        applyRatingStyles(value, css.checked);

        function applyRatingStyles(rating, className) {
            $container.children().each(function(index, item) {
                $(item).find('.' + css.ratingItemBtn).toggleClass(className, index < rating);
            });
        }
    }
};