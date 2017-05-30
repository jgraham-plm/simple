define(['underscore', 'less', 'templateSettings'], function (_, less, templateSettings) {

    ko.bindingHandlers.lessColor = {
        init: function (element, valueAccessor) {
            var conditions = valueAccessor(),
                colors = templateSettings.colors;

            _.each(conditions, function (condition) {
                var color = _.find(colors, function (c) {
                    return c.key === condition.color;
                });

                if (!color) {
                    throw 'Variable "' + condition.color + '" does not exists in template settings';
                }

                var outputColor = color.value;

                if (!condition.attr) return;
                if (condition.func && condition.dimension) {
                    var c = new less.tree.Color(color.value.slice(1)),
                        dimension = new less.tree.Dimension(condition.dimension),
                        func = less.functions.functionRegistry.get(condition.func);
                    outputColor = func(c, dimension).toRGB();
                }
                
                element.setAttribute(condition.attr, outputColor);
            });
        }
    };
});