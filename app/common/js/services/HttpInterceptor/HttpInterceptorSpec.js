'use strict';

describe('bplApp.services', function (){

    describe('HttpInterceptor', function (){
        var $q, $window, DataCache, HttpInterceptor;

        beforeEach(module('bplApp.services'));

        beforeEach(function(){
            $q = {when : function(){}, reject : function(){}};
            //DataCache = {removeAll : function(){}};
            $window = {location : {href : ''}};

            spyOn($q, 'when');
            spyOn($q, 'reject');
            //spyOn(DataCache, 'removeAll');

            module(function($provide) {
                $provide.value('$q', $q);
                $provide.value('$window', $window);
                //$provide.value('DataCache', DataCache);
            });

            inject(function($injector){
                HttpInterceptor = $injector.get('HttpInterceptor');
            });
        });

        it ('should have functions info, put, get, remove, removeAll, destroy', function(){
            expect(HttpInterceptor).toBeDefined();
            expect(HttpInterceptor.request).toEqual(jasmine.any(Function));
            expect(HttpInterceptor.requestError).toEqual(jasmine.any(Function));
            expect(HttpInterceptor.response).toEqual(jasmine.any(Function));
            expect(HttpInterceptor.responseError).toEqual(jasmine.any(Function));
        });

        it ("track request return same object", function(){
            var config = {data : {id : 101}, method : 'GET'};
            expect(HttpInterceptor.request(config)).toBe(config);
        });

//        it ('should call DataCache.removeAll', function(){
//            var config = {method : 'DELETE'};
//            HttpInterceptor.request(config);
//            expect(DataCache.removeAll).toHaveBeenCalled();
//        });

        it ('track request call $q.when with false', function(){
            HttpInterceptor.request(false);
            expect($q.when).toHaveBeenCalledWith(false);
        });

        it ('should call $q.reject', function(){
            var config = {};
            HttpInterceptor.requestError(config);
            expect($q.reject).toHaveBeenCalledWith(config);
        });

        it ("track response return same object", function(){
            var config = {data : {id : 101}, method : 'GET'};
            expect(HttpInterceptor.request(config)).toBe(config);
        });

        it ('track request call $q.when with false', function(){
            HttpInterceptor.response(false);
            expect($q.when).toHaveBeenCalledWith(false);
        });

        it ("track responseError call $q.reject with {data : {id : 101}, method : 'GET'}", function(){
            var config = {data : {id : 101}, method : 'GET'};
            HttpInterceptor.responseError(config);
            expect($q.reject).toHaveBeenCalledWith(config);
        });

        it ("should change $window.location.href to 'https://login.bankhapoalim.co.il' ", function(){
            HttpInterceptor.responseError({status : 403});
            expect($window.location.href).toEqual('https://login.bankhapoalim.co.il');
        });
    });
});