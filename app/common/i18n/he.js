angular.module('bplApp').run(['Translations', function(Translations){
    Translations.extend('he', {
        'hello world' : 'שלום עולם'
    });
}]);