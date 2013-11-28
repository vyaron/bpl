'use strict';
/**
 * Created by Yaron on 27/11/13.
 */


angular.module('bplApp.services')

.factory('ServerValidationService', function () {
    var handleRes = function(form, res){
        if (res && res.data && res.data.errors){
            for (name in res.data.errors){
                if (name in form) {
                    form[name].$setValidity(res.data.errors[name], false);
                    form[name].$dirty = true;
                }
            }
        }
    };

    return {
        handleRes : handleRes
    };
});






