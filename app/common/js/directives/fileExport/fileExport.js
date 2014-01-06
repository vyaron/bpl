'use strict';

angular.module('bplApp.directives')
    .directive('fileExport', ['$rootScope', '$window', '$http', '$compile', function($rootScope, $window, $http, $compile) {
        var DISABLED_CLASS = 'disabled';
        var DOWNLOAD_ATTR = 'download';

        var CSV = 'csv';
        var HTML = 'html';

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

        var getOptions = function(scope){
            var options;

            if (Array.isArray(scope.options) && scope.options.length) options = scope.options;
            else {
                var item = Array.isArray(scope.data) ? scope.data[0] : scope.data;
                if (item){
                    options = [];
                    for (var name in item){
                        //TODO: use $filter on label
                        options.push({name : name, label : name.toUpperCase()});
                    }
                }
            }

            return options;
        };

        var getCsvLine = function(data, options){
            //clear data
            data = angular.fromJson(angular.toJson(data));

            var line = '';

            for (var i = 0; i < options.length; i++){
                var val = data[options[i].name] ? data[options[i].name] : '';

                if ('filter' in options[i]) val = options[i].filter(val);

                line += CSV_SEP + ('' + val).trim();
            }

            line += NEW_LINE;

            //remove first comma
            if (line.length) line = line.substr(1);

            return line;
        };

        var getCsvLines = function(scope, options){
            var lines='';

            for (var i=0; i < scope.data.length; i++){
                lines += getCsvLine(scope.data[i], options);
            }

            return lines;
        };

        var getCsvContent = function(scope){
            var options = getOptions(scope);

            var content = '';

            if (options && options.length){
                for (var i=0; i<options.length; i++){
                    content += CSV_SEP + options[i].label;
                }

                content += NEW_LINE;

                //remove first comma
                content = content.substr(1);

                content += Array.isArray(scope.data) ? getCsvLines(scope, options) : getCsvLine(scope.data, options);

                //remove last new line
                content = content.substr(0, content.length - NEW_LINE.length);
            }

            return content;
        };

        var cssContent;
        var getCssContent = function(){
            if (!cssContent){
                var xmlhttp = new XMLHttpRequest();

                //Wrong URL in Karma
                xmlhttp.open("GET","common/css/print.css",true);

                xmlhttp.onreadystatechange = function(){
                    if (this.readyState == 4 && this.status == 200) cssContent = this.responseText;
                };

                xmlhttp.send();
            }

            return cssContent;
        };

        var getHtmlContent = function(){
            //clear data
//            data = angular.fromJson(angular.toJson(data));
//
//            var scope = $rootScope.$new();
//
//            if (Array.isArray(data)) scope.items = data;
//            else scope.item = data;
//
//            var template = scope.items ? '<pre>{{ items | json }}}</pre>' : '<pre>{{ item | json }}}</pre>';
//
//            var element = $compile(template)(scope);
//            scope.$digest();
            var pageEl = angular.element(document.body).clone();

            //debugger;

            //TODO: clean HTML comments
            //Clean tags
            pageEl.find('.hide-print, script').remove();

            //TODO: convert href data to dataURI
            // Base tag? Base64? samples: cheque img

            return '<!DOCTYPE HTML><html><head><style type="text/css">' + getCssContent() + '</style></head><body>' + pageEl.html() + '</body></html>';
        };

        var getBlob = function(scope){
            var blobParts = ["\ufeff"], blobOptions = {}, content;

            //get content
            if (scope.type == CSV) content = getCsvContent(scope);
            else if (scope.type == HTML) content = getHtmlContent();

            if (content) blobParts.push(content);
            blobOptions = {type: "text/" + scope.type + ";charset=UTF-8"};

            // Blob is IE10+ , if we need to support IE9, need server side fallback to get content and return as the matching content-type
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

        var setClickEvent = function(scope, element){
            var fileNameWithExtension = fileName + '.' + scope.type;

            element.removeClass(DISABLED_CLASS);

            element.unbind('click');
            if (isBrowserSupportMsSaveBlob()){
                element.bind('click', function(){
                    if (isDataReady(scope.data)) $window.navigator.msSaveBlob(getBlob(scope), fileNameWithExtension)
                });
            } else {
                element.bind('click', function(){
                    if (isDataReady(scope.data)){
                        var url = getObjectURL(scope);
                        if (url) {
                            revokeObjectURL(element.attr('href'));
                            element.attr('href', url);
                        }

                        element.attr(DOWNLOAD_ATTR, fileNameWithExtension);
                    } else {
                        element.removeAttr(DOWNLOAD_ATTR);
                        element.removeAttr('href');
                    }


                    //if (scope.type == CSV) element.unbind('click');
                });
            }
        };

        return {
            scope : {
              data : '=fileExport',
              options : '=fileExportOptions',
              type : '@fileExportType'
            },
            link : function(scope, element, attrs){
                if (isBrowserSupportFileExport()){
                    if (scope.type == CSV){
//                        scope.$watch('data', function(newVal, oldVal){
//                            if (isDataReady(newVal)) {
                                setClickEvent(scope, element);
//                            } else {
//                                element.addClass(DISABLED_CLASS);
//                                element.removeAttr(DOWNLOAD_ATTR);
//                                revokeObjectURL(element.attr('href'));
//                                element.removeAttr('href');
//                            }
//                        }, true);
                    } else if (scope.type == HTML){
                        setClickEvent(scope, element);
                    }
                } else {
                    element.addClass(DISABLED_CLASS);
                }

            }
        }
    }]);