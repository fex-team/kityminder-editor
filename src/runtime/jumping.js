/**
 * @fileOverview
 *
 * 根据按键控制状态机的跳转
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module) {

    var Hotbox = require('../hotbox');


    // Nice: http://unixpapa.com/js/key.html
    function isIntendToInput(e) {
        if (e.ctrlKey || e.metaKey || e.altKey) return false;

        // a-zA-Z
        if (e.keyCode >= 65 && e.keyCode <= 90) return true;

        // 0-9 以及其上面的符号
        if (e.keyCode >= 48 && e.keyCode <= 57) return true;

        // 输入法
        if (e.keyCode == 229) return true;
    }

    function JumpingRuntime() {
        var fsm = this.fsm;
        var minder = this.minder;
        var receiver = this.receiver;
        var receiverElement = receiver.element;
        var hotbox = this.hotbox;

        // normal -> *
        receiver.listen('normal', function(e) {
            // normal -> hotbox
            if (e.type == 'keydown' && e.is('Space')) {
                e.preventDefault();
                return fsm.jump('hotbox', 'space-trigger');
            }
            // normal -> input
            if (e.type == 'keydown' && isIntendToInput(e)) {
                if (minder.getSelectedNode()) {
                    return fsm.jump('input', 'user-input');
                } else {
                    receiverElement.innerHTML = '';
                }
            }
            // normal -> normal
            if (e.type == 'keydown') {
                return fsm.jump('normal', 'shortcut-handle', e);
            }
        });

        // hotbox -> normal
        receiver.listen('hotbox', function(e) {
            e.preventDefault();
            var handleResult = hotbox.dispatch(e);
            if (handleResult == 'back' && hotbox.state() == Hotbox.STATE_IDLE) {
                return fsm.jump('normal', 'hotbox-idle');
            }
        });

        // input => normal
        receiver.listen('input', function(e) {
            if (e.type == 'keydown') {
                if (e.is('Enter')) {
                    e.preventDefault();
                    return fsm.jump('normal', 'input-commit');
                }
                if (e.is('Esc')) {
                    e.preventDefault();
                    return fsm.jump('normal', 'input-cancel');
                }
                if (e.is('Tab') || e.is('Shift + Tab')) {
                    e.preventDefault();
                }
            }
        });
    }

    return module.exports = JumpingRuntime;
});