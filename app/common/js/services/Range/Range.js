'use strict';

/**
 * @ngdoc function
 * @name bplApp.Range
 *
 * @description
 * This service extracts range information from the http header.
 * # General usage
 * This service is used for paging, there is usually no reason to inject it to your code, as the BasicResource already provides you
 * with a getRange method.
 *
 <pre>
 var customers = CustomersResource.query(function(customers, headers){var range = Range(headers)});
 </pre>
 *
 * @param {function} headers the response headers function from the ajax call
 * @returns {Object} returns an object with limit, offset and optionally total
 *
 */
angular.module('bplApp.services')
    .factory('Range', [function(){
        var Range = function(headers){
            var data = {};

            var headers = headers();
            if ('content-range' in headers){
                var contentRange = headers['content-range'];
                if (contentRange){
                    var parts = contentRange.match(/(.+)-(.+)\/(.+)/);

                    data.offset = parseInt(parts[1]);
                    data.limit = parseInt(parts[2]);
                    data.total = parseInt(parts[3]);
                    if (isNaN(data.total)) delete data.total;
                }
            }


            return data;
        };
        return Range;
    }]);