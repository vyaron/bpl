'use strict';

/**
 * @ngdoc function
 * @name bplApp.ServerValidation
 *
 * @description
 * Handle server side validation errors
 *
 *
 * # General usage
 * Based on the protocol for error response received from server (TBD),
 * this service knows to set the validity of the various inputs in a form to false,
 * which will cause errors to appear as set by the widget developer.
 *
 * <pre>
 *     var save = function(contact){
 *        var form = this.contactForm;
 *
 *        ContactsResource.save(contact,
 *           function(){
 *              $modalInstance.close();
 *           }, function(res){
 *              ServerValidation(form, res);
 *           });
 *     };
 * </pre>
 *
 * @param {Object} form The submitted form
 * @param {Object} res server response
 */
angular.module('bplApp.services')
.factory('ServerValidation', function () {
    var handleRes = function(form, res){
        if (form && res && res.data && res.data.errors){
            for (var name in res.data.errors){
                if (name in form) {
                    form[name].$setValidity(res.data.errors[name], false);
                    form[name].$dirty = true;
                }
            }
        }
    };

    return handleRes;
});






