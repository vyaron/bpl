'use strict';
angular.module('bplApp.resources').
    factory('MovesResource', ['BasicResource', function(BasicResource){
        var params = {resourceName : 'moves'};

        var MovesResource = BasicResource(angular.extend(params));


        MovesResource.prototype.getCheckbookImageUrl = function(){
            //return (this.id) ? 'img/checkbook/' + this.id + '.jpg' : '';
            return (this.id) ? 'img/checkbook/' + 7474876486 + '.jpg' : '';
        };


        return MovesResource;
    }]);