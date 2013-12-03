'use strict';

describe('widgets', function() {
    var $scope, $httpBackend, $controller, ContactsResource, contact;
    beforeEach(module('bplApp.widgets', 'widgets/contacts/contacts.html', 'widgets/contacts/popup.html'));

    beforeEach(inject(function($injector, _$rootScope_){
        $scope = _$rootScope_.$new();

        $httpBackend = $injector.get('$httpBackend');
        $controller = $injector.get('$controller');
        ContactsResource = $injector.get('ContactsResource');

        contact = new ContactsResource({id:1, name: 'Ronen Cohen'});

        $httpBackend.whenGET('data/contacts?limit=2&offset=0').respond(
            [{id : 1, name : 'Ronen Cohen'}, {id : 2, name : 'Miri Kaplan'}],
            {'content-range' : '0-2/3'}
        );
    }));

    describe('contacts', function() {
        describe('contacts directive', function(){
            var $compile, element;

            beforeEach(inject(function(_$compile_){
                $compile = _$compile_;

                element = $compile('<div contacts></div>')($scope);
                $scope.$digest();
            }));

            it('Replaces the element with the appropriate content', function(){
                expect(element.find('button').text()).toEqual('Add');
            });

            it('Should create 2 contacts in list', function(){
                $httpBackend.flush();
                expect(element.find('li').length).toBe(2);
            });
        });
        describe('contacts controller', function() {
            var $modal, $window, contactsCtrl;

            beforeEach(function(){

                $window = {confirm : function(){}};

                $modal = {open : function(){
                    return {result : {then : function(){}}};
                }};

                contactsCtrl = $controller('contacts', {
                    $scope : $scope,
                    $modal : $modal,
                    $window : $window,
                    ContactsResource : ContactsResource
                });

                spyOn($scope, 'showPopup');
                spyOn($window, 'confirm').andReturn(true);

                $httpBackend.whenDELETE('data/contacts/1').respond(null);
            });

            it('should define empty contacts array', function(){
                expect($scope.contacts).toBeDefined();
                expect($scope.contacts.length).toBe(0);
            });

            it('should define contactIns', function(){
                expect($scope.contactIns).toBeDefined();
            });


            it('should set default max value 2', function(){
                expect($scope.max).toBe(2);
            });

            it('should define setPage function', function(){
                expect($scope.setPage).toBeDefined();
            });

            it('should 2 contacts', function(){
                $httpBackend.flush();
                expect($scope.contacts.length).toBe(2);
            });

            it('should set total 3', function(){
                $httpBackend.flush();
                expect($scope.total).toBe(3);
            });

            it('should set page 1', function(){
                $httpBackend.flush();
                expect($scope.page).toBe(1);
            });

            it('should define add function', function(){
                expect($scope.add).toBeDefined();
            });

            it('should create new ContactResource', function(){
                $scope.add();
                expect($scope.contactIns.name).toBeDefined();
            });

            it("tracks that the $scope.showPopup was called", function(){
                $scope.add();
                expect($scope.showPopup).toHaveBeenCalled();
            });

            it('should define edit function', function(){
                expect($scope.edit).toBeDefined();
            });

            it('should contain contactIns.id 2', function(){
                $scope.edit(contact);
                expect($scope.contactIns.id).toBe(1);
            });

            it("tracks that the $scope.showPopup was called", function(){
                $scope.edit();
                expect($scope.showPopup).toHaveBeenCalled();
            });

            it('should call confirm with "Are you shore?"', function(){
                $scope.delete(contact);
                expect($window.confirm).toHaveBeenCalledWith("Are you shore?");
            });

            it('tracks that the contact.$delete was called', function(){
                spyOn(contact, '$delete');
                $scope.delete(contact);
                expect(contact.$delete).toHaveBeenCalled();
            });

            it('tracks that the $scope.setPage was called', function(){
                spyOn($scope, 'setPage');

                $scope.delete(contact);
                $httpBackend.flush();
                expect($scope.setPage).toHaveBeenCalled();
            });

            it('should define delete function', function(){
                expect($scope.delete).toBeDefined();
            });
        });

        describe('contactsPopup controller', function() {
            var $modalInstance, ServerValidationService, contact;

            beforeEach(function(){
                contact = new ContactsResource({id : 1, name : 'Ronen Cohen'});

                $modalInstance = {
                    dismiss : function(){},
                    close : function(){}
                };

                ServerValidationService = {handleRes : function(){}};

                spyOn($modalInstance, 'dismiss');
                spyOn($modalInstance, 'close');
                spyOn(ServerValidationService, 'handleRes');
                spyOn(contact, '$update');

                var contactsPopupCtrl = $controller('contactsPopup', {
                    '$scope' : $scope,
                    '$modalInstance' : $modalInstance,
                    'ServerValidationService' : ServerValidationService,
                    'translateFilter' : {},
                    'contact' : contact
                });
            });

            it('should contain contact object', function(){
                expect($scope.contact).toBeDefined();
                expect($scope.contact).toEqual(contact);
            });

            it('should contain save function', function(){
                expect($scope.save).toBeDefined();
            });

            it("tracks that the contact.$update was called", function(){
                $scope.save();
                expect(contact.$update).toHaveBeenCalled();
            });

            it("tracks that the contact.$save was called", function(){
                delete contact.id;

                spyOn(contact, '$save');
                $scope.save();

                expect(contact.$save).toHaveBeenCalled();
            });

            it("tracks that the $modalInstance.close was called", function(){
                delete contact.id;

                $httpBackend.whenPOST('data/contacts').respond({});
                $scope.save();

                $httpBackend.flush();

                expect($modalInstance.close).toHaveBeenCalled();
            });

            it("tracks that the ServerValidationService.handleRes was called", function(){
                delete contact.id;

                var errors = {name : 'required'};
                $httpBackend.whenPOST('data/contacts').respond(500, {errors : errors});

                $scope.save();

                $httpBackend.flush();

                expect(ServerValidationService.handleRes.mostRecentCall.args[1].data).toEqual({errors : errors});
            });

            it('should contain cancel function', function(){
                expect($scope.cancel).toBeDefined();
            });

            it("tracks that the $modalInstance.dismiss was called with 'cancel' param", function() {
                $scope.cancel();
                expect($modalInstance.dismiss).toHaveBeenCalledWith('cancel');
            });
        });
    });
//    var $compile, scope, $httpBackend, element;
//    beforeEach(module('bplApp.resources', 'bplApp.widgets', 'ui.bootstrap', 'widgets/contacts/contacts.html', 'widgets/contacts/popup.html'));
//
//
//    beforeEach(inject(function($injector, _$compile_, _$rootScope_){
//        // The injector unwraps the underscores (_) from around the parameter names when matching
//        $compile = _$compile_;
//        scope = _$rootScope_.$new();
//        $httpBackend = $injector.get('$httpBackend');
//
//        $httpBackend.whenGET('data/contacts?limit=2&offset=0').respond(
//            [{id : 1, name : 'Ronen Cohen'}, {id : 2, name : 'Miri Kaplan'}],
//            {'content-range' : '0-2/3'}
//        );
//
//        element = angular.element('<div contacts></div>');
//        var compiled = $compile(element);
//        compiled(scope);
//        scope.$digest();
//    }));
//
//    describe('contacts', function(){
//        it('Should contain contacts list with 2 items', function(){
////            cl(element.html());
////            $httpBackend.flush();
////            expect(element.find('.contacts li').length).toBe(2);
//        });
//
//        it('Should contain add button', function(){
//            expect(element.find('button').text()).toEqual('Add');
//        });
//    });
});