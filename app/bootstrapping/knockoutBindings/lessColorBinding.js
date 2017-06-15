define(['underscore', 'less'], function (_, less) {

    ko.bindingHandlers.lessColor = {
        init: function (element, valueAccessor) {
            var conditions = valueAccessor();

            _.each(conditions, function (condition) {
                var outputColor = condition.color;

                if (!condition.attr) return;
                if (condition.func && condition.dimension) {
                    var c = new less.tree.Color(condition.color.slice(1)),
                        dimension = new less.tree.Dimension(condition.dimension),
                        func = less.functions.functionRegistry.get(condition.func);
                    outputColor = func(c, dimension).toRGB();
                }
                
                element.setAttribute(condition.attr, outputColor);
            });
        }
    };
});