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
                    case 'input-cancel':
                        return exitInputMode();
                    case 'input-commit':
                    default:
                        return commitInputResult();
                }
            });

            // lost focus to commit
            minder.on('beforemousedown', function() {
                if (fsm.state() == 'input') {
                    fsm.jump('normal', 'input-commit');
                }
            });

            minder.on('dblclick', function() {
                if (minder.getSelectedNode()) {
                    editText();
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

        /**
         * 按照文本提交操作处理
         * @Desc: 从其他节点复制文字到另一个节点时部分浏览器(chrome)会自动包裹一个span标签，这样试用一下逻辑出来的就不是text节点二是span节点因此导致undefined的情况发生
         * @Warning: 下方代码使用[].slice.call来将HTMLDomCollection处理成为Array，ie8及以下会有问题
         * @Editor: Naixor
         * @Date: 2015.9.16
         */
        function commitInputText (textNodes) {
            var text = '';
            var TAB_CHAR = '\t',
                ENTER_CHAR = '\n',
                STR_CHECK = /\S/,
                SPACE_CHAR = '\u0020',
                // 针对FF,SG,BD,LB,IE等浏览器下SPACE的charCode存在为32和160的情况做处理
                SPACE_CHAR_REGEXP = new RegExp('(\u0020|' + String.fromCharCode(160) + ')'),
                BR = document.createElement('br');

            for (var str, 
                    _divChildNodes,
                    space_l, space_num, tab_num,
                    i = 0, l = textNodes.length; i < l; i++) {
                str = textNodes[i];

                switch (str.toString()) {
                    // 正常情况处理
                    case '[object HTMLBRElement]': {
                        text += ENTER_CHAR;
                        break;
                    }
                    case '[object Text]': {
                        // SG下会莫名其妙的加上&nbsp;影响后续判断，干掉！
                        str = str.wholeText.replace("&nbsp;", " ");
                        
                        if (!STR_CHECK.test(str)) {
                            space_l = str.length;
                            while (space_l--) {
                                if (SPACE_CHAR_REGEXP.test(str[space_l])) {
                                    text += SPACE_CHAR;
                                } else if (str[space_l] === TAB_CHAR) {
                                    text += TAB_CHAR;
                                }
                            }
                        } else {
                            text += str;
                        }
                        break;
                    }
                    // 被增加span标签的情况会被处理成正常情况并会推交给上面处理
                    case '[object HTMLSpanElement]': {
                        [].splice.apply(textNodes, [i, 1].concat([].slice.call(str.childNodes)));
                        i--;
                        break;
                    }
                    // 被增加div标签的情况会被处理成正常情况并会推交给上面处理
                    case '[object HTMLDivElement]': {
                        _divChildNodes = [];
                        for (var di = 0, l = str.childNodes.length; di < l; di++) {
                            _divChildNodes.push(str.childNodes[di]);
                        }
                        _divChildNodes.push(BR);
                        [].splice.apply(textNodes, [i, 1].concat(_divChildNodes));
                        l = textNodes.length;
                        i--;
                        break;
                    }
                    default: {
                        text += "";
                    }
                }
            };
            
            text = text.replace(/^\n*|\n*$/g, '');
            text = text.replace(new RegExp('(\n|\r|\n\r)(\u0020|' + String.fromCharCode(160) + '){4}', 'g'), '$1\t');
            minder.execCommand('text', text);
            exitInputMode();
            return text;
        }

        /**
         * 判断节点的文本信息是否是
         * @Desc: 从其他节点复制文字到另一个节点时部分浏览器(chrome)会自动包裹一个span标签，这样试用一下逻辑出来的就不是text节点二是span节点因此导致undefined的情况发生
         * @Notice: 此处逻辑应该拆分到 kityminder-core/core/data中去，单独增加一个对某个节点importJson的事件
         * @Editor: Naixor
         * @Date: 2015.9.16
         */
        function commitInputNode(node, text) {
            try {
                minder.decodeData('text', text).then(function(json) {
                    minder.importNode(node, json);
                    minder.refresh();
                    // minder._firePharse({
                    //     type: 'contentchange'
                    // });
                    // minder._interactChange();
                });
            } catch (e) {
                // 无法被转换成脑图节点则不处理
                if (e.toString() !== 'Error: Invalid local format') {
                    throw e;
                }
            }
        }

        function commitInputResult() {
            /**
             * @Desc: 进行如下处理：
             *             根据用户的输入判断是否生成新的节点
             *        fix #83 https://github.com/fex-team/kityminder-editor/issues/83
             * @Editor: Naixor
             * @Date: 2015.9.16
             */
            var textNodes = [].slice.call(receiverElement.childNodes);
            var node = minder.getSelectedNode();
            
            textNodes = commitInputText(textNodes);
            commitInputNode(node, textNodes);
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
                    //receiverElement.focus();
                    planed.timer = 0;
                });
            }
        }
    }

    return module.exports = InputRuntime;
});