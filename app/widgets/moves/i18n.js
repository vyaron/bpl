angular.module('bplApp').run(['Translations', function(Translations){
    Translations.extend('he', {
        'Date' : 'תאריך',
        '30 Days' : '30 ימים אחרונים',
        'Three Months' : 'שלושה חודשים אחרונים',
        'Half Last Year' : 'חצי שנה אחרונה',
        'Exact Date' : 'תאריך מדויק',
        'Type of action' : 'סוג הפעולה',
        'Sum' : 'סכום',
        'Description of action' : 'תאור הפעולה',
        'Income' : 'זכות',
        'Expense' : 'חובה',
        'Balance in NIS' : 'יתרה בש"ח',
        'Conditional' : 'על תנאי',
        'All actions' : 'כל הפעולות'
    });
}]);