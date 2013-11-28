'use strict';
/**
 * @ngdoc function
 * @name bplApp.services:CustomersResource
 * @requires $resource
 *
 * @description
 * The `CustomersResource` service is a core BPL service that facilitates communication with the remote
 * RESTful server via {@link bplApp.services:BasicResource BasicResource} service.
 *
 * # General usage
 * The `CustomersResource` service have CRUD function - get(), list(), update(), delete()
 *
 * <pre>
 * // GET customer object
 * var CustomersResource = CustomersResource.get({id : 101});
 *
 * // GET customers list
 * var customers = CustomersResource.list();
 *
 * // GET customer object and do update()
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
 function FetchCtrl($scope, CustomersResource){
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
angular.module('bplApp.resources').
    factory('CustomersResource', ['BasicResource', 'CurrUser', function(BasicResource, CurrUser){
        var params = {resourceName : 'customers', id: CurrUser.getId()};

        var CustomersResource = BasicResource.get(angular.extend(params));

        /**
         * @ngdoc method
         * @name bplApp.services:CustomersResource#get
         * @methodOf bplApp.services:CustomersResource
         *
         * @description
         * Method to get customer object.
         *
         * @param {Object=} query params - {id:101}.
         * @param {Function=} success call back function.
         *
         * @returns {Object=} customer promise object
         */

        /**
         * @ngdoc method
         * @name bplApp.services:CustomersResource#list
         * @methodOf bplApp.services:CustomersResource
         *
         * @description
         * Method to get customers array.
         *
         * @param {Object=} query params - {offset:0, limit:10}.
         * @param {Function=} success call back function.
         *
         * @returns {Array=} customers promise array
         */

        /**
         * @ngdoc method
         * @name bplApp.services:CustomersResource#save
         * @methodOf bplApp.services:CustomersResource
         *
         * @description
         * Method to create customer.
         *
         * @param {Object=} query params.
         * @param {Object=} customer object.
         * @param {Function=} success call back function.
         *
         * @returns {Object=} customer promise object
         */

        /**
         * @ngdoc method
         * @name bplApp.services:CustomersResource#update
         * @methodOf bplApp.services:CustomersResource
         *
         * @description
         * Method to update customer.
         *
         * @param {Object=} query params - (id:101).
         * @param {Object=} customer object.
         * @param {Function=} success call back function.
         *
         * @returns {Object=} customer promise object
         */

        /**
         * @ngdoc method
         * @name bplApp.services:CustomersResource#remove
         * @methodOf bplApp.services:CustomersResource
         *
         * @description
         * Method to delete customer.
         *
         * @param {Object=} query params - (id:101).
         * @param {Function=} success call back function.
         */

        /**
         * @ngdoc method
         * @name bplApp.services:CustomersResource#getFullName
         * @methodOf bplApp.services:CustomersResource
         *
         * @description
         * Method to get customer full name.
         *
         * @returns {$resource} String
         */
        CustomersResource.prototype.getFullName = function(){
            var fullName = '';

            if (this.first_name) fullName += this.first_name;
            if (this.last_name) fullName += ' ' + this.last_name;

            return fullName.trim();
        };
        CustomersResource.prototype.getImgUrl = function(){
            return this.id? 'img/customer/' + this.id + '.jpg' : '';
        };




        return CustomersResource;
    }]);