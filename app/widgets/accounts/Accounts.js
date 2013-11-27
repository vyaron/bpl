'use strict';


angular.module('bplApp.widgets.accounts', [])

// Display customer acounts
// params: displayType (sideBySide or dropdown)

.directive('bplAccountsDtv', function() {
	return {
	    	templateUrl: 'widgets/accounts/Accounts.html',
	    	replace: true,
	    	controller: 'AccountCtrl',
	    	scope: {

	    	}
    	};
	} 
)

.controller('AccountCtrl', ['$scope', '$attrs', 'CurrUser', 'PubSubService', 'AccountsResource', function($scope, $attrs, CurrUser, PubSubService, AccountsResource) {
    // TODO: enquire why we can't use the directive scope @ attribute assignment to scope.
    $scope.displayType = $attrs['displayType'] || "sideBySide";
    // Get the data
    AccountsResource.list({}, function(data) {
        $scope.accounts = data;

        $scope.accountSelected = function() {
            PubSubService.publish(PubSubService.CHANEL_ACCOUNT_SELECTED, this.selectedAccount);
        };
    });

}])