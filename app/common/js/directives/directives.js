'use strict';

angular.module('bplApp.directives')

// General: Use this directive to enable onlu numeric characters in an input
.directive('numericKeys', function() {
	return {
    	restrict: 'A',
    	link: function(scope, element, attrs, controller) {
    		element.on('keydown', function(event){
        		return (isNumericKeyCode(event.keyCode) || isNavigationKeyCode(event.keyCode));    			
    		});
 	
    	}
    }; 
    
    function isNumericKeyCode(keyCode) {
    	return (keyCode >= 48 && keyCode <= 57) || 
    		   (keyCode >= 96 && keyCode <= 105);
    	
    } 
    function isNavigationKeyCode(keyCode) {
    	
    	switch (keyCode) {
    		case 8: //backspace
    		case 35: //end
    		case 36: //home
    		case 37: //left
    		case 38: //up
    		case 39: //right
    		case 40: //down	
    		case 45: //ins
    		case 46: //del
    			return true;
    		default: 
    			return false;
    	}
    } 

})

// General: Use this directive to get a collapsible behaviour
.directive('collapsible', function() {
	return {
    	restrict: 'E',
    	template: '<div><h4 class="well-title" ng-click="toggleVisible()">{{title}}</h4><div ng-show="visible" ng-transclude></div></div>',
    	replace: true,
    	transclude: true,
    	scope: {
    		title: '@'
    	},
    	controller: function($scope) {
    		$scope.visible = true;
    		$scope.toggleVisible = function () {
    				$scope.visible = !$scope.visible;
    		};
    	}
	}; 
    
});
