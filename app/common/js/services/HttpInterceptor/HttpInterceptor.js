'use strict';
/**
 * @ngdoc object
 * @name bplApp.HttpInterceptor
 * @requires $q
 * @requires $window
 * @requires DataCache
 *
 * @description
 * Hook point for common functionality in server communication.
 *
 * # General usage
 * The HttpInterceptor is being attached to angular $httpProvider.
 *
 * <pre>$httpProvider.interceptors.push('HttpInterceptor');</pre>
 */
angular.module('bplApp.services')
.factory('HttpInterceptor', ['$q', '$window', 'DataCache', 'ErrorHandler', function($q, $window, DataCache, ErrorHandler) {
    return {

        /**
         * @ngdoc method
         * @name bplApp.HttpInterceptor#request
         * @methodOf bplApp.HttpInterceptor
         *
         * @description
         * make sure remove caching case none-GET requests
         * function return the config directly or as a promise.
         *
         * @param {*} config -
         * @returns {Object | Promise} -
         */
        'request': function(config) {
            //D('Requesting: ' + config.url + '(' + config.method + ')');
            //if (config.method != 'GET') DataCache.removeAll();

            return config || $q.when(config);
        },

        /**
         * @ngdoc method
         * @name bplApp.HttpInterceptor#request
         * @methodOf bplApp.HttpInterceptor
         *
         * @description
         * interceptor gets called when a previous interceptor threw an error or resolved with a rejection.
         *
         * @param {*} rejection -
         * @returns {Promise} -
         */
        'requestError': function(rejection) {
            //D("Intercepted - Request Error");
            return $q.reject(rejection);
        },

        /**
         * @ngdoc method
         * @name bplApp.HttpInterceptor#response
         * @methodOf bplApp.HttpInterceptor
         *
         * @description
         * interceptors get called with http response object.
         * The function return the response directly or as a promise.
         *
         * @param {*} response -
         * @returns {Object | Promise} -
         */
        'response': function(response) {
            //D(response);
            return response || $q.when(response);
        },

        /**
         * @ngdoc method
         * @name bplApp.HttpInterceptor#responseError
         * @methodOf bplApp.HttpInterceptor
         *
         * @description
         * Case status = 403 redirect to https://login.bankhapoalim.co.il
         * interceptor gets called when a previous interceptor threw an error or resolved with a rejection.
         *
         * @param {*} rejection -
         * @returns {Promise} -
         */
        'responseError': function(rejection) {
            //if (rejection.status == 403) $window.location.href = 'https://login.bankhapoalim.co.il';
            ErrorHandler(rejection);

            //D('ERROR! (' + rejection.status + ')');
            return $q.reject(rejection);
        }
    };
}]);