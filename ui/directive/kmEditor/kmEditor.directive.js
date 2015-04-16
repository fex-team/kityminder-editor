angular.module('kmEditorUI').directive('kmEditor', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {

            /* global seajs */
            seajs.config({
                base: './src'
            });

            define('demo', function(require) {
                var Editor = require('editor');

                var editor = window.editor = new Editor(element.attr('km-editor'));

                if (window.localStorage.__dev_minder_content) {
                    editor.minder.importJson(JSON.parse(window.localStorage.__dev_minder_content));
                }

                editor.minder.on('contentchange', function() {
                    window.localStorage.__dev_minder_content = JSON.stringify(editor.minder.exportJson());
                });

                window.minder = window.km = editor.minder;

                scope.editor = editor;
                scope.minder = minder;
                scope.$apply();
            });

            seajs.use('demo');
        }
    }
});