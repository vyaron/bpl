'use strict';

/**
 * @ngdoc function
 * @name bplApp.Range
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