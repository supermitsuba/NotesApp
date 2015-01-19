var path = require('path');

module.exports = function(grunt) {
// Load Grunt tasks declared in the package.json file
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

// Configure Grunt
grunt.initConfig({

// Grunt express - our webserver
// https://github.com/blai/grunt-express
express: {
    all: {
        options: {
            bases: [path.resolve('./public'), path.resolve('./view')],
            server: path.resolve('./server.js'),
            port: 8081
        }
    }
},

typescript: {
    default: {
        src: ['lib/**/*.ts'],
        dest: 'public/js/app.js',
        options: {
            module: 'amd',
            target: 'es5',
            ignoreError: true
        }
    }
},

// grunt-watch will monitor the projects files
// https://github.com/gruntjs/grunt-contrib-watch
watch: {
    typescript: {
        files: '**/*.ts',
        tasks: ['typescript']
    }
},

// grunt-open will open your browser at the project's URL
// https://www.npmjs.org/package/grunt-open
open: {
    all: {
        path: 'http://192.168.10.103:8081/'
    }
}
});

// Creates the `server` task
grunt.registerTask('server', [
    'typescript',
    'express',
    'open',
    'watch'
    ]);
};