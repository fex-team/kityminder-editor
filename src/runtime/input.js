/**
 * @fileOverview
 *
 * 文本输入支持
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module) {

    require('../tool/innertext');

    var Debug = require('../tool/debug');
    var debug = new Debug('input');

    function InputRuntime() {
        var fsm = this.fsm;
        var minder = this.minder;
        var hotbox = this.hotbox;
        var receiver = this.receiver;
        var receiverElement = receiver.element;

        // setup everything to go
        setupReciverElement();
        setupFsm();
        setupHotbox();

        // expose editText()
        this.editText = editText;


        // listen the fsm changes, make action.
        function setupFsm() {

            // when jumped to input mode, enter
            fsm.when('* -> input', enterInputMode);

            // when exited, commit or exit depends on the exit reason
            fsm.when('input -> *', function(exit, enter, reason) {
                switch (reason) {
                    case 'input-commit': return commitInputResult();
                    case 'input-cancel': return exitInputMode();
                }
            });

            // lost focus to commit
            minder.on('beforemousedown', function() {
                if (fsm.state() == 'input') {
                    fsm.jump('normal', 'input-commit');
                }
            });
        }


        // let the receiver follow the current selected node position
        function setupReciverElement() {
            if (debug.flaged) {
                receiverElement.classList.add('debug');
            }

            receiverElement.onmousedown = function(e) {
                e.stopPropagation();
            };

            minder.on('layoutallfinish viewchange viewchanged selectionchange', function(e) {

                // viewchange event is too frequenced, lazy it
                if (e.type == 'viewchange' && fsm.state() != 'input') return;

                updatePosition();
            });

            updatePosition();
        }


        // edit entrance in hotbox
        function setupHotbox() {
            hotbox.state('main').button({
                position: 'center',
                label: '编辑',
                key: 'F2',
                enable: function() {
                    return minder.queryCommandState('text') != -1;
                },
                action: editText
            });
        }


        // edit for the selected node
        function editText() {
            receiverElement.innerText = minder.queryCommandValue('text');
            fsm.jump('input', 'input-request');
            receiver.selectAll();
        }

        function enterInputMode() {
            var node = minder.getSelectedNode();
            if (node) {
                var fontSize = node.getData('font-size') || node.getStyle('font-size');
                receiverElement.style.fontSize = fontSize + 'px';
                receiverElement.style.minWidth = 0;
                receiverElement.style.minWidth = receiverElement.clientWidth + 'px';
                receiverElement.classList.add('input');
                receiverElement.focus();
            }
        }

        function commitInputResult() {
            var text = receiverElement.innerText;
            minder.execCommand('text', text.replace(/^\n*|\n*$/g, ''));
            exitInputMode();
        }

        function exitInputMode() {
            receiverElement.classList.remove('input');
            receiver.selectAll();
        }

        function updatePosition() {
            var planed = updatePosition;

            var focusNode = minder.getSelectedNode();
            if (!focusNode) return;

            if (!planed.timer) {
                planed.timer = setTimeout(function() {
                    var box = focusNode.getRenderBox('TextRenderer');
                    receiverElement.style.left = Math.round(box.x) + 'px';
                    receiverElement.style.top = (debug.flaged ? Math.round(box.bottom + 30) : Math.round(box.y)) + 'px';
                    receiverElement.focus();
                    planed.timer = 0;
                });
            }
        }
    }

    return module.exports = InputRuntime;
});