'use strict';


angular.module('bplApp.widgets.transactions', [])
// Display transactions list
// params: none
    .directive('bplTransactionsDtv', function() {
        return {
            templateUrl: 'widgets/transactions/Transactions.html',
            replace: true,
            controller: 'TransactionCtrl'
        };
    }

)
.controller('TransactionCtrl', ['$scope', 'PubSubService', 'TransactionsResource', function($scope, PubSubService, TransactionsResource) {

	// Subscribe to chanel
	PubSubService.subscribe($scope, PubSubService.CHANEL_ACCOUNT_SELECTED, function(event, args) {
		$scope.accountId = args;
		$scope.transactions = TransactionsResource.get({id:$scope.accountId}).list();
	});
	
	// Handle Transaction popup
	$scope.showTransPopup = function(trans) {
		$scope.selectedTrans = trans;
	};
	$scope.hideTransPopup = function() {
		$scope.selectedTrans = null;
	};

	
}]);
