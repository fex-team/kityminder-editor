/**
 * @fileOverview
 *
 * 用于拖拽节点时屏蔽键盘事件
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module) {

    var Hotbox = require('../hotbox');
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

        var downX, downY;
        var MOUSE_HAS_DOWN = 0;
        var MOUSE_HAS_UP = 1;
        var flag = MOUSE_HAS_UP;

        minder.on('mousedown', function(e) {
            flag = MOUSE_HAS_DOWN;
            downX = e.clientX;
            downY = e.clientY;
        });

        minder.on('mousemove', function(e) {

            if (fsm.state() != 'drag'
                && flag == MOUSE_HAS_DOWN
                && minder.getSelectedNode()
                || (Math.abs(downX - e.clientX) > 10
                || Math.abs(downY - e.clientY) > 10)) {

                if (fsm.state() == 'hotbox') {
                    hotbox.active(Hotbox.STATE_IDLE);
                }

                return fsm.jump('drag', 'user-drag');
            }

        });

        document.body.onmouseup = function(e) {
            flag = MOUSE_HAS_UP;
            if (fsm.state() == 'drag') {
                return fsm.jump('normal', 'drag-finish');
            }
        };

    }

    return module.exports = DragRuntime;
});
