'use strict';
/**
 * Created by Yaron on 27/11/13.
 */

angular.module('bplApp.services')
    .factory('DataCacheFactory', ['$cacheFactory', function($cacheFactory){
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


