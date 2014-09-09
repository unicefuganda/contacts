module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      },
      continuous: {
         configFile: 'karma.conf.js',
         singleRun: true,
         browsers: ['PhantomJS']
      }
    },
    migrations: {
      path: "migrations",
      template: grunt.file.read('migrations/_template.js'),
      mongo: 'mongodb://localhost/unicefcontacts',
      ext: "js"
    }
  });

  grunt.registerTask('default', ['karma']);
};
