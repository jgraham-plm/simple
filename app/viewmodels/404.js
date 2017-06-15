define([], function () {
    var viewModel = {
        showBackToLearning: window.self !== window.top,
        backToLearning: backToLearning
    };

    function backToLearning() {
        // Post a message for the PLM app.
        window.parent.postMessage({name: 'backToLearning'}, '*');
    }

    return viewModel;
});