define(function(require, exports, module) {
    var Minder = require('./kityminder');
    var HotBox = require('./hotbox');

    /**
     * 扩展模块
     */
    var extensions = [];

    function KMEditor(selector) {
        var container = document.querySelector(selector);
        var minder = new Minder({ enableKeyReceiver: false }).renderTo(selector).setTheme();
        var hotbox = new HotBox(selector).control();

        // hotbox.hintDeactiveMainState = true;
        hotbox.onkeyevent = function(e) {
            if (!e.handleResult) {
                minder.dispatchKeyEvent(e);
            }
        };

        hotbox.position = function() {
            var selected = minder.getSelectedNode();
            if (!selected) return null;
            var box = selected.getRenderBox();
            return {
                x: box.cx,
                y: box.cy
            };
        };

        this.container = container;
        this.minder = minder;
        this.hotbox = hotbox;

        minder.select(minder.getRoot(), true);
        minder.execCommand('text', '中心主题');

        for (var i = 0; i < extensions.length; i++) {
            extensions[i].call(this, this);
        }
    }

    KMEditor.extend = function(extension) {
        extensions.push(extension);
    };

    module.exports = KMEditor;
});