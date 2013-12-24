'use strict';

/**
 * @ngdoc object
 * @name bplApp.DataCache
 * @requires $cacheFactory
 *
 * @description
 * Handle client side caching in memory.
 *
 * # General usage
 * This is a wrapper around angular's $cacheFactory
 *
 * # Usage
 * None, this happen behind the scene by angular when data is requested via $http.
 *
 * # Processing
 * A wrapper and a hook point so we can extend $cacheFactory return object behavior in the future
 */
angular.module('bplApp.services')
    .factory('DataCache', ['$cacheFactory', function($cacheFactory){
        var _cacheFactory = $cacheFactory('Data');

        /**
         * @ngdoc method
         * @name bplApp.DataCache#info
         * @methodOf bplApp.DataCache
         *
         * @returns {Object} Returns id, size, and options of cache.
         */
        var infoFn = function(){return _cacheFactory.info();};

        /**
         * @ngdoc method
         * @name bplApp.DataCache#put
         * @methodOf bplApp.DataCache
         *
         * @description
         * Puts a new key-value pair into the cache and returns it.
         *
         * @param {String} key name
         * @param {*} value mix
         */
        var putFn = function(key, value){
            return _cacheFactory.put(key, value);
        };

        /**
         * @ngdoc method
         * @name bplApp.DataCache#get
         * @methodOf bplApp.DataCache
         *
         * @param {String} key name
         * @return {*} Returns cached value for key or undefined for cache miss.
         */
        var getFn = function(key){
            //console.log('Get: ' + key);
            return _cacheFactory.get(key);
        };

        /**
         * @ngdoc method
         * @name bplApp.DataCache#remove
         * @methodOf bplApp.DataCache
         *
         * @description
         * Removes a key-value pair from the cache.
         *
         * @param {String} key name
         */
        var removeFn = function(key){return _cacheFactory.remove(key);};

        /**
         * @ngdoc method
         * @name bplApp.DataCache#removeAll
         * @methodOf bplApp.DataCache
         *
         * @description
         * Removes all cached values.
         */
        var removeAllFn = function(){
            //console.log('Clear cache');
            return _cacheFactory.removeAll();
        };

        /**
         * @ngdoc method
         * @name bplApp.DataCache#destroy
         * @methodOf bplApp.DataCache
         *
         * @description
         * Removes references to this cache from $cacheFactory.
         */
        var destroyFn = function(){return _cacheFactory.destroy();} ;

        var sortedKeys = function(obj) {
            var keys = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys.sort();
        };

        var getCacheKey = function(resourceConfig, params){
            var keys = sortedKeys(params);

            var cacheKey = URL;

            cacheKey += '/' + resourceConfig.resourceName;

            if ('id' in params) {
                cacheKey += '/' + params.id;
                delete params.id;
            }
            if ('subResourceName' in resourceConfig && (resourceConfig.subResourceName[0] != '@')) cacheKey += '/' + resourceConfig.subResourceName;
            if ('subId' in params) {
                cacheKey += '/' + params.subId;
                delete  params.subId;
            }

            var uri = '';
            for (var i=0; i < keys.length; i++){
                var key = keys[i];

                if (key == 'id' || key == 'subId') continue;

                uri += '&' + key +'='+ params[key];
            }

            if (uri) cacheKey += '?' + uri.substr(1);

            return cacheKey;
        };


        return {
            info : infoFn,
            put : putFn,
            get : getFn,
            remove : removeFn,
            removeAll : removeAllFn,
            destroy : destroyFn,
            getCacheKey : getCacheKey
        };
    }]);


