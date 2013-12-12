'use strict';

describe('bplApp.services', function (){

    describe('DataCache', function (){
        var $cacheFactory, $cacheFactoryInstance, DataCache;

        $cacheFactory = function(){
            var noop = function(){};
            return {
                info : noop,
                put : noop,
                get : noop,
                remove : noop,
                removeAll : noop,
                destroy : noop
            };
        };

        beforeEach(module('bplApp.services'));

        beforeEach(function(){
            $cacheFactoryInstance = jasmine.createSpyObj('$cacheFactoryInstance', ['info', 'put', 'get', 'remove', 'removeAll', 'destroy']);
            $cacheFactory = jasmine.createSpy('$cacheFactory').andReturn($cacheFactoryInstance);

            module(function($provide) {
                $provide.value('$cacheFactory', $cacheFactory);
            });

            inject(function($injector){
                DataCache = $injector.get('DataCache');
            });
        });

        it ('tracks that the $cacheFactory was called with "data" param', function(){
            expect($cacheFactory).toHaveBeenCalledWith('Data');
        });

        it ('should have functions info, put, get, remove, removeAll, destroy', function(){
            expect(DataCache).toBeDefined();
            expect(DataCache.info).toEqual(jasmine.any(Function));
            expect(DataCache.put).toEqual(jasmine.any(Function));
            expect(DataCache.get).toEqual(jasmine.any(Function));
            expect(DataCache.remove).toEqual(jasmine.any(Function));
            expect(DataCache.removeAll).toEqual(jasmine.any(Function));
            expect(DataCache.destroy).toEqual(jasmine.any(Function));
        });

        it ('tracks that the $cacheFactoryInstance.info was called', function(){
            DataCache.info();
            expect($cacheFactoryInstance.info).toHaveBeenCalled();
        });

        it ('tracks that the $cacheFactoryInstance.put was called with "id", 101 ', function(){
            DataCache.put("id", 101);
            expect($cacheFactoryInstance.put).toHaveBeenCalledWith("id", 101);
        });

        it ('tracks that the $cacheFactoryInstance.get was called with "id"', function(){
            DataCache.get("id");
            expect($cacheFactoryInstance.get).toHaveBeenCalledWith("id");
        });

        it ('tracks that the $cacheFactoryInstance.remove was called with "id"', function(){
            DataCache.remove("id");
            expect($cacheFactoryInstance.remove).toHaveBeenCalledWith("id");
        });

        it ('tracks that the $cacheFactoryInstance.removeAll was called', function(){
            DataCache.removeAll();
            expect($cacheFactoryInstance.removeAll).toHaveBeenCalled();
        });

        it ('tracks that the $cacheFactoryInstance.destroy was called', function(){
            DataCache.destroy();
            expect($cacheFactoryInstance.destroy).toHaveBeenCalled();
        });
    });
});
