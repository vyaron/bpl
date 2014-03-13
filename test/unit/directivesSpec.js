'use strict';

/* jasmine specs for directives go here */

xdescribe('directives', function() {
    var $compile, $rootScope, template;
    beforeEach(module('bplApp.directives', 'common/templates/hello.html'));


    beforeEach(inject(function(_$compile_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;

    }));

    describe('hello', function(){
        //beforeEach(module('common/templates/hello.html'));

        it('Replaces the element with the appropriate content', function() {
            // Compile a piece of HTML containing the directive
            var element = $compile('<div hello name="Shalom"></div>')($rootScope);
            // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
            $rootScope.$digest();
            // Check that the compiled element contains the templated content
            expect(element.text()).toContain("Hello Shalom");
        });
    });
//  describe('app-version', function() {
//    it('should print current version', function() {
//      module(function($provide) {
//        $provide.value('version', 'TEST_VER');
//      });
//      inject(function($compile, $rootScope) {
//        var element = $compile('<span app-version></span>')($rootScope);
//        expect(element.text()).toEqual('TEST_VER');
//      });
//    });
//  });
});
