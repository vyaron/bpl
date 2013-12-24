'use strict';
/**
 * @ngdoc function
 * @name bplApp.BasicResource
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
 <pre>
    var CustomersResource = BasicResource({resourceName : 'customers'});
    var customers = CustomersResource.query();
    var customer = CustomersResource.get({id : 101}, function(customer){
        customer.first_name = 'Ronen';
        customer.$update();
     });
 </pre>
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
 * Calling these methods invoke an {@link http://docs.angularjs.org/api/ng.$http ng.$http} with the specified http method,
 * destination and parameters. When the data is returned from the server then the object is an
 * instance of the resource class. The actions `save`, `remove` and `delete` are available on it
 * as methods with the `$` prefix. This allows you to easily perform CRUD operations (create,
 * read, update, delete) on server-side data like this:
 */
angular.module('bplApp.services').
    provider('BasicResource', [function(){
        var URL = 'data';
        var BasicResourceProvider = {};
        BasicResourceProvider.setUrl = function(url){
            if (url) URL = url;
        };

        BasicResourceProvider.$get = ['$resource', 'PubSub', 'DataCache', 'Range', function($resource, PubSub, DataCache, Range){
            return function(config){
                var resourceConfig = angular.extend({resourceName : null, id : '@id', subResourceName : '@subResourceName', subId : '@subId'}, config);

                var clearedCache = {};
                var clearCache = function(){
                    var args = arguments;

                    var publishTime = parseInt(arguments[0]);

                    var isDeleteCache = (!isNaN(publishTime)) ? true : false;
                    if (isDeleteCache){
                        args = [];
                        if (arguments[1]) args.push(arguments[1]);
                        if (arguments[2]) args.push(arguments[2]);
                        if (arguments[3]) args.push(arguments[3]);
                        if (arguments[4]) args.push(arguments[4]);

                        if (!(publishTime in clearedCache)) {
                            var params = angular.isObject(arguments[1]) ? angular.copy(arguments[1]) : {};
                            var cacheKey = DataCache.getCacheKey(resourceConfig, params);

                            DataCache.remove(cacheKey);
                            clearedCache[publishTime] = true;
                        }

                        return args;
                    }

                    return args;
                };

                var publishResourceChanged = function(res){
                    res.$promise.then(function(data){
                        var channel = resourceConfig.resourceName;
                        if ('subResourceName' in resourceConfig && (resourceConfig.subResourceName[0] != '@')) channel += '_' + resourceConfig.subResourceName;

                        channel = channel.toUpperCase();
                        if (channel in PubSub) {
                            PubSub.publish(PubSub[channel], data);
                        }

                    });
                };

                var resource = $resource(URL + '/:resourceName/:id/:subResourceName/:subId', resourceConfig, {
                    update : {method: 'PUT'}
                });

                var resourceGet = resource.get;
                resource.get = function(){
                    var args = clearCache.apply(null, arguments);
                    var res = resourceGet.apply(null, args);

                    return res;
                };

                var resourceQuery = resource.query;
                resource.query = function(){
                   var args = clearCache.apply(null, arguments);
                   return  resourceQuery.apply(null, args);
                };

                var resourceSave = resource.save;
                resource.save = function(){
                    var res = resourceSave.apply(null, arguments);
                    publishResourceChanged(res);
                    return res;
                };

                var resourceUpdate = resource.update;
                resource.update = function(){
                    var res = resourceUpdate.apply(null, arguments);
                    publishResourceChanged(res);
                    return res;
                };

                var resourceRemove = resource.remove;
                resource.remove = function(){
                    var res = resourceRemove.apply(null, arguments);
                    publishResourceChanged(res);
                    return res;
                };

                resource.getRange = Range;

                /**
                 * @ngdoc function
                 * @name bplApp.BasicResource#getConfig
                 * @methodOf bplApp.BasicResource
                 *
                 * @description
                 * Method to get resource config object.
                 *
                 * @returns {Object} resource config
                 */
                resource.getConfig = function(){
                    return resourceConfig;
                };

                //BasicResource.prototype = resource.prototype;

                return resource;
            };
        }];

        return BasicResourceProvider;
    }]);