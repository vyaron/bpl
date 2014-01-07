'use strict';

/**
 * @ngdoc object
 * @name bplApp.PubSub
 * @requires $broadcast
 * @requires $on
 *
 * @description
 * Cross widget communication, Infra to widgets communications (i.e. - error handler publishes an event when some error occurs)
 * Note: this component is not meant to be used as a general mechanism for communicating between any directive.
 * i.e. - when a datepicker reports a date-change, it will do it via a controller function and not as a pub-sub event.
 *
 * For usage's simplicity The PubSub loads the Channels Service that hold the dictionary for all Channels.
 *
 * # General usage
 * Allow widgets to subscribe to events and publish events, support receiving arguments (an undetermined num of arguments)
 *
 * <pre>
 *
 * angular.module('bplApp.widgets')
 *  .controller('contacts', ['$scope', 'PubSub', function($scope, PubSub){
 *      PubSub.subscribe(PubSub.CHANEL_ACCOUNT_SELECTED, function(accountId){
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
.factory('PubSub', function($rootScope, PubSubChannels){
    var scope, channel2deregistrations= {};
    function getScope(){
        return scope ? scope : scope = $rootScope.$new(true);
    }

    var PubSub = angular.extend({}, PubSubChannels);

    /**
     * @ngdoc method
     * @name bplApp.PubSub#publish
     * @methodOf bplApp.PubSub
     *
     * @description
     * Publishes the message (with args) to all subscribers of this channel.
     * PubSub use internal $scope - from performance reasons.
     *
     * @param {string} Name of the channel from the channels list
     * @param {...*} Optional (un-determined size) list of args
     * @return {Object} Event object, see ng.$rootScope.Scope#methods_$on
     */
    PubSub.publish = function(channel){
        var scope = getScope();
        return scope.$broadcast.apply(scope, arguments);
    };

    /**
     * @ngdoc method
     * @name bplApp.PubSub#subscribe
     * @methodOf bplApp.PubSub
     *
     * @description
     * Subscribes the given channel, the given callback will be called with the args received in publish.
     *
     * @param {string} channel Name of the channel from the channels list
     * @param {function()} Callback Te callback to call when an event is triggered on this channel
     * @return {function()} Returns a deregistration function for this listener.
     */
    PubSub.subscribe = function(channel, callback){
//        if (!(channel in chanel2scopes)) chanel2scopes[channel] = [];
//        chanel2scopes[channel].push($scope);
        var scope = getScope();
        var deregistration = scope.$on(channel, callback);

        return deregistration;
    };

    return PubSub;
});
