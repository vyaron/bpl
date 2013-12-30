'use strict';

/**
 * @ngdoc function
 * @name bplApp.ErrorHandler
 *
 * @description
 * Handles all server returns errors based on HTTP STATUS
 *
 * # General usage
 * In $HttpInterceptor.responseError function.
 *
 * # Usage
 * None, this happen behind the scene by angular when data is requested via $http -> $HttpInterceptor.
 *
 * @param {object} rejection must contain status property - HTTP STATUS
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