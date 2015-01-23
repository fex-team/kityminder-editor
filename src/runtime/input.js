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

        // setup them
        setupReciverElement();
        setupFsm();
        setupHotbox();

        // expose editText()
        this.editText = editText;

        function setupFsm() {

            fsm.when('* -> input', enterInputMode);
            fsm.when('input -> *', function(exit, enter, reason) {
                switch (reason) {
                    case 'input-commit': return commitInputResult();
                    case 'input-cancel': return exitInputMode();
                }
            });

            minder.on('beforemousedown', function() {
                if (fsm.state() == 'input') {
                    fsm.jump('normal', 'input-commit');
                }
            });
        }

        function setupReciverElement() {
            if (debug.flaged) {
                receiverElement.classList.add('debug');
            }

            receiverElement.onmousedown = function(e) {
                e.stopPropagation();
            };

            minder.on('layoutallfinish viewchange viewchanged selectionchange', function(e) {
                if (e.type == 'viewchange' && fsm.state() != 'input') return;
                updatePosition();
            });

            updatePosition();
        }

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

        function editText() {
            var text = minder.queryCommandValue('text');
            if ('innerText' in receiverElement) {
                receiverElement.innerText = text;
            } else {
                receiverElement.innerHTML = text &&
                    text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
            }
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
            var cache = updatePosition;

            cache.fixedX = cache.fixedX || 0;
            cache.fixedY = cache.fixedY || 0;

            var focusNode = minder.getSelectedNode() || minder.getRoot();
            if (!focusNode) return;

            var box = focusNode.getRenderBox('TextRenderer');
            receiverElement.style.left = Math.round(box.x) + 'px';
            receiverElement.style.top = Math.round(box.y) + 'px';
            receiverElement.focus();
        }
    }

    return module.exports = InputRuntime;
});