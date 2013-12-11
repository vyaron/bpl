'use strict';

describe('bplApp.services', function (){
    describe('BasicResource', function (){
        var $httpBackend, BasicResource;

        beforeEach(module('bplApp.services'));


        beforeEach(module(function(BasicResourceProvider) {
            BasicResourceProvider.setUrl('http://bpl.local/data')
        }));

        beforeEach(inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            BasicResource = $injector.get('BasicResource');
        }));

        it ('should return $resource with right actions', function(){
            var CustomersResource = BasicResource({resourceName : 'customers'});

            expect(CustomersResource).toBeDefined();
            expect(CustomersResource.save).toEqual(jasmine.any(Function));
            expect(CustomersResource.get).toEqual(jasmine.any(Function));
            expect(CustomersResource.update).toEqual(jasmine.any(Function));
            expect(CustomersResource.remove).toEqual(jasmine.any(Function));
            expect(CustomersResource.query).toEqual(jasmine.any(Function));

            expect(CustomersResource.prototype.$update).toEqual(jasmine.any(Function));
            expect(CustomersResource.prototype.$delete).toEqual(jasmine.any(Function));
        });

        it ('should have right params', function(){
            var CustomersResource = BasicResource({resourceName : 'customers', subResourceName : 'basic', id : 101});

            expect(CustomersResource.getConfig).toBeDefined();
            expect(CustomersResource.getConfig().resourceName).toEqual('customers');
            expect(CustomersResource.getConfig().subResourceName).toEqual('basic');
            expect(CustomersResource.getConfig().id).toEqual(101);
        });

        it ('should call CRUD calls', function(){
            var CustomersResource = BasicResource({resourceName : 'customers'});

            $httpBackend.expectGET('http://bpl.local/data/customers').respond([]);
            CustomersResource.query();
            $httpBackend.flush();

            $httpBackend.expectPOST('http://bpl.local/data/customers').respond({id : 101, full_name : 'Ronen Cohen'});
            var customer = CustomersResource.save({full_name : 'Ronen Cohen'});
            $httpBackend.flush();

            $httpBackend.expectPUT('http://bpl.local/data/customers/101').respond({id : 101, full_name : 'Ronen Cohen Levi'});
            customer.full_name = "Ronen Cohen Levi";
            customer.$update();
            $httpBackend.flush();

            $httpBackend.expectDELETE('http://bpl.local/data/customers/101').respond(null);
            customer.$remove();
            $httpBackend.flush();
        });

        it ('should call GET "data/customers/1"', function(){
            $httpBackend.expectGET('http://bpl.local/data/customers/1').respond({});
            BasicResource({resourceName : 'customers'}).get({id : 1});
            $httpBackend.flush();
        });
    });
});