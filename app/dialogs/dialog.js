define(['plugins/router'],
    function (router) {

        function Dialog() {
            var that = this;
            this.isVisible = ko.observable(false);
            this.callbacks = {};
            this.show = function (callbacks) {
                if (router.isNavigationLocked()) {
                    return;
                }

                if (callbacks)
                    that.callbacks = callbacks;

                that.isVisible(true);
            };

            this.hide = function () {
                that.isVisible(false);
                if (_.isFunction(that.callbacks.closed)) {
                    that.callbacks.closed();
                }
            };
        }

        return Dialog;
    }
);