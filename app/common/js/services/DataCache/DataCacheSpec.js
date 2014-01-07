'use strict';

describe('bplApp.services', function (){

    describe('DataCache', function (){
        var $cacheFactory, $cacheFactoryInstance, DataCache, REST_URL='api';

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
            //$cacheFactoryInstance = jasmine.createSpyObj('$cacheFactoryInstance', ['info', 'put', 'get', 'remove', 'removeAll', 'destroy']);
            //$cacheFactory = jasmine.createSpy('$cacheFactory').andReturn($cacheFactoryInstance);

            module(function($provide) {
                //$provide.value('$cacheFactory', $cacheFactory);
                $provide.value('REST_URL', REST_URL);
            });

            inject(function($injector){
                DataCache = $injector.get('DataCache');
                $cacheFactory = $injector.get('$cacheFactory');
            });
        });

        it ('should defined "data" in $cacheFacroty', function(){
            expect($cacheFactory.get('Data')).toBeDefined();
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

        it ('tracks that the $cacheFactory.get("Data").info was called', function(){
            spyOn($cacheFactory.get('Data'), 'info');
            DataCache.info();
            expect($cacheFactory.get('Data').info).toHaveBeenCalled();
        });

        it ('tracks that the $cacheFactory.get("Data").put was called with "id", 101 ', function(){
            spyOn($cacheFactory.get('Data'), 'put');

            var customer = {id : 1, name : 'Ronen Cohen'};
            var url = REST_URL + "/customer";
            DataCache.put(url, customer);

            expect($cacheFactory.get("Data").put).toHaveBeenCalledWith(url, customer);
        });

        it ('tracks that the $cacheFactory.get("Data").get was called with "id"', function(){
            spyOn($cacheFactory.get('Data'), 'get');
            DataCache.get("id");
            expect($cacheFactory.get("Data").get).toHaveBeenCalledWith("id");
        });

        it ('tracks that the $cacheFactory.get("Data").remove was called with "id"', function(){
            spyOn($cacheFactory.get('Data'), 'remove');
            DataCache.remove("id");
            expect($cacheFactory.get("Data").remove).toHaveBeenCalledWith("id");
        });

        it ('tracks that the $cacheFactory.get("Data").removeAll was called', function(){
            spyOn($cacheFactory.get('Data'), 'removeAll');
            DataCache.removeAll();
            expect($cacheFactory.get("Data").removeAll).toHaveBeenCalled();
        });

        it ('should remove all resource data', function(){
            var customer = {id : 1, name : 'Ronen Cohen'};

            var urlA = REST_URL + "/customers";
            var urlB = REST_URL + "/customers/basic";
            var urlC = REST_URL + "/transactions";

            DataCache.put(urlA, customer);
            DataCache.put(urlB, customer);
            DataCache.put(urlC, customer);

            expect(DataCache.get(urlA)).toBeDefined();
            expect(DataCache.get(urlB)).toBeDefined();
            expect(DataCache.get(urlC)).toBeDefined();

            DataCache.removeAll('customers');

            expect(DataCache.get(urlA)).not.toBeDefined();
            expect(DataCache.get(urlB)).not.toBeDefined();
            expect(DataCache.get(urlC)).toBeDefined();
        });


        it ('tracks that the $cacheFactory.get("Data").destroy was called', function(){
            spyOn($cacheFactory.get('Data'), 'destroy');
            DataCache.destroy();
            expect($cacheFactory.get("Data").destroy).toHaveBeenCalled();
        });
    });
});
