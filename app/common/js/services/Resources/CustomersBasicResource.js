'use strict';
angular.module('bplApp.services').
    factory('CustomersBasicResource', ['BasicResource', function(BasicResource){
        var params = {resourceName : 'customers', subResourceName: 'basic'};

        var CustomerBasicResource = BasicResource.get(angular.extend(params));

        return CustomerBasicResource;
    }]);