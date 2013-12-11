'use strict';


angular.module('bplApp.widgets')
// Display transactions list
// params: none
    .directive('transactions', function() {
        return {
            templateUrl: 'widgets/transactions/Transactions.html',
            replace: true,
            controller: 'transactions'
        };
    }

)
.controller('transactions', ['$scope', 'PubSub', 'TransactionsResource', function($scope, PubSub, TransactionsResource) {

	// Subscribe to chanel
    PubSub.subscribe(PubSub.CHANEL_ACCOUNT_SELECTED, $scope, function(event, args) {
		$scope.accountId = args;
		$scope.transactions = TransactionsResource.get({id:$scope.accountId}).query();
	});
	
	// Handle Transaction popup
	$scope.showTransPopup = function(trans) {
		$scope.selectedTrans = trans;
	};
	$scope.hideTransPopup = function() {
		$scope.selectedTrans = null;
	};

	
}]);
