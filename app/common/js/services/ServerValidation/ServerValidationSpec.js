'use strict';

describe('bplApp.services', function (){

    describe('ServerValidation', function (){
        var form, ServerValidation;

        beforeEach(module('bplApp.services'));

        beforeEach(function(){
            form = {
                email : jasmine.createSpyObj('email', ['$setValidity']),
                pass : jasmine.createSpyObj('email', ['$setValidity'])
            };

            inject(function($injector){
                ServerValidation = $injector.get('ServerValidation');
            });
        });

        it ('tracks that the $setValidity and $dirty called with right params', function(){
            var res = {data : {errors : {email : 'email', pass : 'required'}}};
            ServerValidation(form, res);

            expect(form.email.$setValidity).toHaveBeenCalledWith('email', false);
            expect(form.email.$dirty).toBe(true);

            expect(form.pass.$setValidity).toHaveBeenCalledWith('required', false);
            expect(form.pass.$dirty).toBe(true);
        });

        it ('tracks that the email.$setValidity not called', function(){
            var res = {data : {errors : {pass : 'required'}}};
            ServerValidation(form, res);

            expect(form.email.$setValidity).not.toHaveBeenCalled();
        });
    });
});
