'use strict';
angular.module('bplApp.services').
    factory('AccountsResource', ['BasicResource', function(BasicResource){
        var params = {resourceName : 'accounts'};

        var AccountsResource = BasicResource.get(angular.extend(params));

        return AccountsResource;
    }]);