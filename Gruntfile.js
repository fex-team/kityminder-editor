/* global require, module */

var path = require('path');

module.exports = function(grunt) {
    'use strict';

    // These plugins provide necessary tasks.
    /* [Build plugin & task ] ------------------------------------*/
    grunt.loadNpmTasks('grunt-module-dependence');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');

    var pkg = grunt.file.readJSON('package.json');

    var banner = '/*!\n' +
        ' * ====================================================\n' +
        ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * GitHub: <%= pkg.repository.url %> \n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
        ' * ====================================================\n' +
        ' */\n\n';

    var expose = '\nuse(\'expose-editor\');\n';

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: pkg,

        clean: {
            last: [
                'kityminder.editor.js',
                'kityminder.editor.min.js',
                'kityminder.editor.css',
                'kityminder.editor.css.map'
            ]
        },

        // resolve dependence
        dependence: {
            options: {
                base: 'src',
                entrance: 'expose-editor'
            },
            merge: {
                files: [{
                    src: [
                        'src/**/*.js',
                        'lib/hotbox/src/**/*.js',
                        'lib/km-core/src/**/*.js'
                    ],
                    dest: 'kityminder.editor.js'
                }]
            }
        },

        // concat
        concat: {
            closure: {
                options: {
                    banner: banner + '(function () {\n',
                    footer: expose + '})();'
                },
                files: {
                    'kityminder.editor.js': ['kityminder.editor.js']
                }
            }
        },

        uglify: {
            options: {
                banner: banner
            },
            minimize: {
                files: {
                    'kityminder.editor.min.js': 'kityminder.editor.js'
                }
            }
        },

        less: {
            compile: {
                options: {
                    sourceMap: true
                },
                files: {
                    'kityminder.editor.css': 'less/editor.less'
                }
            }
        }

    });

    // Build task(s).
    grunt.registerTask('default', ['clean', 'dependence', 'concat', 'uglify', 'less']);

};