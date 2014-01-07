'use strict';

describe('directives', function() {
    describe('fileExport', function() {
        var $rootScope, $http, $window;

        beforeEach(module('bplApp.directives', 'bplApp.services', 'bplApp.filters', 'common/js/directives/fileExports/fileExports.html'));

        beforeEach(inject(function($injector){
            $window = $injector.get('$window');
            $rootScope = $injector.get('$rootScope');
            $http = $injector.get('$http');
        }));

        describe('fileExports directive', function(){
            var $scope, $compile, element;

            beforeEach(inject(function(_$compile_){
                $compile = _$compile_;

                $rootScope.data = [{id : 1, name : 'Ronen Cohen', created_at : Date.now()}];
                $rootScope.options = [{name : 'name', label : 'Full Name'}, {name : 'created_at', label : 'Date', filter : angular.noop}];

                element = $compile('<file-exports data="data" options="options">Excel</file-exports> ')($rootScope);
                $rootScope.$digest();

                $scope = element.isolateScope();
            }));

            afterEach(function(){
                delete $scope.data;
                delete $scope.options;
            });

            it ('should contain file-exports class', function(){
                expect(element.hasClass('file-exports')).toBe(true);
            });

            it ('should contain dropdown with 3 options', function(){
                var dropdownEl = element.find('.dropdown');
                expect(dropdownEl.length).toBe(1);
                expect(dropdownEl.find('li').length).toBe(3);
            });

            it ('track window.print was called', function(){
                spyOn($window, 'print');

                element.find('[ng-click="print()"]').click();

                expect($window.print).toHaveBeenCalled();
            });
        });
    });
});