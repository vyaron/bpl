angular.module('bplApp').run(['Translations', function(Translations){
    Translations.extend('ru', {
        'hello world' : 'привет мир'
    });
}]);