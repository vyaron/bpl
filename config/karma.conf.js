// Karma configuration
// Generated on Wed Nov 13 2013 11:25:51 GMT+0200 (Jerusalem Standard Time)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'app/common/lib/strtotime/strtotime.js',
        'app/common/bower_components/jquery/jquery.min.js',
        'test/lib/jasmine-jquery.js',

        'app/common/bower_components/angular/angular.js',
        'app/common/bower_components/angular-*/*.min.js',
        'app/common/bower_components/angular-mocks/angular-mocks.js',

        'app/common/bower_components/angular-ui-bootstrap/dist/ui-bootstrap-tpls-0.7.0.js',
        'app/common/bower_components/ng-table/ng-table.js',

        'app/common/js/app.js',
        //'common/js/controllers/controllers.js',
        'app/common/js/directives/**/*.js',
        'app/common/js/filters/filters.js',
        //'common/js/services/services.js',


        'app/common/js/services/**/*.js',
        'app/resources/*.js',

        'app/PubSubChannels.js',

        'app/widgets/**/*.js',
        'app/widgets/**/*.html',
        'app/common/js/directives/**/*.html',


        //'test/unit/**/*.js',
        //'../test/unit/directivesSpec.js',
        //'../test/unit/Resources/*Spec.js',

        //'common/templates/**/*.html'

        {pattern: 'server/data/**/*.json', watched: true, served: true, included: false}
    ],


    // list of files to exclude
    exclude: [
    ],

      preprocessors: {
          'app/widgets/**/*.html': 'ng-html2js',
          'app/common/js/directives/**/*.html': 'ng-html2js'//,
          //'app/common/js/services/**/*': ['coverage']
      },

      ngHtml2JsPreprocessor: {
          // strip this from the file path
          stripPrefix: 'app/'
      },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],
      //reporters: ['progress', 'coverage'],

//  coverageReporter: {
//      type : 'html',
//      dir : 'coverage/'
//  },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
