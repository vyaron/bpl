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
        'All actions' : 'כל הפעולות',
        
        'Reference' : 'אסמכתא',
        'Beneficiary name' : 'שם המוטב',
        'Bank' : 'בנק',
        'Branch name' : "שם ומס' סניף",
        'Account number' : "מס' חשבון",
        'Apartment' : 'דירה',
        'Work' : 'עבודה',
        'Contribution' : 'תרומה',
        'Comment' : 'הערה',
        'Initiate a transfer return' : 'בצע העברה חוזרת',
        'Initiate a transfer small expenses' : 'בצע העברה בהו"ק',
        'Management beneficiaries transfers' : 'ניהול מוטבים להעברות',
        'Ordering checkbooks' : 'הזמן פנקסי שייקים',
        
        'Choose plan' : 'בחר תוכנית',
        'Not interested' : 'אינני מעוניין'        
    });
}]);