'use strict';

describe('Resources', function() {
    describe('CustomersBasicResource', function() {
        var $httpBackend, CustomersBasicResource;
        var dummyCustomerBasic = {'first_name' : 'Ronen', 'last_name' : 'Cohen'};

        beforeEach(module('bplApp.resources'));

        beforeEach(inject(function($injector){
            $httpBackend = $injector.get('$httpBackend');
            CustomersBasicResource = $injector.get('CustomersBasicResource');
        }));

        it ('should set resourceName "customers"', function(){
            expect(CustomersBasicResource.getResourceParams().resourceName).toEqual('customers');
            expect(CustomersBasicResource.getResourceParams().subResourceName).toEqual('basic');
        });

        it ('should call GET data/customers/101 "', function(){
            $httpBackend.whenGET('data/customers/101/basic').respond(angular.extend({id : 101, subId: 1}, dummyCustomerBasic));
            CustomersBasicResource.get({id : 101});
            $httpBackend.flush();
        });
    });
});