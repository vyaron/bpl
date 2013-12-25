'use strict';

describe('widgets', function() {
    describe('contacts', function() {
        var $rootScope, $httpBackend, contacts;

        beforeEach(module('bplApp.widgets', 'widgets/contacts/contacts.html', 'widgets/contacts/popup.html'));

        beforeEach(inject(function($injector){
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');

            jasmine.getJSONFixtures().fixturesPath='base/server';

            contacts = getJSONFixture('data/contacts/list.json');

            $httpBackend.whenGET('data/contacts?limit=2&offset=0').respond(
                contacts.slice(0,2),
                {'content-range' : '0-2/' + contacts.length}
            );
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('contacts directive', function(){
            var $scope, $compile, element;

            beforeEach(inject(function(_$compile_){
                $compile = _$compile_;

                element = $compile('<div contacts max="2"></div>')($rootScope);
                $rootScope.$digest();

                $scope = element.isolateScope();
            }));

            it('should contain add button', function(){
                var btn = element.find('.btn-add:first');
                expect(btn.length).toBe(1);

                spyOn($scope, 'add');

                btn.click();
                expect($scope.add).toHaveBeenCalled();

                $httpBackend.flush();
            });

            it('should contain 2 contacts', function(){
                expect(element.find('.contact').length).toBe(0);

                $httpBackend.flush();

                expect(element.find('.contact').length).toBe(2);
            });

            it('should contain contact with edit, delete buttons', function(){
                $httpBackend.flush();

                var contact = element.find('.contact:first');
                var btnEdit = contact.find('.btn-edit');
                var btnDelete = contact.find('.btn-delete');

                expect(btnEdit.length).toBe(1);

                spyOn($scope, 'edit');
                spyOn($scope, 'delete');

                btnEdit.click();
                expect($scope.edit).toHaveBeenCalledWith(jasmine.any(Object));

                btnDelete.click();
                expect($scope.delete).toHaveBeenCalledWith(jasmine.any(Object));
            });

            it('should contain pagination', function(){
                $httpBackend.flush();

                var paginationBtns = element.find('.pagination:first li a');
                expect(paginationBtns.length - 2).toBe(Math.round(contacts.length / $scope.max));

                spyOn($scope, 'setPage');

                angular.element(paginationBtns[2]).click();

                expect($scope.setPage).toHaveBeenCalledWith(2);
            });
        });

        describe('contacts controller', function() {
            var $scope, $controller, $modal, $window, contactsCtrl, ContactsResource, Range;

            beforeEach(inject(function($injector){
                $scope = $rootScope.$new();
                $controller = $injector.get('$controller');
                $window = $injector.get('$window');
                $modal = $injector.get('$modal');
                ContactsResource = $injector.get('ContactsResource');
                Range = $injector.get('Range');

                contactsCtrl = $controller('contacts', {
                    $scope : $scope,
                    $modal : $modal,
                    $window : $window,
                    ContactsResource : ContactsResource,
                    Range : Range
                });
            }));

            it('should set defaults params', function(){
                expect($scope.contactIns).toBeDefined();
                expect($scope.contacts).toEqual(jasmine.any(Array));
                expect($scope.contacts.length).toBe(0);
                expect($scope.max).toBe(2);

                $httpBackend.flush();
            });

            it('should contain 2 contacts on page 1, right contacts total', function(){
                $httpBackend.flush();

                expect($scope.contacts.length).toBe(2);
                expect($scope.total).toBe(contacts.length);
                expect($scope.page).toBe(1);
            });

            it ('should call showPopup and ini right contact', function(){
                $httpBackend.flush();

                expect($scope.showPopup).toEqual(jasmine.any(Function));

                var contact = $scope.contacts[0];


                spyOn($scope, 'showPopup');

                $scope.add();
                expect($scope.contactIns.id).not.toBeDefined();

                $scope.edit(contact);

                expect($scope.contactIns.id).toBe(contact.id);
                expect($scope.showPopup.callCount).toBe(2);
            });

            it ('should call confirm with "Are you sure?" and call setPage', function(){
                $httpBackend.flush();
                var contact = $scope.contacts[0];

                $httpBackend.expectDELETE('data/contacts/' + contact.id).respond(null);

                spyOn($window, 'confirm').andReturn(true);
                spyOn($scope, 'setPage');

                $scope.delete(contact);
                $httpBackend.flush();

                expect($window.confirm).toHaveBeenCalledWith('Are you sure?');
                expect($scope.setPage).toHaveBeenCalled();
            });
        });

        describe('contactsPopup controller', function() {
            var $scope, $controller, $modalInstance, ServerValidation, transFilter, contact, contactsPopupCtrl;

            beforeEach(inject(function($injector){
                $scope = $rootScope.$new();
                $controller = $injector.get('$controller');
                transFilter = $injector.get('transFilter');
                $modalInstance = jasmine.createSpyObj('$modalInstance', ['dismiss', 'close']);
                ServerValidation = jasmine.createSpy('ServerValidation');

                var ContactsResource = $injector.get('ContactsResource');
                contact = new ContactsResource(contacts[0]);

                contactsPopupCtrl = $controller('contactsPopup', {
                    '$scope' : $scope,
                    '$modalInstance' : $modalInstance,
                    'ServerValidation' : ServerValidation,
                    'transFilter' : transFilter,
                    'contact' : contact
                });
            }));

            it('should contain contact', function(){
                expect($scope.contact).toBe(contact);
            });
        });
    });

//
//    describe('contacts', function() {

//
//        describe('contactsPopup controller', function() {
//            var $modalInstance, ServerValidation, contact;
//
//            beforeEach(function(){
//                contact = new ContactsResource({id : 1, name : 'Ronen Cohen'});
//
//                $modalInstance = {
//                    dismiss : function(){},
//                    close : function(){}
//                };
//
//                ServerValidation = jasmine.createSpy('ServerValidation');
//
//                spyOn($modalInstance, 'dismiss');
//                spyOn($modalInstance, 'close');
//                spyOn(contact, '$update');
//
//                var contactsPopupCtrl = $controller('contactsPopup', {
//                    '$scope' : $scope,
//                    '$modalInstance' : $modalInstance,
//                    'ServerValidation' : ServerValidation,
//                    'translateFilter' : {},
//                    'contact' : contact
//                });
//            });
//
//            it('should contain contact object', function(){
//                expect($scope.contact).toBeDefined();
//                expect($scope.contact).toEqual(contact);
//            });
//
//            it('should contain save function', function(){
//                expect($scope.save).toBeDefined();
//            });
//
//            it("tracks that the contact.$update was called", function(){
//                $scope.save();
//                expect(contact.$update).toHaveBeenCalled();
//            });
//
//            it("tracks that the contact.$save was called", function(){
//                delete contact.id;
//
//                spyOn(contact, '$save');
//                $scope.save();
//
//                expect(contact.$save).toHaveBeenCalled();
//            });
//
//            it("tracks that the $modalInstance.close was called", function(){
//                delete contact.id;
//
//                $httpBackend.whenPOST('data/contacts').respond({});
//                $scope.save();
//
//                $httpBackend.flush();
//
//                expect($modalInstance.close).toHaveBeenCalled();
//            });
//
//            it("tracks that the ServerValidation.handleRes was called", function(){
//                delete contact.id;
//
//                var errors = {name : 'required'};
//                $httpBackend.whenPOST('data/contacts').respond(500, {errors : errors});
//
//                $scope.save();
//
//                $httpBackend.flush();
//
//                expect(ServerValidation.mostRecentCall.args[1].data).toEqual({errors : errors});
//            });
//
//            it('should contain cancel function', function(){
//                expect($scope.cancel).toBeDefined();
//            });
//
//            it("tracks that the $modalInstance.dismiss was called with 'cancel' param", function() {
//                $scope.cancel();
//                expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
//            });
//        });
//    });
});