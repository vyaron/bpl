'use strict';

angular.module('bplApp.services').constant('PubSubChannels', {
        CONTACTS : 'onContactsChanged',
		CHANEL_ACCOUNT_SELECTED     : 'cnlAccountSelected',
        CHANEL_SEVERE_ERROR         : 'cnlSevereError',

        STATUS_500 : 'onStatus500'
});