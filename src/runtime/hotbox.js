/**
 * @fileOverview
 *
 * 热盒 Runtime
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module) {
    var Hotbox = require('../hotbox');

    function HotboxRuntime() {
        var fsm = this.fsm;
        var minder = this.minder;
        var receiver = this.receiver;
        var container = this.container;

        var hotbox = new Hotbox(container);

        fsm.when('normal -> hotbox', function(exit, enter, reason) {
            var node = minder.getSelectedNode();
            var position;
            if (node) {
                var box = node.getRenderBox();
                position = {
                    x: box.cx,
                    y: box.cy
                };
            }
            hotbox.active('main', position);
        });

        fsm.when('normal -> normal', function(exit, enter, reason, e) {
            if (reason == 'shortcut-handle') {
                var handleResult = hotbox.dispatch(e);
                if (handleResult) {
                    e.preventDefault();
                } else {
                    minder.dispatchKeyEvent(e);
                }
            }
        });

        this.hotbox = hotbox;
    }

    return module.exports = HotboxRuntime;
});