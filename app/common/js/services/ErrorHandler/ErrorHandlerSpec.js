'use strict';

describe('bplApp.services', function (){
    describe('ErrorHandler', function (){
        var ErrorHandler;

        beforeEach(module('bplApp.services'));

        beforeEach(inject(function($injector){
            ErrorHandler = $injector.get('ErrorHandler');
        }));

        it ('should be function', function(){
            ErrorHandler.redirectToLoginPage('asd');
            expect(ErrorHandler).toEqual(jasmine.any(Function));
        });
    });
});