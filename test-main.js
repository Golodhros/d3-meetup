var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  paths: {
    'jquery': 'node_modules/jquery/dist/jquery.min',
    'd3': 'node_modules/d3/d3',
    'jasmine-jquery': 'node_modules/jasmine-jquery/lib/jasmine-jquery'
  },

  shims: {
    'jquery': { exports: '$'},
    'jasmine-jquery': {
        deps: ['jquery']
    },
    'd3': { exports: 'd3'}
  },

  // dynamically load all test files
  deps: allTestFiles,

  // start test run, once Require.js is done
  // the original callback here was just:
  // callback: window.__karma__.start
  // I was running into issues with jasmine-jquery though
  // specifically specifying where my fixtures were located
  // this solved it for me.
  callback: function(){
      require(['./jasmine-karma'], function(){
          window.__karma__.start();
      });
  }

});
