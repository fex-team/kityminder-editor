define(function(require, exports, module) {
    var Minder = require('./kityminder');
    var HotBox = require('./hotbox');
    var FSM = require('./fsm');
    var format = require('./format');
    var key = require('./key');

    /**
     * 扩展模块
     */
    var extensions = [];

    function KMEditor(selector) {
        var _editor = this;

        /**
         * 整个编辑器的容器，包含：
         *     svg - 脑图可视化
         *     div.hotbox - 热盒容器
         *     div.mask - 鼠标事件屏蔽层
         *     div.receiver - 按键/输入接收器
         */
        var _container;

        /**
         * 脑图实例
         */
        var _minder;

        /**
         * 热盒实例
         */
        var _hotbox;

        /**
         * 屏蔽层
         */
        var _mask;

        /**
         * 接收器 dom
         */
        var _receiver;

        /**
         * 当前状态
         */
        var _fsm;

        _init();

        function _init() {
            _initFSM();
            _initContainer();
            _initMinder();
            _initHotBox();
            _initReceiver();
        }

        function _initFSM() {
            _fsm = new FSM('normal');
            _editor.fsm = _fsm;
        }

        function _initContainer() {
            _container = document.querySelector(selector);
            _container.classList.add('km-editor');
            _editor.container = _container;
        }

        function _initMinder() {
            _minder = new Minder({ enableKeyReceiver: false });
            _minder.renderTo(selector);
            _minder.setTheme(null);
            _minder.select(_minder.getRoot(), true);
            _minder.execCommand('text', '中心主题');
            _minder.on('beforemousedown', function() {
                if (_fsm.state() == 'input') _fsm.jump('normal', 'cancel');
            });
            _editor.minder = _minder;
        }

        function _initReceiver() {
            _receiver = document.createElement('div');
            _receiver.contentEditable = true;
            _receiver.classList.add('receiver');
            _container.appendChild(_receiver);
            _editor.receiver = _receiver;
            _updateReceiverPosition();
            _exitInputMode();

            // 阻止 hotbox 获得焦点
            _receiver.onmousedown = function(e) {
                e.stopPropagation();
            };
            _receiver.onkeydown = _receiver.onkeyup = _receiver.oninput = _handleKeyEvent;
            _minder.on('layoutapply viewchange selectionchange', _updateReceiverPosition);

            _editor.editText = function() {
                var text = _minder.queryCommandValue('text');
                _receiver.innerHTML = text && text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
                _fsm.jump('input');
                document.execCommand('SelectAll');
            };

            _hotbox.state('main').button({
                position: 'center',
                label: '编辑',
                key: 'F2',
                enable: function() {
                    return _minder.queryCommandState('text') != -1;
                },
                action: function() {
                    _editor.editText();
                }
            });

            _fsm.listen(function(exit, enter, reason) {
                if (enter == 'input') _enterInputMode();
                if (exit == 'input') {
                    switch (reason) {
                        case 'commit': return _commitInputResult();
                        case 'cancel': return _exitInputMode();
                    }
                }
            });
        }

        function _initHotBox() {
            _hotbox = new HotBox(_container);
            _fsm.listen(function(exit, enter, reason) {
                if (enter == 'hotbox') {
                    var node = _minder.getSelectedNode();
                    var box = node.getRenderBox();
                    _hotbox.active('main', {
                        x: box.cx,
                        y: box.cy
                    });
                }
            });
            _editor.hotbox = _hotbox;
        }

        function _enterInputMode() {
            var node = _minder.getSelectedNode();
            if (node) {
                var fontSize = node.getData('font-size') || node.getStyle('font-size');
                _receiver.style.fontSize = fontSize + 'px';
                _receiver.style.minWidth = 0;
                _receiver.style.minWidth = _receiver.clientWidth + 'px';
                _receiver.classList.remove('hide');
                _receiver.focus();
            }
        }

        function _commitInputResult() {
            var text = _receiver.innerHTML.replace(/<br\s*\/?>/ig, '\n');
            text = text.replace(/^\n*|\n*$/g, '');
            _minder.execCommand('text', text);
            _exitInputMode();
        }

        function _exitInputMode() {
            _receiver.classList.add('hide');
            _receiver.innerHTML = null;
        }

        function _handleKeyEvent(e) {
            var handleResult;
            switch(_fsm.state()) {
                case 'normal':
                    if (e.type == 'keydown' && key.is(e, 'Space') && _minder.getSelectedNode()) {
                        _fsm.jump('hotbox');
                        return;
                    }
                    if (e.type == 'input') {
                        // 阻止换行
                        if (key.is(e, 'Enter')) {
                            e.preventDefault();
                        }
                        _fsm.jump('input');
                    } else {
                        handleResult = _hotbox.dispatch(e);
                        if (handleResult) {
                            e.preventDefault();
                        } else {
                            _minder.dispatchKeyEvent(e);
                        }
                    }
                    break;
                case 'input':
                    if (e.type == 'keydown') {
                        if (key.is(e, 'Enter')) {
                            e.preventDefault();
                            _fsm.jump('normal', 'commit');
                            return;
                        }
                        if (key.is(e, 'Esc') || key.is(e, 'Tab') || key.is(e, 'Shift + Tab')) {
                            e.preventDefault();
                            _fsm.jump('normal', 'cancel');
                            return;
                        }
                    }
                    break;
                case 'hotbox':
                    e.preventDefault();
                    handleResult = _hotbox.dispatch(e);
                    if (handleResult == 'back' && _hotbox.state() == HotBox.STATE_IDLE) {
                        _fsm.jump('normal');
                    }
                    break;
            }
        }

        function _updateReceiverPosition() {
            var focusNode = _minder.getSelectedNode() || _minder.getRoot();
            if (!focusNode) return;
            var box = focusNode.getRenderBox('TextRenderer');
            _receiver.style.transform = _receiver.style.webkitTransform = format('translate3d({x}px, {y}px, 0)', {
                x: Math.round(box.x),
                y: Math.round(box.y)
            });
            _receiver.focus();
            document.execCommand('SelectAll');
        }

        for (var i = 0; i < extensions.length; i++) {
            if (typeof extensions[i] == 'function') extensions[i].call(this, this);
        }
    }

    function extend(extension) {
        extensions.push(extension);
    }

    // extend(require('./input'));
    extend(require('./node'));

    KMEditor.extend = extend;

    module.exports = KMEditor;
});