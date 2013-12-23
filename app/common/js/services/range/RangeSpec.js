'use strict';

describe('bplApp.services', function (){
    describe('Range', function (){
        var Range;
        beforeEach(module('bplApp.services'));

        beforeEach(inject(function($injector){
            Range = $injector.get('Range');
        }));

        it ('should return range object with offset 0, limit 10, total 120', function(){
            var headers = function(){
                return {'content-range' : '0-10/120'};
            };

            var rangeData = Range(headers);

            expect(rangeData).toEqual(jasmine.any(Object));
            expect(rangeData.offset).toBe(0);
            expect(rangeData.limit).toBe(10);
            expect(rangeData.total).toBe(120);
        });

        it ('should return range object with offset 10, limit 21 without total', function(){
            var headers = function(){
                return {'content-range' : '10-21/*'};
            };

            var rangeData = Range(headers);

            expect(rangeData).toEqual(jasmine.any(Object));
            expect(rangeData.offset).toBe(10);
            expect(rangeData.limit).toBe(21);
            expect(rangeData.total).not.toBeDefined();
        });
    });
});