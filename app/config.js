angular.module('bplApp').config(['$httpProvider', 'BasicResourceProvider', 'TranslationsProvider', function($httpProvider, BasicResourceProvider, TranslationsProvider) {
    // Log.setDebug(true);
    //Log.setUrl("http://10.0.0.94/LogErrors");

    //BasicResourceProvider.setUrl('http://10.0.0.94/data');
    //$httpProvider.defaults.headers.common['Account-ID'] = 123123;

    TranslationsProvider.lang = 'en';
}]);