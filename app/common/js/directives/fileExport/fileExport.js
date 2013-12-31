'use strict';

angular.module('bplApp.directives')
    .directive('fileExport', ['$rootScope', '$window', '$http', '$compile', function($rootScope, $window, $http, $compile) {
        var DISABLED_CLASS = 'disabled';
        var DOWNLOAD_ATTR = 'download';

        var CSV_SEP = ',';
        var NEW_LINE = "\n";

        var fileName = 'data';

        var isDataReady = function(data){
            //TODO: support promise resolved
            return (!data || (data.length == 0)) ? false : true;
        };

        var isIE = function(){
            return ($window.navigator.userAgent.indexOf('MSIE') >= 0);
        };

        var isBrowserSupportMsSaveBlob = function(){
            return ($window.navigator.msSaveBlob) ? true : false;
        };

        var isBrowserSupportFileExport = function(){
            return (isBrowserSupportMsSaveBlob() || (!isIE() && Blob && $window.URL.createObjectURL)) ? true : false;
        };

        var getCsvLine = function(data){
            //clear data
            data = angular.fromJson(angular.toJson(data));

            var line = '';
            for (var key in data){
                line += CSV_SEP + ('' + data[key]).trim();
            }

            line += NEW_LINE;

            //remove first comma
            if (line.length) line = line.substr(1);

            return line;
        };

        var getCsvLines = function(data){
            var lines='';

            for (var i=0; i < data.length; i++){
                lines += getCsvLine(data[i]);
            }

            return lines;
        };

        var getHtmlContent = function(data){
            //clear data
            data = angular.fromJson(angular.toJson(data));



//            var url = 'common/js/directives/fileExport/items.html';
//            $http({method : 'GET', url : url, cache : true})
//                .success(function(template){
//                    var scope = $rootScope.$new();
//
//                    if (Array.isArray(data)) scope.items = data;
//                    else scope.item = data;
//
//                    var element = $compile(template)(scope);
//                    //scope.$digest();
//
//                    d(template[0]);
//                });

            var scope = $rootScope.$new();

            if (Array.isArray(data)) scope.items = data;
            else scope.item = data;

            var template = scope.items ? '<pre>{{ items | json }}}</pre>' : '<pre>{{ item | json }}}</pre>';

            var element = $compile(template)(scope);
            scope.$digest();

            return '<!DOCTYPE HTML><html><body>' + element[0].outerHTML + '</body></html>';
        };

        var getBlob = function(data, type){
            var blobParts = [], blobOptions = {}, content;

            if (type == 'csv')  {
                content = Array.isArray(data) ? getCsvLines(data) : getCsvLine(data);
                content = content.substr(0, content.length - NEW_LINE.length);
            } else if (type == 'html'){
                content = getHtmlContent(data);
            }

            if (content) blobParts.push(content);
            blobOptions = {type: 'text/' + type};

            return (blobParts.length && blobOptions.type) ? new Blob(blobParts, blobOptions) : null;
        };

        var getObjectURL = function(data, type){
            var blob = getBlob(data, type);
            return blob ? $window.URL.createObjectURL(blob) : '';
        };

        var revokeObjectURL = function(href){
            //releases an existing object URL - performance issue
            if (href) $window.URL.revokeObjectURL(href);
        };

        return {
            scope : {
              data : '=fileExport',
              type : '@fileExportType'
            },
            link : function(scope, element, attrs){
                var fileNameWithExtension = fileName + '.' + scope.type;

                if (isBrowserSupportFileExport()){
                    scope.$watch('data', function(newVal, oldVal){
                        if (isDataReady(newVal)) {
                            element.removeClass(DISABLED_CLASS);

                            //TODO: check newVal vs oldVal
                            element.unbind('click');
                            if (isBrowserSupportMsSaveBlob()){
                                element.bind('click', function(){
                                    $window.navigator.msSaveBlob(getBlob(newVal, scope.type), fileNameWithExtension)
                                });
                            } else {
                                element.bind('click', function(){
                                    var url = getObjectURL(scope.data, scope.type);
                                    if (url) {
                                        revokeObjectURL(element.attr('href'));
                                        element.attr('href', url);
                                    }

                                    element.attr(DOWNLOAD_ATTR, fileNameWithExtension);

                                    element.unbind('click');
                                });
                            }
                        } else {
                            element.addClass(DISABLED_CLASS);
                            element.removeAttr(DOWNLOAD_ATTR);
                            revokeObjectURL(element.attr('href'));
                            element.removeAttr('href');
                        }
                    }, true);
                } else {
                    element.addClass(DISABLED_CLASS);
                }

            }
        }
    }]);