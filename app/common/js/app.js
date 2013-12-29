'use strict';
/**
 * @ngdoc overview
 * @name bplApp
 *
 * @description
 *
 * Main module
 *
 * <div doc-module-components="bplApp"></div>
 */
// This is our main module
angular.module('bplApp', ['ngResource', 'ngCookies', 'bplApp.filters', 'bplApp.services', 'bplApp.resources', 'bplApp.directives', 'bplApp.widgets', 'ui.bootstrap', 'ngTable'])

.factory('$exceptionHandler', function () {
    return function (exception, cause) {
        exception.message += ' (caused by "' + cause + '")';
        Log.error(exception);
    };
})

.config(['$httpProvider', function($httpProvider) {
	// register our interceptor service
	$httpProvider.interceptors.push('HttpInterceptor');

    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

	//$httpProvider.defaults.cache = true;
	//$httpProvider.defaults.cache = $cacheFactory('myNewDefaultCache', { capacity: 100 });
}])
.run(['$http', '$cookies', 'DataCache', function ($http, $cookies, DataCache) {
    //cl($cookies);

    $cookies.bpl = "bpl-session-dummy-hash";

	$http.defaults.cache = DataCache;
	// Set the loggein user
    //d("bplApp is Loaded");
}]);

angular.module('bplApp.filters', []);
angular.module('bplApp.controllers', []);
angular.module('bplApp.directives', []);
angular.module('bplApp.services', ['ngResource']).value('REST_URL', 'data');
angular.module('bplApp.resources', ['ngResource', 'bplApp.services']);
angular.module('bplApp.widgets', ['bplApp.resources', 'ui.bootstrap', 'ngTable', 'bplApp.filters']);
