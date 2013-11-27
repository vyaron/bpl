'use strict';

angular.module('bplApp.filters', [])

// Convert boolean to V or X symbols
.filter('checkmark', function() {
  return function(input) {
    return input ? '\u2713' : '\u2718';
  };
})

// Return 'green' for possitive, 'red' for negative
.filter('currencyAmountClass', function() {
	return function(amount) {
		return (amount >= 0 )? 'green': 'red';
	};
})

// Trucate text
// params: the text, the desired length and the suffix to add (default: ...)
.filter('truncate', function () {
	return function (text, length, end) {
		if (text == null || text.length == 0) 	return null;        	
	    if (isNaN(length)) 						length = 10;
	    if (end === undefined)                 end = "...";
 
        if (text.length <= length || text.length - end.length <= length)  return text;
            return String(text).substring(0, length-end.length) + end;
    };
})


// Translate
// <div>{{'hello world'| translate}}</div>
// <div>{{'hello world'| translate:'ru'}}</div>
// <div>{{'hello world'| translate:'he'}}</div>

.filter('translate', ['Translations', function(Translations){
    return function(input, lang){
        return Translations.get(lang, input);
    };
}]);
