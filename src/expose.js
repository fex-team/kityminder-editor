define(function(require, exports, module) {
    var Editor = require('./editor');

    Editor.extend(require('./text'));
    Editor.extend(require('./node'));

    module.exports = Editor;
});