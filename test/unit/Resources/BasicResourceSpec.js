'use strict';

describe('Resources', function() {
    describe('BasicResource', function() {
        var $httpBackend, BasicResource;
        var dummyCustomer = {'first_name' : 'Ronen', 'last_name' : 'Cohen'};

        beforeEach(module('bplApp.services', 'ngResource'));

        beforeEach(inject(function($injector){
            $httpBackend = $injector.get('$httpBackend');
            BasicResource = $injector.get('BasicResource');
        }));

        it ('should return Resource', function(){
            expect(BasicResource.get).toBeDefined();
            expect(BasicResource.get({resourceName : 'customers'})).toBeDefined();
            expect(BasicResource.get({resourceName : 'customers', subResourceName: 'basic'})).toBeDefined();
        });

        it ('should have right params', function(){
            var CustomerBasicResource = BasicResource.get({resourceName : 'customers', id: 101, subResourceName: 'basic'});
            expect(CustomerBasicResource.getResourceParams).toBeDefined();
            expect(CustomerBasicResource.getResourceParams().resourceName).toEqual('customers');
            expect(CustomerBasicResource.getResourceParams().subResourceName).toEqual('basic');
            expect(CustomerBasicResource.getResourceParams().id).toEqual(101);
        });

        it ('should have prototype $save function', function(){
            expect(BasicResource.get({resourceName : 'customers'}).prototype.$save).toBeDefined();
        });

        it ('should call POST "data/customers" and return customer.first_name = "Ronen" ', function(){
            $httpBackend.expectPOST('data/customers').respond(dummyCustomer);
            var customer = BasicResource.get({resourceName : 'customers'}).save(dummyCustomer);
            $httpBackend.flush();

            expect(customer.first_name).toEqual('Ronen');
        });

        it ('should have list function', function(){
            expect(BasicResource.get({resourceName : 'customers'}).list).toBeDefined();
        });

        it ('should call GET "data/customers"', function(){
            $httpBackend.expectGET('data/customers').respond([]);
            BasicResource.get({resourceName : 'customers'}).query();
            $httpBackend.flush();
        });

        it ('should call GET "data/customers/1"', function(){
            $httpBackend.expectGET('data/customers/1').respond({});
            BasicResource.get({resourceName : 'customers'}).get({id : 1});
            $httpBackend.flush();
        });

        it ('should have prototype $update function', function(){
            expect(BasicResource.get({resourceName : 'customers'}).prototype.$update).toBeDefined();
        });

        it ('should call PUT "data/customers/1"', function(){
            var dummyUpdatedCustomer = {id: 1, first_name : 'Mika', last_name : 'Yakov'};

            $httpBackend.whenGET('data/customers/1').respond(dummyCustomer);
            var customer = BasicResource.get({resourceName : 'customers'}).get({id : 1});
            $httpBackend.flush();

            angular.extend(customer, dummyUpdatedCustomer);

            $httpBackend.expectPUT('data/customers/1').respond(dummyUpdatedCustomer);
            customer.$update();

            $httpBackend.flush();
            expect(customer.first_name).toEqual('Mika');
        });
    });
});