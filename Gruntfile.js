module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> ',
    env: {
        dev: {
              NODE_ENV: 'dev'
        },
        test: {
              NODE_ENV: 'test'
        }
    },
    jasmine_node: {
        coverage: {

        },
        options: {
            forceExit: true,
            captureExceptions: true,
            junitreport: {
              report: true,
              savePath: "./reports/",
              consolidated: true
            }
        },
        functional: ['spec/functional/'],
        unit: ['spec/unit/'],
        all: ['spec']
    },
    migrations: {
      path: "migrations",
      template: grunt.file.read('migrations/_template.js'),
      mongo: 'mongodb://localhost/unicefcontacts',
      ext: "js"
    },
    coveralls: {
      options: {
        // LCOV coverage file relevant to every target
        src: 'coverage/lcov.info',

        // When true, grunt-coveralls will only print a warning rather than
        // an error, to prevent CI builds from failing unnecessarily (e.g. if
        // coveralls.io is down). Optional, defaults to false.
        force: false
      },
      grunt_coveralls_coverage: {
        // Target-specific LCOV coverage file
        src: 'coverage/lcov.info'
      }
     }
  });

  grunt.registerTask('default', ['jasmine_node:all']);

  grunt.loadNpmTasks('grunt-coveralls');

  // Catch unhandled exceptions and show the stack trace. This is most
  // useful when running the jasmine specs.
  process.on('uncaughtException',function(e) {
    grunt.log.error('Caught unhandled exception: ' + e.toString());
    grunt.log.error(e.stack);
  });
};
