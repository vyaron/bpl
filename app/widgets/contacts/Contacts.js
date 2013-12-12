'use strict';

angular.module('bplApp.widgets')
.directive('contacts', function() {
    return {
        templateUrl: 'widgets/contacts/contacts.html',
        replace: true,
        controller: 'contacts',
        scope: {
            max: '=?'
        }
    };
})

.controller('contacts', ['$scope', '$modal', '$window', 'ContactsResource', function($scope, $modal, $window, ContactsResource) {
    $scope.contactIns = null;
    $scope.contacts = [];

    $scope.max = $scope.max ? $scope.max : 2;

    //TODO: create paginationService.setPage($scope, max, resource) / headerParser.getRange() ?
    $scope.setPage = function(page){
         var page = page ? (--page) : 0;
         var offset = Math.max(0, page) * $scope.max;

         ContactsResource.query({offset:offset, limit:$scope.max}, function(contacts, headers){
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

       $scope.showPopup = function(){
            var modalInstance = $modal.open({
                templateUrl: 'widgets/contacts/popup.html',
                controller: 'contactsPopup',
                resolve : {
                    contact : function(){
                        return $scope.contactIns;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.setPage($scope.page);
            }, function () {
                //cl('Modal dismissed at: ' + new Date());
            });
        };

        $scope.add = function(){
            $scope.contactIns = new ContactsResource({name : '', image_url : 'img/customer/102.jpg'});
            $scope.showPopup();
        };

        $scope.edit = function(contact){
            $scope.contactIns = angular.copy(contact);
            $scope.showPopup();
        };

        $scope.delete = function(contact){
            if ($window.confirm('Are you shore?')) {

                contact.$delete(function(){
                    $scope.setPage();
                });
            }
        };
}])
.controller('contactsPopup', ['$scope', '$modalInstance', 'ServerValidation', 'translateFilter', 'contact', function($scope, $modalInstance, ServerValidation,translateFilter, contact) {
    $scope.contact = contact;

    $scope.save = function () {
        var form = this.form;

        if ($scope.contact.id) {
            $scope.contact.$update(function(){
                $modalInstance.close();
                //alert(translateFilter('hello world', 'he'));
            });
        }
        else {
            $scope.contact.$save(function(){
                $modalInstance.close();
            }, function(res){
                ServerValidation.handleRes(form, res);
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

