'use strict';

angular.module('bplApp.services')

.factory('PubSubService', function($rootScope){
	return {
		CHANEL_ACCOUNT_SELECTED     : 'cnlAccountSelected',
        CHANEL_SEVERE_ERROR         : 'cnlSevereError',

		// TODO: improve performance of pubsub
		publish: function(chanel, msg){
			//cl('publishing to ' + chanel + ': ' + msg);
			$rootScope.$broadcast(chanel, msg);
		},
		subscribe: function($scope, chanel, callback){
			//cl('subscribing to ' + chanel);
			$scope.$on(chanel, callback);
		}
		
	}
});
