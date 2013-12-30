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
        it ('should have subscribe function', function(){
            expect(PubSub.subscribe).toEqual(jasmine.any(Function));
        });

        it ('should track $on was called with right parameters', function(){
            PubSub.subscribe('chanel1', $scope, function(){});
            expect($scope.$on).toHaveBeenCalledWith('chanel1', jasmine.any(Function));
        });

        it ('should have publish function', function(){
            expect(PubSub.publish).toEqual(jasmine.any(Function));
        });

        it ('should track $on was called with right chanel and parameter', function(){
            PubSub.subscribe('chanel1', $scope, function(){});

            PubSub.publish('chanel1', 101);
            expect($scope.$broadcast).toHaveBeenCalledWith('chanel1',101);
        });

        it ('should have unsubscribe function', function(){
            expect(PubSub.unsubscribe).toEqual(jasmine.any(Function));
        });

        it ('should track $on was not called', function(){
            PubSub.subscribe('chanel1', $scope, function(){});
            PubSub.unsubscribe('chanel1', $scope);

            PubSub.publish('chanel1', 101);
            expect($scope.$broadcast).not.toHaveBeenCalled();
        });
    });
});