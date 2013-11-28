'use strict';
/**
 * Created by Yaron on 27/11/13.
 */
angular.module('bplApp.services')

    .factory('CurrUser', [function() {
        return {
            'getId': function() {
                return 101;
            }
        };
    }])
