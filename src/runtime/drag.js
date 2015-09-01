/**
 * @fileOverview
 *
 * 用于拖拽节点是屏蔽键盘事件
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module) {

    var Debug = require('../tool/debug');
    var debug = new Debug('drag');

    function DragRuntime() {
        var fsm = this.fsm;
        var minder = this.minder;
        var hotbox = this.hotbox;
        var receiver = this.receiver;
        var receiverElement = receiver.element;

        // setup everything to go
        setupFsm();

        // listen the fsm changes, make action.
        function setupFsm() {

            // when jumped to drag mode, enter
            fsm.when('* -> drag', function() {
                // now is drag mode
            });

            fsm.when('drag -> *', function(exit, enter, reason) {
                if (reason == 'drag-finish') {
                    // now exit drag mode
                }
            });
        }

        minder.on('mousedown', function(e) {
            if (minder.getSelectedNode()) {
                return fsm.jump('drag', 'user-drag');
            }
        });

        document.body.onmouseup = function(e) {
            if (fsm.state() == 'drag') {
                return fsm.jump('normal', 'drag-finish');
            }
        };

    }

    return module.exports = DragRuntime;
});