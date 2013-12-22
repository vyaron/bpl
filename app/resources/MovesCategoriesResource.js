'use strict';
angular.module('bplApp.resources').
    factory('MovesCategoriesResource', ['BasicResource', 'MovesResource', function(BasicResource, MovesResource){
        var params = {resourceName : MovesResource.getConfig()['resourceName'], subResourceName : 'categories'};

        var MovesCategoriesResource = BasicResource(angular.extend(params));

        return MovesCategoriesResource;
    }]);