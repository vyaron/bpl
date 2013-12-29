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
    .factory('ErrorHandler', ['$window', 'PubSub', function($window, PubSub){

        var redirectToLoginPage = function(rejection){
            $window.location.href = "https://login.bankhapoalim.co.il";
        };

        var publishByHttpStatus = function(rejection){
            if (('STATUS_' + rejection.status) in PubSub) PubSub.publish(PubSub['STATUS_' + rejection.status], rejection);

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
        ErrorHandler.publishByHttpStatus = publishByHttpStatus;

        var _status = {
            403 : ErrorHandler.redirectToLoginPage,
            500 : [angular.noop, ErrorHandler.publishByHttpStatus]
        };

        return ErrorHandler;
    }]);