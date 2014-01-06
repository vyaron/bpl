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

.controller('contacts', ['$scope', '$modal', '$window', 'PubSub', 'ContactsResource', 'Range', function($scope, $modal, $window, PubSub, ContactsResource, Range) {
    $scope.contactIns = null;
    $scope.contacts = [];

    $scope.max = $scope.max ? $scope.max : 2;

    $scope.setPage = function(page){
        var page = page ? (--page) : 0;
        var offset = Math.max(0, page) * $scope.max;

        ContactsResource.query({offset:offset, limit:$scope.max}, function(contacts, headers){
            $scope.contacts = contacts;

            var range = Range(headers);
            var offset = range.offset;

            $scope.page = Math.round(offset/$scope.max) + 1;
            $scope.total = range.total;
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
            //$scope.setPage($scope.page);
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
        if ($window.confirm('Are you sure?')) {

            contact.$remove(function(){
                $scope.page = 1;
                //$scope.setPage(1);
            });
        }
    };

    PubSub.subscribe(PubSub.CONTACTS, function(e){
        $scope.setPage($scope.page);
    });
}])
.controller('contactsPopup', ['$scope', '$modalInstance', 'ServerValidation', 'transFilter', 'contact', function($scope, $modalInstance, ServerValidation,transFilter, contact) {
    $scope.contact = contact;

    $scope.save = function () {
        var form = this.form;

        if (form) form.$setPristine(true);

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
                ServerValidation(form, res);
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

