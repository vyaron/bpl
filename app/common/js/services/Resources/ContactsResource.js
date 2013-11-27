'use strict';
angular.module('bplApp.services').
    factory('ContactsResource', ['BasicResource', function(BasicResource){
        var params = {resourceName : 'contacts'};

        var ContactsResource = BasicResource.get(angular.extend(params));

        return ContactsResource;
    }]);