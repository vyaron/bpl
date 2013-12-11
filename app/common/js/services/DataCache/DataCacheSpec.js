'use strict';

describe('bplApp.services', function (){

    describe('DataCache', function (){
        var $scope, DataCache;

        beforeEach(module('bplApp.services'));

        beforeEach(inject(function($injector){
            DataCache = $injector.get('DataCache');
        }));

        it ('should have functions info, put, get, remove, removeAll, destroy', function(){
            expect(DataCache).toBeDefined();
            expect(DataCache.info).toEqual(jasmine.any(Function));
            expect(DataCache.put).toEqual(jasmine.any(Function));
            expect(DataCache.get).toEqual(jasmine.any(Function));
            expect(DataCache.remove).toEqual(jasmine.any(Function));
            expect(DataCache.removeAll).toEqual(jasmine.any(Function));
            expect(DataCache.destroy).toEqual(jasmine.any(Function));
        });
    });
});
