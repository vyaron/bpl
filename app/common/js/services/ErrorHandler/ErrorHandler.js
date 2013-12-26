'use strict';

/**
 * @ngdoc object
 * @name bplApp.ErrorHandler
 *
 * @description
 * Handle error response by HTTP Status.
 *
 * # General usage
 * Handle error response by HTTP Status.
 *
 * # Usage
 * HttpInterceptor
 */
angular.module('bplApp.services')
    .factory('ErrorHandler', ['$window', function($window){
        var _status = {
            403 : angular.noop
        };

        var redirectToLoginPage = function(){
            $window.location.href = "http://google.com";
        };

        var ErrorHandler = function(rejection){
            if (rejection.status in _status){
                if (Array.isArray(_status[rejection.status])){
                    for (var i = 0; i < _status[rejection.status].length; i++){
                        _status[rejection.status][i](rejection);
                    }
                } else  _status[rejection.status](rejection);
            }
        };

        ErrorHandler.redirectToLoginPage = redirectToLoginPage;

        return ErrorHandler;
    }]);