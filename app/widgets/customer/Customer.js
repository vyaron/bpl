'use strict';


angular.module('bplApp.widgets.customer', [])
// Display customer details including acounts
// params: showAccountSelection (boolean) - wether or not to show a dropdown for selecting current account
.directive('bplCustomerDtv', function() {
    return {
        templateUrl: 'widgets/customer/Customer.html',
        replace: true,
        controller: 'CustomerCtrl',
        scope: {
            showAccountSelection: '='
        }
    };
})

.controller('CustomerCtrl', ['$scope', 'CurrUser', 'PubSubService','PrefsService', 'CustomersResource', function($scope, CurrUser, PubSubService, PrefsService, CustomersResource) {


	// From Prefs and from directive property
	var showAccountSelection = PrefsService.SHOW_ACCOUNTS_SELECTION;
	if ('showAccountSelection' in $scope && typeof $scope.showAccountSelection != 'undefined') {
		showAccountSelection = $scope.showAccountSelection;
	}

	// Prepare Prefs on the scope 
	$scope.prefs = {
		showAccountSelection : showAccountSelection	
	};

	// Get the data
    $scope.customer = CustomersResource.get({ id: CurrUser.getId() });
    $scope.customer.$promise.then(function(customer) {
		$scope.imgCustomer = 'img/customer/' + customer.id + '.jpg';
	});    

	
}]);
