define(['publishSettings'], function(publishSettings) {
    'use strict';

    function UrlProvider() {
        this.progressStorageUrl = publishSettings.progressStorageUrl ?
            '//' + publishSettings.progressStorageUrl + '/' :
            '//progress-storage.easygenerator.com/';

        this.courseLink = (function() {
            return window.location.protocol + '//' + window.location.host + window.location.pathname;
        })();
    }

    return new UrlProvider();
});