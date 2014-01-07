'use strict';

describe('directives', function() {
    describe('fileExport', function() {
        var $rootScope, $http, $window = window;

        beforeEach(module('bplApp.directives'));

        beforeEach(inject(function($injector){
            //$window = $injector.get('$window');
            $rootScope = $injector.get('$rootScope');
            $http = $injector.get('$http');
        }));

        describe('fileExport directive', function(){
            var $scopeCsv, $scopeHtml, $compile, elementCsv, elementHtml;

            beforeEach(inject(function(_$compile_){
                $compile = _$compile_;

                elementCsv = $compile('<a file-export="contacts" file-export-type="csv" file-export-options="options">Excel</a> ')($rootScope);
                elementHtml = $compile('<a file-export="contacts" file-export-type="html">Excel</a> ')($rootScope);
                $rootScope.$digest();

                $scopeCsv = elementCsv.isolateScope();
                $scopeHtml = elementHtml.isolateScope();
            }));

            afterEach(function(){
                if (typeof $rootScope.contacts != 'undefined') delete $rootScope.contacts;
                if (typeof $rootScope.options != 'undefined') delete $rootScope.options;
            });

            var isIE = function(){
                return ($window.navigator.userAgent.indexOf('MSIE') >= 0);
            };

            var isBrowserSupportMsSaveBlob = function(){
                return ($window.navigator.msSaveBlob) ? true : false;
            };

            var isBrowserSupportFileExport = function(){
                return (isBrowserSupportMsSaveBlob() || (!isIE() && Blob && $window.URL.createObjectURL)) ? true : false;
            };

            //AJAX test blob content with objectURL
            var getBlobContent = function(element, onSuccess){
                var xhr = new XMLHttpRequest();
                xhr.open('GET', element.attr('href'), true);
                //xhr.responseType = 'blob';

                xhr.onload = function(e) {
                    if (this.readyState == 4 && this.status == 200) onSuccess(this.response);
                };

                xhr.send();
            };

            it('should add disabled class based on data', function(){
//                expect(elementCsv.hasClass('disabled')).toBe(true);
//
//                if (!isIE()){
//                    $rootScope.$apply(function(scope){
//                        scope.contacts = {id : 1, name : 'Ronen Cohen'};
//                    });
//                    expect(elementCsv.hasClass('disabled')).toBe(false);
//
//                    $rootScope.$apply(function(scope){
//                        scope.contacts = [];
//                    });
//                    expect(elementCsv.hasClass('disabled')).toBe(true);
//
//                    $rootScope.$apply(function(scope){
//                        scope.contacts = [{id : 1, name : 'Ronen Cohen'}];
//                    });
//                    expect(elementCsv.hasClass('disabled')).toBe(false);
//                }

                $rootScope.$apply(function(scope){
                    scope.contacts = [{id : 1, name : 'Ronen Cohen'}];
                });

                var navigator = $window.navigator;
                $window.navigator = {userAgent : 'MSIE'};

                var newelementCsv = $compile('<a file-export="contacts" file-export-type="csv" file-export-options="options">Excel</a> ')($rootScope);
                expect(newelementCsv.hasClass('disabled')).toBe(true);

                $window.navigator = navigator;
            });

            if (isBrowserSupportFileExport() && !isIE()){
                it('should add download attr', function(){
                    expect(elementCsv.attr('download')).not.toBeDefined();

                    elementCsv.click();

                    expect(elementCsv.attr('download')).not.toBeDefined();

                    $rootScope.$apply(function(scope){
                        scope.contacts = {id : 1, name : 'Ronen Cohen'};
                    });

                    elementCsv.click();
                    expect(elementCsv.attr('download')).toBe('data.csv');

//                    $rootScope.$apply(function(scope){
//                        scope.contacts = null;
//                    });
//                    expect(elementCsv.attr('download')).not.toBeDefined();
                });

                it('should add href attr with right blob object', function(){
                    expect(elementCsv.attr('href')).not.toBeDefined();
                    expect(elementHtml.attr('href')).not.toBeDefined();

                    $rootScope.$apply(function(scope){
                        scope.contacts = {id : 1, name : 'Ronen Cohen'};
                    });
                    elementCsv.click();
                    expect(elementCsv.attr('href')).toMatch('blob:');

                    elementHtml.click();
                    expect(elementHtml.attr('href')).toMatch('blob:');

                    getBlobContent(elementCsv, function(res){
                        expect(res).toMatch('1,Ronen Cohen');
                    });


                    spyOn($window.URL, 'revokeObjectURL');
                    $rootScope.$apply(function(scope){
                        scope.contacts = [{id : 1, name : 'Miri Kaplan'}, {id : 2, name : 'Ronen Cohen'}];
                    });

                    var href = elementCsv.attr('href');
                    elementCsv.click();
                    expect($window.URL.revokeObjectURL).toHaveBeenCalledWith(href);

                    getBlobContent(elementCsv, function(res){
                        expect(res).toMatch('1,Miri Kaplan');
                        expect(res).toMatch('2,Ronen Cohen');
                    });

                    var el = angular.element('<div>Miri Kaplan</div>');
                    angular.element(document.body).append(el);

                    href = elementHtml.attr('href');
                    elementHtml.click();
                    expect($window.URL.revokeObjectURL).toHaveBeenCalledWith(href);

                    el.remove();

                    getBlobContent(elementHtml, function(res){
                        expect(res).toMatch('Miri Kaplan');
                    });

                    //TODO: check order, track option.filter function was called
                });

                it('should get csv with Name, Date column', function(){
                    $rootScope.$apply(function(scope){
                        scope.contacts = [{created_at : Date.now(), id : 1, name : 'Miri Kaplan'}, {id : 2, created_at : Date.now(), name : 'Ronen Cohen'}, {id : 2, name : 'Ronen Cohen'}];
                        scope.options = [
                            {name : 'name', label : 'Name'},
                            {name : 'created_at', label : 'Date', filter : angular.noop}
                        ];
                    });

                    //debugger;

                    elementCsv.click();
                    getBlobContent(elementCsv, function(res){
                        expect(res).toMatch("Name,Date\n");
                    });
                });
            }

            if (isBrowserSupportFileExport()){
                it ('should tack msSaveBlob have been called with right params', function(){
                    if (!$window.navigator.msSaveBlob) $window.navigator.msSaveBlob = angular.noop;

                    spyOn($window.navigator, 'msSaveBlob');

                    elementCsv.click();
                    expect($window.navigator.msSaveBlob).not.toHaveBeenCalled();

                    $rootScope.$apply(function(scope){
                        scope.contacts = {id : 1, name : 'Ronen Cohen'};
                    });

                    elementCsv = $compile('<a file-export="contacts" file-export-type="csv" file-export-options="options">Excel</a> ')($rootScope);

                    elementCsv.click();
                    expect($window.navigator.msSaveBlob).toHaveBeenCalledWith(jasmine.any(Object), 'data.csv');
                });
            }
        });
    });
});