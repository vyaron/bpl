'use strict';

describe('widgets', function() {
    var $scope, $httpBackend, moves;
    beforeEach(module('bplApp.widgets', 'widgets/moves/moves.html'));

    beforeEach(inject(function($injector, _$rootScope_){
        $scope = _$rootScope_.$new();

        $httpBackend = $injector.get('$httpBackend');

        jasmine.getJSONFixtures().fixturesPath='base/server';

       moves = getJSONFixture('data/moves/list.json');

        $httpBackend.whenGET('data/moves?ends_at=1387404000000&limit=7&offset=0&starts_at=1384812000000').respond(
            moves.slice(0,7),
            {'content-range' : '0-7/10'}
        );
    }));

    describe('moves directive', function(){
        var $compile, element;

        beforeEach(inject(function(_$compile_){
            $compile = _$compile_;

            element = $compile('<div moves></div>')($scope);
            $scope.$digest();
        }));

        it('Replaces the element with the appropriate content', function(){
            expect(element.find('table').length).toBe(1);
            expect(element.find('tbody tr').length).toBe(0);

            $httpBackend.flush();
            expect(element.find('tbody tr').length).toBe(14);
        });
    });

    describe('moves controller', function() {
        var $controller, movesCtrl, $filter, ngTableParams, MovesResource;

        beforeEach(inject(function($injector){
            $filter = $injector.get('$filter');
            ngTableParams = $injector.get('ngTableParams');
            MovesResource = $injector.get('MovesResource');
            $controller = $injector.get('$controller');

            movesCtrl = $controller('contacts', {
                $scope : $scope,
                $filter : $filter,
                ngTableParams : ngTableParams,
                MovesResource : MovesResource
            });

//            spyOn($scope, 'showPopup');
//            spyOn($window, 'confirm').andReturn(true);
//
//            $httpBackend.whenDELETE('data/contacts/1').respond(null);
        }));

        it('should define empty contacts array', function(){
          $httpBackend.expectGET('data/moves?ends_at=1387404000000&limit=7&offset=0&starts_at=1384812000000').respond(
                moves.slice(0,7),
                {'content-range' : '0-7/10'}
            );
        });
    });
});