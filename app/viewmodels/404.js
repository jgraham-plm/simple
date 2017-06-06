define([], function () {
    var viewModel = {
        backToLearning: backToLearning
    };

    function backToLearning() {
        // Post a message for the PLM app.
        window.parent.postMessage({name: 'backToLearning'}, '*');
    }

    return viewModel;
});