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

                elementCsv = $compile('<a file-export="contacts" file-export-type="csv">Excel</a> ')($rootScope);
                elementHtml = $compile('<a file-export="contacts" file-export-type="html">Excel</a> ')($rootScope);
                $rootScope.$digest();

                $scopeCsv = elementCsv.isolateScope();
                $scopeHtml = elementHtml.isolateScope();
            }));

            afterEach(function(){
                if (typeof $rootScope.contacts != 'undefined') delete $rootScope.contacts;
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
            var getBlobContent = function(onSuccess){
                var xhr = new XMLHttpRequest();
                xhr.open('GET', elementCsv.attr('href'), true);
                //xhr.responseType = 'blob';

                xhr.onload = function(e) {
                    if (this.status == 200) onSuccess(this.response);
                };

                xhr.send();
            };

            it('should add disabled class based on data', function(){
                expect(elementCsv.hasClass('disabled')).toBe(true);

                if (!isIE()){
                    $rootScope.$apply(function(scope){
                        scope.contacts = {id : 1, name : 'Ronen Cohen'};
                    });
                    expect(elementCsv.hasClass('disabled')).toBe(false);

                    $rootScope.$apply(function(scope){
                        scope.contacts = [];
                    });
                    expect(elementCsv.hasClass('disabled')).toBe(true);

                    $rootScope.$apply(function(scope){
                        scope.contacts = [{id : 1, name : 'Ronen Cohen'}];
                    });
                    expect(elementCsv.hasClass('disabled')).toBe(false);
                }

                $rootScope.$apply(function(scope){
                    scope.contacts = [{id : 1, name : 'Ronen Cohen'}];
                });

                var navigator = $window.navigator;
                $window.navigator = {userAgent : 'MSIE'};

                var newelementCsv = $compile('<a file-export="contacts" file-export-type="csv">Excel</a> ')($rootScope);
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

                    $rootScope.$apply(function(scope){
                        scope.contacts = null;
                    });
                    expect(elementCsv.attr('download')).not.toBeDefined();
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

                    getBlobContent(function(res){
                        expect(res).toBe('1,Ronen Cohen');
                    });

                    var href = elementCsv.attr('href');

                    spyOn($window.URL, 'revokeObjectURL');
                    $rootScope.$apply(function(scope){
                        scope.contacts = [{id : 1, name : 'Miri Kaplan'}, {id : 2, name : 'Ronen Cohen'}];
                    });
                    elementCsv.click();
                    expect($window.URL.revokeObjectURL).toHaveBeenCalledWith(href);



                    getBlobContent(function(res){
                        expect(res).toContain('1,Miri Kaplan');
                        expect(res).toContain('2,Ronen Cohen');
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

                    elementCsv.click();
                    expect($window.navigator.msSaveBlob).toHaveBeenCalledWith(jasmine.any(Object), 'data.csv');
                });
            }
        });
    });
});