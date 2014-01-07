'use strict';

describe('bplApp.services', function (){
    var $scope, PubSub;

    beforeEach(module('bplApp.services'));

    beforeEach(inject(function($injector){
        PubSub = $injector.get('PubSub');

        $scope = {$on : function(){}, $broadcast : function(){}};
        spyOn($scope, '$on');
        spyOn($scope, '$broadcast');
    }));

    describe('PubSub', function (){
        it ('should have subscribe, publish functions', function(){
            expect(PubSub.subscribe).toEqual(jasmine.any(Function));
            expect(PubSub.publish).toEqual(jasmine.any(Function));
        });

        it ('should track callBackFunc was called with right parameter', function(){
            var callBackFunc = jasmine.createSpy('callBackFunc');
            PubSub.subscribe('chanel1', callBackFunc);
            PubSub.publish('chanel1', 2);
            expect(callBackFunc).toHaveBeenCalled();
            expect(callBackFunc.mostRecentCall.args[1]).toBe(2);
        });

        it ('should track callBackFunc not have been called', function(){
            var callBackFunc = jasmine.createSpy('callBackFunc');
            var deregistrationFunc = PubSub.subscribe('chanel1', callBackFunc);
            deregistrationFunc();
            PubSub.publish('chanel1', 2);
            expect(callBackFunc).not.toHaveBeenCalled();
        });

        it ('should call callback properly', function(){
            var callBackFunc = jasmine.createSpy('callBackFunc');
            PubSub.subscribe('chanel1', callBackFunc);

            PubSub.subscribe('chanel1', angular.noop);
            PubSub.subscribe('chanel1', angular.noop);
            PubSub.subscribe('chanel1', angular.noop);
            PubSub.subscribe('chanel1', angular.noop);
            PubSub.subscribe('chanel1', angular.noop);

            PubSub.publish('chanel1', 2);
            expect(callBackFunc.callCount).toEqual(1);
        });
    });
});