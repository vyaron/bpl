'use strict';


angular.module('bplApp.widgets')
// Display customer details including acounts
// params: showAccountSelection (boolean) - wether or not to show a dropdown for selecting current account
.directive('customer', function() {
    return {
        templateUrl: 'widgets/customer/Customer.html',
        replace: true,
        controller: 'customer',
        scope: {
            showAccountSelection: '@'
        }
    };
})

.controller('customer', ['$scope','CustomersResource', function($scope, CustomersResource) {

    // Set the prefs including a default display type
    $scope.prefs = {showAccountSelection : $scope.showAccountSelection?  $scope.showAccountSelection : false};

	// Get the data
    $scope.customer = CustomersResource.get();

}]);
