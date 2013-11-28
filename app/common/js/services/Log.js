'use strict';
/**
 * Created by Yaron on 27/11/13.
 */

// TODO: make it none-anuglar

angular.module('bplApp.services')

    .provider('Log', ['$logProvider', function($logProvider) {
        var url, debug = true;

        this.debugEnabled = function(flag) {
            debug = flag ? true : false;
        };

        this.debugUrl = function(newUrl) {
            url = newUrl;
        };

        this.$get = ['$log', '$http', function($log, $http){
            var sendLogToServer = function(data){
                if (url) $http.post(url, data);
            };

            return {
                isDebugEnabled : function(){return debug;},

                log: debug ? $log.log : sendLogToServer,
                info: debug ? $log.info : sendLogToServer,
                warn: debug ? $log.warn : sendLogToServer,
                error: debug ? $log.error : sendLogToServer,
                debug: debug ? $log.debug : sendLogToServer
            };
        }];
    }])
//    .factory('$exceptionHandler', function () {
//        return function (exception, cause) {
//            exception.message += ' (caused by "' + cause + '")';
//            throw exception;
//        };
//    })




