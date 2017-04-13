define(['durandal/app', './statementSender', './statementQueue'], function (app, statementSender, statementQueue) {

    return {
        handle: handle
    };

    function handle() {
        var statement = statementQueue.dequeue();

        if (statement) {
            return statementSender.sendLrsStatement(statement).then(handle);
        } else {
            var subscription = statementQueue.statements.subscribe(function () {
                handle();
                subscription.dispose();
            });
        }

    }

});