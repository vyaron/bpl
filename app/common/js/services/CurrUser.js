'use strict';
/**
 * Created by Yaron on 27/11/13.
 */
angular.module('bplApp.services')

    .factory('CurrUser', ['$rootScope', function($rootScope) {
        return {
            'getId': function() {
                return $rootScope.userId;
            }
        };
    }])
