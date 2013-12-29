'use strict';

/**
 * @ngdoc object
 * @name bplApp.PubSub
 * @requires $broadcast
 * @requires $on
 *
 * @description
 * Cross widget communication
 *
 * # General usage
 * Allow widgets to subscribe to events and publish events, support receiving arguments (an undetermined num of arguments)
 *
 * <pre>
 *
 * angular.module('bplApp.widgets')
 *  .controller('contacts', ['$scope', 'PubSub', function($scope, PubSub){
 *      PubSub.subscribe($scope, PubSub.CHANEL_ACCOUNT_SELECTED, function(accountId){
 *          alert('account ' + accountId + ' selected');
 *      })
 *  }]);
 *
 *  angular.module('bplApp.widgets')
 *  .controller('accounts', ['PubSub', function(PubSub){
 *      PubSub.publish(PubSub.CHANEL_ACCOUNT_SELECTED, 101)
 *  }]);
 *
 * </pre>
 */

angular.module('bplApp.services')
.factory('PubSub', function($rootScope){
    var chanel2scopes = {};

	return {
        CONTACTS : 'onContactsChanged',
		CHANEL_ACCOUNT_SELECTED     : 'cnlAccountSelected',
        CHANEL_SEVERE_ERROR         : 'cnlSevereError',

        STATUS_500 : 'onStatus500',

        /**
         * @ngdoc method
         * @name bplApp.PubSub#publish
         * @methodOf bplApp.PubSub
         *
         * @description
         * Publishes the message (with args) to all subscribers of this channel.
         * do not use $rootScope – from performance reasons, but keep a list of subscribed $scopes.
         *
         * @param {string} Name of the channel from the channels list
         * @param {...*} Optional (un-determined size) list of args
         */
		publish: function(channel){
            var channel = arguments[0];
            if ( channel in chanel2scopes) {
                for (var i=0; i< chanel2scopes[channel].length; i++){
                    //arguments[arguments.length] = Date.now();

                    var args = [];
                    for (var j in arguments){
                        args[j] = arguments[j];
                    }

                    args.splice(1, 0, Date.now());

                    chanel2scopes[channel][i].$broadcast.apply(chanel2scopes[channel][i], args);
                }
            }
		},

        /**
         * @ngdoc method
         * @name bplApp.PubSub#subscribe
         * @methodOf bplApp.PubSub
         *
         * @description
         * Subscribes the given $scope to a channel, the given callback will be called with the args received in publish.
         *
         * @param {string} channel Name of the channel from the channels list
         * @param {Object} $scope The Scope
         * @param {function()} Callback Te callback to call when an event is triggered on this channel
         */
		subscribe: function(channel, $scope, callback){
            if (!(channel in chanel2scopes)) chanel2scopes[channel] = [];
            chanel2scopes[channel].push($scope);

            $scope.$on(channel, callback);
		},

        /**
         * @ngdoc method
         * @name bplApp.PubSub#unsubscribe
         * @methodOf bplApp.PubSub
         *
         * @description
         * Unsubscribe the given $scope from a channel
         *
         * @param {string} channel Name of the channel from the channels list
         * @param {Object} $scope The Scope
         */
        unsubscribe: function(channel, $scope){
            if (channel in chanel2scopes){
                for (var i=0; i < chanel2scopes[channel].length; i++){
                    if (chanel2scopes[channel][i] == $scope) {
                        chanel2scopes[channel].splice(i,1);
                        break;
                    }
                }
            }
        }
		
	}
});
