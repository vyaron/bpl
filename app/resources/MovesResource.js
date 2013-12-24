'use strict';
angular.module('bplApp.resources').
    factory('MovesResource', ['BasicResource', function(BasicResource){
        var params = {resourceName : 'moves'};

        var MovesResource = BasicResource(angular.extend(params));


        MovesResource.prototype.getChequeImageUrl = function(){
            //return (this.id) ? 'img/checkbook/' + this.id + '.jpg' : '';
            return (this.id) ? 'img/checkbook/' + 7474876486 + '.jpg' : '';
        };
        MovesResource.prototype.getCtgClass = function(){
            return (this.category_id)? 'ctg ctg-' + this.category_id : '';
        };





        return MovesResource;
    }]);