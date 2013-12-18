'use strict';

describe('bplApp.services', function (){
    describe('MovesResource', function (){
        var $httpBackend, BasicResource, MovesResource;

        beforeEach(module('bplApp.resources'));

        beforeEach(inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            BasicResource = $injector.get('BasicResource');
            MovesResource = $injector.get('MovesResource');
        }));

        it ('should have right params', function(){
            expect(MovesResource.getConfig().resourceName).toEqual('moves');
        });
    });
});