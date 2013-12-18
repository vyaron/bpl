'use strict';
angular.module('bplApp.resources').
    factory('MovesResource', ['BasicResource', function(BasicResource){
        var params = {resourceName : 'moves'};

        var MovesResource = BasicResource(angular.extend(params));

        return MovesResource;
    }]);