'use strict';
angular.module('bplApp.resources').
    factory('ContactsResource', ['BasicResource', function(BasicResource){
        var params = {resourceName : 'contacts'};

        var ContactsResource = BasicResource.get(angular.extend(params));

        return ContactsResource;
    }]);