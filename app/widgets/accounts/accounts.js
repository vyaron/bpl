'use strict';


angular.module('bplApp.widgets')

// Display customer acounts
// params: displayType (sideBySide or dropdown)

.directive('accounts', function() {
	return {
	    	templateUrl: 'widgets/accounts/accounts.html',
	    	replace: true,
	    	controller: 'accounts',
	    	scope: {
                   displayType: '@'
	    	}
    	};
	} 
)

.controller('accounts', ['$scope', 'PubSub', 'AccountsResource', function($scope, PubSubService, AccountsResource) {
    // Set the prefs including a default display type
    $scope.prefs = {displayType : $scope.displayType?  $scope.displayType : "sideBySide"};
    // Get the data
    AccountsResource.query(function(accounts) {
        $scope.accounts = accounts;
        $scope.accountSelected = function() {
            PubSubService.publish(PubSubService.CHANEL_ACCOUNT_SELECTED, this.selectedAccount);
        };
    });

}]);