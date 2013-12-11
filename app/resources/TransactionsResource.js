'use strict';
angular.module('bplApp.resources').
    factory('TransactionsResource', ['BasicResource', function(BasicResource) {
        var params = {resourceName: 'transactions',subResourceName:'list'};
        return {
            get: function(opts) {
                angular.extend(opts, params);
                return BasicResource(angular.extend(opts));
            }
        };
    }]);