'use strict';
angular.module('bplApp.services').
    factory('TransactionsResource', ['BasicResource', function(BasicResource) {
        var params = {resourceName: 'transactions',subResourceName:'list'};
        return {
            get: function(opts) {
                angular.extend(opts, params);
                return BasicResource.get(angular.extend(opts));
            }
        };
    }]);