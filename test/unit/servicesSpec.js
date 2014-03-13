// TODO: need extra works to test, using a CONTACT entity

'use strict';

/* jasmine specs for services go here */

//describe('service', function() {
//  beforeEach(module('bplApp.services'));
//
//
//  describe('version', function() {
//    it('should return current version', inject(function(version) {
//      expect(version).toEqual('0.1');
//    }));
//  });
//});

xdescribe('DataService Services', function(){
    //var mockResource;
    var $httpBackend, ENTITIES, DataService;

    beforeEach(module('bplApp.services', 'ngResource'));

    beforeEach(function(){
        module(function($provide){
            $provide.value('ENTITIES', {MONSTER : 'monster', CUSTOMER : 'customer', ACCOUNT : 'account', TRANSACTION : 'transaction'});
        });
    });

    beforeEach(inject(function($injector){
        $httpBackend = $injector.get('$httpBackend');
        DataService = $injector.get('DataService');
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('DataService', function(){
        it ('should add enums', function(){
            expect(DataService.CUSTOMER).toBeDefined();
            expect(DataService.ACCOUNT).toBeDefined();
            expect(DataService.TRANSACTION).toBeDefined();
        });

        it ('should return Entity key', function(){
            expect(DataService._getResourceKey(DataService.CUSTOMER)).toEqual('CUSTOMER');
            expect(DataService._getResourceKey(DataService.ACCOUNT)).toEqual('ACCOUNT');
            expect(DataService._getResourceKey(DataService.TRANSACTION)).toEqual('TRANSACTION');
        });

        it ('should create customer resource', function(){
            var monsterResource = DataService.get(DataService.CUSTOMER);
            expect(monsterResource.list).toBeDefined();
            expect(monsterResource.prototype.$update).toBeDefined();
        });

        it ('should store customer resource in _resources', function(){
            expect(DataService._resources).toBeDefined();
            expect(DataService._resources.CUSTOMER).not.toBeDefined();

            DataService.get(DataService.CUSTOMER);
            expect(DataService._resources.CUSTOMER).toBeDefined();
        });

        it ('should call GET data/monster/list', function(){
            var monsterService = DataService.get(DataService.MONSTER);

            $httpBackend.expectGET('data/monster/list').respond([]);
            monsterService.query();

            $httpBackend.flush();
        });

        it ('should call GET data/monster/1', function(){
            var monsterService = DataService.get(DataService.MONSTER);

            $httpBackend.expectGET('data/monster/1').respond({});
            monsterService.get({id:1});

            $httpBackend.flush();
        });

        it ('should call PUT data/monster/1', function(){
            $httpBackend.when('GET', 'data/monster/1').respond({id : 1, name: 'baba'});

            var monsterService = DataService.get(DataService.MONSTER);

            var monster = monsterService.get({id:1});
            $httpBackend.flush();

            $httpBackend.expectPUT('data/monster/1').respond({msg : 'success'});

            monster.name = "ido";
            monster.$update();
            $httpBackend.flush();
        });

        it ('should call POST data/monster', function(){
            $httpBackend.expectPOST('data/monster').respond({id:1});

            var monsterService = DataService.get(DataService.MONSTER);
            var monster = {name : "Ido"};
            monsterService.save(monster);

            $httpBackend.flush();
        });

//        it ('should call GET data/monster/1/action and return actionServices', function(){
//            $httpBackend.when('GET', 'data/monster/1').respond({id : 1, name: 'baba'});
//
//            var monsterService = DataService.get(DataService.MONSTER);
//            var monster = monsterService.get({id:1});
//            $httpBackend.flush();
//
//            //expect(monster.getAction).toBeDefined();
//
//            $httpBackend.expectGET('data/monster/1/action').respond([{id:1, txt:'Dressed up as a an ordinary man to fly to the moon'}]);
//
//            var actions = monster.getAction();
//            $httpBackend.flush();
//
//            expect(actions[0].$update).toBeDefined();
//            expect(actions[0].getAction).not.toBeDefined();
//        });
    });
});