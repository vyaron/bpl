'use strict';

/* jasmine specs for filters go here */

xdescribe('filter', function() {
  beforeEach(module('bplApp.filters'));


  describe('interpolate', function() {
    beforeEach(module(function($provide) {
      $provide.value('version', 'TEST_VER');
    }));


    it('should replace VERSION', inject(function(interpolateFilter) {
      expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
    }));
  });
});
