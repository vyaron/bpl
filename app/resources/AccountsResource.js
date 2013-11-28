'use strict';
angular.module('bplApp.resources').
    factory('AccountsResource', ['BasicResource', function(BasicResource){
        var params = {resourceName : 'accounts'};

        var AccountsResource = BasicResource.get(angular.extend(params));

        return AccountsResource;
    }]);