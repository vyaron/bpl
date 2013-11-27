'use strict';

angular.module('bplApp.services')
    .provider('Translations', function(){
        this.lang = 'en';
        this.$get = function(){
            var defaultLang = this.lang;
            var _translations = {};
            _translations[defaultLang] = {};

            var extend = function(lang, trans){
                var currTrans = (lang in _translations) ? _translations[lang] : {};
                _translations[lang] = angular.extend(trans, currTrans);
            };

            var get = function(lang, key){
                var lang = lang ? lang : defaultLang;
                return (lang in _translations && key in _translations[lang]) ? _translations[lang][key]
                    : ((key in _translations[defaultLang]) ? _translations[defaultLang][key] : key);
            };

            return {
                extend : extend,
                get : get
            }
        };
    })
