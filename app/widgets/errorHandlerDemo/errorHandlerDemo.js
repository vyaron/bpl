'use strict';


angular.module('bplApp.widgets')
    .directive('errorHandlerDemo', function() {
        return {
            templateUrl: 'widgets/errorHandlerDemo/errorHandlerDemo.html',
            replace: true,
            controller: 'errorHandlerDemo'
        };
    })
    .controller('errorHandlerDemo', ['$scope', '$http', '$modal', 'PubSub', function($scope, $http, $modal, PubSub){
        var getStatus500 = function(){
            $http({method: 'GET', url: '/500'});
        };

        var getStatus403 = function(){
            $http({method: 'GET', url: '/403'});
        };

        var showPopup = function(rejection){
            var modalInstance = $modal.open({
                templateUrl: 'widgets/errorHandlerDemo/popup.html',
                controller: 'errorHandlerDemoPopup',
                resolve : {
                    msg : function(){
                        return (rejection.data && rejection.data.msg) ? rejection.data.msg : null;
                    }
                }
            });
        };

        $scope.getStatus500 = getStatus500;
        $scope.getStatus403 = getStatus403;

        PubSub.subscribe(PubSub.STATUS_500, $scope, function(e, time, rejection){
            showPopup(rejection);
        });
    }])
    .controller('errorHandlerDemoPopup', ['$scope', '$modalInstance', 'msg', function($scope, $modalInstance, msg) {
        $scope.msg = msg;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);