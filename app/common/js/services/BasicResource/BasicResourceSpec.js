'use strict';

describe('bplApp.services', function (){
    describe('BasicResource', function (){
        var $httpBackend, DataCache, PubSub, Range, BasicResource;

        beforeEach(module('bplApp.services'));


//        beforeEach(module(function(BasicResourceProvider) {
//            BasicResourceProvider.setUrl('http://bpl.local/data')
//        }));


        beforeEach(function(){
            //DataCache = jasmine.createSpyObj('DataCache', ['remove', 'getCacheKey']);


            PubSub = jasmine.createSpyObj('PubSub', ['publish']);
            PubSub.CONTACTS = 'onContactsChange';
            PubSub.CUSTOMERS_BASIC = 'onCustomersBasicChange';

            Range = jasmine.createSpy('Range');

            module(function($provide) {
                //$provide.value('DataCache', DataCache);
                $provide.value('PubSub', PubSub);
                $provide.value('Range', Range);
                $provide.value('REST_URL', 'http://bpl.local/data');
            });

            inject(function($injector){
                DataCache = $injector.get('DataCache');
                $httpBackend = $injector.get('$httpBackend');
                BasicResource = $injector.get('BasicResource');

                spyOn(DataCache, 'removeAll');
            });
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it ('should return $resource with right actions', function(){
            var CustomersResource = BasicResource({resourceName : 'customers'});

            expect(CustomersResource).toBeDefined();
            expect(CustomersResource.save).toEqual(jasmine.any(Function));
            expect(CustomersResource.get).toEqual(jasmine.any(Function));
            expect(CustomersResource.update).toEqual(jasmine.any(Function));
            expect(CustomersResource.remove).toEqual(jasmine.any(Function));
            expect(CustomersResource.query).toEqual(jasmine.any(Function));

            expect(CustomersResource.getRange).toEqual(jasmine.any(Function));
            expect(CustomersResource.getConfig).toEqual(jasmine.any(Function));

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

        it ('should clear cache', function(){
            $httpBackend.whenGET('http://bpl.local/data/customers/1').respond({});
            $httpBackend.whenGET('http://bpl.local/data/customers?limit=2&offset=0').respond([]);
            $httpBackend.whenPOST('http://bpl.local/data/customers').respond({});
            $httpBackend.whenPUT('http://bpl.local/data/customers/1').respond({});
            $httpBackend.whenDELETE('http://bpl.local/data/customers/1').respond(null);

            BasicResource({resourceName : 'customers'}).get({id : 1});
            BasicResource({resourceName : 'customers'}).query({offset : 0, limit : 2});
            expect(DataCache.removeAll).not.toHaveBeenCalled();

            BasicResource({resourceName : 'customers'}).save({name : 'ronen'});
            BasicResource({resourceName : 'customers'}).update({id : 1, name : 'ronen'});
            BasicResource({resourceName : 'customers'}).remove({id : 1});

            expect(DataCache.removeAll).toHaveBeenCalledWith('customers');
            expect(DataCache.removeAll.calls.length).toEqual(3);

            $httpBackend.flush();
        });

        it ('should publish on right channels', function(){
            $httpBackend.whenPOST('http://bpl.local/data/contacts').respond({});
            $httpBackend.whenPOST('http://bpl.local/data/customers/basic').respond({});
            $httpBackend.whenPUT('http://bpl.local/data/contacts/1').respond({});
            $httpBackend.whenDELETE('http://bpl.local/data/contacts/1').respond(null);

            BasicResource({resourceName : 'contacts'}).save({name : 'Ronen Cohen'});
            BasicResource({resourceName : 'contacts'}).update({id : 1, name : 'Ronen Cohen'});
            BasicResource({resourceName : 'contacts'}).remove({id : 1});

            $httpBackend.flush();
            expect(PubSub.publish.mostRecentCall.args[0]).toEqual(PubSub.CONTACTS);
            expect(PubSub.publish.calls.length).toBe(3);

            BasicResource({resourceName : 'customers', subResourceName : 'basic'}).save({name : 'Ronen Cohen'});
            $httpBackend.flush();

            expect(PubSub.publish.mostRecentCall.args[0]).toEqual(PubSub.CUSTOMERS_BASIC);
        });

        it ('should call Range factory', function(){
            var CustomersResource = BasicResource({resourceName : 'customers'});
            CustomersResource.getRange(angular.noop);
            expect(Range).toHaveBeenCalled();
        });
    });
});