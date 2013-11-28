angular.module('bplApp').run(['Translations', function(Translations){
    Translations.extend('en', {
        'hello world' : 'hello world'
    });
}]);