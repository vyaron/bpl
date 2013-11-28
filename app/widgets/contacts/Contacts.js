'use strict';

angular.module('bplApp.widgets.customer', [])
    //.controller('ContactsPopupCtrl', )
    .controller('bplContactsCtrlPopupCtrl', ['$scope', '$modalInstance', 'serverValidationService', 'contact', function($scope, $modalInstance, serverValidationService, contact) {
        $scope.contact = contact;

        $scope.save = function () {
            var form = this.form;

            //$modalInstance.close($scope.contact);
            if ($scope.contact.id) {
                $scope.contact.$update(function(){
                    $modalInstance.close();
                });
            }
            else {
                $scope.contact.$save({'forceError' : false}, function(){
                    $modalInstance.close();
                }, function(res){
                    serverValidationService.handleRes(form, res);
                });
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('bplContactsCtrl', ['$scope', '$modal', 'ContactsResource', function($scope, $modal, ContactsResource) {
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

                //TODO: support case server limit < max (widget limit)
                //$scope.max = Math.max(0, limit - offset);
                $scope.page = Math.round(offset/$scope.max) + 1;

                //cl('page: ' + $scope.page + ' | max: ' + $scope.max + ' | total: ' + $scope.total);
            });
        };
        $scope.setPage();

           var showPopup = function(){
                var modalInstance = $modal.open({
                    templateUrl: 'widgets/contacts/popup.html',
                    controller: 'bplContactsCtrlPopupCtrl',
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

//            var save = function(contact){
//                if (contact.id) contact.$update(function(){
//                    $scope.setPage($scope.page);
//                });
//                else contact.$save({'forceError' : true}, function(){
//                    $scope.setPage($scope.page);
//                });
//            };

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
    .directive('bplContacts', function() {
        return {
            templateUrl: 'widgets/contacts/Contacts.html',
            replace: true,
            controller: 'bplContactsCtrl',
            scope: {
                max: '@'
            }
        };
    });


