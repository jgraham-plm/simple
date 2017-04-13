define(['./requestManager', './configuration/xApiSettings', './errorsHandler'],
    function (requestManager, xApiSettings, errorsHandler) {

        return {
            sendLrsStatement: sendLrsStatement,
            sendNpsStatement: sendNpsStatement
        };

        function sendLrsStatement(statement) {
            return sendStatement(statement, xApiSettings.xApi.lrs).fail(function (error) {
                errorsHandler.handleError(error);
            });
        }

        function sendNpsStatement(statement) {
            return sendStatement(statement, xApiSettings.xApi.nps);
        }

        function sendStatement(statement, settings) {
            var url = settings.uri;

            if (url.indexOf("/statements") === -1)
                url = url + "/statements";

            var credentials = settings.authenticationRequired ?
                settings.credentials : xApiSettings.anonymousCredentials;

            return requestManager.sendStatement(statement, url, credentials.username, credentials.password);
        }
    });