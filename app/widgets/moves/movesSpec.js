'use strict';

describe('widgets', function() {
    var $scope, $httpBackend, moves, ctgs;
    beforeEach(module('bplApp.widgets', 'widgets/moves/moves.html', 'widgets/moves/pager.html'));

    beforeEach(inject(function($injector, _$rootScope_){
        $scope = _$rootScope_.$new();

        $httpBackend = $injector.get('$httpBackend');

        jasmine.getJSONFixtures().fixturesPath='base/server';

        moves = getJSONFixture('data/moves/list.json');
        ctgs = getJSONFixture('data/moves/categories/list.json');

        $httpBackend.whenGET('data/moves/categories').respond(ctgs);

        $httpBackend.whenGET('data/moves?ends_at=1387404000000&limit=7&offset=0&starts_at=1384812000000').respond(
            moves.slice(0,7),
            {'content-range' : '0-7/10'}
        );
    }));

    describe('movesFilterDropdown directive', function(){
        var $compile, element;

        beforeEach(inject(function(_$compile_){
            $compile = _$compile_;

            element = $compile('<ul moves-filter-dropdown><li><div></div><ul></ul></li><li><div></div><ul></ul></li></ul>')($scope);
            $scope.$digest();
        }));

        it('Replaces the element with the appropriate content', function(){
            var firstEl = element.find('> li:first');
            var lastEl = element.find('> li:last');
            expect(firstEl.find('div:first').attr('ng-click')).toEqual("openDropDown(0)");
            expect(firstEl.find('ul:first').attr('ng-show')).toEqual("isDropDownOpen(0)");

            expect(lastEl.find('div:first').attr('ng-click')).toEqual("openDropDown(1)");
            expect(lastEl.find('ul:first').attr('ng-show')).toEqual("isDropDownOpen(1)");
        });
    });

    describe('movesSort directive', function(){
        var $compile, element;

        beforeEach(inject(function(_$compile_){
            $compile = _$compile_;

            element = $compile('<div moves-sort="created_at"></div>')($scope);
            $scope.$digest();
        }));

        it('Replaces the element with the appropriate content', function(){
            expect(element.attr('ng-click')).toEqual("sorting('created_at')");
            expect(element.attr('ng-class')).toEqual("getSortableClass('created_at')");
        });
    });

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

            //$httpBackend.flush();
            //expect(element.find('tbody tr').length).toBe(14);
        });
    });

    describe('moves controller', function() {
        var $controller, movesCtrl, $filter, ngTableParams, MovesResource;

        beforeEach(inject(function($injector){
            $filter = $injector.get('$filter');
            ngTableParams = $injector.get('ngTableParams');
            MovesResource = $injector.get('MovesResource');
            $controller = $injector.get('$controller');

            movesCtrl = $controller('moves', {
                $scope : $scope,
                $filter : $filter,
                ngTableParams : ngTableParams,
                MovesResource : MovesResource
            });
        }));

        it('should define empty contacts array', function(){
          $httpBackend.expectGET('data/moves?ends_at=1387404000000&limit=7&offset=0&starts_at=1384812000000').respond(
                moves.slice(0,7),
                {'content-range' : '0-7/10'}
            );
        });

        it('should contain object with 2 properties ends_at, starts_at', function(){
            expect($scope.filter).toEqual(jasmine.any(Object));
            expect($scope.filter.starts_at).toEqual(jasmine.any(Number));
            expect($scope.filter.ends_at).toEqual(jasmine.any(Number));
        });

        it('should contain tableModel object', function(){
            expect($scope.tableModel).toEqual(jasmine.any(Object));
        });

        it ('should set the right sort param', function(){
            $scope.sorting('created_at');
            expect($scope.isGrouped).toBeTruthy();

            //spyOn($scope.tableParams, 'sorting');
            //expect($scope.tableParams.sorting).toHaveBeenCalledWith({created_at : 'asc'});

            $scope.sorting('income');
            expect($scope.isGrouped).not.toBeTruthy();
        });

        it ('should return the right sort class', function(){
            expect($scope.getSortableClass('income')).toBe('sortable');

            $scope.sorting('income');

            expect($scope.getSortableClass('income')).toBe('sortable sort-asc');
        });
    });
});