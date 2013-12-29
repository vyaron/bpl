'use strict';

describe('bplApp.services', function (){
    describe('ErrorHandler', function (){
        var $window, PubSub, ErrorHandler;

        beforeEach(module('bplApp.services'));

        beforeEach(function(){
            $window = {location : {href : ''}};

            module(function($provide) {
                $provide.value('$window', $window);
            });

            inject(function($injector){
                ErrorHandler = $injector.get('ErrorHandler');
                PubSub = $injector.get('PubSub');
            });
        });

        it ('should call the right function', function(){
            expect(ErrorHandler).toEqual(jasmine.any(Function));

            var rejection = {status : 403};
            ErrorHandler(rejection);
            expect($window.location.href).toContain('login.bankhapoalim.co.il');

            spyOn(PubSub, 'publish');
            rejection = {status : 500};
            ErrorHandler(rejection);
            expect(PubSub.publish).toHaveBeenCalledWith(PubSub.STATUS_500, jasmine.any(Object));
        });
    });
});