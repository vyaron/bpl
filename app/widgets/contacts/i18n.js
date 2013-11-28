angular.module('bplApp').run(['Translations', function(Translations){
    Translations.extend('he', {
        'contacts' : 'אנשי קשר'
    });

    Translations.extend('ru', {
        'contacts' : 'привет мир'
    });
}]);