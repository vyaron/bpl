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
    .factory('DataCache', ['$cacheFactory', 'REST_URL', function($cacheFactory, REST_URL){
        var _cacheFactory = $cacheFactory('Data');

        var resourceToKeys = {};
        var setKey = function(name, key){
            if (!(name in resourceToKeys)) resourceToKeys[name] = [];
            resourceToKeys[name].push(key);
        };

        var getKeys = function(name){
            return (name in resourceToKeys) ? resourceToKeys[name] : [];
        };

        /**
         * @ngdoc method
         * @name bplApp.DataCache#info
         * @methodOf bplApp.DataCache
         *
         * @returns {Object} Returns id, size, and options of cache.
         */
        var info = function(){return _cacheFactory.info();};

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
        var put = function(key, value){
            //save relation between resource name to cache key
            var t = key.match(REST_URL + '/' + '([a-zA-Z]+)');
            if (t && t.length > 1) setKey(t[1], key);

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
        var get = function(key){
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
        var remove = function(key){return _cacheFactory.remove(key);};

        /**
         * @ngdoc method
         * @name bplApp.DataCache#removeAll
         * @methodOf bplApp.DataCache
         *
         * @description
         * Removes all cached values.
         *
         * @param {String} name optional resource name
         */
        var removeAll = function(name){
            if (name){
                var keys = getKeys(name);
                for (var i=0; i < keys.length; i++){
                    remove(keys[i]);
                }
                if (resourceToKeys[name]) delete resourceToKeys[name];
            } else return _cacheFactory.removeAll();
        };

        /**
         * @ngdoc method
         * @name bplApp.DataCache#destroy
         * @methodOf bplApp.DataCache
         *
         * @description
         * Removes references to this cache from $cacheFactory.
         */
        var destroy = function(){return _cacheFactory.destroy();} ;

        return {
            info : info,
            put : put,
            get : get,
            remove : remove,
            removeAll : removeAll,
            destroy : destroy
        };
    }]);


