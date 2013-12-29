//angular.module('bplApp.services').value('REST_URL', 'http://192.168.2.1/data');

angular.module('bplApp')
    .config(['$httpProvider', 'BasicResourceProvider', 'TranslationsProvider', function($httpProvider, BasicResourceProvider, TranslationsProvider) {
        // Log.setDebug(true);
        //Log.setUrl("http://10.0.0.94/LogErrors");

        //$httpProvider.defaults.headers.common['Account-ID'] = 123123;

        TranslationsProvider.lang = 'en';
    }]);