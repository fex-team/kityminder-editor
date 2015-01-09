define(function(require, exports, module) {
    var Minder = require('./kityminder');
    var HotBox = require('./hotbox');
    var format = require('./format');

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
        var _state;

        _init();

        function _init() {
            _initContainer();
            _initMinder();
            _initMask();
            _initState();
            _initReceiver();
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
            _editor.minder = _minder;
        }

        function _initMask() {
            _mask = document.createElement('div');
            _mask.classList.add('text-editor-mask');
            _mask.style.display = 'none';
            _container.appendChild(_mask);
            _editor.mask = _mask;
        }

        function _initState() {
            _state = 'normal';
        }

        function _initReceiver() {
            _receiver = document.createElement('div');
            _receiver.contentEditable = true;
            _receiver.classList.add('receiver');
            // 阻止 hotbox 获得焦点
            _receiver.onmousedown = function(e) {
                e.stopPropagation();
            };
            _receiver.onkeydown = _receiver.onkeyup = _receiver.oninput = _handleKeyEvent;
            _minder.on('layoutapply viewchange selectionchange', _updateReceiverPosition);
            _container.appendChild(_receiver);
            _container.onmousedown = function() {
                _receiver.focus();
            };
            _editor.receiver = _receiver;
        }

        function _handleKeyEvent(e) {
            switch(_state) {
                case 'normal':
                    if (e.type == 'input') _state = 'input';
                    break;
                case 'input':
                case 'hotbox':
            }
        }

        function _updateReceiverPosition() {
            var focusNode = _minder.getSelectedNode();
            if (!focusNode) return;
            var box = focusNode.getRenderBox('TextRenderer');
            _receiver.style.transform = _receiver.style.webkitTransform = format('translate3d({x}px, {y}px, 0)', {
                x: Math.round(box.x),
                y: Math.round(box.y)
            });
        }

        for (var i = 0; i < extensions.length; i++) {
            if (typeof extensions[i] == 'function') extensions[i].call(this, this);
        }
    }

    function extend(extension) {
        extensions.push(extension);
    }

    // extend(require('./input'));
    // extend(require('./node'));

    KMEditor.extend = extend;

    module.exports = KMEditor;
});