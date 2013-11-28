'use strict';


// TODO: make a global Log object
var cl = function(mix) {
	console.log(mix);
};



// This is our main module
angular.module('bplApp', ['ngResource', 'ngCookies', 'bplApp.filters', 'bplApp.filters', 'bplApp.services', 'bplApp.directives', 'bplApp.widgets', 'ui.bootstrap'])

.constant('ENTITIES', {MONSTER : 'monster', CUSTOMER : 'customer', CONTACT: 'contact', ACCOUNT : 'account', TRANSACTION : 'transaction'})

.config(['$httpProvider', 'LogProvider', 'TranslationsProvider', function($httpProvider, LogProvider, TranslationsProvider) {
    TranslationsProvider.lang = 'en';

    //bplLogProvider.debugEnabled(false);
    //bplLogProvider.debugUrl('someDebugServer');

	// register our interceptor service
	$httpProvider.interceptors.push('HttpInterceptor');
	//$httpProvider.defaults.cache = true;
	//$httpProvider.defaults.cache = $cacheFactory('myNewDefaultCache', { capacity: 100 });
}])

.run(['$http', '$cookies', 'DataCacheFactory', function ($http, $cookies, DataCacheFactory) {
    //cl($cookies);
    $cookies.bpl = "bpl-session-dummy-hash";

	$http.defaults.cache = DataCacheFactory;
	// Set the loggein user
    cl("bplApp is Loaded");
	
}]);

angular.module('bplApp.controllers', []);
angular.module('bplApp.directives', []);
angular.module('bplApp.services', ['ngResource']);
angular.module('bplApp.widgets', []);