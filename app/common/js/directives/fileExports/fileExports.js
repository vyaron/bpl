'use strict';

angular.module('bplApp.directives')
    .controller('fileExports', ['$scope', '$window', function($scope, $window){
        function print(){
            $window.print();
        };

        $scope.print = print;
    }])
    .directive('fileExports', [function(){
        return {
            restrict : 'EA',
            scope : {
              data : '=',
              options : '='
            },
            templateUrl : 'common/js/directives/fileExports/fileExports.html',
            controller : 'fileExports'
        }
    }]);