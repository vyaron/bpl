'use strict';
angular.module('bplApp.resources').
    factory('AccountsResource', ['BasicResource', function(BasicResource){
        var params = {resourceName : 'accounts'};

        var AccountsResource = BasicResource(angular.extend(params));

        return AccountsResource;
    }]);