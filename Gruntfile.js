module.exports = function (grunt) {

  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    //// Empty the old minified file from the dist directory
    //clean: {
    //  default: ["../dist/<%= pkg.name %>-*.min.js"],
    //  options: {
    //    force: true
    //  }
    //},

    // Bumpup version
    bumpup: {
      options: {
        updateProps: {
          pkg: 'package.json'
        }
      },
      files: ['package.json']
    },

    uglify: {
      options: {
        banner: grunt.file.read('BANNER'),
        compress: {
          drop_console: true
        },
        preserveComments: false
      },
      build: {
        src: './src/<%= pkg.name %>.js',
        dest: './<%= pkg.name %>.min.js'
      }
    },

    // Generate doc
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        version: '<%= pkg.version %>',
        description: '<%= pkg.description %>',
        url: '<%= pkg.url %>',
        options: {
          outdir: './docs',
          linkNatives: true,
          paths: ['./src/']
        }
      }
    },

    // Copy file to the example folder
    copy: {
      main: {

        files: [
          { src: './<%= pkg.name %>.min.js', dest: './examples/<%= pkg.name %>.min.js' }
        ]

      }
    },

    // Push documentation to GitHub pages
    'gh-pages': {
      options: {
        base: './docs'
      },
      src: ['**/*']
    },

    release: {
      options: {
        bump: false,
        commitMessage: 'Release <%= version %>',
      }
    }

  });

  grunt.loadNpmTasks('grunt-bumpup');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-yuidoc");
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-release');

  grunt.registerTask('publish', ['publish:prerelease']);
  grunt.registerTask("publish:prerelease", ['bumpup:prerelease', 'uglify', 'yuidoc', 'copy', 'gh-pages', 'release']);
  grunt.registerTask("publish:patch", ['bumpup:patch', 'yuidoc', 'release']);
  grunt.registerTask('publish:minor', ['bumpup:minor', 'yuidoc', 'release']);
  grunt.registerTask('publish:major', ['bumpup:major', 'yuidoc', 'release']);

};