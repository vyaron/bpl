'use strict';
/**
 * Created by Yaron on 27/11/13.
 */
angular.module('bplApp.services')
.factory('HttpInterceptor', ['$q', 'DataCacheFactory', function($q, DataCacheFactory) {
    return {
        'request': function(config) {
            //cl('Requesting: ' + config.url + '(' + config.method + ')');
            if (config.method != 'GET') DataCacheFactory.removeAll();

            return config || $q.when(config);
        },
        // Gets called when a previous interceptor threw an error or resolved with a rejection
        'requestError': function(rejection) {
            //cl("Intercepted - Request Error");
            return $q.reject(rejection);
        },
        'response': function(response) {
            //cl(response);
            return response || $q.when(response);
        },
        // Gets called when a previous interceptor threw an error or resolved with a rejection
        'responseError': function(rejection) {
            if (rejection.status == 403) window.location.href = 'https://login.bankhapoalim.co.il';

            cl('ERROR! (' + rejection.status + ')');
            return $q.reject(rejection);
        }
    };
}]);