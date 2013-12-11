'use strict';
/**
 * @ngdoc function
 * @name bplApp.services:BasicResource
 * @requires $resource
 *
 * @description
 * The DataService is in-charge of all server side communication via AJAX,
 * It should be based on $resource, but eliminate the common code needed for each resource.
 * This is the basic resource based on $resource.
 * Every data that is retrieved from the REST API is retrieved via a specific resource, and every resource
 * will rely on BasicResource for the common functionality.
 *
 * # General usage
 * Define the general structure of the $resource
 *
 * @param {Object} config configuration object must include 'resourceName' property.
 * @returns {Object} A resource "class" object with methods for the default set of resource actions
 * optionally extended with custom `actions`. The default set contains these actions:
 *
 * { 'get': {method:'GET'},
 * 'save': {method:'POST'},
 * 'save': {method:'PUT'},
 * 'query': {method:'GET', isArray:true},
 * 'remove': {method:'DELETE'}};
 *
 * Calling these methods invoke an {@link ng.$http} with the specified http method,
 * destination and parameters. When the data is returned from the server then the object is an
 * instance of the resource class. The actions `save`, `remove` and `delete` are available on it
 * as methods with the `$` prefix. This allows you to easily perform CRUD operations (create,
 * read, update, delete) on server-side data like this:
 * <pre>
     var CustomersResource = BasicResource({resourceName : 'customers'});
     var customers = CustomersResource.query();
     var customer = CustomersResource.get({id : 101}, function(customer){
        customer.first_name = 'Ronen';
        customer.$update();
     });
   </pre>

 * @example
 <example>
     <file name="index.html">
        <div ng-controller="FetchCtrl" id="customer">{{customer.first_name}}</div>
     </file>
     <file name="script.js">
        function FetchCtrl($scope, BasicResource){
            var CustomersResource = BasicResource({resourceName : 'customers'});
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
    provider('BasicResource', [function(){
        var URL = 'data';
        var BasicResource = {};
        BasicResource.setUrl = function(url){
            if (url) URL = url;
        };

        BasicResource.$get = ['$resource', function($resource){
            return function(config){
                var resourceConfig = angular.extend({resourceName : null, id : '@id', subResourceName : '@subResourceName', subId : '@subId'}, config);

                var resource = $resource(URL + '/:resourceName/:id/:subResourceName/:subId', resourceConfig, {
                    update : {method: 'PUT'}
                });

                /**
                 * @ngdoc function
                 * @name bplApp.services:BasicResource#getConfig
                 * @methodOf bplApp.services:BasicResource
                 *
                 * @description
                 * Method to get resource config object.
                 *
                 * @returns {Object} resource config
                 */
                resource.getConfig = function(){
                    return resourceConfig;
                };

                return resource;
            };
        }];

        return BasicResource;
    }]);