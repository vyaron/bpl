'use strict';

angular.module('bplApp.widgets')
    .controller('contactsPopup', ['$scope', '$modalInstance', 'ServerValidationService', 'contact', function($scope, $modalInstance, ServerValidationService, contact) {
        $scope.contact = contact;

        $scope.save = function () {
            var form = this.form;

            if ($scope.contact.id) {
                $scope.contact.$update(function(){
                    $modalInstance.close();
                });
            }
            else {
                $scope.contact.$save({'forceError' : false}, function(){
                    $modalInstance.close();
                }, function(res){
                    ServerValidationService.handleRes(form, res);
                });
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('contacts', ['$scope', '$modal', 'ContactsResource', function($scope, $modal, ContactsResource) {
        var contactIns;
        $scope.contacts = [];

        //TODO: create paginationService.setPage($scope, max, resource) / headerParser.getRange() ?
        $scope.setPage = function(page){
             var page = page ? (--page) : 0;
             var offset = Math.max(0, page) * $scope.max;

             ContactsResource.list({offset:offset, limit:$scope.max}, function(contacts, headers){
                $scope.contacts = contacts;

                 //TODO: create paginationService
                var headers = headers();
                var rangeParts = headers['content-range'].split('/');
                $scope.total = parseInt(rangeParts[1]);

                rangeParts = rangeParts[0].split('-');
                var offset = parseInt(rangeParts[0]);
                var limit = parseInt(rangeParts[1]);

                $scope.page = Math.round(offset/$scope.max) + 1;
                //cl('page: ' + $scope.page + ' | max: ' + $scope.max + ' | total: ' + $scope.total);
            });
        };
        $scope.setPage();

           var showPopup = function(){
                var modalInstance = $modal.open({
                    templateUrl: 'widgets/contacts/popup.html',
                    controller: 'contactsPopup',
                    resolve : {
                        contact : function(){
                            return contactIns;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    $scope.setPage($scope.page);
                }, function () {
                    cl('Modal dismissed at: ' + new Date());
                });
            };

            $scope.add = function(){
                contactIns = new ContactsResource({name : '', image_url : 'img/customer/102.jpg'});
                showPopup();
            };

            $scope.edit = function(contact){
                contactIns = angular.copy(contact);
                showPopup();
            };

            $scope.delete = function(contact){
                if (window.confirm('Are you shore?')) contact.$delete(function(){
                    $scope.setPage();
                });
            };
    }])
    .directive('contacts', function() {
        return {
            templateUrl: 'widgets/contacts/contacts.html',
            replace: true,
            controller: 'contacts',
            scope: {
                max: '@'
            }
        };
    });


