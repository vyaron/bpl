'use strict';
/**
 * @ngdoc function
 * @name bplApp.services:BasicResource
 * @requires $resource
 *
 * @description
 * The `BasicResource` service is a core BPL service that facilitates communication with the remote
 * RESTful server via {@link ngResource.$resource $resource} service.
 *
 * # General usage
 * The `BasicResource` service have a get() function which takes a single argument — a configuration object —
 * that is used to return $resource service with CRUD function - get(), list(), update(), delete()
 *
 * <pre>
 * var CustomersResource = BasicResource.get({resourceName : 'customers'});
 * var customers = CustomersResource.list();
 * var customer = CustomersResource.get({id : 101}, function(customer){
 *   customer.first_name = 'Ronen';
 *   customer.$update();
 * });
 * </pre>
 * @example
 <example>
     <file name="index.html">
        <div ng-controller="FetchCtrl" id="customer">{{customer.first_name}}</div>
     </file>
     <file name="script.js">
        function FetchCtrl($scope, BasicResource){
            var CustomersResource = BasicResource.get({resourceName : 'customers'});
            $scope.customer = CustomersResource.get({id : 101});
        }
     </file>
     <file name="scenario.js">
         it('should get Ronen', function() {
            expect(element('#customer')).toBe('Ronen');
        });
     </file>
 </example>
 */
angular.module('bplApp.services').
    //TODO: change to provider - support absolute url
    factory('BasicResource', ['$resource', function($resource){
        /**
         * @ngdoc method
         * @name bplApp.services:BasicResource#get
         * @methodOf bplApp.services:BasicResource
         *
         * @description
         * Method to get resource.
         *
         * @param {Object=} config configuration object must include 'resourceName' property.
         * @returns {$resource} resource object with list(), update() function
         */
        var get = function(params){
            var resourceParams = angular.extend({resourceName : null, id : '@id', subResourceName : '@subResourceName', subId : '@subId'}, params);

            var resource = $resource('data/:resourceName/:id/:subResourceName/:subId', resourceParams, {
                list : {method : 'GET', isArray : true},
                update : {method: 'PUT'}
            });

            resource.getResourceParams = function(){
                return resourceParams;
            };

            return resource;
        };

        return {
            get : get
        }
    }]);