'use strict';
angular.module('bplApp.resources').
    factory('CustomersBasicResource', ['BasicResource', function(BasicResource){
        var params = {resourceName : 'customers', subResourceName: 'basic'};

        var CustomerBasicResource = BasicResource(angular.extend(params));

        return CustomerBasicResource;
    }]);