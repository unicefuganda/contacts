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
    }
  });

  grunt.registerTask('default', ['jasmine_node:all']);
};
