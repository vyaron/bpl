'use strict';

// This is our main module
angular.module('bplApp', ['ngResource', 'ngCookies', 'bplApp.filters', 'bplApp.services', 'bplApp.resources', 'bplApp.directives', 'bplApp.widgets', 'ui.bootstrap'])

.constant('ENTITIES', {MONSTER : 'monster', CUSTOMER : 'customer', CONTACT: 'contact', ACCOUNT : 'account', TRANSACTION : 'transaction'})

.factory('$exceptionHandler', function () {
    return function (exception, cause) {
        exception.message += ' (caused by "' + cause + '")';
        Log.error(exception);
    };
})

.config(['$httpProvider', 'TranslationsProvider', function($httpProvider, TranslationsProvider) {
   // Log.setDebug(true);
    //Log.setUrl("/LogErrors");

    TranslationsProvider.lang = 'en';

	// register our interceptor service
	$httpProvider.interceptors.push('HttpInterceptor');

    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

	//$httpProvider.defaults.cache = true;
	//$httpProvider.defaults.cache = $cacheFactory('myNewDefaultCache', { capacity: 100 });
}])
.run(['$http', '$cookies', 'DataCacheFactory', function ($http, $cookies, DataCacheFactory) {
    //cl($cookies);

    $cookies.bpl = "bpl-session-dummy-hash";

	$http.defaults.cache = DataCacheFactory;
	// Set the loggein user
    D("bplApp is Loaded");
}]);

angular.module('bplApp.filters', []);
angular.module('bplApp.controllers', []);
angular.module('bplApp.directives', []);
angular.module('bplApp.services', ['ngResource']);
angular.module('bplApp.resources', ['ngResource', 'bplApp.services']);
angular.module('bplApp.widgets', ['bplApp.resources', 'ui.bootstrap']);
