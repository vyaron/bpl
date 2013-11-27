'use strict';

describe('Resources', function() {
    describe('CustomersResource', function() {
        var $httpBackend, CustomersResource;
        var dummyCustomer = {'first_name' : 'Ronen', 'last_name' : 'Cohen'};

        beforeEach(module('bplApp.services', 'ngResource'));

        beforeEach(inject(function($injector){
            $httpBackend = $injector.get('$httpBackend');
            CustomersResource = $injector.get('CustomersResource');
        }));

        it ('should set resourceName "customers"', function(){
            expect(CustomersResource.getResourceParams().resourceName).toEqual('customers');
        });

        it ('should call GET data/customers/101 "', function(){
            $httpBackend.whenGET('data/customers/101').respond(angular.extend({id : 101}, dummyCustomer));
            CustomersResource.get({id : 101});
            $httpBackend.flush();
        });

        it ('should return full name "Ronen Cohen"', function(){
            $httpBackend.whenGET('data/customers/1').respond({id:1, first_name:'Ronen', last_name:'Cohen'});
            var customer = CustomersResource.get({id : 1});

            expect(customer.getFullName()).toBe('');
            $httpBackend.flush();

            expect(customer.getFullName()).toBe('Ronen Cohen');
        });
    });
});