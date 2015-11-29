module.exports = function(grunt) {

    // Initialize the Grunt configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Configure the concat task
        concat: {
            js: {
                src: [
                    'src/chart/bar.js'
                ],
                dest: 'dist/d3-meetup.js'
            }
        },

        // Uglify Configuration
        uglify: {
            options: {
                mangle: false
            },
            js: {
                files: {
                    'dist/d3-meetup.min.js': ['dist/d3-meetup.js']
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', ['concat', 'uglify']);
    grunt.registerTask('default', 'build');

};

