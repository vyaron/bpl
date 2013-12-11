'use strict';

/**
 * @ngdoc function
 * @name bplApp.services:DataCache
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
 * A wrapper and a hook point so we can extend caching behavior in the future,
 * and be able to do things like: {angular-cache : http://jmdobry.github.io/angular-cache/}
 *
 * <pre>
 *  var bplData = DataCache('BplData', {capacity: 100});
 *  bplData.put("key", "value");
 *  bplData.get("key"); // return "value"
 * </pre>
 */
angular.module('bplApp.services')
    .factory('DataCache', ['$cacheFactory', function($cacheFactory){
        var _cacheFactory = $cacheFactory('Data');

        var infoFn = function(){return _cacheFactory.info();};
        var putFn = function(key, value){
            //console.log('Put: ' + key);
            return _cacheFactory.put(key, value);
        };

        var getFn = function(key){
            //console.log('Get: ' + key);
            return _cacheFactory.get(key);
        };

        var removeFn = function(key){return _cacheFactory.remove(key);};

        var removeAllFn = function(){
            //console.log('Clear cache');
            return _cacheFactory.removeAll();
        };

        var destroyFn = function(){return _cacheFactory.destroy();};

        return {
            info : infoFn,
            put : putFn,
            get : getFn,
            remove : removeFn,
            removeAll : removeAllFn,
            destroy : destroyFn
        };
    }]);


