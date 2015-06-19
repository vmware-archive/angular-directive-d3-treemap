module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],

        basePath: '',
        files: [
            'node_modules/angular/angular.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'node_modules/d3/d3.js',
            'node_modules/underscore/underscore.js',

            'src/*.js',

            'test/*.spec.js'
        ],

        singleRun: false,
        autoWatch: true,
        port: 9876,
        logLevel: config.LOG_INFO,

        reporters: ['progress'],
        colors: true
    });
};
