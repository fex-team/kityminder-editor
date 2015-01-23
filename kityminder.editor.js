/*!
 * ====================================================
 * km-editor - v0.0.1 - 2015-01-22
 * https://github.com/fex-team/kityminder-editor
 * GitHub: https://github.com/fex-team/kityminder-editor 
 * Copyright (c) 2015 ; Licensed 
 * ====================================================
 */

(function () {
var _p = {
    r: function(index) {
        if (_p[index].inited) {
            return _p[index].value;
        }
        if (typeof _p[index].value === "function") {
            var module = {
                exports: {}
            }, returnValue = _p[index].value(null, module.exports, module);
            _p[index].inited = true;
            _p[index].value = returnValue;
            if (returnValue !== undefined) {
                return returnValue;
            } else {
                for (var key in module.exports) {
                    if (module.exports.hasOwnProperty(key)) {
                        _p[index].inited = true;
                        _p[index].value = module.exports;
                        return module.exports;
                    }
                }
            }
        } else {
            _p[index].inited = true;
            return _p[index].value;
        }
    }
};

//src/editor.js
_p[0] = {
    value: function(require, exports, module) {
        /**
     * 运行时
     */
        var runtimes = [];
        function assemble(runtime) {
            runtimes.push(runtime);
        }
        function KMEditor(selector) {
            this.selector = selector;
            for (var i = 0; i < runtimes.length; i++) {
                if (typeof runtimes[i] == "function") {
                    runtimes[i].call(this, this);
                }
            }
        }
        KMEditor.assemble = assemble;
        assemble(_p.r(5));
        assemble(_p.r(6));
        assemble(_p.r(10));
        assemble(_p.r(12));
        assemble(_p.r(7));
        assemble(_p.r(8));
        assemble(_p.r(11));
        assemble(_p.r(9));
        return module.exports = KMEditor;
    }
};

//src/expose-editor.js
/**
 * @fileOverview
 *
 * 打包暴露
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[1] = {
    value: function(require, exports, module) {
        var kityminder = window.kityminder = _p.r(54);
        return module.exports = kityminder.Editor = _p.r(0);
    }
};

//src/hotbox.js
_p[2] = {
    value: function(require, exports, module) {
        var HotBox = _p.r(18);
        return module.exports = HotBox;
    }
};

//src/lang.js
_p[3] = {
    value: function(require, exports, module) {}
};

//src/minder.js
_p[4] = {
    value: function(require, exports, module) {
        return module.exports = _p.r(54).Minder;
    }
};

//src/runtime/container.js
/**
 * @fileOverview
 *
 * 初始化编辑器的容器
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[5] = {
    value: function(require, exports, module) {
        /**
     * 最先执行的 Runtime，初始化编辑器容器
     */
        function ContainerRuntime() {
            var container = document.querySelector(this.selector);
            if (!container) throw new Error("Invalid selector: " + this.selector);
            // 这个类名用于给编辑器添加样式
            container.classList.add("km-editor");
            // 暴露容器给其他运行时使用
            this.container = container;
        }
        return module.exports = ContainerRuntime;
    }
};

//src/runtime/fsm.js
/**
 * @fileOverview
 *
 * 编辑器状态机
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[6] = {
    value: function(require, exports, module) {
        var Debug = _p.r(13);
        var debug = new Debug("fsm");
        function handlerConditionMatch(condition, when, exit, enter) {
            if (condition.when != when) return false;
            if (condition.enter != "*" && condition.enter != enter) return false;
            if (condition.exit != "*" && condition.exit != exit) return;
            return true;
        }
        function FSM(defaultState) {
            var currentState = defaultState;
            var BEFORE_ARROW = " - ";
            var AFTER_ARROW = " -> ";
            var handlers = [];
            /**
         * 状态跳转
         *
         * 会通知所有的状态跳转监视器
         *
         * @param  {string} newState  新状态名称
         * @param  {any} reason 跳转的原因，可以作为参数传递给跳转监视器
         */
            this.jump = function(newState, reason) {
                if (!reason) throw new Error("Please tell fsm the reason to jump");
                var oldState = currentState;
                var notify = [ oldState, newState ].concat([].slice.call(arguments, 1));
                var i, handler;
                // 跳转前
                for (i = 0; i < handlers.length; i++) {
                    handler = handlers[i];
                    if (handlerConditionMatch(handler.condition, "before", oldState, newState)) {
                        if (handler.apply(null, notify)) return;
                    }
                }
                currentState = newState;
                debug.log("[{0}] {1} -> {2}", reason, oldState, newState);
                // 跳转后
                for (i = 0; i < handlers.length; i++) {
                    handler = handlers[i];
                    if (handlerConditionMatch(handler.condition, "after", oldState, newState)) {
                        handler.apply(null, notify);
                    }
                }
                return currentState;
            };
            /**
         * 返回当前状态
         * @return {string}
         */
            this.state = function() {
                return currentState;
            };
            /**
         * 添加状态跳转监视器
         *
         * @param  {Function} listener
         *     监视函数，当状态跳转的时候，会接收三个参数
         *         * from - 跳转前的状态
         *         * to - 跳转后的状态
         *         * reason - 跳转的原因
         *
         * @param {string} condition
         *     监视的时机
         *         "* => *" （默认）
         *
         */
            this.when = function(condition, handler) {
                if (arguments.length == 1) {
                    handler = condition;
                    condition = "* -> *";
                }
                var when, resolved, exit, enter;
                resolved = condition.split(BEFORE_ARROW);
                if (resolved.length == 2) {
                    when = "before";
                } else {
                    resolved = condition.split(AFTER_ARROW);
                    if (resolved.length == 2) {
                        when = "after";
                    }
                }
                if (!when) throw new Error("Illegal fsm condition: " + condition);
                exit = resolved[0];
                enter = resolved[1];
                handler.condition = {
                    when: when,
                    exit: exit,
                    enter: enter
                };
                handlers.push(handler);
            };
        }
        function FSMRumtime() {
            this.fsm = new FSM("normal");
        }
        return module.exports = FSMRumtime;
    }
};

//src/runtime/hotbox.js
/**
 * @fileOverview
 *
 * 热盒 Runtime
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[7] = {
    value: function(require, exports, module) {
        var Hotbox = _p.r(2);
        function HotboxRuntime() {
            var fsm = this.fsm;
            var minder = this.minder;
            var receiver = this.receiver;
            var container = this.container;
            var hotbox = new Hotbox(container);
            fsm.when("normal -> hotbox", function(exit, enter, reason) {
                var node = minder.getSelectedNode();
                var position;
                if (node) {
                    var box = node.getRenderBox();
                    position = {
                        x: box.cx,
                        y: box.cy
                    };
                }
                hotbox.active("main", position);
            });
            fsm.when("normal -> normal", function(exit, enter, reason, e) {
                if (reason == "shortcut-handle") {
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
    }
};

//src/runtime/input.js
/**
 * @fileOverview
 *
 * 文本输入支持
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[8] = {
    value: function(require, exports, module) {
        _p.r(15);
        var Debug = _p.r(13);
        var debug = new Debug("input");
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
                fsm.when("* -> input", enterInputMode);
                fsm.when("input -> *", function(exit, enter, reason) {
                    switch (reason) {
                      case "input-commit":
                        return commitInputResult();

                      case "input-cancel":
                        return exitInputMode();
                    }
                });
                minder.on("beforemousedown", function() {
                    if (fsm.state() == "input") {
                        fsm.jump("normal", "input-commit");
                    }
                });
            }
            function setupReciverElement() {
                if (debug.flaged) {
                    receiverElement.classList.add("debug");
                }
                receiverElement.onmousedown = function(e) {
                    e.stopPropagation();
                };
                minder.on("layoutallfinish viewchange viewchanged selectionchange", function(e) {
                    if (e.type == "viewchange" && fsm.state() != "input") return;
                    updatePosition();
                });
                updatePosition();
            }
            function setupHotbox() {
                hotbox.state("main").button({
                    position: "center",
                    label: "编辑",
                    key: "F2",
                    enable: function() {
                        return minder.queryCommandState("text") != -1;
                    },
                    action: editText
                });
            }
            function editText() {
                var text = minder.queryCommandValue("text");
                if ("innerText" in receiverElement) {
                    receiverElement.innerText = text;
                } else {
                    receiverElement.innerHTML = text && text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
                }
                fsm.jump("input", "input-request");
                receiver.selectAll();
            }
            function enterInputMode() {
                var node = minder.getSelectedNode();
                if (node) {
                    var fontSize = node.getData("font-size") || node.getStyle("font-size");
                    receiverElement.style.fontSize = fontSize + "px";
                    receiverElement.style.minWidth = 0;
                    receiverElement.style.minWidth = receiverElement.clientWidth + "px";
                    receiverElement.classList.add("input");
                    receiverElement.focus();
                }
            }
            function commitInputResult() {
                var text = receiverElement.innerText;
                minder.execCommand("text", text.replace(/^\n*|\n*$/g, ""));
                exitInputMode();
            }
            function exitInputMode() {
                receiverElement.classList.remove("input");
                receiver.selectAll();
            }
            function updatePosition() {
                var cache = updatePosition;
                cache.fixedX = cache.fixedX || 0;
                cache.fixedY = cache.fixedY || 0;
                var focusNode = minder.getSelectedNode() || minder.getRoot();
                if (!focusNode) return;
                var box = focusNode.getRenderBox("TextRenderer");
                receiverElement.style.left = Math.round(box.x) + "px";
                receiverElement.style.top = Math.round(box.y) + "px";
                receiverElement.focus();
            }
        }
        return module.exports = InputRuntime;
    }
};

//src/runtime/jumping.js
/**
 * @fileOverview
 *
 * 根据按键控制状态机的跳转
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[9] = {
    value: function(require, exports, module) {
        var Hotbox = _p.r(2);
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
            receiver.listen("normal", function(e) {
                // normal -> hotbox
                if (e.type == "keydown" && e.is("Space")) {
                    e.preventDefault();
                    return fsm.jump("hotbox", "space-trigger");
                }
                // normal -> input
                if (e.type == "keydown" && isIntendToInput(e)) {
                    if (minder.getSelectedNode()) {
                        return fsm.jump("input", "user-input");
                    } else {
                        receiverElement.innerHTML = "";
                    }
                }
                // normal -> normal
                if (e.type == "keydown") {
                    return fsm.jump("normal", "shortcut-handle", e);
                }
            });
            // hotbox -> normal
            receiver.listen("hotbox", function(e) {
                e.preventDefault();
                var handleResult = hotbox.dispatch(e);
                if (handleResult == "back" && hotbox.state() == Hotbox.STATE_IDLE) {
                    return fsm.jump("normal", "hotbox-idle");
                }
            });
            // input => normal
            receiver.listen("input", function(e) {
                if (e.type == "keydown") {
                    if (e.is("Enter")) {
                        e.preventDefault();
                        return fsm.jump("normal", "input-commit");
                    }
                    if (e.is("Esc")) {
                        e.preventDefault();
                        return fsm.jump("normal", "input-cancel");
                    }
                    if (e.is("Tab") || e.is("Shift + Tab")) {
                        e.preventDefault();
                    }
                }
            });
        }
        return module.exports = JumpingRuntime;
    }
};

//src/runtime/minder.js
/**
 * @fileOverview
 *
 * 脑图示例运行时
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[10] = {
    value: function(require, exports, module) {
        var Minder = _p.r(4);
        function MinderRuntime() {
            // 不使用 kityminder 的按键处理，由 ReceiverRuntime 统一处理
            var minder = new Minder({
                enableKeyReceiver: false,
                enableAnimation: false
            });
            // 渲染，初始化
            minder.renderTo(this.selector);
            minder.setTheme(null);
            minder.select(minder.getRoot(), true);
            minder.execCommand("text", "中心主题");
            // 导出给其它 Runtime 使用
            this.minder = minder;
        }
        return module.exports = MinderRuntime;
    }
};

//src/runtime/node.js
_p[11] = {
    value: function(require, exports, module) {
        function NodeRuntime() {
            var runtime = this;
            var minder = this.minder;
            var hotbox = this.hotbox;
            var fsm = this.fsm;
            var main = hotbox.state("main");
            var buttons = [ "前移:Alt+Up:ArrangeUp", "下级:Tab:AppendChildNode", "同级:Enter:AppendSiblingNode", "后移:Alt+Down:ArrangeDown", "删除:Delete|Backspace:RemoveNode", "归纳:Shift+Tab|Shift+Insert:AppendParentNode" ];
            buttons.forEach(function(button) {
                var parts = button.split(":");
                var label = parts.shift();
                var key = parts.shift();
                var command = parts.shift();
                main.button({
                    position: "ring",
                    label: label,
                    key: key,
                    action: function() {
                        if (command.indexOf("Append") === 0) {
                            minder.execCommand(command, "新主题");
                            // provide in input runtime
                            runtime.editText();
                        } else {
                            minder.execCommand(command);
                            fsm.jump("normal", "command-executed");
                        }
                    },
                    enable: function() {
                        return minder.queryCommandState(command) != -1;
                    }
                });
            });
        }
        return module.exports = NodeRuntime;
    }
};

//src/runtime/receiver.js
/**
 * @fileOverview
 *
 * 键盘事件接收/分发器
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[12] = {
    value: function(require, exports, module) {
        var key = _p.r(16);
        function ReceiverRuntime() {
            var fsm = this.fsm;
            var minder = this.minder;
            // 接收事件的 div
            var element = document.createElement("div");
            element.contentEditable = true;
            element.classList.add("receiver");
            element.onkeydown = element.onkeypress = element.onkeyup = dispatchKeyEvent;
            this.container.appendChild(element);
            // receiver 对象
            var receiver = {
                element: element,
                selectAll: function() {
                    // 保证有被选中的
                    if (!element.innerHTML) element.innerHTML = "&nbsp;";
                    var range = document.createRange();
                    var selection = window.getSelection();
                    range.selectNodeContents(element);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    element.focus();
                }
            };
            receiver.selectAll();
            minder.on("beforemousedown", receiver.selectAll);
            // 侦听器，接收到的事件会派发给所有侦听器
            var listeners = [];
            // 侦听指定状态下的事件，如果不传 state，侦听所有状态
            receiver.listen = function(state, listener) {
                if (arguments.length == 1) {
                    listener = state;
                    state = "*";
                }
                listener.notifyState = state;
                listeners.push(listener);
            };
            function dispatchKeyEvent(e) {
                e.is = function(keyExpression) {
                    var subs = keyExpression.split("|");
                    for (var i = 0; i < subs.length; i++) {
                        if (key.is(this, subs[i])) return true;
                    }
                    return false;
                };
                var listener, jumpState;
                for (var i = 0; i < listeners.length; i++) {
                    listener = listeners[i];
                    // 忽略不在侦听状态的侦听器
                    if (listener.notifyState != "*" && listener.notifyState != fsm.state()) {
                        continue;
                    }
                    /**
                 *
                 * 对于所有的侦听器，只允许一种处理方式：跳转状态。
                 * 如果侦听器确定要跳转，则返回要跳转的状态。
                 * 每个事件只允许一个侦听器进行状态跳转
                 * 跳转动作由侦听器自行完成（因为可能需要在跳转时传递 reason），返回跳转结果即可。
                 * 比如：
                 *
                 * ```js
                 *  receiver.listen('normal', function(e) {
                 *      if (isSomeReasonForJumpState(e)) {
                 *          return fsm.jump('newstate', e);
                 *      }
                 *  });
                 * ```
                 */
                    if (listener.call(null, e)) {
                        return;
                    }
                }
            }
            this.receiver = receiver;
        }
        return module.exports = ReceiverRuntime;
    }
};

//src/tool/debug.js
/**
 * @fileOverview
 *
 * 支持各种调试后门
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[13] = {
    value: function(require, exports, module) {
        var format = _p.r(14);
        function noop() {}
        function stringHash(str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash += str.charCodeAt(i);
            }
            return hash;
        }
        /* global console */
        function Debug(flag) {
            var debugMode = this.flaged = window.location.search.indexOf(flag) != -1;
            if (debugMode) {
                var h = stringHash(flag) % 360;
                var flagStyle = format("background: hsl({0}, 50%, 80%); " + "color: hsl({0}, 100%, 30%); " + "padding: 2px 3px; " + "margin: 1px 3px 0 0;" + "border-radius: 2px;", h);
                var textStyle = "background: none; color: black;";
                this.log = function() {
                    var output = format.apply(null, arguments);
                    console.log(format("%c{0}%c{1}", flag, output), flagStyle, textStyle);
                };
            } else {
                this.log = noop;
            }
        }
        return module.exports = Debug;
    }
};

//src/tool/format.js
_p[14] = {
    value: function(require, exports, module) {
        function format(template, args) {
            if (typeof args != "object") {
                args = [].slice.call(arguments, 1);
            }
            return String(template).replace(/\{(\w+)\}/gi, function(match, $key) {
                return args[$key] || $key;
            });
        }
        return module.exports = format;
    }
};

//src/tool/innertext.js
/**
 * @fileOverview
 *
 *
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[15] = {
    value: function(require, exports, module) {
        if (!("innerText" in document.createElement("a")) && "getSelection" in window) {
            HTMLElement.prototype.__defineGetter__("innerText", function() {
                var selection = window.getSelection(), ranges = [], str, i;
                // Save existing selections.
                for (i = 0; i < selection.rangeCount; i++) {
                    ranges[i] = selection.getRangeAt(i);
                }
                // Deselect everything.
                selection.removeAllRanges();
                // Select `el` and all child nodes.
                // 'this' is the element .innerText got called on
                selection.selectAllChildren(this);
                // Get the string representation of the selected nodes.
                str = selection.toString();
                // Deselect everything. Again.
                selection.removeAllRanges();
                // Restore all formerly existing selections.
                for (i = 0; i < ranges.length; i++) {
                    selection.addRange(ranges[i]);
                }
                // Oh look, this is what we wanted.
                // String representation of the element, close to as rendered.
                return str;
            });
            HTMLElement.prototype.__defineSetter__("innerText", function(text) {
                this.innerHTML = text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
            });
        }
    }
};

//src/tool/key.js
_p[16] = {
    value: function(require, exports, module) {
        return module.exports = _p.r(19);
    }
};

//lib/hotbox/src/expose.js
_p[17] = {
    value: function(require, exports, module) {
        module.exports = window.HotBox = _p.r(18);
    }
};

//lib/hotbox/src/hotbox.js
_p[18] = {
    value: function(require, exports, module) {
        var key = _p.r(19);
        var KeyControl = _p.r(20);
        /**** Dom Utils ****/
        function createElement(name) {
            return document.createElement(name);
        }
        function setElementAttribute(element, name, value) {
            element.setAttribute(name, value);
        }
        function getElementAttribute(element, name) {
            return element.getAttribute(name);
        }
        function addElementClass(element, name) {
            element.classList.add(name);
        }
        function removeElementClass(element, name) {
            element.classList.remove(name);
        }
        function appendChild(parent, child) {
            parent.appendChild(child);
        }
        /*******************/
        var IDLE = HotBox.STATE_IDLE = "idle";
        var div = "div";
        /**
     * Simple Formatter
     */
        function format(template, args) {
            if (typeof args != "object") {
                args = [].slice.apply(arguments, 1);
            }
            return String(template).replace(/\{(\w+)\}/g, function(match, name) {
                return args[name] || match;
            });
        }
        /**
     * Hot Box Class
     */
        function HotBox($container) {
            if (typeof $container == "string") {
                $container = document.querySelector($container);
            }
            if (!$container || !($container instanceof HTMLElement)) {
                throw new Error("No container or not invalid container for hot box");
            }
            // 创建 HotBox Dom 解构
            var $hotBox = createElement(div);
            addElementClass($hotBox, "hotbox");
            appendChild($container, $hotBox);
            // 保存 Dom 解构和父容器
            this.$element = $hotBox;
            this.$container = $container;
            // 已定义的状态（string => HotBoxState）
            var _states = {};
            // 主状态（HotBoxState）
            var _mainState = null;
            // 当前状态（HotBoxState）
            var _currentState = IDLE;
            // 当前状态堆栈
            var _stateStack = [];
            // 实例引用
            var _this = this;
            var _controler;
            /**
         * Controller: {
         *     constructor(hotbox: HotBox),
         *     active: () => void
         * }
         */
            function _control(Controller) {
                if (_controler) {
                    _controler.active();
                    return;
                }
                Controller = Controller || KeyControl;
                _controler = new Controller(_this);
                _controler.active();
                $hotBox.onmousedown = function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                };
                return _this;
            }
            function _dispatchKey(e) {
                var type = e.type.toLowerCase();
                e.keyHash = key.hash(e);
                e.isKey = function(keyExpression) {
                    if (!keyExpression) return false;
                    var expressions = keyExpression.split(/\s*\|\s*/);
                    while (expressions.length) {
                        if (e.keyHash == key.hash(expressions.shift())) return true;
                    }
                    return false;
                };
                e[type] = true;
                // Boot: keyup and activeKey pressed on IDLE, active main state.
                if (e.keydown && _this.activeKey && e.isKey(_this.activeKey) && _currentState == IDLE && _mainState) {
                    _activeState("main", {
                        x: $container.clientWidth / 2,
                        y: $container.clientHeight / 2
                    });
                    return;
                }
                var handleState = _currentState == IDLE ? _mainState : _currentState;
                if (handleState) {
                    var handleResult = handleState.handleKeyEvent(e);
                    if (typeof _this.onkeyevent == "function") {
                        e.handleResult = handleResult;
                        _this.onkeyevent(e, handleResult);
                    }
                    return handleResult;
                }
                return null;
            }
            function _addState(name) {
                if (!name) return _currentState;
                if (name == IDLE) {
                    throw new Error("Can not define or use the `idle` state.");
                }
                _states[name] = _states[name] || new HotBoxState(this, name);
                if (name == "main") {
                    _mainState = _states[name];
                }
                return _states[name];
            }
            function _activeState(name, position) {
                // 回到 IDLE
                if (name == IDLE) {
                    if (_currentState != IDLE) {
                        _stateStack.shift().deactive();
                        _stateStack = [];
                    }
                    _currentState = IDLE;
                } else if (name == "back") {
                    if (_currentState != IDLE) {
                        _currentState.deactive();
                        _stateStack.shift();
                        _currentState = _stateStack[0];
                        if (_currentState) {
                            _currentState.active();
                        } else {
                            _currentState = "idle";
                        }
                    }
                } else {
                    if (_currentState != IDLE) {
                        _currentState.deactive();
                    }
                    var newState = _states[name];
                    _stateStack.unshift(newState);
                    if (typeof _this.position == "function") {
                        position = _this.position(position);
                    }
                    newState.active(position);
                    _currentState = newState;
                }
            }
            this.control = _control;
            this.state = _addState;
            this.active = _activeState;
            this.dispatch = _dispatchKey;
            this.activeKey = "space";
            this.actionKey = "space";
        }
        /**
     * 表示热盒某个状态，包含这些状态需要的 Dom 对象
     */
        function HotBoxState(hotBox, stateName) {
            var BUTTON_SELECTED_CLASS = "selected";
            var BUTTON_PRESSED_CLASS = "pressed";
            var STATE_ACTIVE_CLASS = "active";
            // 状态容器
            var $state = createElement(div);
            // 四种可见的按钮容器
            var $center = createElement(div);
            var $ring = createElement(div);
            var $ringShape = createElement("div");
            var $top = createElement(div);
            var $bottom = createElement(div);
            // 添加 CSS 类
            addElementClass($state, "state");
            addElementClass($state, stateName);
            addElementClass($center, "center");
            addElementClass($ring, "ring");
            addElementClass($ringShape, "ring-shape");
            addElementClass($top, "top");
            addElementClass($bottom, "bottom");
            // 摆放容器
            appendChild(hotBox.$element, $state);
            appendChild($state, $center);
            appendChild($state, $ring);
            appendChild($ring, $ringShape);
            appendChild($state, $top);
            appendChild($state, $bottom);
            // 记住状态名称
            this.name = stateName;
            // 五种按钮：中心，圆环，上栏，下栏，幕后
            var buttons = {
                center: null,
                ring: [],
                top: [],
                bottom: [],
                behind: []
            };
            var allButtons = [];
            var selectedButton = null;
            var pressedButton = null;
            var stateActived = false;
            // 布局，添加按钮后，标记需要布局
            var needLayout = true;
            function layout() {
                var radius = buttons.ring.length * 15;
                layoutRing(radius);
                layoutTop(radius);
                layoutBottom(radius);
                indexPosition();
                needLayout = false;
                function layoutRing(radius) {
                    var ring = buttons.ring;
                    var step = 2 * Math.PI / ring.length;
                    if (buttons.center) {
                        buttons.center.indexedPosition = [ 0, 0 ];
                    }
                    $ringShape.style.marginLeft = $ringShape.style.marginTop = -radius + "px";
                    $ringShape.style.width = $ringShape.style.height = radius + radius + "px";
                    var $button, angle, x, y;
                    for (var i = 0; i < ring.length; i++) {
                        $button = ring[i].$button;
                        angle = step * i - Math.PI / 2;
                        x = radius * Math.cos(angle);
                        y = radius * Math.sin(angle);
                        ring[i].indexedPosition = [ x, y ];
                        $button.style.left = x + "px";
                        $button.style.top = y + "px";
                    }
                }
                function layoutTop(radius) {
                    var xOffset = -$top.clientWidth / 2;
                    var yOffset = -radius * 2 - $top.clientHeight / 2;
                    $top.style.marginLeft = xOffset + "px";
                    $top.style.marginTop = yOffset + "px";
                    buttons.top.forEach(function(topButton) {
                        var $button = topButton.$button;
                        topButton.indexedPosition = [ xOffset + $button.offsetLeft + $button.clientWidth / 2, yOffset ];
                    });
                }
                function layoutBottom(radius) {
                    var xOffset = -$bottom.clientWidth / 2;
                    var yOffset = radius * 2 - $bottom.clientHeight / 2;
                    $bottom.style.marginLeft = xOffset + "px";
                    $bottom.style.marginTop = yOffset + "px";
                    buttons.bottom.forEach(function(bottomButton) {
                        var $button = bottomButton.$button;
                        bottomButton.indexedPosition = [ xOffset + $button.offsetLeft + $button.clientWidth / 2, yOffset ];
                    });
                }
                function indexPosition() {
                    var positionedButtons = allButtons.filter(function(button) {
                        return button.indexedPosition;
                    });
                    positionedButtons.forEach(findNeightbour);
                    function findNeightbour(button) {
                        var neighbor = {};
                        var coef = 0;
                        var minCoef = {};
                        var homePosition = button.indexedPosition;
                        var candidatePosition, dx, dy, ds;
                        var possible, dir;
                        var abs = Math.abs;
                        positionedButtons.forEach(function(candidate) {
                            if (button == candidate) return;
                            candidatePosition = candidate.indexedPosition;
                            possible = [];
                            dx = candidatePosition[0] - homePosition[0];
                            dy = candidatePosition[1] - homePosition[1];
                            ds = Math.sqrt(dx * dx + dy * dy);
                            if (abs(dx) > 2) {
                                possible.push(dx > 0 ? "right" : "left");
                                possible.push(ds + abs(dy));
                            }
                            if (abs(dy) > 2) {
                                possible.push(dy > 0 ? "down" : "up");
                                possible.push(ds + abs(dx));
                            }
                            while (possible.length) {
                                dir = possible.shift();
                                coef = possible.shift();
                                if (!neighbor[dir] || coef < minCoef[dir]) {
                                    neighbor[dir] = candidate;
                                    minCoef[dir] = coef;
                                }
                            }
                        });
                        button.neighbor = neighbor;
                    }
                }
            }
            function alwaysEnable() {
                return true;
            }
            // 为状态创建按钮
            function createButton(option) {
                var $button = createElement(div);
                addElementClass($button, "button");
                var render = option.render || defaultButtonRender;
                $button.innerHTML = render(format, option);
                switch (option.position) {
                  case "center":
                    appendChild($center, $button);
                    break;

                  case "ring":
                    appendChild($ring, $button);
                    break;

                  case "top":
                    appendChild($top, $button);
                    break;

                  case "bottom":
                    appendChild($bottom, $button);
                    break;
                }
                return {
                    action: option.action,
                    enable: option.enable || alwaysEnable,
                    key: option.key,
                    next: option.next,
                    label: option.label,
                    data: option.data || null,
                    $button: $button
                };
            }
            // 默认按钮渲染
            function defaultButtonRender(format, option) {
                return format('<span class="label">{label}</span><span class="key">{key}</span>', {
                    label: option.label,
                    key: option.key && option.key.split("|")[0]
                });
            }
            // 为当前状态添加按钮
            this.button = function(option) {
                var button = createButton(option);
                if (option.position == "center") {
                    buttons.center = button;
                } else if (buttons[option.position]) {
                    buttons[option.position].push(button);
                }
                allButtons.push(button);
                needLayout = true;
            };
            function activeState(position) {
                position = position || {
                    x: hotBox.$container.clientWidth / 2,
                    y: hotBox.$container.clientHeight / 2
                };
                if (position) {
                    $state.style.left = position.x + "px";
                    $state.style.top = position.y + "px";
                }
                allButtons.forEach(function(button) {
                    var $button = button.$button;
                    if ($button) {
                        $button.classList[button.enable() ? "add" : "remove"]("enabled");
                    }
                });
                addElementClass($state, STATE_ACTIVE_CLASS);
                if (needLayout) {
                    layout();
                }
                if (!selectedButton) {
                    select(buttons.center || buttons.ring[0] || buttons.top[0] || buttons.bottom[0]);
                }
                stateActived = true;
            }
            function deactiveState() {
                removeElementClass($state, STATE_ACTIVE_CLASS);
                select(null);
                stateActived = false;
            }
            // 激活当前状态
            this.active = activeState;
            // 反激活当前状态
            this.deactive = deactiveState;
            function press(button) {
                if (pressedButton && pressedButton.$button) {
                    removeElementClass(pressedButton.$button, BUTTON_PRESSED_CLASS);
                }
                pressedButton = button;
                if (pressedButton && pressedButton.$button) {
                    addElementClass(pressedButton.$button, BUTTON_PRESSED_CLASS);
                }
            }
            function select(button) {
                if (selectedButton && selectedButton.$button) {
                    if (selectedButton.$button) {
                        removeElementClass(selectedButton.$button, BUTTON_SELECTED_CLASS);
                    }
                }
                selectedButton = button;
                if (selectedButton && selectedButton.$button) {
                    addElementClass(selectedButton.$button, BUTTON_SELECTED_CLASS);
                }
            }
            $state.onmouseup = function(e) {
                if (e.button) return;
                var target = e.target;
                while (target && target != $state) {
                    if (target.classList.contains("button")) {
                        allButtons.forEach(function(button) {
                            if (button.$button == target) {
                                execute(button);
                            }
                        });
                    }
                    target = target.parentNode;
                }
            };
            this.handleKeyEvent = function(e) {
                var handleResult = null;
                if (e.keydown) {
                    allButtons.forEach(function(button) {
                        if (e.isKey(button.key)) {
                            if (stateActived || hotBox.hintDeactiveMainState) {
                                select(button);
                                press(button);
                                handleResult = "buttonpress";
                            } else {
                                execute(button);
                                handleResult = "execute";
                            }
                            e.preventDefault();
                            e.stopPropagation();
                            if (!stateActived && hotBox.hintDeactiveMainState) {
                                hotBox.active(stateName);
                            }
                        }
                    });
                    if (stateActived) {
                        if (e.isKey("esc")) {
                            if (pressedButton) {
                                if (!e.isKey(pressedButton.key)) {
                                    // the button is not esc
                                    press(null);
                                }
                            } else {
                                hotBox.active("back");
                            }
                            return "back";
                        }
                        [ "up", "down", "left", "right" ].forEach(function(dir) {
                            if (!e.isKey(dir)) return;
                            if (!selectedButton) {
                                select(buttons.center || buttons.ring[0] || buttons.top[0] || buttons.bottom[0]);
                                return;
                            }
                            var neighbor = selectedButton.neighbor[dir];
                            while (neighbor && !neighbor.enable()) {
                                neighbor = neighbor.neighbor[dir];
                            }
                            if (neighbor) {
                                select(neighbor);
                            }
                            handleResult = "navigate";
                        });
                        if (e.isKey("space") && selectedButton) {
                            press(selectedButton);
                            handleResult = "buttonpress";
                        } else if (pressedButton && pressedButton != selectedButton) {
                            press(null);
                            handleResult = "selectcancel";
                        }
                    }
                } else if (e.keyup && (stateActived || !hotBox.hintDeactiveMainState)) {
                    if (pressedButton) {
                        if (e.isKey("space") && selectedButton == pressedButton || e.isKey(pressedButton.key)) {
                            execute(pressedButton);
                            e.preventDefault();
                            e.stopPropagation();
                            handleResult = "execute";
                        }
                    }
                }
                return handleResult;
            };
            function execute(button) {
                if (button) {
                    if (!button.enable || button.enable()) {
                        if (button.action) button.action(button);
                        hotBox.active(button.next || IDLE);
                    }
                    press(null);
                    select(null);
                }
            }
        }
        module.exports = HotBox;
    }
};

//lib/hotbox/src/key.js
_p[19] = {
    value: function(require, exports, module) {
        var keymap = _p.r(21);
        var CTRL_MASK = 4096;
        var ALT_MASK = 8192;
        var SHIFT_MASK = 16384;
        function hash(unknown) {
            if (typeof unknown == "string") {
                return hashKeyExpression(unknown);
            }
            return hashKeyEvent(unknown);
        }
        function is(a, b) {
            return a && b && hash(a) == hash(b);
        }
        exports.hash = hash;
        exports.is = is;
        function hashKeyEvent(keyEvent) {
            var hashCode = 0;
            if (keyEvent.ctrlKey || keyEvent.metaKey) {
                hashCode |= CTRL_MASK;
            }
            if (keyEvent.altKey) {
                hashCode |= ALT_MASK;
            }
            if (keyEvent.shiftKey) {
                hashCode |= SHIFT_MASK;
            }
            // Shift, Control, Alt KeyCode ignored.
            if ([ 16, 17, 18, 91 ].indexOf(keyEvent.keyCode) == -1) {
                hashCode |= keyEvent.keyCode;
            }
            return hashCode;
        }
        function hashKeyExpression(keyExpression) {
            var hashCode = 0;
            keyExpression.toLowerCase().split(/\s*\+\s*/).forEach(function(name) {
                switch (name) {
                  case "ctrl":
                  case "cmd":
                    hashCode |= CTRL_MASK;
                    break;

                  case "alt":
                    hashCode |= ALT_MASK;
                    break;

                  case "shift":
                    hashCode |= SHIFT_MASK;
                    break;

                  default:
                    hashCode |= keymap[name];
                }
            });
            return hashCode;
        }
    }
};

//lib/hotbox/src/keycontrol.js
_p[20] = {
    value: function(require, exports, module) {
        var key = _p.r(19);
        var FOCUS_CLASS = "hotbox-focus";
        var RECEIVER_CLASS = "hotbox-key-receiver";
        function KeyControl(hotbox) {
            var _this = this;
            var _receiver;
            var _actived = true;
            var _receiverIsSelfCreated = false;
            var $container = hotbox.$container;
            _createReceiver();
            _bindReceiver();
            _bindContainer();
            _active();
            function _createReceiver() {
                _receiver = document.createElement("input");
                _receiver.classList.add(RECEIVER_CLASS);
                $container.appendChild(_receiver);
                _receiverIsSelfCreated = true;
            }
            function _bindReceiver() {
                _receiver.onkeyup = _handle;
                _receiver.onkeypress = _handle;
                _receiver.onkeydown = _handle;
                _receiver.onfocus = _active;
                _receiver.onblur = _deactive;
                if (_receiverIsSelfCreated) {
                    _receiver.oninput = function(e) {
                        _receiver.value = null;
                    };
                }
            }
            function _bindContainer() {
                $container.onmousedown = function(e) {
                    _active();
                    e.preventDefault();
                };
            }
            function _handle(keyEvent) {
                if (!_actived) return;
                hotbox.dispatch(keyEvent);
            }
            function _active() {
                _receiver.select();
                _receiver.focus();
                _actived = true;
                $container.classList.add(FOCUS_CLASS);
            }
            function _deactive() {
                _receiver.blur();
                _actived = false;
                $container.classList.remove(FOCUS_CLASS);
            }
            this.handle = _handle;
            this.active = _active;
            this.deactive = _deactive;
        }
        module.exports = KeyControl;
    }
};

//lib/hotbox/src/keymap.js
_p[21] = {
    value: function(require, exports, module) {
        var keymap = {
            Shift: 16,
            Control: 17,
            Alt: 18,
            CapsLock: 20,
            BackSpace: 8,
            Tab: 9,
            Enter: 13,
            Esc: 27,
            Space: 32,
            PageUp: 33,
            PageDown: 34,
            End: 35,
            Home: 36,
            Insert: 45,
            Left: 37,
            Up: 38,
            Right: 39,
            Down: 40,
            Direction: {
                37: 1,
                38: 1,
                39: 1,
                40: 1
            },
            Del: 46,
            NumLock: 144,
            Cmd: 91,
            CmdFF: 224,
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123,
            "`": 192,
            "=": 187,
            "-": 189,
            "/": 191,
            ".": 190
        };
        // 小写适配
        for (var key in keymap) {
            if (keymap.hasOwnProperty(key)) {
                keymap[key.toLowerCase()] = keymap[key];
            }
        }
        var aKeyCode = 65;
        var aCharCode = "a".charCodeAt(0);
        // letters
        "abcdefghijklmnopqrstuvwxyz".split("").forEach(function(letter) {
            keymap[letter] = aKeyCode + (letter.charCodeAt(0) - aCharCode);
        });
        // numbers
        var n = 9;
        do {
            keymap[n.toString()] = n + 48;
        } while (--n);
        module.exports = keymap;
    }
};

//lib/km-core/src/connect/arc.js
/**
 * @fileOverview
 *
 * 圆弧连线
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[22] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var connect = _p.r(31);
        var connectMarker = new kity.Marker().pipe(function() {
            var r = 7;
            var dot = new kity.Circle(r - 1);
            this.addShape(dot);
            this.setRef(r - 1, 0).setViewBox(-r, -r, r + r, r + r).setWidth(r).setHeight(r);
            this.dot = dot;
            this.node.setAttribute("markerUnits", "userSpaceOnUse");
        });
        connect.register("arc", function(node, parent, connection, width, color) {
            var box = node.getLayoutBox(), pBox = parent.getLayoutBox();
            var start, end, vector;
            var abs = Math.abs;
            var pathData = [];
            var side = box.x > pBox.x ? "right" : "left";
            node.getMinder().getPaper().addResource(connectMarker);
            start = new kity.Point(pBox.cx, pBox.cy);
            end = side == "left" ? new kity.Point(box.right + 2, box.cy) : new kity.Point(box.left - 2, box.cy);
            vector = kity.Vector.fromPoints(start, end);
            pathData.push("M", start);
            pathData.push("A", abs(vector.x), abs(vector.y), 0, 0, vector.x * vector.y > 0 ? 0 : 1, end);
            connection.setMarker(connectMarker);
            connectMarker.dot.fill(color);
            connection.setPathData(pathData);
        });
    }
};

//lib/km-core/src/connect/bezier.js
/**
 * @fileOverview
 *
 * 提供折线相连的方法
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[23] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var connect = _p.r(31);
        connect.register("bezier", function(node, parent, connection) {
            // 连线起点和终点
            var po = parent.getLayoutVertexOut(), pi = node.getLayoutVertexIn();
            // 连线矢量和方向
            var v = parent.getLayoutVectorOut().normalize();
            var r = Math.round;
            var abs = Math.abs;
            var pathData = [];
            pathData.push("M", r(po.x), r(po.y));
            if (abs(v.x) > abs(v.y)) {
                // x - direction
                var hx = (pi.x + po.x) / 2;
                pathData.push("C", hx, po.y, hx, pi.y, pi.x, pi.y);
            } else {
                // y - direction
                var hy = (pi.y + po.y) / 2;
                pathData.push("C", po.x, hy, pi.x, hy, pi.x, pi.y);
            }
            connection.setMarker(null);
            connection.setPathData(pathData);
        });
    }
};

//lib/km-core/src/connect/fish-bone-master.js
/**
 * @fileOverview
 *
 * 鱼骨头主干连线
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[24] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var connect = _p.r(31);
        connect.register("fish-bone-master", function(node, parent, connection) {
            var pout = parent.getLayoutVertexOut(), pin = node.getLayoutVertexIn();
            var abs = Math.abs;
            var dy = abs(pout.y - pin.y), dx = abs(pout.x - pin.x);
            var pathData = [];
            pathData.push("M", pout.x, pout.y);
            pathData.push("h", dx - dy);
            pathData.push("L", pin.x, pin.y);
            connection.setMarker(null);
            connection.setPathData(pathData);
        });
    }
};

//lib/km-core/src/connect/l.js
/**
 * @fileOverview
 *
 * "L" 连线
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[25] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var connect = _p.r(31);
        connect.register("l", function(node, parent, connection) {
            var po = parent.getLayoutVertexOut();
            var pi = node.getLayoutVertexIn();
            var vo = parent.getLayoutVectorOut();
            var pathData = [];
            var r = Math.round, abs = Math.abs;
            pathData.push("M", po.round());
            if (abs(vo.x) > abs(vo.y)) {
                pathData.push("H", r(pi.x));
            } else {
                pathData.push("V", pi.y);
            }
            pathData.push("L", pi);
            connection.setPathData(pathData);
        });
    }
};

//lib/km-core/src/connect/poly.js
/**
 * @fileOverview
 *
 * 提供折线相连的方法
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[26] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var connect = _p.r(31);
        connect.register("poly", function(node, parent, connection, width) {
            // 连线起点和终点
            var po = parent.getLayoutVertexOut(), pi = node.getLayoutVertexIn();
            // 连线矢量和方向
            var v = parent.getLayoutVectorOut().normalize();
            var r = Math.round;
            var abs = Math.abs;
            var pathData = [];
            pathData.push("M", r(po.x), r(po.y));
            switch (true) {
              case abs(v.x) > abs(v.y) && v.x < 0:
                // left
                pathData.push("h", -parent.getStyle("margin-left"));
                pathData.push("v", pi.y - po.y);
                pathData.push("H", pi.x);
                break;

              case abs(v.x) > abs(v.y) && v.x >= 0:
                // right
                pathData.push("h", parent.getStyle("margin-right"));
                pathData.push("v", pi.y - po.y);
                pathData.push("H", pi.x);
                break;

              case abs(v.x) <= abs(v.y) && v.y < 0:
                // top
                pathData.push("v", -parent.getStyle("margin-top"));
                pathData.push("h", pi.x - po.x);
                pathData.push("V", pi.y);
                break;

              case abs(v.x) <= abs(v.y) && v.y >= 0:
                // bottom
                pathData.push("v", parent.getStyle("margin-bottom"));
                pathData.push("h", pi.x - po.x);
                pathData.push("V", pi.y);
                break;
            }
            connection.setMarker(null);
            connection.setPathData(pathData);
        });
    }
};

//lib/km-core/src/connect/under.js
/**
 * @fileOverview
 *
 * 下划线连线
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[27] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var connect = _p.r(31);
        connect.register("under", function(node, parent, connection, width, color) {
            var box = node.getLayoutBox(), pBox = parent.getLayoutBox();
            var start, end, vector;
            var abs = Math.abs;
            var pathData = [];
            var side = box.x > pBox.x ? "right" : "left";
            var radius = node.getStyle("connect-radius");
            var underY = box.bottom + 3;
            var startY = parent.getType() == "sub" ? pBox.bottom + 3 : pBox.cy;
            var p1, p2, p3, mx;
            if (side == "right") {
                p1 = new kity.Point(pBox.right, startY);
                p2 = new kity.Point(box.left - 10, underY);
                p3 = new kity.Point(box.right, underY);
            } else {
                p1 = new kity.Point(pBox.left, startY);
                p2 = new kity.Point(box.right + 10, underY);
                p3 = new kity.Point(box.left, underY);
            }
            mx = (p1.x + p2.x) / 2;
            pathData.push("M", p1);
            pathData.push("C", mx, p1.y, mx, p2.y, p2);
            pathData.push("L", p3);
            connection.setMarker(null);
            connection.setPathData(pathData);
        });
    }
};

//lib/km-core/src/core/animate.js
/**
 * @fileOverview
 *
 * 动画控制
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[28] = {
    value: function(require, exports, module) {
        var Minder = _p.r(39);
        var animateDefaultOptions = {
            enableAnimation: true,
            layoutAnimationDuration: 300,
            viewAnimationDuration: 100,
            zoomAnimationDuration: 300
        };
        var resoredAnimationOptions = {};
        Minder.registerInitHook(function() {
            this.setDefaultOptions(animateDefaultOptions);
            if (!this.getOption("enableAnimation")) {
                this.disableAnimation();
            }
        });
        Minder.prototype.enableAnimation = function() {
            for (var name in animateDefaultOptions) {
                if (animateDefaultOptions.hasOwnProperty(name)) {
                    this.setOption(resoredAnimationOptions[name]);
                }
            }
        };
        Minder.prototype.disableAnimation = function() {
            for (var name in animateDefaultOptions) {
                if (animateDefaultOptions.hasOwnProperty(name)) {
                    resoredAnimationOptions[name] = this.getOption(name);
                    this.setOption(name, 0);
                }
            }
        };
    }
};

//lib/km-core/src/core/command.js
_p[29] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var MinderEvent = _p.r(33);
        var COMMAND_STATE_NORMAL = 0;
        var COMMAND_STATE_DISABLED = -1;
        var COMMAND_STATE_ACTIVED = 1;
        /**
     * 表示一个命令，包含命令的查询及执行
     */
        var Command = kity.createClass("Command", {
            constructor: function() {
                this._isContentChange = true;
                this._isSelectionChange = false;
            },
            execute: function(minder, args) {
                throw new Error("Not Implement: Command.execute()");
            },
            setContentChanged: function(val) {
                this._isContentChange = !!val;
            },
            isContentChanged: function() {
                return this._isContentChange;
            },
            setSelectionChanged: function(val) {
                this._isSelectionChange = !!val;
            },
            isSelectionChanged: function() {
                return this._isContentChange;
            },
            queryState: function(km) {
                return COMMAND_STATE_NORMAL;
            },
            queryValue: function(km) {
                return 0;
            },
            isNeedUndo: function() {
                return true;
            }
        });
        Command.STATE_NORMAL = COMMAND_STATE_NORMAL;
        Command.STATE_ACTIVE = COMMAND_STATE_ACTIVED;
        Command.STATE_DISABLED = COMMAND_STATE_DISABLED;
        kity.extendClass(Minder, {
            _getCommand: function(name) {
                return this._commands[name.toLowerCase()];
            },
            _queryCommand: function(name, type, args) {
                var cmd = this._getCommand(name);
                if (cmd) {
                    var queryCmd = cmd["query" + type];
                    if (queryCmd) return queryCmd.apply(cmd, [ this ].concat(args));
                }
                return 0;
            },
            /**
         * @method queryCommandState()
         * @for Minder
         * @description 查询指定命令的状态
         *
         * @grammar queryCommandName(name) => {number}
         *
         * @param {string} name 要查询的命令名称
         *
         * @return {number}
         *   -1: 命令不存在或命令当前不可用
         *    0: 命令可用
         *    1: 命令当前可用并且已经执行过
         */
            queryCommandState: function(name) {
                return this._queryCommand(name, "State", [].slice.call(arguments, 1));
            },
            /**
         * @method queryCommandValue()
         * @for Minder
         * @description 查询指定命令当前的执行值
         *
         * @grammar queryCommandValue(name) => {any}
         *
         * @param {string} name 要查询的命令名称
         *
         * @return {any}
         *    如果命令不存在，返回 undefined
         *    不同命令具有不同返回值，具体请查看 [Command](command) 章节
         */
            queryCommandValue: function(name) {
                return this._queryCommand(name, "Value", [].slice.call(arguments, 1));
            },
            /**
         * @method execCommand()
         * @for Minder
         * @description 执行指定的命令。
         *
         * @grammar execCommand(name, args...)
         *
         * @param {string} name 要执行的命令名称
         * @param {argument} args 要传递给命令的其它参数
         */
            execCommand: function(name) {
                if (!name) return null;
                name = name.toLowerCase();
                var cmdArgs = [].slice.call(arguments, 1), cmd, stoped, result, eventParams;
                var me = this;
                cmd = this._getCommand(name);
                eventParams = {
                    command: cmd,
                    commandName: name.toLowerCase(),
                    commandArgs: cmdArgs
                };
                if (!cmd || !~this.queryCommandState(name)) {
                    return false;
                }
                if (!this._hasEnterExecCommand && cmd.isNeedUndo()) {
                    this._hasEnterExecCommand = true;
                    stoped = this._fire(new MinderEvent("beforeExecCommand", eventParams, true));
                    if (!stoped) {
                        //保存场景
                        this._fire(new MinderEvent("saveScene"));
                        this._fire(new MinderEvent("preExecCommand", eventParams, false));
                        result = cmd.execute.apply(cmd, [ me ].concat(cmdArgs));
                        this._fire(new MinderEvent("execCommand", eventParams, false));
                        //保存场景
                        this._fire(new MinderEvent("saveScene"));
                        if (cmd.isContentChanged()) {
                            this._firePharse(new MinderEvent("contentchange"));
                        }
                        this._interactChange();
                    }
                    this._hasEnterExecCommand = false;
                } else {
                    result = cmd.execute.apply(cmd, [ me ].concat(cmdArgs));
                    if (!this._hasEnterExecCommand) {
                        this._interactChange();
                    }
                }
                return result === undefined ? null : result;
            }
        });
        module.exports = Command;
    }
};

//lib/km-core/src/core/compatibility.js
_p[30] = {
    value: function(require, exports, module) {
        var utils = _p.r(52);
        function compatibility(json) {
            var version = json.version || (json.root ? "1.4.0" : "1.1.3");
            switch (version) {
              case "1.1.3":
                c_113_120(json);

              /* falls through */
                case "1.2.0":
              case "1.2.1":
                c_120_130(json);

              /* falls through */
                case "1.3.0":
              case "1.3.1":
              case "1.3.2":
              case "1.3.3":
              case "1.3.4":
              case "1.3.5":
                /* falls through */
                c_130_140(json);
            }
            return json;
        }
        function traverse(node, fn) {
            fn(node);
            if (node.children) node.children.forEach(function(child) {
                traverse(child, fn);
            });
        }
        /* 脑图数据升级 */
        function c_120_130(json) {
            traverse(json, function(node) {
                var data = node.data;
                delete data.layout_bottom_offset;
                delete data.layout_default_offset;
                delete data.layout_filetree_offset;
            });
        }
        /**
     * 脑图数据升级
     * v1.1.3 => v1.2.0
     * */
        function c_113_120(json) {
            // 原本的布局风格
            var ocs = json.data.currentstyle;
            delete json.data.currentstyle;
            // 为 1.2 选择模板，同时保留老版本文件的皮肤
            if (ocs == "bottom") {
                json.template = "structure";
                json.theme = "snow";
            } else if (ocs == "default") {
                json.template = "default";
                json.theme = "classic";
            }
            traverse(json, function(node) {
                var data = node.data;
                // 升级优先级、进度图标
                if ("PriorityIcon" in data) {
                    data.priority = data.PriorityIcon;
                    delete data.PriorityIcon;
                }
                if ("ProgressIcon" in data) {
                    data.progress = 1 + (data.ProgressIcon - 1 << 1);
                    delete data.ProgressIcon;
                }
                // 删除过时属性
                delete data.point;
                delete data.layout;
            });
        }
        function c_130_140(json) {
            json.root = {
                data: json.data,
                children: json.children
            };
            delete json.data;
            delete json.children;
        }
        return compatibility;
    }
};

//lib/km-core/src/core/connect.js
_p[31] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Module = _p.r(40);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        // 连线提供方
        var _connectProviders = {};
        function register(name, provider) {
            _connectProviders[name] = provider;
        }
        register("default", function(node, parent, connection) {
            connection.setPathData([ "M", parent.getLayoutVertexOut(), "L", node.getLayoutVertexIn() ]);
        });
        kity.extendClass(MinderNode, {
            /**
         * @private
         * @method getConnect()
         * @for MinderNode
         * @description 获取当前节点的连线类型
         *
         * @grammar getConnect() => {string}
         */
            getConnect: function() {
                return this.data.connect || "default";
            },
            getConnectProvider: function() {
                return _connectProviders[this.getConnect()] || _connectProviders["default"];
            },
            /**
         * @private
         * @method getConnection()
         * @for MinderNode
         * @description 获取当前节点的连线对象
         *
         * @grammar getConnection() => {kity.Path}
         */
            getConnection: function() {
                return this._connection || null;
            }
        });
        kity.extendClass(Minder, {
            getConnectContainer: function() {
                return this._connectContainer;
            },
            createConnect: function(node) {
                if (node.isRoot()) return;
                var connection = new kity.Path();
                node._connection = connection;
                this._connectContainer.addShape(connection);
                this.updateConnect(node);
            },
            removeConnect: function(node) {
                var me = this;
                node.traverse(function(node) {
                    me._connectContainer.removeShape(node._connection);
                    node._connection = null;
                });
            },
            updateConnect: function(node) {
                var connection = node._connection;
                var parent = node.parent;
                if (!parent || !connection) return;
                if (parent.isCollapsed()) {
                    connection.setVisible(false);
                    return;
                }
                connection.setVisible(true);
                var provider = node.getConnectProvider();
                var strokeColor = node.getStyle("connect-color") || "white", strokeWidth = node.getStyle("connect-width") || 2;
                connection.stroke(strokeColor, strokeWidth);
                provider(node, parent, connection, strokeWidth, strokeColor);
                if (strokeWidth % 2 === 0) {
                    connection.setTranslate(.5, .5);
                } else {
                    connection.setTranslate(0, 0);
                }
            }
        });
        Module.register("Connect", {
            init: function() {
                this._connectContainer = new kity.Group().setId(utils.uuid("minder_connect_group"));
                this.getRenderContainer().prependShape(this._connectContainer);
            },
            events: {
                nodeattach: function(e) {
                    this.createConnect(e.node);
                },
                nodedetach: function(e) {
                    this.removeConnect(e.node);
                },
                "layoutapply layoutfinish noderender": function(e) {
                    this.updateConnect(e.node);
                }
            }
        });
        exports.register = register;
    }
};

//lib/km-core/src/core/data.js
_p[32] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var MinderEvent = _p.r(33);
        var compatibility = _p.r(30);
        var Promise = _p.r(44);
        var protocols = {};
        function registerProtocol(name, protocol) {
            protocols[name] = protocol;
        }
        exports.registerProtocol = registerProtocol;
        // 导入导出
        kity.extendClass(Minder, {
            // 自动导入
            setup: function(target) {
                if (typeof target == "string") {
                    target = document.querySelector(target);
                }
                if (!target) return;
                var protocol = target.getAttribute("minder-data-type");
                if (protocol in protocols) {
                    var data = target.textContent;
                    target.textContent = null;
                    this.renderTo(target);
                    this.importData(protocol, data);
                }
                return this;
            },
            /**
         * @method exportJson()
         * @for Minder
         * @description
         *     导出当前脑图数据为 JSON 对象，导出的数据格式请参考 [Data](data) 章节。
         * @grammar exportJson() => {plain}
         */
            exportJson: function() {
                /* 导出 node 上整棵树的数据为 JSON */
                function exportNode(node) {
                    var exported = {};
                    exported.data = node.getData();
                    var childNodes = node.getChildren();
                    if (childNodes.length) {
                        exported.children = [];
                        for (var i = 0; i < childNodes.length; i++) {
                            exported.children.push(exportNode(childNodes[i]));
                        }
                    }
                    return exported;
                }
                var json = {
                    root: exportNode(this.getRoot())
                };
                json.template = this.getTemplate();
                json.theme = this.getTheme();
                json.version = Minder.version;
                return json;
            },
            /**
         * @method importJson()
         * @for Minder
         * @description 导入脑图数据，数据为 JSON 对象，具体的数据字段形式请参考 [Data](data) 章节。
         *
         * @grammar importJson(json) => {this}
         *
         * @param {plain} json 要导入的数据
         */
            importJson: function(json) {
                function importNode(node, json, km) {
                    var data = json.data;
                    node.data = {};
                    for (var field in data) {
                        node.setData(field, data[field]);
                    }
                    var childrenTreeData = json.children || [];
                    for (var i = 0; i < childrenTreeData.length; i++) {
                        var childNode = km.createNode(null, node);
                        importNode(childNode, childrenTreeData[i], km);
                    }
                    return node;
                }
                if (!json) return;
                /**
             * @event preimport
             * @for Minder
             * @when 导入数据之前
             */
                this._fire(new MinderEvent("preimport", null, false));
                // 删除当前所有节点
                while (this._root.getChildren().length) {
                    this.removeNode(this._root.getChildren()[0]);
                }
                json = compatibility(json);
                importNode(this._root, json.root, this);
                this.setTemplate(json.template || "default");
                this.setTheme(json.theme || null);
                this.refresh();
                /**
             * @event import,contentchange,interactchange
             * @for Minder
             * @when 导入数据之后
             */
                this.fire("import");
                this._firePharse({
                    type: "contentchange"
                });
                this._interactChange();
                return this;
            },
            /**
         * @method exportData()
         * @for Minder
         * @description 使用指定使用的数据协议，导入脑图数据
         *
         * @grammar exportData(protocol) => Promise<data>
         *
         * @param {string} protocol 指定的数据协议（默认内置五种数据协议 `json`、`text`、`markdown`、`svg` 和 `png`）
         */
            exportData: function(protocolName) {
                var json, protocol;
                json = this.exportJson();
                // 指定了协议进行导出，需要检测协议是否支持
                if (protocolName) {
                    protocol = protocols[protocolName];
                    if (!protocol || !protocol.encode) {
                        return Promise.reject(new Error("Not supported protocol:" + protocolName));
                    }
                }
                // 导出前抛个事件
                this._fire(new MinderEvent("beforeexport", {
                    json: json,
                    protocolName: protocolName,
                    protocol: protocol
                }));
                return Promise.resolve(protocol.encode(json, this));
            },
            /**
         * @method importData()
         * @for Minder
         * @description 使用指定的数据协议，导出脑图数据
         *
         * @grammar importData(protocol, callback) => Promise<json>
         *
         * @param {string} protocol 指定的用于解析数据的数据协议（默认内置三种数据协议 `json`、`text` 和 `markdown` 的支持）
         * @param {any} data 要导入的数据
         */
            importData: function(protocolName, data) {
                var json, protocol;
                var minder = this;
                // 指定了协议进行导入，需要检测协议是否支持
                if (protocolName) {
                    protocol = protocols[protocolName];
                    if (!protocol || !protocol.decode) {
                        return Promise.reject(new Error("Not supported protocol:" + protocolName));
                    }
                }
                var params = {
                    local: data,
                    protocolName: protocolName,
                    protocol: protocol
                };
                // 导入前抛事件
                this._fire(new MinderEvent("beforeimport", params));
                return Promise.resolve(protocol.decode(data, this)).then(function(json) {
                    minder.importJson(json);
                    return json;
                });
            }
        });
    }
};

//lib/km-core/src/core/event.js
_p[33] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        /**
     * @class MinderEvent
     * @description 表示一个脑图中发生的事件
     */
        var MinderEvent = kity.createClass("MindEvent", {
            constructor: function(type, params, canstop) {
                params = params || {};
                if (params.getType && params.getType() == "ShapeEvent") {
                    /**
                 * @property kityEvent
                 * @for MinderEvent
                 * @description 如果事件是从一个 kity 的事件派生的，会有 kityEvent 属性指向原来的 kity 事件
                 * @type {KityEvent}
                 */
                    this.kityEvent = params;
                    /**
                 * @property originEvent
                 * @for MinderEvent
                 * @description 如果事件是从原声 Dom 事件派生的（如 click、mousemove 等），会有 originEvent 指向原来的 Dom 事件
                 * @type {DomEvent}
                 */
                    this.originEvent = params.originEvent;
                } else if (params.target && params.preventDefault) {
                    this.originEvent = params;
                } else {
                    kity.Utils.extend(this, params);
                }
                /**
             * @property type
             * @for MinderEvent
             * @description 事件的类型，如 `click`、`contentchange` 等
             * @type {string}
             */
                this.type = type;
                this._canstop = canstop || false;
            },
            /**
         * @method getPosition()
         * @for MinderEvent
         * @description 如果事件是从一个 kity 事件派生的，会有 `getPosition()` 获取事件发生的坐标
         *
         * @grammar getPosition(refer) => {kity.Point}
         *
         * @param {string|kity.Shape} refer
         *     参照的坐标系，
         *     `"screen"` - 以浏览器屏幕为参照坐标系
         *     `"minder"` - （默认）以脑图画布为参照坐标系
         *     `{kity.Shape}` - 指定以某个 kity 图形为参照坐标系
         */
            getPosition: function(refer) {
                if (!this.kityEvent) return;
                if (!refer || refer == "minder") {
                    return this.kityEvent.getPosition(this.minder.getRenderContainer());
                }
                return this.kityEvent.getPosition.call(this.kityEvent, refer);
            },
            /**
         * @method getTargetNode()
         * @for MinderEvent
         * @description 当发生的事件是鼠标事件时，获取事件位置命中的脑图节点
         *
         * @grammar getTargetNode() => {MinderNode}
         */
            getTargetNode: function() {
                var findShape = this.kityEvent && this.kityEvent.targetShape;
                if (!findShape) return null;
                while (!findShape.minderNode && findShape.container) {
                    findShape = findShape.container;
                }
                var node = findShape.minderNode;
                if (node && findShape.getOpacity() < 1) return null;
                return node || null;
            },
            /**
         * @method stopPropagation()
         * @for MinderEvent
         * @description 当发生的事件是鼠标事件时，获取事件位置命中的脑图节点
         *
         * @grammar getTargetNode() => {MinderNode}
         */
            stopPropagation: function() {
                this._stoped = true;
            },
            stopPropagationImmediately: function() {
                this._immediatelyStoped = true;
                this._stoped = true;
            },
            shouldStopPropagation: function() {
                return this._canstop && this._stoped;
            },
            shouldStopPropagationImmediately: function() {
                return this._canstop && this._immediatelyStoped;
            },
            preventDefault: function() {
                this.originEvent.preventDefault();
            },
            isRightMB: function() {
                var isRightMB = false;
                if (!this.originEvent) {
                    return false;
                }
                if ("which" in this.originEvent) isRightMB = this.originEvent.which == 3; else if ("button" in this.originEvent) isRightMB = this.originEvent.button == 2;
                return isRightMB;
            },
            getKeyCode: function() {
                var evt = this.originEvent;
                return evt.keyCode || evt.which;
            }
        });
        Minder.registerInitHook(function(option) {
            this._initEvents();
        });
        kity.extendClass(Minder, {
            _initEvents: function() {
                this._eventCallbacks = {};
            },
            _resetEvents: function() {
                this._initEvents();
                this._bindEvents();
            },
            _bindEvents: function() {
                /* jscs:disable maximumLineLength */
                this._paper.on("click dblclick mousedown contextmenu mouseup mousemove mouseover mousewheel DOMMouseScroll touchstart touchmove touchend dragenter dragleave drop", this._firePharse.bind(this));
                if (window) {
                    window.addEventListener("resize", this._firePharse.bind(this));
                }
            },
            /**
         * @method dispatchKeyEvent
         * @description 派发键盘（相关）事件到脑图实例上，让实例的模块处理
         * @grammar dispatchKeyEvent(e) => {this}
         * @param  {Event} e 原生的 Dom 事件对象
         */
            dispatchKeyEvent: function(e) {
                this._firePharse(e);
            },
            _firePharse: function(e) {
                var beforeEvent, preEvent, executeEvent;
                if (e.type == "DOMMouseScroll") {
                    e.type = "mousewheel";
                    e.wheelDelta = e.originEvent.wheelDelta = e.originEvent.detail * -10;
                    e.wheelDeltaX = e.originEvent.mozMovementX;
                    e.wheelDeltaY = e.originEvent.mozMovementY;
                }
                beforeEvent = new MinderEvent("before" + e.type, e, true);
                if (this._fire(beforeEvent)) {
                    return;
                }
                preEvent = new MinderEvent("pre" + e.type, e, true);
                executeEvent = new MinderEvent(e.type, e, true);
                if (this._fire(preEvent) || this._fire(executeEvent)) this._fire(new MinderEvent("after" + e.type, e, false));
            },
            _interactChange: function(e) {
                var me = this;
                if (me._interactScheduled) return;
                setTimeout(function() {
                    me._fire(new MinderEvent("interactchange"));
                    me._interactScheduled = false;
                }, 100);
                me._interactScheduled = true;
            },
            _listen: function(type, callback) {
                var callbacks = this._eventCallbacks[type] || (this._eventCallbacks[type] = []);
                callbacks.push(callback);
            },
            _fire: function(e) {
                /**
             * @property minder
             * @description 产生事件的 Minder 对象
             * @for MinderShape
             * @type {Minder}
             */
                e.minder = this;
                var status = this.getStatus();
                var callbacks = this._eventCallbacks[e.type.toLowerCase()] || [];
                if (status) {
                    callbacks = callbacks.concat(this._eventCallbacks[status + "." + e.type.toLowerCase()] || []);
                }
                if (callbacks.length === 0) {
                    return;
                }
                var lastStatus = this.getStatus();
                for (var i = 0; i < callbacks.length; i++) {
                    callbacks[i].call(this, e);
                    /* this.getStatus() != lastStatus ||*/
                    if (e.shouldStopPropagationImmediately()) {
                        break;
                    }
                }
                return e.shouldStopPropagation();
            },
            on: function(name, callback) {
                var km = this;
                name.split(/\s+/).forEach(function(n) {
                    km._listen(n.toLowerCase(), callback);
                });
                return this;
            },
            off: function(name, callback) {
                var types = name.split(/\s+/);
                var i, j, callbacks, removeIndex;
                for (i = 0; i < types.length; i++) {
                    callbacks = this._eventCallbacks[types[i].toLowerCase()];
                    if (callbacks) {
                        removeIndex = null;
                        for (j = 0; j < callbacks.length; j++) {
                            if (callbacks[j] == callback) {
                                removeIndex = j;
                            }
                        }
                        if (removeIndex !== null) {
                            callbacks.splice(removeIndex, 1);
                        }
                    }
                }
            },
            fire: function(type, params) {
                var e = new MinderEvent(type, params);
                this._fire(e);
                return this;
            }
        });
        module.exports = MinderEvent;
    }
};

//lib/km-core/src/core/focus.js
_p[34] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var Minder = _p.r(39);
        Minder.registerInitHook(function() {
            this.on("beforemousedown", function(e) {
                this.focus();
                e.preventDefault();
            });
            this.on("paperrender", function() {
                this.focus();
            });
        });
        kity.extendClass(Minder, {
            focus: function() {
                if (!this.isFocused()) {
                    var renderTarget = this._renderTarget;
                    renderTarget.classList.add("focus");
                    this.renderNodeBatch(this.getSelectedNodes());
                }
                this.fire("focus");
                return this;
            },
            blur: function() {
                if (this.isFocused()) {
                    var renderTarget = this._renderTarget;
                    renderTarget.classList.remove("focus");
                    this.renderNodeBatch(this.getSelectedNodes());
                }
                this.fire("blur");
                return this;
            },
            isFocused: function() {
                var renderTarget = this._renderTarget;
                return renderTarget && renderTarget.classList.contains("focus");
            }
        });
    }
};

//lib/km-core/src/core/keymap.js
_p[35] = {
    value: function(require, exports, module) {
        var keymap = {
            Backspace: 8,
            Tab: 9,
            Enter: 13,
            Shift: 16,
            Control: 17,
            Alt: 18,
            CapsLock: 20,
            Esc: 27,
            Spacebar: 32,
            PageUp: 33,
            PageDown: 34,
            End: 35,
            Home: 36,
            Insert: 45,
            Left: 37,
            Up: 38,
            Right: 39,
            Down: 40,
            direction: {
                37: 1,
                38: 1,
                39: 1,
                40: 1
            },
            Del: 46,
            NumLock: 144,
            Cmd: 91,
            CmdFF: 224,
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123,
            "`": 192,
            "=": 187,
            "-": 189,
            "/": 191,
            ".": 190,
            controlKeys: {
                16: 1,
                17: 1,
                18: 1,
                20: 1,
                91: 1,
                224: 1
            },
            notContentChange: {
                13: 1,
                9: 1,
                33: 1,
                34: 1,
                35: 1,
                36: 1,
                16: 1,
                17: 1,
                18: 1,
                20: 1,
                91: 1,
                //上下左右
                37: 1,
                38: 1,
                39: 1,
                40: 1,
                113: 1,
                114: 1,
                115: 1,
                144: 1,
                27: 1
            },
            isSelectedNodeKey: {
                //上下左右
                37: 1,
                38: 1,
                39: 1,
                40: 1,
                13: 1,
                9: 1
            }
        };
        // 小写适配
        for (var key in keymap) {
            if (keymap.hasOwnProperty(key)) {
                keymap[key.toLowerCase()] = keymap[key];
            }
        }
        var aKeyCode = 65;
        var aCharCode = "a".charCodeAt(0);
        // letters
        "abcdefghijklmnopqrstuvwxyz".split("").forEach(function(letter) {
            keymap[letter] = aKeyCode + (letter.charCodeAt(0) - aCharCode);
        });
        // numbers
        var n = 9;
        do {
            keymap[n.toString()] = n + 48;
        } while (--n);
        module.exports = keymap;
    }
};

//lib/km-core/src/core/keyreceiver.js
_p[36] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        function listen(element, type, handler) {
            type.split(" ").forEach(function(name) {
                element.addEventListener(name, handler, false);
            });
        }
        Minder.registerInitHook(function(option) {
            this.setDefaultOptions({
                enableKeyReceiver: true
            });
            if (this.getOption("enableKeyReceiver")) {
                this.on("paperrender", function() {
                    this._initKeyReceiver();
                });
            }
        });
        kity.extendClass(Minder, {
            _initKeyReceiver: function() {
                if (this._keyReceiver) return;
                var receiver = this._keyReceiver = document.createElement("input");
                receiver.classList.add("km-receiver");
                var renderTarget = this._renderTarget;
                renderTarget.appendChild(receiver);
                var minder = this;
                listen(receiver, "keydown keyup keypress copy paste blur focus input", function(e) {
                    switch (e.type) {
                      case "blur":
                        minder.blur();
                        break;

                      case "focus":
                        minder.focus();
                        break;

                      case "input":
                        receiver.value = null;
                        break;
                    }
                    minder._firePharse(e);
                    e.preventDefault();
                });
                this.on("focus", function() {
                    receiver.select();
                    receiver.focus();
                });
                this.on("blur", function() {
                    receiver.blur();
                });
                if (this.isFocused()) {
                    receiver.select();
                    receiver.focus();
                }
            }
        });
    }
};

//lib/km-core/src/core/kity.js
/**
 * @fileOverview
 *
 * Kity 引入
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[37] = {
    value: function(require, exports, module) {
        module.exports = window.kity;
    }
};

//lib/km-core/src/core/layout.js
_p[38] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var MinderEvent = _p.r(33);
        var Command = _p.r(29);
        var _layouts = {};
        var _defaultLayout;
        function register(name, layout) {
            _layouts[name] = layout;
            _defaultLayout = _defaultLayout || name;
        }
        /**
     * @class Layout 布局基类，具体布局需要从该类派生
     */
        var Layout = kity.createClass("Layout", {
            /**
         * @abstract
         *
         * 子类需要实现的布局算法，该算法输入一个节点，排布该节点的子节点（相对父节点的变换）
         *
         * @param  {MinderNode} node 需要布局的节点
         *
         * @example
         *
         * doLayout: function(node) {
         *     var children = node.getChildren();
         *     // layout calculation
         *     children[i].setLayoutTransform(new kity.Matrix().translate(x, y));
         * }
         */
            doLayout: function(node) {
                throw new Error("Not Implement: Layout.doLayout()");
            },
            /**
         * 对齐指定的节点
         *
         * @param {Array<MinderNode>} nodes 要对齐的节点
         * @param {string} border 对齐边界，允许取值 left, right, top, bottom
         *
         */
            align: function(nodes, border, offset) {
                var me = this;
                offset = offset || 0;
                nodes.forEach(function(node) {
                    var tbox = me.getTreeBox([ node ]);
                    var matrix = node.getLayoutTransform();
                    switch (border) {
                      case "left":
                        return matrix.translate(offset - tbox.left, 0);

                      case "right":
                        return matrix.translate(offset - tbox.right, 0);

                      case "top":
                        return matrix.translate(0, offset - tbox.top);

                      case "bottom":
                        return matrix.translate(0, offset - tbox.bottom);
                    }
                });
            },
            stack: function(nodes, axis, distance) {
                var me = this;
                var position = 0;
                distance = distance || function(node, next, axis) {
                    return node.getStyle({
                        x: "margin-right",
                        y: "margin-bottom"
                    }[axis]) + next.getStyle({
                        x: "margin-left",
                        y: "margin-top"
                    }[axis]);
                };
                nodes.forEach(function(node, index, nodes) {
                    var tbox = me.getTreeBox([ node ]);
                    var size = {
                        x: tbox.width,
                        y: tbox.height
                    }[axis];
                    var offset = {
                        x: tbox.left,
                        y: tbox.top
                    }[axis];
                    var matrix = node.getLayoutTransform();
                    if (axis == "x") {
                        matrix.translate(position - offset, 0);
                    } else {
                        matrix.translate(0, position - offset);
                    }
                    position += size;
                    if (nodes[index + 1]) position += distance(node, nodes[index + 1], axis);
                });
                return position;
            },
            move: function(nodes, dx, dy) {
                nodes.forEach(function(node) {
                    node.getLayoutTransform().translate(dx, dy);
                });
            },
            /**
         * 工具方法：获取给点的节点所占的布局区域
         *
         * @param  {MinderNode[]} nodes 需要计算的节点
         *
         * @return {Box} 计算结果
         */
            getBranchBox: function(nodes) {
                var box = new kity.Box();
                var i, node, matrix, contentBox;
                for (i = 0; i < nodes.length; i++) {
                    node = nodes[i];
                    matrix = node.getLayoutTransform();
                    contentBox = node.getContentBox();
                    box = box.merge(matrix.transformBox(contentBox));
                }
                return box;
            },
            /**
         * 工具方法：计算给定的节点的子树所占的布局区域
         *
         * @param  {MinderNode} nodes 需要计算的节点
         *
         * @return {Box} 计算的结果
         */
            getTreeBox: function(nodes) {
                var i, node, matrix, treeBox;
                var box = new kity.Box();
                if (!(nodes instanceof Array)) nodes = [ nodes ];
                for (i = 0; i < nodes.length; i++) {
                    node = nodes[i];
                    matrix = node.getLayoutTransform();
                    treeBox = node.getContentBox();
                    if (node.isExpanded() && node.children.length) {
                        treeBox = treeBox.merge(this.getTreeBox(node.children));
                    }
                    box = box.merge(matrix.transformBox(treeBox));
                }
                return box;
            },
            getOrderHint: function(node) {
                return [];
            }
        });
        Layout.register = register;
        Minder.registerInitHook(function(options) {
            this.refresh();
        });
        /**
     * 布局支持池子管理
     */
        utils.extend(Minder, {
            getLayoutList: function() {
                return _layouts;
            },
            getLayoutInstance: function(name) {
                var LayoutClass = _layouts[name];
                if (!LayoutClass) throw new Error("Missing Layout: " + name);
                var layout = new LayoutClass();
                return layout;
            }
        });
        /**
     * MinderNode 上的布局支持
     */
        kity.extendClass(MinderNode, {
            /**
         * 获得当前节点的布局名称
         *
         * @return {String}
         */
            getLayout: function() {
                var layout = this.getData("layout");
                layout = layout || (this.isRoot() ? _defaultLayout : this.parent.getLayout());
                return layout;
            },
            setLayout: function(name) {
                if (name) {
                    if (name == "inherit") {
                        this.setData("layout");
                    } else {
                        this.setData("layout", name);
                    }
                }
                return this;
            },
            layout: function(name) {
                this.setLayout(name).getMinder().layout();
                return this;
            },
            getLayoutInstance: function() {
                return Minder.getLayoutInstance(this.getLayout());
            },
            getOrderHint: function(refer) {
                return this.parent.getLayoutInstance().getOrderHint(this);
            },
            getExpandPosition: function() {
                return this.getLayoutInstance().getExpandPosition();
            },
            /**
         * 获取当前节点相对于父节点的布局变换
         */
            getLayoutTransform: function() {
                return this._layoutTransform || new kity.Matrix();
            },
            /**
         * 第一轮布局计算后，获得的全局布局位置
         *
         * @return {[type]} [description]
         */
            getGlobalLayoutTransformPreview: function() {
                var pMatrix = this.parent ? this.parent.getLayoutTransform() : new kity.Matrix();
                var matrix = this.getLayoutTransform();
                var offset = this.getLayoutOffset();
                if (offset) {
                    matrix.translate(offset.x, offset.y);
                }
                return pMatrix.merge(matrix);
            },
            getLayoutPointPreview: function() {
                return this.getGlobalLayoutTransformPreview().transformPoint(new kity.Point());
            },
            /**
         * 获取节点相对于全局的布局变换
         */
            getGlobalLayoutTransform: function() {
                if (this._globalLayoutTransform) {
                    return this._globalLayoutTransform;
                } else if (this.parent) {
                    return this.parent.getGlobalLayoutTransform();
                } else {
                    return new kity.Matrix();
                }
            },
            /**
         * 设置当前节点相对于父节点的布局变换
         */
            setLayoutTransform: function(matrix) {
                this._layoutTransform = matrix;
                return this;
            },
            /**
         * 设置当前节点相对于全局的布局变换（冗余优化）
         */
            setGlobalLayoutTransform: function(matrix) {
                this.getRenderContainer().setMatrix(this._globalLayoutTransform = matrix);
                return this;
            },
            setVertexIn: function(p) {
                this._vertexIn = p;
            },
            setVertexOut: function(p) {
                this._vertexOut = p;
            },
            getVertexIn: function() {
                return this._vertexIn || new kity.Point();
            },
            getVertexOut: function() {
                return this._vertexOut || new kity.Point();
            },
            getLayoutVertexIn: function() {
                return this.getGlobalLayoutTransform().transformPoint(this.getVertexIn());
            },
            getLayoutVertexOut: function() {
                return this.getGlobalLayoutTransform().transformPoint(this.getVertexOut());
            },
            setLayoutVectorIn: function(v) {
                this._layoutVectorIn = v;
                return this;
            },
            setLayoutVectorOut: function(v) {
                this._layoutVectorOut = v;
                return this;
            },
            getLayoutVectorIn: function() {
                return this._layoutVectorIn || new kity.Vector();
            },
            getLayoutVectorOut: function() {
                return this._layoutVectorOut || new kity.Vector();
            },
            getLayoutBox: function() {
                var matrix = this.getGlobalLayoutTransform();
                return matrix.transformBox(this.getContentBox());
            },
            getLayoutPoint: function() {
                var matrix = this.getGlobalLayoutTransform();
                return matrix.transformPoint(new kity.Point());
            },
            getLayoutOffset: function() {
                if (!this.parent) return new kity.Point();
                // 影响当前节点位置的是父节点的布局
                var data = this.getData("layout_" + this.parent.getLayout() + "_offset");
                if (data) return new kity.Point(data.x, data.y);
                return new kity.Point();
            },
            setLayoutOffset: function(p) {
                if (!this.parent) return this;
                if (p && !this.hasLayoutOffset()) {
                    var m = this.getLayoutTransform().m;
                    p = p.offset(m.e, m.f);
                    this.setLayoutTransform(null);
                }
                this.setData("layout_" + this.parent.getLayout() + "_offset", p ? {
                    x: p.x,
                    y: p.y
                } : null);
                return this;
            },
            hasLayoutOffset: function() {
                return !!this.getData("layout_" + this.parent.getLayout() + "_offset");
            },
            resetLayoutOffset: function() {
                return this.setLayoutOffset(null);
            },
            getLayoutRoot: function() {
                if (this.isLayoutRoot()) {
                    return this;
                }
                return this.parent.getLayoutRoot();
            },
            isLayoutRoot: function() {
                return this.getData("layout") || this.isRoot();
            }
        });
        /**
     * Minder 上的布局支持
     */
        kity.extendClass(Minder, {
            layout: function() {
                var duration = this.getOption("layoutAnimationDuration");
                this.getRoot().traverse(function(node) {
                    // clear last results
                    node.setLayoutTransform(null);
                });
                function layoutNode(node, round) {
                    // layout all children first
                    // 剪枝：收起的节点无需计算
                    if (node.isExpanded() || true) {
                        node.children.forEach(function(child) {
                            layoutNode(child, round);
                        });
                    }
                    var layout = node.getLayoutInstance();
                    var childrenInFlow = node.getChildren().filter(function(child) {
                        return !child.hasLayoutOffset();
                    });
                    layout.doLayout(node, childrenInFlow, round);
                }
                // 第一轮布局
                layoutNode(this.getRoot(), 1);
                // 第二轮布局
                layoutNode(this.getRoot(), 2);
                var minder = this;
                this.applyLayoutResult(this.getRoot(), duration, function() {
                    minder.fire("layoutallfinish");
                });
                return this.fire("layout");
            },
            refresh: function() {
                this.getRoot().renderTree();
                this.layout().fire("contentchange")._interactChange();
                return this;
            },
            applyLayoutResult: function(root, duration, callback) {
                root = root || this.getRoot();
                var me = this;
                var complex = root.getComplex();
                function consume() {
                    if (!--complex) {
                        if (callback) {
                            callback();
                        }
                    }
                }
                // 节点复杂度大于 100，关闭动画
                if (complex > 200) duration = 0;
                function applyMatrix(node, matrix) {
                    node.setGlobalLayoutTransform(matrix);
                    me.fire("layoutapply", {
                        node: node,
                        matrix: matrix
                    });
                }
                function apply(node, pMatrix) {
                    var matrix = node.getLayoutTransform().merge(pMatrix);
                    var lastMatrix = node.getGlobalLayoutTransform() || new kity.Matrix();
                    var offset = node.getLayoutOffset();
                    matrix.translate(offset.x, offset.y);
                    matrix.m.e = Math.round(matrix.m.e);
                    matrix.m.f = Math.round(matrix.m.f);
                    // 如果当前有动画，停止动画
                    if (node._layoutTimeline) {
                        node._layoutTimeline.stop();
                        node._layoutTimeline = null;
                    }
                    // 如果要求以动画形式来更新，创建动画
                    if (duration) {
                        node._layoutTimeline = new kity.Animator(lastMatrix, matrix, applyMatrix).start(node, duration, "ease").on("finish", function() {
                            //可能性能低的时候会丢帧，手动添加一帧
                            setTimeout(function() {
                                applyMatrix(node, matrix);
                                me.fire("layoutfinish", {
                                    node: node,
                                    matrix: matrix
                                });
                                consume();
                            }, 150);
                        });
                    } else {
                        applyMatrix(node, matrix);
                        me.fire("layoutfinish", {
                            node: node,
                            matrix: matrix
                        });
                        consume();
                    }
                    for (var i = 0; i < node.children.length; i++) {
                        apply(node.children[i], matrix);
                    }
                }
                apply(root, root.parent ? root.parent.getGlobalLayoutTransform() : new kity.Matrix());
                return this;
            }
        });
        module.exports = Layout;
    }
};

//lib/km-core/src/core/minder.js
/**
 * @fileOverview
 *
 * KityMinder 类，暴露在 window 上的唯一变量
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[39] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var _initHooks = [];
        var Minder = kity.createClass("Minder", {
            constructor: function(options) {
                this._options = utils.extend({}, options);
                var initHooks = _initHooks.slice();
                var initHook;
                while (initHooks.length) {
                    initHook = initHooks.shift();
                    if (typeof initHook == "function") {
                        initHook.call(this, this._options);
                    }
                }
                this.fire("ready");
            }
        });
        Minder.version = "1.4.0";
        Minder.registerInitHook = function(hook) {
            _initHooks.push(hook);
        };
        module.exports = Minder;
    }
};

//lib/km-core/src/core/module.js
_p[40] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        /* 已注册的模块 */
        var _modules = {};
        exports.register = function(name, module) {
            _modules[name] = module;
        };
        /* 模块初始化 */
        Minder.registerInitHook(function() {
            this._initModules();
        });
        // 模块声明周期维护
        kity.extendClass(Minder, {
            _initModules: function() {
                var modulesPool = _modules;
                var modulesToLoad = this._options.modules || utils.keys(modulesPool);
                this._commands = {};
                this._query = {};
                this._modules = {};
                this._rendererClasses = {};
                var i, name, type, module, moduleDeals, dealCommands, dealEvents, dealRenderers;
                var me = this;
                for (i = 0; i < modulesToLoad.length; i++) {
                    name = modulesToLoad[i];
                    if (!modulesPool[name]) continue;
                    // 执行模块初始化，抛出后续处理对象
                    if (typeof modulesPool[name] == "function") {
                        moduleDeals = modulesPool[name].call(me);
                    } else {
                        moduleDeals = modulesPool[name];
                    }
                    this._modules[name] = moduleDeals;
                    if (!moduleDeals) continue;
                    if (moduleDeals.defaultOptions) {
                        me.setDefaultOptions(moduleDeals.defaultOptions);
                    }
                    if (moduleDeals.init) {
                        moduleDeals.init.call(me, this._options);
                    }
                    // command加入命令池子
                    dealCommands = moduleDeals.commands;
                    for (name in dealCommands) {
                        this._commands[name.toLowerCase()] = new dealCommands[name]();
                    }
                    // 绑定事件
                    dealEvents = moduleDeals.events;
                    if (dealEvents) {
                        for (type in dealEvents) {
                            me.on(type, dealEvents[type]);
                        }
                    }
                    // 渲染器
                    dealRenderers = moduleDeals.renderers;
                    if (dealRenderers) {
                        for (type in dealRenderers) {
                            this._rendererClasses[type] = this._rendererClasses[type] || [];
                            if (utils.isArray(dealRenderers[type])) {
                                this._rendererClasses[type] = this._rendererClasses[type].concat(dealRenderers[type]);
                            } else {
                                this._rendererClasses[type].push(dealRenderers[type]);
                            }
                        }
                    }
                    //添加模块的快捷键
                    if (moduleDeals.commandShortcutKeys) {
                        this.addCommandShortcutKeys(moduleDeals.commandShortcutKeys);
                    }
                }
            },
            _garbage: function() {
                this.clearSelect();
                while (this._root.getChildren().length) {
                    this._root.removeChild(0);
                }
            },
            destroy: function() {
                var modules = this._modules;
                this._resetEvents();
                this._garbage();
                for (var key in modules) {
                    if (!modules[key].destroy) continue;
                    modules[key].destroy.call(this);
                }
            },
            reset: function() {
                var modules = this._modules;
                this._garbage();
                for (var key in modules) {
                    if (!modules[key].reset) continue;
                    modules[key].reset.call(this);
                }
            }
        });
    }
};

//lib/km-core/src/core/node.js
_p[41] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        /**
     * @class MinderNode
     *
     * 表示一个脑图节点
     */
        var MinderNode = kity.createClass("MinderNode", {
            /**
         * 创建一个游离的脑图节点
         *
         * @param {String|Object} textOrData
         *     节点的初始数据或文本
         */
            constructor: function(textOrData) {
                // 指针
                this.parent = null;
                this.root = this;
                this.children = [];
                // 数据
                this.data = {
                    id: utils.guid(),
                    created: +new Date()
                };
                // 绘图容器
                this.initContainers();
                if (utils.isString(textOrData)) {
                    this.setText(textOrData);
                } else if (utils.isObject(textOrData)) {
                    utils.extend(this.data, textOrData);
                }
            },
            initContainers: function() {
                this.rc = new kity.Group().setId(utils.uuid("minder_node"));
                this.rc.minderNode = this;
            },
            /**
         * 判断节点是否根节点
         */
            isRoot: function() {
                return this.root === this;
            },
            /**
         * 判断节点是否叶子
         */
            isLeaf: function() {
                return this.children.length === 0;
            },
            /**
         * 获取节点的根节点
         */
            getRoot: function() {
                return this.root || this;
            },
            /**
         * 获得节点的父节点
         */
            getParent: function() {
                return this.parent;
            },
            /**
         * 获得节点的深度
         */
            getLevel: function() {
                var level = 0, ancestor = this.parent;
                while (ancestor) {
                    level++;
                    ancestor = ancestor.parent;
                }
                return level;
            },
            /**
         * 获得节点的复杂度（即子树中节点的数量）
         */
            getComplex: function() {
                var complex = 0;
                this.traverse(function() {
                    complex++;
                });
                return complex;
            },
            /**
         * 获得节点的类型（root|main|sub）
         */
            getType: function(type) {
                this.type = [ "root", "main", "sub" ][Math.min(this.getLevel(), 2)];
                return this.type;
            },
            /**
         * 判断当前节点是否被测试节点的祖先
         * @param  {MinderNode}  test 被测试的节点
         */
            isAncestorOf: function(test) {
                var ancestor = test.parent;
                while (ancestor) {
                    if (ancestor == this) return true;
                    ancestor = ancestor.parent;
                }
                return false;
            },
            getData: function(key) {
                return key ? this.data[key] : this.data;
            },
            setData: function(key, value) {
                this.data[key] = value;
            },
            /**
         * 设置节点的文本数据
         * @param {String} text 文本数据
         */
            setText: function(text) {
                return this.data.text = text;
            },
            /**
         * 获取节点的文本数据
         * @return {String}
         */
            getText: function() {
                return this.data.text || null;
            },
            /**
         * 先序遍历当前节点树
         * @param  {Function} fn 遍历函数
         */
            preTraverse: function(fn, excludeThis) {
                var children = this.getChildren();
                if (!excludeThis) fn(this);
                for (var i = 0; i < children.length; i++) {
                    children[i].preTraverse(fn);
                }
            },
            /**
         * 后序遍历当前节点树
         * @param  {Function} fn 遍历函数
         */
            postTraverse: function(fn, excludeThis) {
                var children = this.getChildren();
                for (var i = 0; i < children.length; i++) {
                    children[i].postTraverse(fn);
                }
                if (!excludeThis) fn(this);
            },
            traverse: function(fn, excludeThis) {
                return this.postTraverse(fn, excludeThis);
            },
            getChildren: function() {
                return this.children;
            },
            getIndex: function() {
                return this.parent ? this.parent.children.indexOf(this) : -1;
            },
            insertChild: function(node, index) {
                if (index === undefined) {
                    index = this.children.length;
                }
                if (node.parent) {
                    node.parent.removeChild(node);
                }
                node.parent = this;
                node.root = this.root;
                this.children.splice(index, 0, node);
            },
            appendChild: function(node) {
                return this.insertChild(node);
            },
            prependChild: function(node) {
                return this.insertChild(node, 0);
            },
            removeChild: function(elem) {
                var index = elem, removed;
                if (elem instanceof MinderNode) {
                    index = this.children.indexOf(elem);
                }
                if (index >= 0) {
                    removed = this.children.splice(index, 1)[0];
                    removed.parent = null;
                    removed.root = removed;
                }
            },
            clearChildren: function() {
                this.children = [];
            },
            getChild: function(index) {
                return this.children[index];
            },
            getRenderContainer: function() {
                return this.rc;
            },
            getCommonAncestor: function(node) {
                return MinderNode.getNodeCommonAncestor(this, node);
            },
            contains: function(node) {
                return this == node || this.isAncestorOf(node);
            },
            clone: function() {
                var cloned = new MinderNode();
                cloned.data = utils.clone(this.data);
                this.children.forEach(function(child) {
                    cloned.appendChild(child.clone());
                });
                return cloned;
            },
            compareTo: function(node) {
                if (!utils.comparePlainObject(this.data, node.data)) return false;
                if (!utils.comparePlainObject(this.temp, node.temp)) return false;
                if (this.children.length != node.children.length) return false;
                var i = 0;
                while (this.children[i]) {
                    if (!this.children[i].compareTo(node.children[i])) return false;
                    i++;
                }
                return true;
            },
            getMinder: function() {
                return this.getRoot().minder;
            }
        });
        MinderNode.getCommonAncestor = function(nodeA, nodeB) {
            if (nodeA instanceof Array) {
                return MinderNode.getCommonAncestor.apply(this, nodeA);
            }
            switch (arguments.length) {
              case 1:
                return nodeA.parent || nodeA;

              case 2:
                if (nodeA.isAncestorOf(nodeB)) {
                    return nodeA;
                }
                if (nodeB.isAncestorOf(nodeA)) {
                    return nodeB;
                }
                var ancestor = nodeA.parent;
                while (ancestor && !ancestor.isAncestorOf(nodeB)) {
                    ancestor = ancestor.parent;
                }
                return ancestor;

              default:
                return Array.prototype.reduce.call(arguments, function(prev, current) {
                    return MinderNode.getCommonAncestor(prev, current);
                }, nodeA);
            }
        };
        kity.extendClass(Minder, {
            getRoot: function() {
                return this._root;
            },
            setRoot: function(root) {
                this._root = root;
                root.minder = this;
            },
            createNode: function(textOrData, parent, index) {
                var node = new MinderNode(textOrData);
                this.fire("nodecreate", {
                    node: node,
                    parent: parent,
                    index: index
                });
                this.appendNode(node, parent, index);
                return node;
            },
            appendNode: function(node, parent, index) {
                if (parent) parent.insertChild(node, index);
                this.attachNode(node);
                return this;
            },
            removeNode: function(node) {
                if (node.parent) {
                    node.parent.removeChild(node);
                    this.detachNode(node);
                    this.fire("noderemove", {
                        node: node
                    });
                }
            },
            attachNode: function(node) {
                var rc = this.getRenderContainer();
                node.traverse(function(current) {
                    current.attached = true;
                    rc.addShape(current.getRenderContainer());
                });
                rc.addShape(node.getRenderContainer());
                this.fire("nodeattach", {
                    node: node
                });
            },
            detachNode: function(node) {
                var rc = this.getRenderContainer();
                node.traverse(function(current) {
                    current.attached = false;
                    rc.removeShape(current.getRenderContainer());
                });
                this.fire("nodedetach", {
                    node: node
                });
            },
            getMinderTitle: function() {
                return this.getRoot().getText();
            }
        });
        module.exports = MinderNode;
    }
};

//lib/km-core/src/core/option.js
/**
 * @fileOverview
 *
 * 提供脑图选项支持
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[42] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        Minder.registerInitHook(function(options) {
            this._defaultOptions = {};
        });
        kity.extendClass(Minder, {
            setDefaultOptions: function(options) {
                utils.extend(this._defaultOptions, options);
                return this;
            },
            getOption: function(key) {
                if (key) {
                    return key in this._options ? this._options[key] : this._defaultOptions[key];
                } else {
                    return utils.extend({}, this._defaultOptions, this._options);
                }
            },
            setOption: function(key, value) {
                this._options[key] = value;
            }
        });
    }
};

//lib/km-core/src/core/paper.js
/**
 * @fileOverview
 *
 * 初始化渲染容器
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[43] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        Minder.registerInitHook(function() {
            this._initPaper();
        });
        kity.extendClass(Minder, {
            _initPaper: function() {
                this._paper = new kity.Paper();
                this._paper._minder = this;
                this._paper.getNode().ondragstart = function(e) {
                    e.preventDefault();
                };
                this._paper.shapeNode.setAttribute("transform", "translate(0.5, 0.5)");
                this._addRenderContainer();
                this.setRoot(this.createNode());
                if (this._options.renderTo) {
                    this.renderTo(this._options.renderTo);
                }
            },
            _addRenderContainer: function() {
                this._rc = new kity.Group().setId(utils.uuid("minder"));
                this._paper.addShape(this._rc);
            },
            renderTo: function(target) {
                if (typeof target == "string") {
                    target = document.querySelector(target);
                }
                if (target) {
                    if (target.tagName.toLowerCase() == "script") {
                        var newTarget = document.createElement("div");
                        newTarget.id = target.id;
                        newTarget.class = target.class;
                        target.parentNode.insertBefore(newTarget, target);
                        target.parentNode.removeChild(target);
                        target = newTarget;
                    }
                    target.classList.add("km-view");
                    this._paper.renderTo(this._renderTarget = target);
                    this._bindEvents();
                    this.fire("paperrender");
                }
                return this;
            },
            getRenderContainer: function() {
                return this._rc;
            },
            getPaper: function() {
                return this._paper;
            },
            getRenderTarget: function() {
                return this._renderTarget;
            }
        });
    }
};

//lib/km-core/src/core/promise.js
_p[44] = {
    value: function(require, exports, module) {
        /*!
    **  Thenable -- Embeddable Minimum Strictly-Compliant Promises/A+ 1.1.1 Thenable
    **  Copyright (c) 2013-2014 Ralf S. Engelschall <http://engelschall.com>
    **  Licensed under The MIT License <http://opensource.org/licenses/MIT>
    **  Source-Code distributed on <http://github.com/rse/thenable>
    */
        /*  promise states [Promises/A+ 2.1]  */
        var STATE_PENDING = 0;
        /*  [Promises/A+ 2.1.1]  */
        var STATE_FULFILLED = 1;
        /*  [Promises/A+ 2.1.2]  */
        var STATE_REJECTED = 2;
        /*  [Promises/A+ 2.1.3]  */
        /*  promise object constructor  */
        var Promise = function(executor) {
            /*  optionally support non-constructor/plain-function call  */
            if (!(this instanceof Promise)) return new Promise(executor);
            /*  initialize object  */
            this.id = "Thenable/1.0.7";
            this.state = STATE_PENDING;
            /*  initial state  */
            this.fulfillValue = undefined;
            /*  initial value  */
            /*  [Promises/A+ 1.3, 2.1.2.2]  */
            this.rejectReason = undefined;
            /*  initial reason */
            /*  [Promises/A+ 1.5, 2.1.3.2]  */
            this.onFulfilled = [];
            /*  initial handlers  */
            this.onRejected = [];
            /*  initial handlers  */
            /*  support optional executor function  */
            if (typeof executor === "function") executor.call(this, this.fulfill.bind(this), this.reject.bind(this));
        };
        /*  Promise API methods  */
        Promise.prototype = {
            /*  promise resolving methods  */
            fulfill: function(value) {
                return deliver(this, STATE_FULFILLED, "fulfillValue", value);
            },
            reject: function(value) {
                return deliver(this, STATE_REJECTED, "rejectReason", value);
            },
            /*  'The then Method' [Promises/A+ 1.1, 1.2, 2.2]  */
            then: function(onFulfilled, onRejected) {
                var curr = this;
                var next = new Promise();
                /*  [Promises/A+ 2.2.7]  */
                curr.onFulfilled.push(resolver(onFulfilled, next, "fulfill"));
                /*  [Promises/A+ 2.2.2/2.2.6]  */
                curr.onRejected.push(resolver(onRejected, next, "reject"));
                /*  [Promises/A+ 2.2.3/2.2.6]  */
                execute(curr);
                return next;
            }
        };
        /*  deliver an action  */
        var deliver = function(curr, state, name, value) {
            if (curr.state === STATE_PENDING) {
                curr.state = state;
                /*  [Promises/A+ 2.1.2.1, 2.1.3.1]  */
                curr[name] = value;
                /*  [Promises/A+ 2.1.2.2, 2.1.3.2]  */
                execute(curr);
            }
            return curr;
        };
        /*  execute all handlers  */
        var execute = function(curr) {
            if (curr.state === STATE_FULFILLED) execute_handlers(curr, "onFulfilled", curr.fulfillValue); else if (curr.state === STATE_REJECTED) execute_handlers(curr, "onRejected", curr.rejectReason);
        };
        /*  execute particular set of handlers  */
        var execute_handlers = function(curr, name, value) {
            /* global process: true */
            /* global setImmediate: true */
            /* global setTimeout: true */
            /*  short-circuit processing  */
            if (curr[name].length === 0) return;
            /*  iterate over all handlers, exactly once  */
            var handlers = curr[name];
            curr[name] = [];
            /*  [Promises/A+ 2.2.2.3, 2.2.3.3]  */
            var func = function() {
                for (var i = 0; i < handlers.length; i++) handlers[i](value);
            };
            /*  execute procedure asynchronously  */
            /*  [Promises/A+ 2.2.4, 3.1]  */
            if (typeof process === "object" && typeof process.nextTick === "function") process.nextTick(func); else if (typeof setImmediate === "function") setImmediate(func); else setTimeout(func, 0);
        };
        /*  generate a resolver function */
        var resolver = function(cb, next, method) {
            return function(value) {
                if (typeof cb !== "function") /*  [Promises/A+ 2.2.1, 2.2.7.3, 2.2.7.4]  */
                next[method].call(next, value); else {
                    var result;
                    try {
                        if (value instanceof Promise) {
                            result = value.then(cb);
                        } else result = cb(value);
                    } /*  [Promises/A+ 2.2.2.1, 2.2.3.1, 2.2.5, 3.2]  */
                    catch (e) {
                        next.reject(e);
                        /*  [Promises/A+ 2.2.7.2]  */
                        return;
                    }
                    resolve(next, result);
                }
            };
        };
        /*  'Promise Resolution Procedure'  */
        /*  [Promises/A+ 2.3]  */
        var resolve = function(promise, x) {
            /*  sanity check arguments  */
            /*  [Promises/A+ 2.3.1]  */
            if (promise === x) {
                promise.reject(new TypeError("cannot resolve promise with itself"));
                return;
            }
            /*  surgically check for a 'then' method
            (mainly to just call the 'getter' of 'then' only once)  */
            var then;
            if (typeof x === "object" && x !== null || typeof x === "function") {
                try {
                    then = x.then;
                } /*  [Promises/A+ 2.3.3.1, 3.5]  */
                catch (e) {
                    promise.reject(e);
                    /*  [Promises/A+ 2.3.3.2]  */
                    return;
                }
            }
            /*  handle own Thenables    [Promises/A+ 2.3.2]
            and similar 'thenables' [Promises/A+ 2.3.3]  */
            if (typeof then === "function") {
                var resolved = false;
                try {
                    /*  call retrieved 'then' method */
                    /*  [Promises/A+ 2.3.3.3]  */
                    then.call(x, /*  resolvePromise  */
                    /*  [Promises/A+ 2.3.3.3.1]  */
                    function(y) {
                        if (resolved) return;
                        resolved = true;
                        /*  [Promises/A+ 2.3.3.3.3]  */
                        if (y === x) /*  [Promises/A+ 3.6]  */
                        promise.reject(new TypeError("circular thenable chain")); else resolve(promise, y);
                    }, /*  rejectPromise  */
                    /*  [Promises/A+ 2.3.3.3.2]  */
                    function(r) {
                        if (resolved) return;
                        resolved = true;
                        /*  [Promises/A+ 2.3.3.3.3]  */
                        promise.reject(r);
                    });
                } catch (e) {
                    if (!resolved) /*  [Promises/A+ 2.3.3.3.3]  */
                    promise.reject(e);
                }
                return;
            }
            /*  handle other values  */
            promise.fulfill(x);
        };
        Promise.resolve = function(value) {
            return new Promise(function(resolve) {
                resolve(value);
            });
        };
        Promise.reject = function(reason) {
            return new Promise(function(resolve, reject) {
                reject(reason);
            });
        };
        /*  export API  */
        module.exports = Promise;
    }
};

//lib/km-core/src/core/readonly.js
/**
 * @fileOverview
 *
 * 只读模式支持
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[45] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var Minder = _p.r(39);
        Minder.registerInitHook(function(options) {
            if (options.readOnly) {
                this.setDisabled();
            }
        });
        kity.extendClass(Minder, {
            disable: function() {
                var me = this;
                //禁用命令
                me.bkqueryCommandState = me.queryCommandState;
                me.bkqueryCommandValue = me.queryCommandValue;
                me.queryCommandState = function(type) {
                    var cmd = this._getCommand(type);
                    if (cmd && cmd.enableReadOnly) {
                        return me.bkqueryCommandState.apply(me, arguments);
                    }
                    return -1;
                };
                me.queryCommandValue = function(type) {
                    var cmd = this._getCommand(type);
                    if (cmd && cmd.enableReadOnly) {
                        return me.bkqueryCommandValue.apply(me, arguments);
                    }
                    return null;
                };
                this.setStatus("readonly");
                me._interactChange();
            },
            enable: function() {
                var me = this;
                if (me.bkqueryCommandState) {
                    me.queryCommandState = me.bkqueryCommandState;
                    delete me.bkqueryCommandState;
                }
                if (me.bkqueryCommandValue) {
                    me.queryCommandValue = me.bkqueryCommandValue;
                    delete me.bkqueryCommandValue;
                }
                this.setStatus("normal");
                me._interactChange();
            }
        });
    }
};

//lib/km-core/src/core/render.js
_p[46] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Renderer = kity.createClass("Renderer", {
            constructor: function(node) {
                this.node = node;
            },
            create: function(node) {
                throw new Error("Not implement: Renderer.create()");
            },
            shouldRender: function(node) {
                return true;
            },
            watchChange: function(data) {
                var changed;
                if (this.watchingData === undefined) {
                    changed = true;
                } else if (this.watchingData != data) {
                    changed = true;
                } else {
                    changed = false;
                }
                this.watchingData = data;
            },
            shouldDraw: function(node) {
                return true;
            },
            update: function(shape, node, box) {
                if (this.shouldDraw()) this.draw(shape, node);
                return this.place(shape, node, box);
            },
            draw: function(shape, node) {
                throw new Error("Not implement: Renderer.draw()");
            },
            place: function(shape, node, box) {
                throw new Error("Not implement: Renderer.place()");
            },
            getRenderShape: function() {
                return this._renderShape || null;
            },
            setRenderShape: function(shape) {
                this._renderShape = shape;
            }
        });
        function createMinderExtension() {
            function createRendererForNode(node, registered) {
                var renderers = [];
                [ "center", "left", "right", "top", "bottom", "outline", "outside" ].forEach(function(section) {
                    var before = "before" + section;
                    var after = "after" + section;
                    if (registered[before]) {
                        renderers = renderers.concat(registered[before]);
                    }
                    if (registered[section]) {
                        renderers = renderers.concat(registered[section]);
                    }
                    if (registered[after]) {
                        renderers = renderers.concat(registered[after]);
                    }
                });
                node._renderers = renderers.map(function(Renderer) {
                    return new Renderer(node);
                });
            }
            return {
                renderNodeBatch: function(nodes) {
                    var rendererClasses = this._rendererClasses;
                    var lastBoxes = [];
                    var rendererCount = 0;
                    var i, j, renderer, node;
                    if (!nodes.length) return;
                    for (j = 0; j < nodes.length; j++) {
                        node = nodes[j];
                        if (!node._renderers) {
                            createRendererForNode(node, rendererClasses);
                        }
                        node._contentBox = new kity.Box();
                        this.fire("beforerender", {
                            node: node
                        });
                    }
                    // 所有节点渲染器数量是一致的
                    rendererCount = nodes[0]._renderers.length;
                    for (i = 0; i < rendererCount; i++) {
                        // 获取延迟盒子数据
                        for (j = 0; j < nodes.length; j++) {
                            if (typeof lastBoxes[j] == "function") {
                                lastBoxes[j] = lastBoxes[j]();
                            }
                            if (!(lastBoxes[j] instanceof kity.Box)) {
                                lastBoxes[j] = new kity.Box(lastBoxes[j]);
                            }
                        }
                        for (j = 0; j < nodes.length; j++) {
                            node = nodes[j];
                            renderer = node._renderers[i];
                            // 合并盒子
                            if (lastBoxes[j]) {
                                node._contentBox = node._contentBox.merge(lastBoxes[j]);
                                renderer.contentBox = lastBoxes[j];
                            }
                            // 判断当前上下文是否应该渲染
                            if (renderer.shouldRender(node)) {
                                // 应该渲染，但是渲染图形没创建过，需要创建
                                if (!renderer.getRenderShape()) {
                                    renderer.setRenderShape(renderer.create(node));
                                    if (renderer.bringToBack) {
                                        node.getRenderContainer().prependShape(renderer.getRenderShape());
                                    } else {
                                        node.getRenderContainer().appendShape(renderer.getRenderShape());
                                    }
                                }
                                // 强制让渲染图形显示
                                renderer.getRenderShape().setVisible(true);
                                // 更新渲染图形
                                lastBoxes[j] = renderer.update(renderer.getRenderShape(), node, node._contentBox);
                            } else if (renderer.getRenderShape()) {
                                renderer.getRenderShape().setVisible(false);
                                lastBoxes[j] = null;
                            }
                        }
                    }
                    for (j = 0; j < nodes.length; j++) {
                        this.fire("noderender", {
                            node: nodes[j]
                        });
                    }
                },
                renderNode: function(node) {
                    var rendererClasses = this._rendererClasses;
                    var i, latestBox, renderer;
                    if (!node._renderers) {
                        createRendererForNode(node, rendererClasses);
                    }
                    this.fire("beforerender", {
                        node: node
                    });
                    node._contentBox = new kity.Box();
                    node._renderers.forEach(function(renderer) {
                        // 判断当前上下文是否应该渲染
                        if (renderer.shouldRender(node)) {
                            // 应该渲染，但是渲染图形没创建过，需要创建
                            if (!renderer.getRenderShape()) {
                                renderer.setRenderShape(renderer.create(node));
                                if (renderer.bringToBack) {
                                    node.getRenderContainer().prependShape(renderer.getRenderShape());
                                } else {
                                    node.getRenderContainer().appendShape(renderer.getRenderShape());
                                }
                            }
                            // 强制让渲染图形显示
                            renderer.getRenderShape().setVisible(true);
                            // 更新渲染图形
                            latestBox = renderer.update(renderer.getRenderShape(), node, node._contentBox);
                            if (typeof latestBox == "function") latestBox = latestBox();
                            // 合并渲染区域
                            if (latestBox) {
                                node._contentBox = node._contentBox.merge(latestBox);
                                renderer.contentBox = latestBox;
                            }
                        } else if (renderer.getRenderShape()) {
                            renderer.getRenderShape().setVisible(false);
                        }
                    });
                    this.fire("noderender", {
                        node: node
                    });
                }
            };
        }
        kity.extendClass(Minder, createMinderExtension());
        kity.extendClass(MinderNode, {
            render: function() {
                if (!this.attached) return;
                this.getMinder().renderNode(this);
                return this;
            },
            renderTree: function() {
                if (!this.attached) return;
                var list = [];
                this.traverse(function(node) {
                    list.push(node);
                });
                this.getMinder().renderNodeBatch(list);
                return this;
            },
            getRenderer: function(type) {
                var rs = this._renderers;
                if (!rs) return null;
                for (var i = 0; i < rs.length; i++) {
                    if (rs[i].getType() == type) return rs[i];
                }
                return null;
            },
            getContentBox: function() {
                //if (!this._contentBox) this.render();
                return this.parent && this.parent.isCollapsed() ? new kity.Box() : this._contentBox || new kity.Box();
            },
            getRenderBox: function(rendererType, refer) {
                var renderer = rendererType && this.getRenderer(rendererType);
                var contentBox = renderer ? renderer.contentBox : this.getContentBox();
                var ctm = kity.Matrix.getCTM(this.getRenderContainer(), refer || "paper");
                return ctm.transformBox(contentBox);
            }
        });
        module.exports = Renderer;
    }
};

//lib/km-core/src/core/select.js
_p[47] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        Minder.registerInitHook(function() {
            this._initSelection();
        });
        // 选区管理
        kity.extendClass(Minder, {
            _initSelection: function() {
                this._selectedNodes = [];
            },
            renderChangedSelection: function(last) {
                var current = this.getSelectedNodes();
                var changed = [];
                current.forEach(function(node) {
                    if (last.indexOf(node) == -1) {
                        changed.push(node);
                    }
                });
                last.forEach(function(node) {
                    if (current.indexOf(node) == -1) {
                        changed.push(node);
                    }
                });
                if (changed.length) {
                    this._interactChange();
                    this.fire("selectionchange");
                }
                while (changed.length) {
                    changed.shift().render();
                }
            },
            getSelectedNodes: function() {
                //不能克隆返回，会对当前选区操作，从而影响querycommand
                return this._selectedNodes;
            },
            getSelectedNode: function() {
                return this.getSelectedNodes()[0] || null;
            },
            removeAllSelectedNodes: function() {
                var me = this;
                var last = this._selectedNodes.splice(0);
                this._selectedNodes = [];
                this.renderChangedSelection(last);
                return this.fire("selectionclear");
            },
            removeSelectedNodes: function(nodes) {
                var me = this;
                var last = this._selectedNodes.slice(0);
                nodes = utils.isArray(nodes) ? nodes : [ nodes ];
                nodes.forEach(function(node) {
                    var index;
                    if ((index = me._selectedNodes.indexOf(node)) === -1) return;
                    me._selectedNodes.splice(index, 1);
                });
                this.renderChangedSelection(last);
                return this;
            },
            select: function(nodes, isSingleSelect) {
                var lastSelect = this.getSelectedNodes().slice(0);
                if (isSingleSelect) {
                    this._selectedNodes = [];
                }
                var me = this;
                nodes = utils.isArray(nodes) ? nodes : [ nodes ];
                nodes.forEach(function(node) {
                    if (me._selectedNodes.indexOf(node) !== -1) return;
                    me._selectedNodes.unshift(node);
                });
                this.renderChangedSelection(lastSelect);
                return this;
            },
            //当前选区中的节点在给定的节点范围内的保留选中状态，
            //没在给定范围的取消选中，给定范围中的但没在当前选中范围的也做选中效果
            toggleSelect: function(node) {
                if (utils.isArray(node)) {
                    node.forEach(this.toggleSelect.bind(this));
                } else {
                    if (node.isSelected()) this.removeSelectedNodes(node); else this.select(node);
                }
                return this;
            },
            isSingleSelect: function() {
                return this._selectedNodes.length == 1;
            },
            getSelectedAncestors: function(includeRoot) {
                var nodes = this.getSelectedNodes().slice(0), ancestors = [], judge;
                // 根节点不参与计算
                var rootIndex = nodes.indexOf(this.getRoot());
                if (~rootIndex && !includeRoot) {
                    nodes.splice(rootIndex, 1);
                }
                // 判断 nodes 列表中是否存在 judge 的祖先
                function hasAncestor(nodes, judge) {
                    for (var i = nodes.length - 1; i >= 0; --i) {
                        if (nodes[i].isAncestorOf(judge)) return true;
                    }
                    return false;
                }
                // 按照拓扑排序
                nodes.sort(function(node1, node2) {
                    return node1.getLevel() - node2.getLevel();
                });
                // 因为是拓扑有序的，所以只需往上查找
                while (judge = nodes.pop()) {
                    if (!hasAncestor(nodes, judge)) {
                        ancestors.push(judge);
                    }
                }
                return ancestors;
            }
        });
        kity.extendClass(MinderNode, {
            isSelected: function() {
                var minder = this.getMinder();
                return minder && minder.getSelectedNodes().indexOf(this) != -1;
            }
        });
    }
};

//lib/km-core/src/core/shortcut.js
/**
 * @fileOverview
 *
 * 添加快捷键支持
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[48] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var keymap = _p.r(35);
        var Minder = _p.r(39);
        var MinderEvent = _p.r(33);
        /**
     * 计算包含 meta 键的 keycode
     *
     * @param  {String|KeyEvent} unknown
     */
        function getMetaKeyCode(unknown) {
            var CTRL_MASK = 4096;
            var ALT_MASK = 8192;
            var SHIFT_MASK = 16384;
            var metaKeyCode = 0;
            if (typeof unknown == "string") {
                // unknown as string
                unknown.toLowerCase().split(/\+\s*/).forEach(function(name) {
                    switch (name) {
                      case "ctrl":
                      case "cmd":
                        metaKeyCode |= CTRL_MASK;
                        break;

                      case "alt":
                        metaKeyCode |= ALT_MASK;
                        break;

                      case "shift":
                        metaKeyCode |= SHIFT_MASK;
                        break;

                      default:
                        metaKeyCode |= keymap[name];
                    }
                });
            } else {
                // unknown as key event
                if (unknown.ctrlKey || unknown.metaKey) {
                    metaKeyCode |= CTRL_MASK;
                }
                if (unknown.altKey) {
                    metaKeyCode |= ALT_MASK;
                }
                if (unknown.shiftKey) {
                    metaKeyCode |= SHIFT_MASK;
                }
                metaKeyCode |= unknown.keyCode;
            }
            return metaKeyCode;
        }
        kity.extendClass(MinderEvent, {
            isShortcutKey: function(keyCombine) {
                var keyEvent = this.originEvent;
                if (!keyEvent) return false;
                return getMetaKeyCode(keyCombine) == getMetaKeyCode(keyEvent);
            }
        });
        Minder.registerInitHook(function() {
            this._initShortcutKey();
        });
        kity.extendClass(Minder, {
            _initShortcutKey: function() {
                this._bindShortcutKeys();
            },
            _bindShortcutKeys: function() {
                var map = this._shortcutKeys = {};
                var has = "hasOwnProperty";
                this.on("keydown", function(e) {
                    for (var keys in map) {
                        if (!map[has](keys)) continue;
                        if (e.isShortcutKey(keys)) {
                            var fn = map[keys];
                            if (fn.__statusCondition && fn.__statusCondition != this.getStatus()) return;
                            fn();
                            e.preventDefault();
                        }
                    }
                });
            },
            addShortcut: function(keys, fn) {
                var binds = this._shortcutKeys;
                keys.split(/\|\s*/).forEach(function(combine) {
                    var parts = combine.split("::");
                    var status;
                    if (parts.length > 1) {
                        combine = parts[1];
                        status = parts[0];
                        fn.__statusCondition = status;
                    }
                    binds[combine] = fn;
                });
            },
            addCommandShortcutKeys: function(cmd, keys) {
                var binds = this._commandShortcutKeys || (this._commandShortcutKeys = {});
                var obj = {}, km = this;
                if (keys) {
                    obj[cmd] = keys;
                } else {
                    obj = cmd;
                }
                var minder = this;
                utils.each(obj, function(keys, command) {
                    binds[command] = keys;
                    minder.addShortcut(keys, function execCommandByShortcut() {
                        if (minder.queryCommandState(command) === 0) {
                            minder.execCommand(command);
                        }
                    });
                });
            },
            getCommandShortcutKey: function(cmd) {
                var binds = this._commandShortcutKeys;
                return binds && binds[cmd] || null;
            }
        });
    }
};

//lib/km-core/src/core/status.js
/**
 * @fileOverview
 *
 * 状态切换控制
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[49] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var Minder = _p.r(39);
        var sf = ~window.location.href.indexOf("status");
        var tf = ~window.location.href.indexOf("trace");
        Minder.registerInitHook(function() {
            this._initStatus();
        });
        kity.extendClass(Minder, {
            _initStatus: function() {
                this._status = "normal";
                this._rollbackStatus = "normal";
            },
            setStatus: function(status, force) {
                // 在 readonly 模式下，只有 force 为 true 才能切换回来
                if (this._status == "readonly" && !force) return this;
                if (status != this._status) {
                    this._rollbackStatus = this._status;
                    this._status = status;
                    this.fire("statuschange", {
                        lastStatus: this._rollbackStatus,
                        currentStatus: this._status
                    });
                    if (sf) {
                        /* global console: true */
                        console.log(window.event.type, this._rollbackStatus, "->", this._status);
                        if (tf) {
                            console.trace();
                        }
                    }
                }
                return this;
            },
            rollbackStatus: function() {
                this.setStatus(this._rollbackStatus);
            },
            getRollbackStatus: function() {
                return this._rollbackStatus;
            },
            getStatus: function() {
                return this._status;
            }
        });
    }
};

//lib/km-core/src/core/template.js
_p[50] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var Command = _p.r(29);
        var MinderNode = _p.r(41);
        var Module = _p.r(40);
        var _templates = {};
        function register(name, supports) {
            _templates[name] = supports;
        }
        exports.register = register;
        utils.extend(Minder, {
            getTemplateList: function() {
                return _templates;
            }
        });
        kity.extendClass(Minder, function() {
            var originGetTheme = Minder.prototype.getTheme;
            return {
                useTemplate: function(name, duration) {
                    this.setTemplate(name);
                    this.refresh(duration || 800);
                },
                getTemplate: function() {
                    return this._template || "default";
                },
                setTemplate: function(name) {
                    this._template = name || null;
                },
                getTemplateSupport: function(method) {
                    var supports = _templates[this.getTemplate()];
                    return supports && supports[method];
                },
                getTheme: function(node) {
                    var support = this.getTemplateSupport("getTheme") || originGetTheme;
                    return support.call(this, node);
                }
            };
        }());
        kity.extendClass(MinderNode, function() {
            var originGetLayout = MinderNode.prototype.getLayout;
            var originGetConnect = MinderNode.prototype.getConnect;
            return {
                getLayout: function() {
                    var support = this.getMinder().getTemplateSupport("getLayout") || originGetLayout;
                    return support.call(this, this);
                },
                getConnect: function() {
                    var support = this.getMinder().getTemplateSupport("getConnect") || originGetConnect;
                    return support.call(this, this);
                }
            };
        }());
        Module.register("TemplateModule", {
            /**
         * @command Template
         * @description 设置当前脑图的模板
         * @param {string} name 模板名称
         *    允许使用的模板可以使用 `kityminder.Minder.getTemplateList()` 查询
         * @state
         *   0: 始终可用
         * @return 返回当前的模板名称
         */
            commands: {
                template: kity.createClass("TemplateCommand", {
                    base: Command,
                    execute: function(minder, name) {
                        minder.useTemplate(name);
                        minder.execCommand("camera");
                    },
                    queryValue: function(minder) {
                        return minder.getTemplate() || "default";
                    }
                })
            }
        });
    }
};

//lib/km-core/src/core/theme.js
_p[51] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Module = _p.r(40);
        var Command = _p.r(29);
        var cssLikeValueMatcher = {
            left: function(value) {
                return 3 in value && value[3] || 1 in value && value[1] || value[0];
            },
            right: function(value) {
                return 1 in value && value[1] || value[0];
            },
            top: function(value) {
                return value[0];
            },
            bottom: function(value) {
                return 2 in value && value[2] || value[0];
            }
        };
        var _themes = {};
        /**
     * 注册一个主题
     *
     * @param  {String} name  主题的名称
     * @param  {Plain} theme 主题的样式描述
     *
     * @example
     *     Minder.registerTheme('default', {
     *         'root-color': 'red',
     *         'root-stroke': 'none',
     *         'root-padding': [10, 20]
     *     });
     */
        function register(name, theme) {
            _themes[name] = theme;
        }
        exports.register = register;
        utils.extend(Minder, {
            getThemeList: function() {
                return _themes;
            }
        });
        kity.extendClass(Minder, {
            /**
         * 切换脑图实例上的主题
         * @param  {String} name 要使用的主题的名称
         */
            useTheme: function(name) {
                this.setTheme(name);
                this.refresh(800);
                return true;
            },
            setTheme: function(name) {
                var lastTheme = this._theme;
                this._theme = name || null;
                var container = this.getRenderTarget();
                if (container) {
                    container.classList.remove("km-theme-" + lastTheme);
                    if (name) {
                        container.classList.add("km-theme-" + name);
                    }
                    container.style.background = this.getStyle("background");
                }
                this.fire("themechange", {
                    theme: name
                });
                return this;
            },
            /**
         * 获取脑图实例上的当前主题
         * @return {[type]} [description]
         */
            getTheme: function(node) {
                return this._theme || this.getOption("defaultTheme") || "fresh-blue";
            },
            getThemeItems: function(node) {
                var theme = this.getTheme(node);
                return _themes[this.getTheme(node)];
            },
            /**
         * 获得脑图实例上的样式
         * @param  {String} item 样式名称
         */
            getStyle: function(item, node) {
                var items = this.getThemeItems(node);
                var segment, dir, selector, value, matcher;
                if (item in items) return items[item];
                // 尝试匹配 CSS 数组形式的值
                // 比如 item 为 'pading-left'
                // theme 里有 {'padding': [10, 20]} 的定义，则可以返回 20
                segment = item.split("-");
                if (segment.length < 2) return null;
                dir = segment.pop();
                item = segment.join("-");
                if (item in items) {
                    value = items[item];
                    if (utils.isArray(value) && (matcher = cssLikeValueMatcher[dir])) {
                        return matcher(value);
                    }
                    if (!isNaN(value)) return value;
                }
                return null;
            },
            /**
         * 获取指定节点的样式
         * @param  {String} name 样式名称，可以不加节点类型的前缀
         */
            getNodeStyle: function(node, name) {
                var value = this.getStyle(node.getType() + "-" + name, node);
                return value !== null ? value : this.getStyle(name, node);
            }
        });
        kity.extendClass(MinderNode, {
            getStyle: function(name) {
                return this.getMinder().getNodeStyle(this, name);
            }
        });
        Module.register("Theme", {
            defaultOptions: {
                defaultTheme: "fresh-blue"
            },
            commands: {
                /**
             * @command Theme
             * @description 设置当前脑图的主题
             * @param {string} name 主题名称
             *    允许使用的主题可以使用 `kityminder.Minder.getThemeList()` 查询
             * @state
             *   0: 始终可用
             * @return 返回当前的主题名称
             */
                theme: kity.createClass("ThemeCommand", {
                    base: Command,
                    execute: function(km, name) {
                        return km.useTheme(name);
                    },
                    queryValue: function(km) {
                        return km.getTheme() || "default";
                    }
                })
            }
        });
        Minder.registerInitHook(function() {
            this.setTheme();
        });
    }
};

//lib/km-core/src/core/utils.js
_p[52] = {
    value: function(require, exports) {
        var kity = _p.r(37);
        var uuidMap = {};
        exports.extend = kity.Utils.extend.bind(kity.Utils);
        exports.each = kity.Utils.each.bind(kity.Utils);
        exports.uuid = function(group) {
            uuidMap[group] = uuidMap[group] ? uuidMap[group] + 1 : 1;
            return group + uuidMap[group];
        };
        exports.guid = function() {
            return (+new Date() * 1e6 + Math.floor(Math.random() * 1e6)).toString(36);
        };
        exports.trim = function(str) {
            return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, "");
        };
        exports.keys = function(plain) {
            var keys = [];
            for (var key in plain) {
                if (plain.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
        exports.clone = function(source) {
            return JSON.parse(JSON.stringify(source));
        };
        exports.comparePlainObject = function(a, b) {
            return JSON.stringify(a) == JSON.stringify(b);
        };
        exports.encodeHtml = function(str, reg) {
            return str ? str.replace(reg || /[&<">'](?:(amp|lt|quot|gt|#39|nbsp);)?/g, function(a, b) {
                if (b) {
                    return a;
                } else {
                    return {
                        "<": "&lt;",
                        "&": "&amp;",
                        '"': "&quot;",
                        ">": "&gt;",
                        "'": "&#39;"
                    }[a];
                }
            }) : "";
        };
        exports.clearWhiteSpace = function(str) {
            return str.replace(/[\u200b\t\r\n]/g, "");
        };
        exports.each([ "String", "Function", "Array", "Number", "RegExp", "Object" ], function(v) {
            var toString = Object.prototype.toString;
            exports["is" + v] = function(obj) {
                return toString.apply(obj) == "[object " + v + "]";
            };
        });
    }
};

//lib/km-core/src/expose-kityminder.js
_p[53] = {
    value: function(require, exports, module) {
        module.exports = window.kityminder = _p.r(54);
    }
};

//lib/km-core/src/kityminder.js
/**
 * @fileOverview
 *
 * 默认导出（全部模块）
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[54] = {
    value: function(require, exports, module) {
        var kityminder = {
            version: _p.r(39).version
        };
        // 核心导出，大写的部分导出类，小写的部分简单 require 一下
        // 这里顺序是有讲究的，调整前先弄清楚依赖关系。
        _p.r(52);
        kityminder.Minder = _p.r(39);
        kityminder.Command = _p.r(29);
        kityminder.Node = _p.r(41);
        _p.r(42);
        _p.r(28);
        kityminder.Event = _p.r(33);
        kityminder.data = _p.r(32);
        _p.r(30);
        kityminder.KeyMap = _p.r(35);
        _p.r(48);
        _p.r(49);
        _p.r(43);
        _p.r(47);
        _p.r(34);
        _p.r(36);
        kityminder.Module = _p.r(40);
        _p.r(45);
        kityminder.Render = _p.r(46);
        kityminder.Connect = _p.r(31);
        kityminder.Layout = _p.r(38);
        kityminder.Theme = _p.r(51);
        kityminder.Template = _p.r(50);
        kityminder.Promise = _p.r(44);
        // 模块依赖
        _p.r(60);
        _p.r(61);
        _p.r(62);
        _p.r(63);
        _p.r(64);
        _p.r(65);
        _p.r(66);
        _p.r(67);
        _p.r(68);
        _p.r(69);
        _p.r(70);
        _p.r(71);
        _p.r(72);
        _p.r(73);
        _p.r(74);
        _p.r(75);
        _p.r(76);
        _p.r(77);
        _p.r(78);
        _p.r(79);
        _p.r(80);
        _p.r(81);
        _p.r(82);
        _p.r(86);
        _p.r(83);
        _p.r(85);
        _p.r(84);
        _p.r(59);
        _p.r(55);
        _p.r(56);
        _p.r(57);
        _p.r(58);
        _p.r(92);
        _p.r(95);
        _p.r(94);
        _p.r(93);
        _p.r(95);
        _p.r(22);
        _p.r(23);
        _p.r(24);
        _p.r(25);
        _p.r(26);
        _p.r(27);
        _p.r(87);
        _p.r(91);
        _p.r(88);
        _p.r(90);
        _p.r(89);
        module.exports = kityminder;
    }
};

//lib/km-core/src/layout/btree.js
_p[55] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var Layout = _p.r(38);
        [ "left", "right", "top", "bottom" ].forEach(registerLayoutForDirection);
        function registerLayoutForDirection(name) {
            var axis = name == "left" || name == "right" ? "x" : "y";
            var dir = name == "left" || name == "top" ? -1 : 1;
            var oppsite = {
                left: "right",
                right: "left",
                top: "bottom",
                bottom: "top",
                x: "y",
                y: "x"
            };
            function getOrderHint(node) {
                var hint = [];
                var box = node.getLayoutBox();
                var offset = 5;
                if (axis == "x") {
                    hint.push({
                        type: "up",
                        node: node,
                        area: new kity.Box({
                            x: box.x,
                            y: box.top - node.getStyle("margin-top") - offset,
                            width: box.width,
                            height: node.getStyle("margin-top")
                        }),
                        path: [ "M", box.x, box.top - offset, "L", box.right, box.top - offset ]
                    });
                    hint.push({
                        type: "down",
                        node: node,
                        area: new kity.Box({
                            x: box.x,
                            y: box.bottom + offset,
                            width: box.width,
                            height: node.getStyle("margin-bottom")
                        }),
                        path: [ "M", box.x, box.bottom + offset, "L", box.right, box.bottom + offset ]
                    });
                } else {
                    hint.push({
                        type: "up",
                        node: node,
                        area: new kity.Box({
                            x: box.left - node.getStyle("margin-left") - offset,
                            y: box.top,
                            width: node.getStyle("margin-left"),
                            height: box.height
                        }),
                        path: [ "M", box.left - offset, box.top, "L", box.left - offset, box.bottom ]
                    });
                    hint.push({
                        type: "down",
                        node: node,
                        area: new kity.Box({
                            x: box.right + offset,
                            y: box.top,
                            width: node.getStyle("margin-right"),
                            height: box.height
                        }),
                        path: [ "M", box.right + offset, box.top, "L", box.right + offset, box.bottom ]
                    });
                }
                return hint;
            }
            Layout.register(name, kity.createClass({
                base: Layout,
                doLayout: function(parent, children) {
                    var pbox = parent.getContentBox();
                    if (axis == "x") {
                        parent.setVertexOut(new kity.Point(pbox[name], pbox.cy));
                        parent.setLayoutVectorOut(new kity.Vector(dir, 0));
                    } else {
                        parent.setVertexOut(new kity.Point(pbox.cx, pbox[name]));
                        parent.setLayoutVectorOut(new kity.Vector(0, dir));
                    }
                    if (!children.length) {
                        return false;
                    }
                    children.forEach(function(child) {
                        var cbox = child.getContentBox();
                        child.setLayoutTransform(new kity.Matrix());
                        if (axis == "x") {
                            child.setVertexIn(new kity.Point(cbox[oppsite[name]], cbox.cy));
                            child.setLayoutVectorIn(new kity.Vector(dir, 0));
                        } else {
                            child.setVertexIn(new kity.Point(cbox.cx, cbox[oppsite[name]]));
                            child.setLayoutVectorIn(new kity.Vector(0, dir));
                        }
                    });
                    this.align(children, oppsite[name]);
                    this.stack(children, oppsite[axis]);
                    var bbox = this.getBranchBox(children);
                    var xAdjust, yAdjust;
                    if (axis == "x") {
                        xAdjust = pbox[name];
                        xAdjust += dir * parent.getStyle("margin-" + name);
                        xAdjust += dir * children[0].getStyle("margin-" + oppsite[name]);
                        yAdjust = pbox.bottom;
                        yAdjust -= pbox.height / 2;
                        yAdjust -= bbox.height / 2;
                        yAdjust -= bbox.y;
                    } else {
                        xAdjust = pbox.right;
                        xAdjust -= pbox.width / 2;
                        xAdjust -= bbox.width / 2;
                        xAdjust -= bbox.x;
                        yAdjust = pbox[name];
                        yAdjust += dir * parent.getStyle("margin-" + name);
                        yAdjust += dir * children[0].getStyle("margin-" + oppsite[name]);
                    }
                    this.move(children, xAdjust, yAdjust);
                },
                getOrderHint: getOrderHint
            }));
        }
    }
};

//lib/km-core/src/layout/filetree.js
_p[56] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var Layout = _p.r(38);
        [ -1, 1 ].forEach(registerLayoutForDir);
        function registerLayoutForDir(dir) {
            var name = "filetree-" + (dir > 0 ? "down" : "up");
            Layout.register(name, kity.createClass({
                base: Layout,
                doLayout: function(parent, children, round) {
                    var pBox = parent.getContentBox();
                    var indent = 20;
                    parent.setVertexOut(new kity.Point(pBox.left + indent, dir > 0 ? pBox.bottom : pBox.top));
                    parent.setLayoutVectorOut(new kity.Vector(0, dir));
                    if (!children.length) return;
                    children.forEach(function(child) {
                        var cbox = child.getContentBox();
                        child.setLayoutTransform(new kity.Matrix());
                        child.setVertexIn(new kity.Point(cbox.left, cbox.cy));
                        child.setLayoutVectorIn(new kity.Vector(1, 0));
                    });
                    this.align(children, "left");
                    this.stack(children, "y");
                    var xAdjust = 0;
                    xAdjust += pBox.left;
                    xAdjust += indent;
                    xAdjust += children[0].getStyle("margin-left");
                    var yAdjust = 0;
                    if (dir > 0) {
                        yAdjust += pBox.bottom;
                        yAdjust += parent.getStyle("margin-bottom");
                        yAdjust += children[0].getStyle("margin-top");
                    } else {
                        yAdjust -= this.getTreeBox(children).bottom;
                        yAdjust += pBox.top;
                        yAdjust -= parent.getStyle("margin-top");
                        yAdjust -= children[0].getStyle("margin-bottom");
                    }
                    this.move(children, xAdjust, yAdjust);
                },
                getOrderHint: function(node) {
                    var hint = [];
                    var box = node.getLayoutBox();
                    var offset = node.getLevel() > 1 ? 3 : 5;
                    hint.push({
                        type: "up",
                        node: node,
                        area: new kity.Box({
                            x: box.x,
                            y: box.top - node.getStyle("margin-top") - offset,
                            width: box.width,
                            height: node.getStyle("margin-top")
                        }),
                        path: [ "M", box.x, box.top - offset, "L", box.right, box.top - offset ]
                    });
                    hint.push({
                        type: "down",
                        node: node,
                        area: new kity.Box({
                            x: box.x,
                            y: box.bottom + offset,
                            width: box.width,
                            height: node.getStyle("margin-bottom")
                        }),
                        path: [ "M", box.x, box.bottom + offset, "L", box.right, box.bottom + offset ]
                    });
                    return hint;
                }
            }));
        }
    }
};

//lib/km-core/src/layout/fish-bone-master.js
/**
 * @fileOverview
 *
 * 鱼骨图主骨架布局
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[57] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var Layout = _p.r(38);
        Layout.register("fish-bone-master", kity.createClass("FishBoneMasterLayout", {
            base: Layout,
            doLayout: function(parent, children, round) {
                var upPart = [], downPart = [];
                var child = children[0];
                var pBox = parent.getContentBox();
                parent.setVertexOut(new kity.Point(pBox.right, pBox.cy));
                parent.setLayoutVectorOut(new kity.Vector(1, 0));
                if (!child) return;
                var cBox = child.getContentBox();
                var pMarginRight = parent.getStyle("margin-right");
                var cMarginLeft = child.getStyle("margin-left");
                var cMarginTop = child.getStyle("margin-top");
                var cMarginBottom = child.getStyle("margin-bottom");
                children.forEach(function(child, index) {
                    child.setLayoutTransform(new kity.Matrix());
                    var cBox = child.getContentBox();
                    if (index % 2) {
                        downPart.push(child);
                        child.setVertexIn(new kity.Point(cBox.left, cBox.top));
                        child.setLayoutVectorIn(new kity.Vector(1, 1));
                    } else {
                        upPart.push(child);
                        child.setVertexIn(new kity.Point(cBox.left, cBox.bottom));
                        child.setLayoutVectorIn(new kity.Vector(1, -1));
                    }
                });
                this.stack(upPart, "x");
                this.stack(downPart, "x");
                this.align(upPart, "bottom");
                this.align(downPart, "top");
                var xAdjust = pBox.right + pMarginRight + cMarginLeft;
                var yAdjustUp = pBox.cy - cMarginBottom - parent.getStyle("margin-top");
                var yAdjustDown = pBox.cy + cMarginTop + parent.getStyle("margin-bottom");
                this.move(upPart, xAdjust, yAdjustUp);
                this.move(downPart, xAdjust + cMarginLeft, yAdjustDown);
            }
        }));
    }
};

//lib/km-core/src/layout/fish-bone-slave.js
/**
 * @fileOverview
 *
 *
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[58] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var Layout = _p.r(38);
        Layout.register("fish-bone-slave", kity.createClass("FishBoneSlaveLayout", {
            base: Layout,
            doLayout: function(parent, children, round) {
                var layout = this;
                var abs = Math.abs;
                var GOLD_CUT = 1 - .618;
                var pBox = parent.getContentBox();
                var vi = parent.getLayoutVectorIn();
                parent.setLayoutVectorOut(vi);
                var goldX = pBox.left + pBox.width * GOLD_CUT;
                var pout = new kity.Point(goldX, vi.y > 0 ? pBox.bottom : pBox.top);
                parent.setVertexOut(pout);
                var child = children[0];
                if (!child) return;
                var cBox = child.getContentBox();
                children.forEach(function(child, index) {
                    child.setLayoutTransform(new kity.Matrix());
                    child.setLayoutVectorIn(new kity.Vector(1, 0));
                    child.setVertexIn(new kity.Point(cBox.left, cBox.cy));
                });
                this.stack(children, "y");
                this.align(children, "left");
                var xAdjust = 0, yAdjust = 0;
                xAdjust += pout.x;
                if (parent.getLayoutVectorOut().y < 0) {
                    yAdjust -= this.getTreeBox(children).bottom;
                    yAdjust += parent.getContentBox().top;
                    yAdjust -= parent.getStyle("margin-top");
                    yAdjust -= child.getStyle("margin-bottom");
                } else {
                    yAdjust += parent.getContentBox().bottom;
                    yAdjust += parent.getStyle("margin-bottom");
                    yAdjust += child.getStyle("margin-top");
                }
                this.move(children, xAdjust, yAdjust);
                if (round == 2) {
                    children.forEach(function(child) {
                        var m = child.getLayoutTransform();
                        var cbox = child.getContentBox();
                        var pin = m.transformPoint(new kity.Point(cbox.left, 0));
                        layout.move([ child ], abs(pin.y - pout.y), 0);
                    });
                }
            }
        }));
    }
};

//lib/km-core/src/layout/mind.js
_p[59] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var Layout = _p.r(38);
        var Minder = _p.r(39);
        Layout.register("mind", kity.createClass({
            base: Layout,
            doLayout: function(node, children) {
                var layout = this;
                var half = Math.ceil(node.children.length / 2);
                var right = [];
                var left = [];
                children.forEach(function(child) {
                    if (child.getIndex() < half) right.push(child); else left.push(child);
                });
                var leftLayout = Minder.getLayoutInstance("left");
                var rightLayout = Minder.getLayoutInstance("right");
                leftLayout.doLayout(node, left);
                rightLayout.doLayout(node, right);
                var box = node.getContentBox();
                node.setVertexOut(new kity.Point(box.cx, box.cy));
                node.setLayoutVectorOut(new kity.Vector(0, 0));
            },
            getOrderHint: function(node) {
                var hint = [];
                var box = node.getLayoutBox();
                var offset = 5;
                hint.push({
                    type: "up",
                    node: node,
                    area: new kity.Box({
                        x: box.x,
                        y: box.top - node.getStyle("margin-top") - offset,
                        width: box.width,
                        height: node.getStyle("margin-top")
                    }),
                    path: [ "M", box.x, box.top - offset, "L", box.right, box.top - offset ]
                });
                hint.push({
                    type: "down",
                    node: node,
                    area: new kity.Box({
                        x: box.x,
                        y: box.bottom + offset,
                        width: box.width,
                        height: node.getStyle("margin-bottom")
                    }),
                    path: [ "M", box.x, box.bottom + offset, "L", box.right, box.bottom + offset ]
                });
                return hint;
            }
        }));
    }
};

//lib/km-core/src/module/arrange.js
_p[60] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        kity.extendClass(MinderNode, {
            arrange: function(index) {
                var parent = this.parent;
                if (!parent) return;
                var sibling = parent.children;
                if (index < 0 || index >= sibling.length) return;
                sibling.splice(this.getIndex(), 1);
                sibling.splice(index, 0, this);
                return this;
            }
        });
        function asc(nodeA, nodeB) {
            return nodeA.getIndex() - nodeB.getIndex();
        }
        function desc(nodeA, nodeB) {
            return -asc(nodeA, nodeB);
        }
        function canArrange(km) {
            var selected = km.getSelectedNode();
            return selected && selected.parent && selected.parent.children.length > 1;
        }
        /**
     * @command ArrangeUp
     * @description 向上调整选中节点的位置
     * @shortcut Alt + Up
     * @state
     *    0: 当前选中了具有相同父亲的节点
     *   -1: 其它情况
     */
        var ArrangeUpCommand = kity.createClass("ArrangeUpCommand", {
            base: Command,
            execute: function(km) {
                var nodes = km.getSelectedNodes();
                nodes.sort(asc);
                var lastIndexes = nodes.map(function(node) {
                    return node.getIndex();
                });
                nodes.forEach(function(node, index) {
                    node.arrange(lastIndexes[index] - 1);
                });
                km.layout(300);
            },
            queryState: function(km) {
                var selected = km.getSelectedNode();
                return selected ? 0 : -1;
            }
        });
        /**
     * @command ArrangeDown
     * @description 向下调整选中节点的位置
     * @shortcut Alt + Down
     * @state
     *    0: 当前选中了具有相同父亲的节点
     *   -1: 其它情况
     */
        var ArrangeDownCommand = kity.createClass("ArrangeUpCommand", {
            base: Command,
            execute: function(km) {
                var nodes = km.getSelectedNodes();
                nodes.sort(desc);
                var lastIndexes = nodes.map(function(node) {
                    return node.getIndex();
                });
                nodes.forEach(function(node, index) {
                    node.arrange(lastIndexes[index] + 1);
                });
                km.layout(300);
            },
            queryState: function(km) {
                var selected = km.getSelectedNode();
                return selected ? 0 : -1;
            }
        });
        /**
     * @command Arrange
     * @description 调整选中节点的位置
     * @param {number} index 调整后节点的新位置
     * @state
     *    0: 当前选中了具有相同父亲的节点
     *   -1: 其它情况
     */
        var ArrangeCommand = kity.createClass("ArrangeCommand", {
            base: Command,
            execute: function(km, index) {
                var nodes = km.getSelectedNodes().slice();
                if (!nodes.length) return;
                var ancestor = MinderNode.getCommonAncestor(nodes);
                if (ancestor != nodes[0].parent) return;
                var indexed = nodes.map(function(node) {
                    return {
                        index: node.getIndex(),
                        node: node
                    };
                });
                var asc = Math.min.apply(Math, indexed.map(function(one) {
                    return one.index;
                })) >= index;
                indexed.sort(function(a, b) {
                    return asc ? b.index - a.index : a.index - b.index;
                });
                indexed.forEach(function(one) {
                    one.node.arrange(index);
                });
                km.layout(300);
            },
            queryState: function(km) {
                var selected = km.getSelectedNode();
                return selected ? 0 : -1;
            }
        });
        Module.register("ArrangeModule", {
            commands: {
                arrangeup: ArrangeUpCommand,
                arrangedown: ArrangeDownCommand,
                arrange: ArrangeCommand
            },
            contextmenu: [ {
                command: "arrangeup"
            }, {
                command: "arrangedown"
            }, {
                divider: true
            } ],
            commandShortcutKeys: {
                arrangeup: "normal::alt+Up",
                arrangedown: "normal::alt+Down"
            }
        });
    }
};

//lib/km-core/src/module/basestyle.js
_p[61] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var TextRenderer = _p.r(79);
        Module.register("basestylemodule", function() {
            var km = this;
            function getNodeDataOrStyle(node, name) {
                return node.getData(name) || node.getStyle(name);
            }
            TextRenderer.registerStyleHook(function(node, textGroup) {
                var fontWeight = getNodeDataOrStyle(node, "font-weight");
                var fontStyle = getNodeDataOrStyle(node, "font-style");
                var styleHash = [ fontWeight, fontStyle ].join("/");
                textGroup.eachItem(function(index, item) {
                    item.setFont({
                        weight: fontWeight,
                        style: fontStyle
                    });
                });
            });
            return {
                commands: {
                    /**
                 * @command Bold
                 * @description 加粗选中的节点
                 * @shortcut Ctrl + B
                 * @state
                 *   0: 当前有选中的节点
                 *  -1: 当前没有选中的节点
                 *   1: 当前已选中的节点已加粗
                 */
                    bold: kity.createClass("boldCommand", {
                        base: Command,
                        execute: function(km) {
                            var nodes = km.getSelectedNodes();
                            if (this.queryState("bold") == 1) {
                                nodes.forEach(function(n) {
                                    n.setData("font-weight").render();
                                });
                            } else {
                                nodes.forEach(function(n) {
                                    n.setData("font-weight", "bold").render();
                                });
                            }
                            km.layout();
                        },
                        queryState: function() {
                            var nodes = km.getSelectedNodes(), result = 0;
                            if (nodes.length === 0) {
                                return -1;
                            }
                            nodes.forEach(function(n) {
                                if (n && n.getData("font-weight")) {
                                    result = 1;
                                    return false;
                                }
                            });
                            return result;
                        }
                    }),
                    /**
                 * @command Italic
                 * @description 加斜选中的节点
                 * @shortcut Ctrl + I
                 * @state
                 *   0: 当前有选中的节点
                 *  -1: 当前没有选中的节点
                 *   1: 当前已选中的节点已加斜
                 */
                    italic: kity.createClass("italicCommand", {
                        base: Command,
                        execute: function(km) {
                            var nodes = km.getSelectedNodes();
                            if (this.queryState("italic") == 1) {
                                nodes.forEach(function(n) {
                                    n.setData("font-style").render();
                                });
                            } else {
                                nodes.forEach(function(n) {
                                    n.setData("font-style", "italic").render();
                                });
                            }
                            km.layout();
                        },
                        queryState: function() {
                            var nodes = km.getSelectedNodes(), result = 0;
                            if (nodes.length === 0) {
                                return -1;
                            }
                            nodes.forEach(function(n) {
                                if (n && n.getData("font-style")) {
                                    result = 1;
                                    return false;
                                }
                            });
                            return result;
                        }
                    })
                },
                commandShortcutKeys: {
                    bold: "ctrl+b",
                    //bold
                    italic: "ctrl+i"
                }
            };
        });
    }
};

//lib/km-core/src/module/clipboard.js
_p[62] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        Module.register("ClipboardModule", function() {
            var km = this, _clipboardNodes = [], _selectedNodes = [];
            function appendChildNode(parent, child) {
                _selectedNodes.push(child);
                km.appendNode(child, parent);
                child.render();
                child.setLayoutOffset(null);
                var children = child.children.map(function(node) {
                    return node.clone();
                });
                for (var i = 0, ci; ci = children[i]; i++) {
                    appendChildNode(child, ci);
                }
            }
            function sendToClipboard(nodes) {
                if (!nodes.length) return;
                nodes.sort(function(a, b) {
                    return b.getIndex() - a.getIndex();
                });
                _clipboardNodes = nodes.map(function(node) {
                    return node.clone();
                });
            }
            /**
         * @command Copy
         * @description 复制当前选中的节点
         * @shortcut Ctrl + C
         * @state
         *   0: 当前有选中的节点
         *  -1: 当前没有选中的节点
         */
            var CopyCommand = kity.createClass("CopyCommand", {
                base: Command,
                execute: function(km) {
                    sendToClipboard(km.getSelectedAncestors(true));
                    this.setContentChanged(false);
                }
            });
            /**
         * @command Cut
         * @description 剪切当前选中的节点
         * @shortcut Ctrl + X
         * @state
         *   0: 当前有选中的节点
         *  -1: 当前没有选中的节点
         */
            var CutCommand = kity.createClass("CutCommand", {
                base: Command,
                execute: function(km) {
                    var ancestors = km.getSelectedAncestors();
                    if (ancestors.length === 0) return;
                    sendToClipboard(ancestors);
                    km.select(MinderNode.getCommonAncestor(ancestors), true);
                    ancestors.slice().forEach(function(node) {
                        km.removeNode(node);
                    });
                    km.layout(300);
                }
            });
            /**
         * @command Paste
         * @description 粘贴已复制的节点到每一个当前选中的节点上
         * @shortcut Ctrl + V
         * @state
         *   0: 当前有选中的节点
         *  -1: 当前没有选中的节点
         */
            var PasteCommand = kity.createClass("PasteCommand", {
                base: Command,
                execute: function(km) {
                    if (_clipboardNodes.length) {
                        var node = km.getSelectedNode();
                        if (!node) return;
                        for (var i = 0, ni; ni = _clipboardNodes[i]; i++) {
                            appendChildNode(node, ni.clone());
                        }
                        km.select(_selectedNodes, true);
                        _selectedNodes = [];
                        km.layout(300);
                    }
                },
                queryState: function(km) {
                    return km.getSelectedNode() ? 0 : -1;
                }
            });
            return {
                commands: {
                    copy: CopyCommand,
                    cut: CutCommand,
                    paste: PasteCommand
                },
                commandShortcutKeys: {
                    copy: "normal::ctrl+c|",
                    cut: "normal::ctrl+x",
                    paste: "normal::ctrl+v"
                }
            };
        });
    }
};

//lib/km-core/src/module/dragtree.js
_p[63] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        // 矩形的变形动画定义
        var MoveToParentCommand = kity.createClass("MoveToParentCommand", {
            base: Command,
            execute: function(minder, nodes, parent) {
                var node;
                for (var i = nodes.length - 1; i >= 0; i--) {
                    node = nodes[i];
                    if (node.parent) {
                        node.parent.removeChild(node);
                        parent.appendChild(node);
                        node.render();
                    }
                }
                parent.expand();
                minder.select(nodes, true);
            }
        });
        var DropHinter = kity.createClass("DropHinter", {
            base: kity.Group,
            constructor: function() {
                this.callBase();
                this.rect = new kity.Rect();
                this.addShape(this.rect);
            },
            render: function(target) {
                this.setVisible(!!target);
                if (target) {
                    this.rect.setBox(target.getLayoutBox()).setRadius(target.getStyle("radius") || 0).stroke(target.getStyle("drop-hint-color") || "yellow", target.getStyle("drop-hint-width") || 2);
                    this.bringTop();
                }
            }
        });
        var OrderHinter = kity.createClass("OrderHinter", {
            base: kity.Group,
            constructor: function() {
                this.callBase();
                this.area = new kity.Rect();
                this.path = new kity.Path();
                this.addShapes([ this.area, this.path ]);
            },
            render: function(hint) {
                this.setVisible(!!hint);
                if (hint) {
                    this.area.setBox(hint.area);
                    this.area.fill(hint.node.getStyle("order-hint-area-color") || "rgba(0, 255, 0, .5)");
                    this.path.setPathData(hint.path);
                    this.path.stroke(hint.node.getStyle("order-hint-path-color") || "#0f0", hint.node.getStyle("order-hint-path-width") || 1);
                }
            }
        });
        // 对拖动对象的一个替代盒子，控制整个拖放的逻辑，包括：
        //    1. 从节点列表计算出拖动部分
        //    2. 计算可以 drop 的节点，产生 drop 交互提示
        var TreeDragger = kity.createClass("TreeDragger", {
            constructor: function(minder) {
                this._minder = minder;
                this._dropHinter = new DropHinter();
                this._orderHinter = new OrderHinter();
                minder.getRenderContainer().addShapes([ this._dropHinter, this._orderHinter ]);
            },
            dragStart: function(position) {
                // 只记录开始位置，不马上开启拖放模式
                // 这个位置同时是拖放范围收缩时的焦点位置（中心）
                this._startPosition = position;
            },
            dragMove: function(position) {
                // 启动拖放模式需要最小的移动距离
                var DRAG_MOVE_THRESHOLD = 10;
                if (!this._startPosition) return;
                var movement = kity.Vector.fromPoints(this._dragPosition || this._startPosition, position);
                var minder = this._minder;
                this._dragPosition = position;
                if (!this._dragMode) {
                    // 判断拖放模式是否该启动
                    if (kity.Vector.fromPoints(this._dragPosition, this._startPosition).length() < DRAG_MOVE_THRESHOLD) {
                        return;
                    }
                    if (!this._enterDragMode()) {
                        return;
                    }
                }
                for (var i = 0; i < this._dragSources.length; i++) {
                    this._dragSources[i].setLayoutOffset(this._dragSources[i].getLayoutOffset().offset(movement));
                    minder.applyLayoutResult(this._dragSources[i]);
                }
                if (!this._dropTest()) {
                    this._orderTest();
                } else {
                    this._renderOrderHint(this._orderSucceedHint = null);
                }
            },
            dragEnd: function() {
                this._startPosition = null;
                this._dragPosition = null;
                if (!this._dragMode) {
                    return;
                }
                this._fadeDragSources(1);
                if (this._dropSucceedTarget) {
                    this._dragSources.forEach(function(source) {
                        source.setLayoutOffset(null);
                    });
                    this._minder.layout(-1);
                    this._minder.execCommand("movetoparent", this._dragSources, this._dropSucceedTarget);
                } else if (this._orderSucceedHint) {
                    var hint = this._orderSucceedHint;
                    var index = hint.node.getIndex();
                    var sourceIndexes = this._dragSources.map(function(source) {
                        // 顺便干掉布局偏移
                        source.setLayoutOffset(null);
                        return source.getIndex();
                    });
                    var maxIndex = Math.max.apply(Math, sourceIndexes);
                    var minIndex = Math.min.apply(Math, sourceIndexes);
                    if (index < minIndex && hint.type == "down") index++;
                    if (index > maxIndex && hint.type == "up") index--;
                    hint.node.setLayoutOffset(null);
                    this._minder.execCommand("arrange", index);
                    this._renderOrderHint(null);
                } else {
                    this._minder.fire("savescene");
                }
                this._minder.layout(300);
                this._leaveDragMode();
                this._minder.fire("contentchange");
            },
            // 进入拖放模式：
            //    1. 计算拖放源和允许的拖放目标
            //    2. 标记已启动
            _enterDragMode: function() {
                this._calcDragSources();
                if (!this._dragSources.length) {
                    this._startPosition = null;
                    return false;
                }
                this._fadeDragSources(.5);
                this._calcDropTargets();
                this._calcOrderHints();
                this._dragMode = true;
                this._minder.setStatus("dragtree");
                return true;
            },
            // 从选中的节点计算拖放源
            //    并不是所有选中的节点都作为拖放源，如果选中节点中存在 A 和 B，
            //    并且 A 是 B 的祖先，则 B 不作为拖放源
            //
            //    计算过程：
            //       1. 将节点按照树高排序，排序后只可能是前面节点是后面节点的祖先
            //       2. 从后往前枚举排序的结果，如果发现枚举目标之前存在其祖先，
            //          则排除枚举目标作为拖放源，否则加入拖放源
            _calcDragSources: function() {
                this._dragSources = this._minder.getSelectedAncestors();
            },
            _fadeDragSources: function(opacity) {
                var minder = this._minder;
                this._dragSources.forEach(function(source) {
                    source.getRenderContainer().setOpacity(opacity, 200);
                    source.traverse(function(node) {
                        if (opacity < 1) {
                            minder.detachNode(node);
                        } else {
                            minder.attachNode(node);
                        }
                    }, true);
                });
            },
            // 计算拖放目标可以释放的节点列表（释放意味着成为其子树），存在这条限制规则：
            //    - 不能拖放到拖放目标的子树上（允许拖放到自身，因为多选的情况下可以把其它节点加入）
            //
            //    1. 加入当前节点（初始为根节点）到允许列表
            //    2. 对于当前节点的每一个子节点：
            //       (1) 如果是拖放目标的其中一个节点，忽略（整棵子树被剪枝）
            //       (2) 如果不是拖放目标之一，以当前子节点为当前节点，回到 1 计算
            //    3. 返回允许列表
            //
            _calcDropTargets: function() {
                function findAvailableParents(nodes, root) {
                    var availables = [], i;
                    availables.push(root);
                    root.getChildren().forEach(function(test) {
                        for (i = 0; i < nodes.length; i++) {
                            if (nodes[i] == test) return;
                        }
                        availables = availables.concat(findAvailableParents(nodes, test));
                    });
                    return availables;
                }
                this._dropTargets = findAvailableParents(this._dragSources, this._minder.getRoot());
                this._dropTargetBoxes = this._dropTargets.map(function(source) {
                    return source.getLayoutBox();
                });
            },
            _calcOrderHints: function() {
                var sources = this._dragSources;
                var ancestor = MinderNode.getCommonAncestor(sources);
                // 只有一个元素选中，公共祖先是其父
                if (ancestor == sources[0]) ancestor = sources[0].parent;
                if (sources.length === 0 || ancestor != sources[0].parent) {
                    this._orderHints = [];
                    return;
                }
                var siblings = ancestor.children;
                this._orderHints = siblings.reduce(function(hint, sibling) {
                    if (sources.indexOf(sibling) == -1) {
                        hint = hint.concat(sibling.getOrderHint());
                    }
                    return hint;
                }, []);
            },
            _leaveDragMode: function() {
                this._dragMode = false;
                this._dropSucceedTarget = null;
                this._orderSucceedHint = null;
                this._renderDropHint(null);
                this._renderOrderHint(null);
                this._minder.rollbackStatus();
            },
            _drawForDragMode: function() {
                this._text.setContent(this._dragSources.length + " items");
                this._text.setPosition(this._startPosition.x, this._startPosition.y + 5);
                this._minder.getRenderContainer().addShape(this);
            },
            _boxTest: function(targets, targetBoxMapper, judge) {
                var sourceBoxes = this._dragSources.map(function(source) {
                    return source.getLayoutBox();
                });
                var i, j, target, sourceBox, targetBox;
                judge = judge || function(intersectBox, sourceBox, targetBox) {
                    return intersectBox && !intersectBox.isEmpty();
                };
                for (i = 0; i < targets.length; i++) {
                    target = targets[i];
                    targetBox = targetBoxMapper.call(this, target, i);
                    for (j = 0; j < sourceBoxes.length; j++) {
                        sourceBox = sourceBoxes[j];
                        var intersectBox = sourceBox.intersect(targetBox);
                        if (judge(intersectBox, sourceBox, targetBox)) {
                            return target;
                        }
                    }
                }
                return null;
            },
            _dropTest: function() {
                this._dropSucceedTarget = this._boxTest(this._dropTargets, function(target, i) {
                    return this._dropTargetBoxes[i];
                }, function(intersectBox, sourceBox, targetBox) {
                    function area(box) {
                        return box.width * box.height;
                    }
                    if (!intersectBox) return false;
                    // 面积判断
                    if (area(intersectBox) > .5 * Math.min(area(sourceBox), area(targetBox))) return true;
                    if (intersectBox.width + 1 >= Math.min(sourceBox.width, targetBox.width)) return true;
                    if (intersectBox.height + 1 >= Math.min(sourceBox.height, targetBox.height)) return true;
                    return false;
                });
                this._renderDropHint(this._dropSucceedTarget);
                return !!this._dropSucceedTarget;
            },
            _orderTest: function() {
                this._orderSucceedHint = this._boxTest(this._orderHints, function(hint) {
                    return hint.area;
                });
                this._renderOrderHint(this._orderSucceedHint);
                return !!this._orderSucceedHint;
            },
            _renderDropHint: function(target) {
                this._dropHinter.render(target);
            },
            _renderOrderHint: function(hint) {
                this._orderHinter.render(hint);
            },
            preventDragMove: function() {
                this._startPosition = null;
            }
        });
        Module.register("DragTree", function() {
            var dragger;
            return {
                init: function() {
                    dragger = new TreeDragger(this);
                    window.addEventListener("mouseup", function() {
                        dragger.dragEnd();
                    });
                },
                events: {
                    "normal.mousedown inputready.mousedown": function(e) {
                        // 单选中根节点也不触发拖拽
                        if (e.originEvent.button) return;
                        if (e.getTargetNode() && e.getTargetNode() != this.getRoot()) {
                            dragger.dragStart(e.getPosition());
                        }
                    },
                    "normal.mousemove dragtree.mousemove": function(e) {
                        dragger.dragMove(e.getPosition());
                    },
                    "normal.mouseup dragtree.beforemouseup": function(e) {
                        dragger.dragEnd();
                        //e.stopPropagation();
                        e.preventDefault();
                    },
                    statuschange: function(e) {
                        if (e.lastStatus == "textedit" && e.currentStatus == "normal") {
                            dragger.preventDragMove();
                        }
                    }
                },
                commands: {
                    movetoparent: MoveToParentCommand
                }
            };
        });
    }
};

//lib/km-core/src/module/expand.js
_p[64] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var keymap = _p.r(35);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        Module.register("Expand", function() {
            var minder = this;
            var EXPAND_STATE_DATA = "expandState", STATE_EXPAND = "expand", STATE_COLLAPSE = "collapse";
            // 将展开的操作和状态读取接口拓展到 MinderNode 上
            kity.extendClass(MinderNode, {
                /**
             * 展开节点
             * @param  {Policy} policy 展开的策略，默认为 KEEP_STATE
             */
                expand: function() {
                    this.setData(EXPAND_STATE_DATA, STATE_EXPAND);
                    return this;
                },
                /**
             * 收起节点
             */
                collapse: function() {
                    this.setData(EXPAND_STATE_DATA, STATE_COLLAPSE);
                    return this;
                },
                /**
             * 判断节点当前的状态是否为展开
             */
                isExpanded: function() {
                    var expanded = this.getData(EXPAND_STATE_DATA) !== STATE_COLLAPSE;
                    return expanded && (this.isRoot() || this.parent.isExpanded());
                },
                /**
             * 判断节点当前的状态是否为收起
             */
                isCollapsed: function() {
                    return !this.isExpanded();
                }
            });
            /**
         * @command Expand
         * @description 展开当前选中的节点，保证其可见
         * @param {bool} justParents 是否只展开到父亲
         *     * `false` - （默认）保证选中的节点以及其子树可见
         *     * `true` - 只保证选中的节点可见，不展开其子树
         * @state
         *   0: 当前有选中的节点
         *  -1: 当前没有选中的节点
         */
            var ExpandCommand = kity.createClass("ExpandCommand", {
                base: Command,
                execute: function(km, justParents) {
                    var node = km.getSelectedNode();
                    if (!node) return;
                    if (justParents) {
                        node = node.parent;
                    }
                    while (node.parent) {
                        node.expand();
                        node = node.parent;
                    }
                    node.renderTree();
                    km.layout(100);
                },
                queryState: function(km) {
                    return km.getSelectedNode() ? 0 : -1;
                }
            });
            /**
         * @command ExpandToLevel
         * @description 展开脑图到指定的层级
         * @param {number} level 指定展开到的层级，最少值为 1。
         * @state
         *   0: 一直可用
         */
            var ExpandToLevelCommand = kity.createClass("ExpandToLevelCommand", {
                base: Command,
                execute: function(km, level) {
                    km.getRoot().traverse(function(node) {
                        if (node.getLevel() < level) node.expand();
                        if (node.getLevel() == level) node.collapse();
                    });
                    km.refresh(100);
                },
                enableReadOnly: true
            });
            var Expander = kity.createClass("Expander", {
                base: kity.Group,
                constructor: function(node) {
                    this.callBase();
                    this.radius = 6;
                    this.outline = new kity.Circle(this.radius).stroke("gray").fill("white");
                    this.sign = new kity.Path().stroke("gray");
                    this.addShapes([ this.outline, this.sign ]);
                    this.initEvent(node);
                    this.setId(utils.uuid("node_expander"));
                    this.setStyle("cursor", "pointer");
                },
                initEvent: function(node) {
                    this.on("mousedown", function(e) {
                        if (node.isExpanded()) {
                            node.collapse();
                        } else {
                            node.expand();
                        }
                        node.renderTree().getMinder().layout(100);
                        node.getMinder().fire("contentchange");
                        e.stopPropagation();
                        e.preventDefault();
                    });
                    this.on("dblclick click mouseup", function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                    });
                },
                setState: function(state) {
                    if (state == "hide") {
                        this.setVisible(false);
                        return;
                    }
                    this.setVisible(true);
                    var pathData = [ "M", 1.5 - this.radius, 0, "L", this.radius - 1.5, 0 ];
                    if (state == STATE_COLLAPSE) {
                        pathData.push([ "M", 0, 1.5 - this.radius, "L", 0, this.radius - 1.5 ]);
                    }
                    this.sign.setPathData(pathData);
                }
            });
            var ExpanderRenderer = kity.createClass("ExpanderRenderer", {
                base: Renderer,
                create: function(node) {
                    if (node.isRoot()) return;
                    this.expander = new Expander(node);
                    node.getRenderContainer().prependShape(this.expander);
                    node.expanderRenderer = this;
                    this.node = node;
                    return this.expander;
                },
                shouldRender: function(node) {
                    return !node.isRoot();
                },
                update: function(expander, node, box) {
                    if (!node.parent) return;
                    var visible = node.parent.isExpanded();
                    expander.setState(visible && node.children.length ? node.getData(EXPAND_STATE_DATA) : "hide");
                    var vector = node.getLayoutVectorIn().normalize(expander.radius + node.getStyle("stroke-width"));
                    var position = node.getVertexIn().offset(vector.reverse());
                    this.expander.setTranslate(position);
                }
            });
            return {
                commands: {
                    expand: ExpandCommand,
                    expandtolevel: ExpandToLevelCommand
                },
                events: {
                    layoutapply: function(e) {
                        var r = e.node.getRenderer("ExpanderRenderer");
                        if (r.getRenderShape()) {
                            r.update(r.getRenderShape(), e.node);
                        }
                    },
                    beforerender: function(e) {
                        var node = e.node;
                        var visible = !node.parent || node.parent.isExpanded();
                        var minder = this;
                        node.getRenderContainer().setVisible(visible);
                        if (!visible) e.stopPropagation();
                    },
                    "normal.keydown": function(e) {
                        if (this.getStatus() == "textedit") return;
                        if (e.originEvent.keyCode == keymap["/"]) {
                            var node = this.getSelectedNode();
                            if (!node || node == this.getRoot()) return;
                            var expanded = node.isExpanded();
                            this.getSelectedNodes().forEach(function(node) {
                                if (expanded) node.collapse(); else node.expand();
                                node.renderTree();
                            });
                            this.layout(100);
                            this.fire("contentchange");
                            e.preventDefault();
                            e.stopPropagationImmediately();
                        }
                        if (e.isShortcutKey("Alt+`")) {
                            this.execCommand("expandtolevel", 9999);
                        }
                        for (var i = 1; i < 6; i++) {
                            if (e.isShortcutKey("Alt+" + i)) {
                                this.execCommand("expandtolevel", i);
                            }
                        }
                    }
                },
                renderers: {
                    outside: ExpanderRenderer
                },
                contextmenu: [ {
                    command: "expandtoleaf",
                    query: function() {
                        return !minder.getSelectedNode();
                    },
                    fn: function(minder) {
                        minder.execCommand("expandtolevel", 9999);
                    }
                }, {
                    command: "expandtolevel1",
                    query: function() {
                        return !minder.getSelectedNode();
                    },
                    fn: function(minder) {
                        minder.execCommand("expandtolevel", 1);
                    }
                }, {
                    command: "expandtolevel2",
                    query: function() {
                        return !minder.getSelectedNode();
                    },
                    fn: function(minder) {
                        minder.execCommand("expandtolevel", 2);
                    }
                }, {
                    command: "expandtolevel3",
                    query: function() {
                        return !minder.getSelectedNode();
                    },
                    fn: function(minder) {
                        minder.execCommand("expandtolevel", 3);
                    }
                }, {
                    divider: true
                } ]
            };
        });
    }
};

//lib/km-core/src/module/font.js
_p[65] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var TextRenderer = _p.r(79);
        function getNodeDataOrStyle(node, name) {
            return node.getData(name) || node.getStyle(name);
        }
        TextRenderer.registerStyleHook(function(node, textGroup) {
            var dataColor = node.getData("color");
            var selectedColor = node.getStyle("selected-color");
            var styleColor = node.getStyle("color");
            var foreColor = dataColor || (node.isSelected() && selectedColor ? selectedColor : styleColor);
            var fontFamily = getNodeDataOrStyle(node, "font-family");
            var fontSize = getNodeDataOrStyle(node, "font-size");
            textGroup.fill(foreColor);
            textGroup.eachItem(function(index, item) {
                item.setFont({
                    family: fontFamily,
                    size: fontSize
                });
            });
        });
        Module.register("fontmodule", {
            commands: {
                /**
             * @command ForeColor
             * @description 设置选中节点的字体颜色
             * @param {string} color 表示颜色的字符串
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 如果只有一个节点选中，返回已选中节点的字体颜色；否则返回 'mixed'。
             */
                forecolor: kity.createClass("fontcolorCommand", {
                    base: Command,
                    execute: function(km, color) {
                        var nodes = km.getSelectedNodes();
                        nodes.forEach(function(n) {
                            n.setData("color", color);
                            n.render();
                        });
                    },
                    queryState: function(km) {
                        return km.getSelectedNodes().length === 0 ? -1 : 0;
                    },
                    queryValue: function(km) {
                        if (km.getSelectedNodes().length == 1) {
                            return km.getSelectedNodes()[0].getData("color");
                        }
                        return "mixed";
                    }
                }),
                /**
             * @command Background
             * @description 设置选中节点的背景颜色
             * @param {string} color 表示颜色的字符串
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 如果只有一个节点选中，返回已选中节点的背景颜色；否则返回 'mixed'。
             */
                background: kity.createClass("backgroudCommand", {
                    base: Command,
                    execute: function(km, color) {
                        var nodes = km.getSelectedNodes();
                        nodes.forEach(function(n) {
                            n.setData("background", color);
                            n.render();
                        });
                    },
                    queryState: function(km) {
                        return km.getSelectedNodes().length === 0 ? -1 : 0;
                    },
                    queryValue: function(km) {
                        if (km.getSelectedNodes().length == 1) {
                            return km.getSelectedNodes()[0].getData("background");
                        }
                        return "mixed";
                    }
                }),
                /**
             * @command FontFamily
             * @description 设置选中节点的字体
             * @param {string} family 表示字体的字符串
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 返回首个选中节点的字体
             */
                fontfamily: kity.createClass("fontfamilyCommand", {
                    base: Command,
                    execute: function(km, family) {
                        var nodes = km.getSelectedNodes();
                        nodes.forEach(function(n) {
                            n.setData("font-family", family);
                            n.render();
                            km.layout();
                        });
                    },
                    queryState: function(km) {
                        return km.getSelectedNodes().length === 0 ? -1 : 0;
                    },
                    queryValue: function(km) {
                        var node = km.getSelectedNode();
                        if (node) return node.getData("font-family");
                        return null;
                    }
                }),
                /**
             * @command FontSize
             * @description 设置选中节点的字体大小
             * @param {number} size 字体大小（px）
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 返回首个选中节点的字体大小
             */
                fontsize: kity.createClass("fontsizeCommand", {
                    base: Command,
                    execute: function(km, size) {
                        var nodes = km.getSelectedNodes();
                        nodes.forEach(function(n) {
                            n.setData("font-size", size);
                            n.render();
                            km.layout(300);
                        });
                    },
                    queryState: function(km) {
                        return km.getSelectedNodes().length === 0 ? -1 : 0;
                    },
                    queryValue: function(km) {
                        var node = km.getSelectedNode();
                        if (node) return node.getData("font-size");
                        return null;
                    }
                })
            }
        });
    }
};

//lib/km-core/src/module/history.js
_p[66] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        function compareObject(source, target) {
            var tmp;
            if (isEmptyObject(source) !== isEmptyObject(target)) {
                return false;
            }
            if (getObjectLength(source) != getObjectLength(target)) {
                return false;
            }
            for (var p in source) {
                if (source.hasOwnProperty(p)) {
                    tmp = source[p];
                    if (target[p] === undefined) {
                        return false;
                    }
                    if (utils.isObject(tmp) || utils.isArray(tmp)) {
                        if (utils.isObject(target[p]) !== utils.isObject(tmp)) {
                            return false;
                        }
                        if (utils.isArray(tmp) !== utils.isArray(target[p])) {
                            return false;
                        }
                        if (compareObject(tmp, target[p]) === false) {
                            return false;
                        }
                    } else {
                        if (tmp != target[p]) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        function getObjectLength(obj) {
            if (utils.isArray(obj) || utils.isString(obj)) return obj.length;
            var count = 0;
            for (var key in obj) if (obj.hasOwnProperty(key)) count++;
            return count;
        }
        function isEmptyObject(obj) {
            if (obj === null || obj === undefined) return true;
            if (utils.isArray(obj) || utils.isString(obj)) return obj.length === 0;
            for (var key in obj) if (obj.hasOwnProperty(key)) return false;
            return true;
        }
        function getValueByIndex(data, index) {
            var initIndex = 0, result = 0;
            data.forEach(function(arr, i) {
                if (initIndex + arr.length >= index) {
                    if (index - initIndex == arr.length) {
                        if (arr.length == 1 && arr[0].width === 0) {
                            initIndex++;
                            return;
                        }
                        result = {
                            x: arr[arr.length - 1].x + arr[arr.length - 1].width,
                            y: arr[arr.length - 1].y
                        };
                    } else {
                        result = arr[index - initIndex];
                    }
                    return false;
                } else {
                    initIndex += arr.length + (arr.length == 1 && arr[0].width === 0 ? 0 : 1);
                }
            });
            return result;
        }
        function getNodeIndex(node, ignoreTextNode) {
            var preNode = node, i = 0;
            while (preNode = preNode.previousSibling) {
                if (ignoreTextNode && preNode.nodeType == 3) {
                    if (preNode.nodeType != preNode.nextSibling.nodeType) {
                        i++;
                    }
                    continue;
                }
                i++;
            }
            return i;
        }
        var km = this;
        var Scene = kity.createClass("Scene", {
            constructor: function(root, inputStatus) {
                this.data = root.clone();
                this.inputStatus = inputStatus;
            },
            getData: function() {
                return this.data;
            },
            cloneData: function() {
                return this.getData().clone();
            },
            equals: function(scene) {
                return this.getData().compareTo(scene.getData());
            },
            isInputStatus: function() {
                return this.inputStatus;
            },
            setInputStatus: function(status) {
                this.inputStatus = status;
            }
        });
        var HistoryManager = kity.createClass("HistoryManager", {
            constructor: function(km) {
                this.list = [];
                this.index = 0;
                this.hasUndo = false;
                this.hasRedo = false;
                this.km = km;
            },
            undo: function() {
                if (this.hasUndo) {
                    var currentScene = this.list[this.index];
                    //如果是输入文字时的保存，直接回复当前场景
                    if (currentScene && currentScene.isInputStatus()) {
                        this.saveScene();
                        this.restore(--this.index);
                        currentScene.setInputStatus(false);
                        return;
                    }
                    if (this.list.length == 1) {
                        this.restore(0);
                        return;
                    }
                    if (!this.list[this.index - 1] && this.list.length == 1) {
                        this.reset();
                        return;
                    }
                    while (this.list[this.index].equals(this.list[this.index - 1])) {
                        this.index--;
                        if (this.index === 0) {
                            return this.restore(0);
                        }
                    }
                    this.restore(--this.index);
                }
            },
            redo: function() {
                if (this.hasRedo) {
                    while (this.list[this.index].equals(this.list[this.index + 1])) {
                        this.index++;
                        if (this.index == this.list.length - 1) {
                            return this.restore(this.index);
                        }
                    }
                    this.restore(++this.index);
                }
            },
            partialRenewal: function(target) {
                var selectedNodes = [];
                function compareNode(source, target) {
                    if (source.getText() != target.getText()) {
                        return false;
                    }
                    if (compareObject(source.getData(), target.getData()) === false) {
                        return false;
                    }
                    return true;
                }
                function appendChildNode(parent, child) {
                    if (child.isSelected()) {
                        selectedNodes.push(child);
                    }
                    km.appendNode(child, parent);
                    child.render();
                    var children = child.children.slice();
                    for (var i = 0, ci; ci = children[i++]; ) {
                        appendChildNode(child, ci);
                    }
                }
                function traverseNode(srcNode, tagNode) {
                    if (compareNode(srcNode, tagNode) === false) {
                        srcNode.setValue(tagNode);
                    }
                    //todo，这里有性能问题，变成全部render了
                    srcNode.render();
                    if (srcNode.isSelected()) {
                        selectedNodes.push(srcNode);
                    }
                    for (var i = 0, j = 0, si, tj; si = srcNode.children[i], tj = tagNode.children[j], 
                    si || tj; i++, j++) {
                        if (si && !tj) {
                            i--;
                            km.removeNode(si);
                        } else if (!si && tj) {
                            j--;
                            appendChildNode(srcNode, tj);
                        } else {
                            traverseNode(si, tj);
                        }
                    }
                }
                var km = this.km;
                traverseNode(km.getRoot(), target);
                km.layout(200);
                km.select(selectedNodes, true);
                selectedNodes = [];
            },
            restore: function(index) {
                index = index === undefined ? this.index : index;
                var scene = this.list[index];
                this.partialRenewal(scene.cloneData());
                this.update();
                this.km.fire("restoreScene");
                this.km.fire("contentChange");
            },
            getScene: function(inputStatus) {
                return new Scene(this.km.getRoot(), inputStatus);
            },
            saveScene: function(inputStatus) {
                var currentScene = this.getScene(inputStatus);
                var lastScene = this.list[this.index];
                if (lastScene && lastScene.equals(currentScene)) {
                    if (inputStatus) {
                        lastScene.setInputStatus(true);
                        this.update();
                    }
                    return;
                }
                this.list = this.list.slice(0, this.index + 1);
                this.list.push(currentScene);
                //如果大于最大数量了，就把最前的剔除
                if (this.list.length > this.km.getOption("maxUndoCount")) {
                    this.list.shift();
                }
                this.index = this.list.length - 1;
                //跟新undo/redo状态
                this.update();
            },
            update: function() {
                this.hasRedo = !!this.list[this.index + 1];
                this.hasUndo = !!this.list[this.index - 1];
                var currentScene = this.list[this.index];
                if (currentScene && currentScene.isInputStatus()) {
                    this.hasUndo = true;
                }
            },
            reset: function() {
                this.list = [];
                this.index = 0;
                this.hasUndo = false;
                this.hasRedo = false;
            }
        });
        Module.register("HistoryModule", function() {
            //为km实例添加history管理
            this.historyManager = new HistoryManager(this);
            return {
                defaultOptions: {
                    maxUndoCount: 20,
                    maxInputCount: 20
                },
                commands: {
                    /**
                 * @command Undo
                 * @description 回退上一步操作
                 * @state
                 *   0: 当前有可回退的内容
                 *  -1: 当前没有可回退的内容
                 */
                    undo: kity.createClass("UndoCommand", {
                        base: Command,
                        execute: function(km) {
                            km.historyManager.undo();
                        },
                        queryState: function(km) {
                            return km.historyManager.hasUndo ? 0 : -1;
                        },
                        isNeedUndo: function() {
                            return false;
                        }
                    }),
                    /**
                 * @command Redo
                 * @description 重做下一步已回退的操作
                 * @state
                 *   0: 当前有可重做的内容
                 *  -1: 当前没有可重做的内容
                 */
                    redo: kity.createClass("RedoCommand", {
                        base: Command,
                        execute: function(km) {
                            km.historyManager.redo();
                        },
                        queryState: function(km) {
                            return km.historyManager.hasRedo ? 0 : -1;
                        },
                        isNeedUndo: function() {
                            return false;
                        }
                    })
                },
                commandShortcutKeys: {
                    undo: "ctrl+z",
                    //undo
                    redo: "ctrl+y"
                },
                events: {
                    saveScene: function(e) {
                        this.historyManager.saveScene(e.inputStatus);
                    },
                    "import": function() {
                        this.historyManager.reset();
                    }
                }
            };
        });
    }
};

//lib/km-core/src/module/hyperlink.js
_p[67] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        // jscs:disable maximumLineLength
        var linkShapePath = "M16.614,10.224h-1.278c-1.668,0-3.07-1.07-3.599-2.556h4.877c0.707,0,1.278-0.571,1.278-1.278V3.834 c0-0.707-0.571-1.278-1.278-1.278h-4.877C12.266,1.071,13.668,0,15.336,0h1.278c2.116,0,3.834,1.716,3.834,3.834V6.39 C20.448,8.508,18.73,10.224,16.614,10.224z M5.112,5.112c0-0.707,0.573-1.278,1.278-1.278h7.668c0.707,0,1.278,0.571,1.278,1.278 S14.765,6.39,14.058,6.39H6.39C5.685,6.39,5.112,5.819,5.112,5.112z M2.556,3.834V6.39c0,0.707,0.573,1.278,1.278,1.278h4.877 c-0.528,1.486-1.932,2.556-3.599,2.556H3.834C1.716,10.224,0,8.508,0,6.39V3.834C0,1.716,1.716,0,3.834,0h1.278 c1.667,0,3.071,1.071,3.599,2.556H3.834C3.129,2.556,2.556,3.127,2.556,3.834z";
        Module.register("hyperlink", {
            commands: {
                /**
             * @command HyperLink
             * @description 为选中的节点添加超链接
             * @param {string} url 超链接的 URL，设置为 null 移除
             * @param {string} title 超链接的说明
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 返回首个选中节点的超链接信息，JSON 对象： `{url: url, title: title}`
             */
                hyperlink: kity.createClass("hyperlink", {
                    base: Command,
                    execute: function(km, url, title) {
                        var nodes = km.getSelectedNodes();
                        nodes.forEach(function(n) {
                            n.setData("hyperlink", url);
                            n.setData("hyperlinkTitle", url && title);
                            n.render();
                        });
                        km.layout();
                    },
                    queryState: function(km) {
                        var nodes = km.getSelectedNodes(), result = 0;
                        if (nodes.length === 0) {
                            return -1;
                        }
                        nodes.forEach(function(n) {
                            if (n && n.getData("hyperlink")) {
                                result = 0;
                                return false;
                            }
                        });
                        return result;
                    },
                    queryValue: function(km) {
                        var node = km.getSelectedNode();
                        return {
                            url: node.getData("hyperlink"),
                            title: node.getData("hyperlinkTitle")
                        };
                    }
                })
            },
            renderers: {
                right: kity.createClass("hyperlinkrender", {
                    base: Renderer,
                    create: function() {
                        var link = new kity.HyperLink();
                        var linkshape = new kity.Path();
                        var outline = new kity.Rect(24, 22, -2, -6, 4).fill("rgba(255, 255, 255, 0)");
                        linkshape.setPathData(linkShapePath).fill("#666");
                        link.addShape(outline);
                        link.addShape(linkshape);
                        link.setTarget("_blank");
                        link.setStyle("cursor", "pointer");
                        link.on("mouseover", function() {
                            outline.fill("rgba(255, 255, 200, .8)");
                        }).on("mouseout", function() {
                            outline.fill("rgba(255, 255, 255, 0)");
                        });
                        return link;
                    },
                    shouldRender: function(node) {
                        return node.getData("hyperlink");
                    },
                    update: function(link, node, box) {
                        var href = node.getData("hyperlink");
                        link.setHref(href);
                        var title = node.getData("hyperlinkTitle");
                        if (title) {
                            title = [ title, "(", href, ")" ].join("");
                        } else {
                            title = href;
                        }
                        link.node.setAttributeNS("http://www.w3.org/1999/xlink", "title", title);
                        var spaceRight = node.getStyle("space-right");
                        link.setTranslate(box.right + spaceRight + 2, -5);
                        return new kity.Box({
                            x: box.right + spaceRight,
                            y: -11,
                            width: 24,
                            height: 22
                        });
                    }
                })
            }
        });
    }
};

//lib/km-core/src/module/image.js
_p[68] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        Module.register("image", function() {
            function loadImageSize(url, callback) {
                var img = document.createElement("img");
                img.onload = function() {
                    callback(img.width, img.height);
                };
                img.onerror = function() {
                    callback(null);
                };
                img.src = url;
            }
            function fitImageSize(width, height, maxWidth, maxHeight) {
                var ratio = width / height, fitRatio = maxWidth / maxHeight;
                // 宽高比大于最大尺寸的宽高比，以宽度为标准适应
                if (width > maxWidth && ratio > fitRatio) {
                    width = maxWidth;
                    height = width / ratio;
                } else if (height > maxHeight) {
                    height = maxHeight;
                    width = height * ratio;
                }
                return {
                    width: width | 0,
                    height: height | 0
                };
            }
            /**
         * @command Image
         * @description 为选中的节点添加图片
         * @param {string} url 图片的 URL，设置为 null 移除
         * @param {string} title 图片的说明
         * @state
         *   0: 当前有选中的节点
         *  -1: 当前没有选中的节点
         * @return 返回首个选中节点的图片信息，JSON 对象： `{url: url, title: title}`
         */
            var ImageCommand = kity.createClass("ImageCommand", {
                base: Command,
                execute: function(km, url, title) {
                    var nodes = km.getSelectedNodes();
                    loadImageSize(url, function(width, height) {
                        nodes.forEach(function(n) {
                            var size = fitImageSize(width, height, km.getOption("maxImageWidth"), km.getOption("maxImageHeight"));
                            n.setData("image", url);
                            n.setData("imageTitle", url && title);
                            n.setData("imageSize", url && size);
                            n.render();
                        });
                        km.fire("saveScene");
                        km.layout(300);
                    });
                },
                queryState: function(km) {
                    var nodes = km.getSelectedNodes(), result = 0;
                    if (nodes.length === 0) {
                        return -1;
                    }
                    nodes.forEach(function(n) {
                        if (n && n.getData("image")) {
                            result = 0;
                            return false;
                        }
                    });
                    return result;
                },
                queryValue: function(km) {
                    var node = km.getSelectedNode();
                    return {
                        url: node.getData("image"),
                        title: node.getData("imageTitle")
                    };
                }
            });
            var ImageRenderer = kity.createClass("ImageRenderer", {
                base: Renderer,
                create: function(node) {
                    return new kity.Image(node.getData("image"));
                },
                shouldRender: function(node) {
                    return node.getData("image");
                },
                update: function(image, node, box) {
                    var url = node.getData("image");
                    var title = node.getData("imageTitle");
                    var size = node.getData("imageSize");
                    var spaceTop = node.getStyle("space-top");
                    if (!size) return;
                    if (title) {
                        image.node.setAttributeNS("http://www.w3.org/1999/xlink", "title", title);
                    }
                    var x = box.cx - size.width / 2;
                    var y = box.y - size.height - spaceTop;
                    image.setUrl(url).setX(x | 0).setY(y | 0).setWidth(size.width | 0).setHeight(size.height | 0);
                    return new kity.Box(x | 0, y | 0, size.width | 0, size.height | 0);
                }
            });
            return {
                defaultOptions: {
                    maxImageWidth: 200,
                    maxImageHeight: 200
                },
                commands: {
                    image: ImageCommand
                },
                renderers: {
                    top: ImageRenderer
                }
            };
        });
    }
};

//lib/km-core/src/module/keynav.js
_p[69] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var keymap = _p.r(35);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        Module.register("KeyboardModule", function() {
            var min = Math.min, max = Math.max, abs = Math.abs, sqrt = Math.sqrt, exp = Math.exp;
            function buildPositionNetwork(root) {
                var pointIndexes = [], p;
                root.traverse(function(node) {
                    p = node.getLayoutBox();
                    // bugfix: 不应导航到收起的节点（判断其尺寸是否存在）
                    if (p.width && p.height) {
                        pointIndexes.push({
                            left: p.x,
                            top: p.y,
                            right: p.x + p.width,
                            bottom: p.y + p.height,
                            width: p.width,
                            height: p.height,
                            node: node,
                            text: node.getText()
                        });
                    }
                });
                for (var i = 0; i < pointIndexes.length; i++) {
                    findClosestPointsFor(pointIndexes, i);
                }
            }
            // 这是金泉的点子，赞！
            // 求两个不相交矩形的最近距离
            function getCoefedDistance(box1, box2) {
                var xMin, xMax, yMin, yMax, xDist, yDist, dist, cx, cy;
                xMin = min(box1.left, box2.left);
                xMax = max(box1.right, box2.right);
                yMin = min(box1.top, box2.top);
                yMax = max(box1.bottom, box2.bottom);
                xDist = xMax - xMin - box1.width - box2.width;
                yDist = yMax - yMin - box1.height - box2.height;
                if (xDist < 0) dist = yDist; else if (yDist < 0) dist = xDist; else dist = sqrt(xDist * xDist + yDist * yDist);
                return {
                    cx: dist,
                    cy: dist
                };
            }
            function findClosestPointsFor(pointIndexes, iFind) {
                var find = pointIndexes[iFind];
                var most = {}, quad;
                var current, dist;
                for (var i = 0; i < pointIndexes.length; i++) {
                    if (i == iFind) continue;
                    current = pointIndexes[i];
                    dist = getCoefedDistance(current, find);
                    // left check
                    if (current.right < find.left) {
                        if (!most.left || dist.cx < most.left.dist) {
                            most.left = {
                                dist: dist.cx,
                                node: current.node
                            };
                        }
                    }
                    // right check
                    if (current.left > find.right) {
                        if (!most.right || dist.cx < most.right.dist) {
                            most.right = {
                                dist: dist.cx,
                                node: current.node
                            };
                        }
                    }
                    // top check
                    if (current.bottom < find.top) {
                        if (!most.top || dist.cy < most.top.dist) {
                            most.top = {
                                dist: dist.cy,
                                node: current.node
                            };
                        }
                    }
                    // bottom check
                    if (current.top > find.bottom) {
                        if (!most.down || dist.cy < most.down.dist) {
                            most.down = {
                                dist: dist.cy,
                                node: current.node
                            };
                        }
                    }
                }
                find.node._nearestNodes = {
                    right: most.right && most.right.node || null,
                    top: most.top && most.top.node || null,
                    left: most.left && most.left.node || null,
                    down: most.down && most.down.node || null
                };
            }
            function navigateTo(km, direction) {
                var referNode = km.getSelectedNode();
                if (!referNode) {
                    km.select(km.getRoot());
                    buildPositionNetwork(km.getRoot());
                    return;
                }
                if (!referNode._nearestNodes) {
                    buildPositionNetwork(km.getRoot());
                }
                var nextNode = referNode._nearestNodes[direction];
                if (nextNode) {
                    km.select(nextNode, true);
                }
            }
            // 稀释用
            var lastFrame;
            return {
                events: {
                    layoutallfinish: function() {
                        var root = this.getRoot();
                        buildPositionNetwork(root);
                    },
                    "normal.keydown readonly.keydown": function(e) {
                        var minder = this;
                        [ "left", "right", "up", "down" ].forEach(function(key) {
                            if (e.isShortcutKey(key)) {
                                navigateTo(minder, key == "up" ? "top" : key);
                            }
                        });
                    }
                }
            };
        });
    }
};

//lib/km-core/src/module/layout.js
/**
 * @fileOverview
 *
 * 布局模块
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[70] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var Command = _p.r(29);
        var Module = _p.r(40);
        /**
     * @command Layout
     * @description 设置选中节点的布局
     *     允许使用的布局可以使用 `kityminder.Minder.getLayoutList()` 查询
     * @param {string} name 布局的名称，设置为 null 则使用继承或默认的布局
     * @state
     *   0: 当前有选中的节点
     *  -1: 当前没有选中的节点
     * @return 返回首个选中节点的布局名称
     */
        var LayoutCommand = kity.createClass("LayoutCommand", {
            base: Command,
            execute: function(minder, name) {
                var nodes = minder.getSelectedNodes();
                nodes.forEach(function(node) {
                    node.layout(name);
                });
            },
            queryValue: function(minder) {
                var node = minder.getSelectedNode();
                if (node) {
                    return node.getData("layout");
                }
            },
            queryState: function(minder) {
                return minder.getSelectedNode() ? 0 : -1;
            }
        });
        /**
     * @command ResetLayout
     * @description 重设选中节点的布局，如果当前没有选中的节点，重设整个脑图的布局
     * @state
     *   0: 始终可用
     * @return 返回首个选中节点的布局名称
     */
        var ResetLayoutCommand = kity.createClass("ResetLayoutCommand", {
            base: Command,
            execute: function(minder) {
                var nodes = minder.getSelectedNodes();
                if (!nodes.length) nodes = [ minder.getRoot() ];
                nodes.forEach(function(node) {
                    node.traverse(function(child) {
                        child.resetLayoutOffset();
                        if (!child.isRoot()) {
                            child.setData("layout", null);
                        }
                    });
                });
                minder.layout(300);
            },
            enableReadOnly: true
        });
        Module.register("LayoutModule", {
            commands: {
                layout: LayoutCommand,
                resetlayout: ResetLayoutCommand
            },
            contextmenu: [ {
                command: "resetlayout"
            }, {
                divider: true
            } ],
            commandShortcutKeys: {
                resetlayout: "Ctrl+Shift+L"
            }
        });
    }
};

//lib/km-core/src/module/node.js
_p[71] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        /**
     * @command AppendChildNode
     * @description 添加子节点到选中的节点中
     * @param {string|object} textOrData 要插入的节点的文本或数据
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
        var AppendChildCommand = kity.createClass("AppendChildCommand", {
            base: Command,
            execute: function(km, text) {
                var parent = km.getSelectedNode();
                if (!parent) {
                    return null;
                }
                parent.expand();
                var node = km.createNode(text, parent);
                km.select(node, true);
                node.render();
                km.layout(600);
            },
            queryState: function(km) {
                var selectedNode = km.getSelectedNode();
                return selectedNode ? 0 : -1;
            }
        });
        /**
     * @command AppendSiblingNode
     * @description 添加选中的节点的兄弟节点
     * @param {string|object} textOrData 要添加的节点的文本或数据
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
        var AppendSiblingCommand = kity.createClass("AppendSiblingCommand", {
            base: Command,
            execute: function(km, text) {
                var sibling = km.getSelectedNode();
                var parent = sibling.parent;
                if (!parent) {
                    return km.execCommand("AppendChildNode", text);
                }
                var node = km.createNode(text, parent, sibling.getIndex() + 1);
                node.setGlobalLayoutTransform(sibling.getGlobalLayoutTransform());
                km.select(node, true);
                node.render();
                km.layout(600);
            },
            queryState: function(km) {
                var selectedNode = km.getSelectedNode();
                return selectedNode ? 0 : -1;
            }
        });
        /**
     * @command RemoveNode
     * @description 移除选中的节点
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
        var RemoveNodeCommand = kity.createClass("RemoverNodeCommand", {
            base: Command,
            execute: function(km) {
                var nodes = km.getSelectedNodes();
                var ancestor = MinderNode.getCommonAncestor.apply(null, nodes);
                var index = nodes[0].getIndex();
                nodes.forEach(function(node) {
                    if (!node.isRoot()) km.removeNode(node);
                });
                if (nodes.length == 1) {
                    var selectBack = ancestor.children[index - 1] || ancestor.children[index];
                    km.select(selectBack || ancestor || km.getRoot(), true);
                } else {
                    km.select(ancestor || km.getRoot(), true);
                }
                km.layout(600);
            },
            queryState: function(km) {
                var selectedNode = km.getSelectedNode();
                return selectedNode ? 0 : -1;
            }
        });
        var AppendParentCommand = kity.createClass("AppendParentCommand", {
            base: Command,
            execute: function(km, text) {
                var nodes = km.getSelectedNodes();
                nodes.sort(function(a, b) {
                    return a.getIndex() - b.getIndex();
                });
                var parent = nodes[0].parent;
                var newParent = km.createNode(text, parent, nodes[0].getIndex());
                nodes.forEach(function(node) {
                    newParent.appendChild(node);
                });
                newParent.setGlobalLayoutTransform(nodes[nodes.length >> 1].getGlobalLayoutTransform());
                km.select(newParent, true);
                km.layout(600);
            },
            queryState: function(km) {
                var nodes = km.getSelectedNodes();
                if (!nodes.length) return;
                var parent = nodes[0].parent;
                if (!parent) return -1;
                for (var i = 1; i < nodes.length; i++) {
                    if (nodes[i].parent != parent) return -1;
                }
                return 0;
            }
        });
        Module.register("NodeModule", function() {
            return {
                commands: {
                    AppendChildNode: AppendChildCommand,
                    AppendSiblingNode: AppendSiblingCommand,
                    RemoveNode: RemoveNodeCommand,
                    AppendParentNode: AppendParentCommand
                },
                commandShortcutKeys: {
                    appendsiblingnode: "normal::Enter",
                    appendchildnode: "normal::Insert|Tab",
                    appendparentnode: "normal::Shift+Tab|normal::Shift+Insert",
                    removenode: "normal::Del|Backspace"
                }
            };
        });
    }
};

//lib/km-core/src/module/note.js
/**
 * @fileOverview
 *
 * 支持节点详细信息（HTML）格式
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[72] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        Module.register("NoteModule", function() {
            var NOTE_PATH = "M9,9H3V8h6L9,9L9,9z M9,7H3V6h6V7z M9,5H3V4h6V5z M8.5,11H2V2h8v7.5 M9,12l2-2V1H1v11";
            /**
         * @command Note
         * @description 设置节点的备注信息
         * @param {string} note 要设置的备注信息，设置为 null 则移除备注信息
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
            var NoteCommand = kity.createClass("NoteCommand", {
                base: Command,
                execute: function(minder, note) {
                    var node = minder.getSelectedNode();
                    node.setData("note", note);
                    node.render();
                    node.getMinder().layout(300);
                },
                queryState: function(minder) {
                    return minder.getSelectedNodes().length === 1 ? 0 : -1;
                },
                queryValue: function(minder) {
                    var node = minder.getSelectedNode();
                    return node && node.getData("note");
                }
            });
            var NoteIcon = kity.createClass("NoteIcon", {
                base: kity.Group,
                constructor: function() {
                    this.callBase();
                    this.width = 16;
                    this.height = 17;
                    this.rect = new kity.Rect(16, 17, .5, -8.5, 2).fill("transparent");
                    this.path = new kity.Path().setPathData(NOTE_PATH).setTranslate(2.5, -6.5);
                    this.addShapes([ this.rect, this.path ]);
                    this.on("mouseover", function() {
                        this.rect.fill("rgba(255, 255, 200, .8)");
                    }).on("mouseout", function() {
                        this.rect.fill("transparent");
                    });
                    this.setStyle("cursor", "pointer");
                }
            });
            var NoteIconRenderer = kity.createClass("NoteIconRenderer", {
                base: Renderer,
                create: function(node) {
                    var icon = new NoteIcon();
                    icon.on("mousedown", function(e) {
                        e.preventDefault();
                        node.getMinder().fire("editnoterequest");
                    });
                    icon.on("mouseover", function() {
                        node.getMinder().fire("shownoterequest", {
                            node: node,
                            icon: icon
                        });
                    });
                    icon.on("mouseout", function() {
                        node.getMinder().fire("hidenoterequest", {
                            node: node,
                            icon: icon
                        });
                    });
                    return icon;
                },
                shouldRender: function(node) {
                    return node.getData("note");
                },
                update: function(icon, node, box) {
                    var x = box.right + node.getStyle("space-left");
                    var y = box.cy;
                    icon.path.fill(node.getStyle("color"));
                    icon.setTranslate(x, y);
                    return new kity.Box(x, Math.round(y - icon.height / 2), icon.width, icon.height);
                }
            });
            return {
                renderers: {
                    right: NoteIconRenderer
                },
                commands: {
                    note: NoteCommand
                }
            };
        });
    }
};

//lib/km-core/src/module/outline.js
_p[73] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        var OutlineRenderer = kity.createClass("OutlineRenderer", {
            base: Renderer,
            create: function(node) {
                var outline = new kity.Rect().setId(utils.uuid("node_outline"));
                this.bringToBack = true;
                return outline;
            },
            update: function(outline, node, box) {
                var paddingLeft = node.getStyle("padding-left"), paddingRight = node.getStyle("padding-right"), paddingTop = node.getStyle("padding-top"), paddingBottom = node.getStyle("padding-bottom");
                var outlineBox = {
                    x: box.x - paddingLeft,
                    y: box.y - paddingTop,
                    width: box.width + paddingLeft + paddingRight,
                    height: box.height + paddingTop + paddingBottom
                };
                var prefix = node.isSelected() ? node.getMinder().isFocused() ? "selected-" : "blur-selected-" : "";
                outline.setPosition(outlineBox.x, outlineBox.y).setSize(outlineBox.width, outlineBox.height).setRadius(node.getStyle("radius")).fill(node.getData("background") || node.getStyle(prefix + "background") || node.getStyle("background")).stroke(node.getStyle(prefix + "stroke" || node.getStyle("stroke")), node.getStyle(prefix + "stroke-width"));
                return new kity.Box(outlineBox);
            }
        });
        var ShadowRenderer = kity.createClass("ShadowRenderer", {
            base: Renderer,
            create: function(node) {
                this.bringToBack = true;
                return new kity.Rect();
            },
            shouldRender: function(node) {
                return node.getStyle("shadow");
            },
            update: function(shadow, node, box) {
                shadow.setPosition(box.x + 4, box.y + 5).setSize(box.width, box.height).fill(node.getStyle("shadow")).setRadius(node.getStyle("radius"));
            }
        });
        var marker = new kity.Marker();
        marker.setWidth(10);
        marker.setHeight(12);
        marker.setRef(0, 0);
        marker.setViewBox(-6, -4, 8, 10);
        marker.addShape(new kity.Path().setPathData("M-5-3l5,3,-5,3").stroke("#33ffff"));
        var wireframeOption = /wire/.test(window.location.href);
        var WireframeRenderer = kity.createClass("WireframeRenderer", {
            base: Renderer,
            create: function() {
                var wireframe = new kity.Group();
                var oxy = this.oxy = new kity.Path().stroke("#f6f").setPathData("M0,-50L0,50M-50,0L50,0");
                var box = this.wireframe = new kity.Rect().stroke("lightgreen");
                var vectorIn = this.vectorIn = new kity.Path().stroke("#66ffff");
                var vectorOut = this.vectorOut = new kity.Path().stroke("#66ffff");
                vectorIn.setMarker(marker, "end");
                vectorOut.setMarker(marker, "end");
                return wireframe.addShapes([ oxy, box, vectorIn, vectorOut ]);
            },
            shouldRender: function() {
                return wireframeOption;
            },
            update: function(created, node, box) {
                this.wireframe.setPosition(box.x, box.y).setSize(box.width, box.height);
                var pin = node.getVertexIn();
                var pout = node.getVertexOut();
                var vin = node.getLayoutVectorIn().normalize(30);
                var vout = node.getLayoutVectorOut().normalize(30);
                this.vectorIn.setPathData([ "M", pin.offset(vin.reverse()), "L", pin ]);
                this.vectorOut.setPathData([ "M", pout, "l", vout ]);
            }
        });
        Module.register("OutlineModule", function() {
            return {
                events: !wireframeOption ? null : {
                    ready: function() {
                        this.getPaper().addResource(marker);
                    },
                    layoutallfinish: function() {
                        this.getRoot().traverse(function(node) {
                            node.getRenderer("WireframeRenderer").update(null, node, node.getContentBox());
                        });
                    }
                },
                renderers: {
                    outline: OutlineRenderer,
                    outside: [ ShadowRenderer, WireframeRenderer ]
                }
            };
        });
    }
};

//lib/km-core/src/module/priority.js
_p[74] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        Module.register("PriorityModule", function() {
            var minder = this;
            // Designed by Akikonata
            // [MASK, BACK]
            var PRIORITY_COLORS = [ null, [ "#FF1200", "#840023" ], // 1 - red
            [ "#0074FF", "#01467F" ], // 2 - blue
            [ "#00AF00", "#006300" ], // 3 - green
            [ "#FF962E", "#B25000" ], // 4 - orange
            [ "#A464FF", "#4720C4" ], // 5 - purple
            [ "#A3A3A3", "#515151" ], // 6,7,8,9 - gray
            [ "#A3A3A3", "#515151" ], [ "#A3A3A3", "#515151" ], [ "#A3A3A3", "#515151" ] ];
            // hue from 1 to 5
            // jscs:disable maximumLineLength
            var BACK_PATH = "M0,13c0,3.866,3.134,7,7,7h6c3.866,0,7-3.134,7-7V7H0V13z";
            var MASK_PATH = "M20,10c0,3.866-3.134,7-7,7H7c-3.866,0-7-3.134-7-7V7c0-3.866,3.134-7,7-7h6c3.866,0,7,3.134,7,7V10z";
            var PRIORITY_DATA = "priority";
            // 进度图标的图形
            var PriorityIcon = kity.createClass("PriorityIcon", {
                base: kity.Group,
                constructor: function() {
                    this.callBase();
                    this.setSize(20);
                    this.create();
                    this.setId(utils.uuid("node_priority"));
                },
                setSize: function(size) {
                    this.width = this.height = size;
                },
                create: function() {
                    var white, back, mask, number;
                    // 4 layer
                    white = new kity.Path().setPathData(MASK_PATH).fill("white");
                    back = new kity.Path().setPathData(BACK_PATH).setTranslate(.5, .5);
                    mask = new kity.Path().setPathData(MASK_PATH).setOpacity(.8).setTranslate(.5, .5);
                    number = new kity.Text().setX(this.width / 2 - .5).setY(this.height / 2).setTextAnchor("middle").setVerticalAlign("middle").setFontItalic(true).setFontSize(12).fill("white");
                    this.addShapes([ back, mask, number ]);
                    this.mask = mask;
                    this.back = back;
                    this.number = number;
                },
                setValue: function(value) {
                    var back = this.back, mask = this.mask, number = this.number;
                    var color = PRIORITY_COLORS[value];
                    if (color) {
                        back.fill(color[1]);
                        mask.fill(color[0]);
                    }
                    number.setContent(value);
                }
            });
            /**
         * @command Priority
         * @description 设置节点的优先级信息
         * @param {number} value 要设置的优先级（添加一个优先级小图标）
         *     取值为 0 移除优先级信息；
         *     取值为 1 - 9 设置优先级，超过 9 的优先级不渲染
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
            var PriorityCommand = kity.createClass("SetPriorityCommand", {
                base: Command,
                execute: function(km, value) {
                    var nodes = km.getSelectedNodes();
                    for (var i = 0; i < nodes.length; i++) {
                        nodes[i].setData(PRIORITY_DATA, value || null).render();
                    }
                    km.layout();
                },
                queryValue: function(km) {
                    var nodes = km.getSelectedNodes();
                    var val;
                    for (var i = 0; i < nodes.length; i++) {
                        val = nodes[i].getData(PRIORITY_DATA);
                        if (val) break;
                    }
                    return val || null;
                },
                queryState: function(km) {
                    return km.getSelectedNodes().length ? 0 : -1;
                }
            });
            return {
                commands: {
                    priority: PriorityCommand
                },
                renderers: {
                    left: kity.createClass("PriorityRenderer", {
                        base: Renderer,
                        create: function(node) {
                            return new PriorityIcon();
                        },
                        shouldRender: function(node) {
                            return node.getData(PRIORITY_DATA);
                        },
                        update: function(icon, node, box) {
                            var data = node.getData(PRIORITY_DATA);
                            var spaceLeft = node.getStyle("space-left"), x, y;
                            icon.setValue(data);
                            x = box.left - icon.width - spaceLeft;
                            y = -icon.height / 2;
                            icon.setTranslate(x, y);
                            return new kity.Box({
                                x: x,
                                y: y,
                                width: icon.width,
                                height: icon.height
                            });
                        }
                    })
                }
            };
        });
    }
};

//lib/km-core/src/module/progress.js
_p[75] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        Module.register("ProgressModule", function() {
            var minder = this;
            var PROGRESS_DATA = "progress";
            // Designed by Akikonata
            var BG_COLOR = "#FFED83";
            var PIE_COLOR = "#43BC00";
            var SHADOW_PATH = "M10,3c4.418,0,8,3.582,8,8h1c0-5.523-3.477-10-9-10S1,5.477,1,11h1C2,6.582,5.582,3,10,3z";
            var SHADOW_COLOR = "#8E8E8E";
            // jscs:disable maximumLineLength
            var FRAME_PATH = "M10,0C4.477,0,0,4.477,0,10c0,5.523,4.477,10,10,10s10-4.477,10-10C20,4.477,15.523,0,10,0zM10,18c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S14.418,18,10,18z";
            var FRAME_GRAD = new kity.LinearGradient().pipe(function(g) {
                g.setStartPosition(0, 0);
                g.setEndPosition(0, 1);
                g.addStop(0, "#fff");
                g.addStop(1, "#ccc");
            });
            var CHECK_PATH = "M15.812,7.896l-6.75,6.75l-4.5-4.5L6.25,8.459l2.812,2.803l5.062-5.053L15.812,7.896z";
            var CHECK_COLOR = "#EEE";
            minder.getPaper().addResource(FRAME_GRAD);
            // 进度图标的图形
            var ProgressIcon = kity.createClass("ProgressIcon", {
                base: kity.Group,
                constructor: function(value) {
                    this.callBase();
                    this.setSize(20);
                    this.create();
                    this.setValue(value);
                    this.setId(utils.uuid("node_progress"));
                    this.translate(.5, .5);
                },
                setSize: function(size) {
                    this.width = this.height = size;
                },
                create: function() {
                    var bg, pie, shadow, frame, check;
                    bg = new kity.Circle(9).fill(BG_COLOR);
                    pie = new kity.Pie(9, 0).fill(PIE_COLOR);
                    shadow = new kity.Path().setPathData(SHADOW_PATH).setTranslate(-10, -10).fill(SHADOW_COLOR);
                    frame = new kity.Path().setTranslate(-10, -10).setPathData(FRAME_PATH).fill(FRAME_GRAD);
                    check = new kity.Path().setTranslate(-10, -10).setPathData(CHECK_PATH).fill(CHECK_COLOR);
                    this.addShapes([ bg, pie, shadow, check, frame ]);
                    this.pie = pie;
                    this.check = check;
                },
                setValue: function(value) {
                    this.pie.setAngle(-360 * (value - 1) / 8);
                    this.check.setVisible(value == 9);
                }
            });
            /**
         * @command Progress
         * @description 设置节点的进度信息（添加一个进度小图标）
         * @param {number} value 要设置的进度
         *     取值为 0 移除进度信息；
         *     取值为 1 表示未开始；
         *     取值为 2 表示完成 1/8；
         *     取值为 3 表示完成 2/8；
         *     取值为 4 表示完成 3/8；
         *     其余类推，取值为 9 表示全部完成
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
            var ProgressCommand = kity.createClass("ProgressCommand", {
                base: Command,
                execute: function(km, value) {
                    var nodes = km.getSelectedNodes();
                    for (var i = 0; i < nodes.length; i++) {
                        nodes[i].setData(PROGRESS_DATA, value || null).render();
                    }
                    km.layout();
                },
                queryValue: function(km) {
                    var nodes = km.getSelectedNodes();
                    var val;
                    for (var i = 0; i < nodes.length; i++) {
                        val = nodes[i].getData(PROGRESS_DATA);
                        if (val) break;
                    }
                    return val || null;
                },
                queryState: function(km) {
                    return km.getSelectedNodes().length ? 0 : -1;
                }
            });
            return {
                commands: {
                    progress: ProgressCommand
                },
                renderers: {
                    left: kity.createClass("ProgressRenderer", {
                        base: Renderer,
                        create: function(node) {
                            return new ProgressIcon();
                        },
                        shouldRender: function(node) {
                            return node.getData(PROGRESS_DATA);
                        },
                        update: function(icon, node, box) {
                            var data = node.getData(PROGRESS_DATA);
                            var spaceLeft = node.getStyle("space-left");
                            var x, y;
                            icon.setValue(data);
                            x = box.left - icon.width - spaceLeft;
                            y = -icon.height / 2;
                            icon.setTranslate(x + icon.width / 2, y + icon.height / 2);
                            return new kity.Box(x, y, icon.width, icon.height);
                        }
                    })
                }
            };
        });
    }
};

//lib/km-core/src/module/resource.js
_p[76] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        Module.register("Resource", function() {
            /**
         * 自动使用的颜色序列
         */
            var RESOURCE_COLOR_SERIES = [ 51, 303, 75, 200, 157, 0, 26, 254 ].map(function(h) {
                return kity.Color.createHSL(h, 100, 85);
            });
            var RESOURCE_COLOR_OVERFLOW = kity.Color.createHSL(0, 0, 95);
            /**
         * 在 Minder 上拓展一些关于资源的支持接口
         */
            kity.extendClass(Minder, {
                /**
             * 获取脑图中某个资源对应的颜色
             *
             * 如果存在同名资源，则返回已经分配给该资源的颜色，否则分配给该资源一个颜色，并且返回
             *
             * 如果资源数超过颜色序列数量，返回白色
             *
             * @param {String} resource 资源名称
             * @return {Color}
             */
                getResourceColor: function(resource) {
                    var colorMapping = this._getResourceColorIndexMapping();
                    var nextIndex;
                    if (!colorMapping.hasOwnProperty(resource)) {
                        // 找不到找下个可用索引
                        nextIndex = this._getNextResourceColorIndex();
                        colorMapping[resource] = nextIndex;
                    }
                    // 资源过多，找不到可用索引颜色，统一返回白色
                    return RESOURCE_COLOR_SERIES[colorMapping[resource]] || RESOURCE_COLOR_OVERFLOW;
                },
                /**
             * 获得已使用的资源的列表
             *
             * @return {Array}
             */
                getUsedResource: function() {
                    var mapping = this._getResourceColorIndexMapping();
                    var used = [], resource;
                    for (resource in mapping) {
                        if (mapping.hasOwnProperty(resource)) {
                            used.push(resource);
                        }
                    }
                    return used;
                },
                /**
             * 获取脑图下一个可用的资源颜色索引
             *
             * @return {int}
             */
                _getNextResourceColorIndex: function() {
                    // 获取现有颜色映射
                    //     resource => color_index
                    var colorMapping = this._getResourceColorIndexMapping();
                    var resource, used, i;
                    used = [];
                    // 抽取已经使用的值到 used 数组
                    for (resource in colorMapping) {
                        if (colorMapping.hasOwnProperty(resource)) {
                            used.push(colorMapping[resource]);
                        }
                    }
                    // 枚举所有的可用值，如果还没被使用，返回
                    for (i = 0; i < RESOURCE_COLOR_SERIES.length; i++) {
                        if (!~used.indexOf(i)) return i;
                    }
                    // 没有可用的颜色了
                    return -1;
                },
                // 获取现有颜色映射
                //     resource => color_index
                _getResourceColorIndexMapping: function() {
                    return this._resourceColorMapping || (this._resourceColorMapping = {});
                }
            });
            /**
         * @command Resource
         * @description 设置节点的资源标签
         * @param {Array<string>} resource 要设置的资源列表，设置为空清除节点的资源标签
         * @return 返回当前选中节点中包含的资源（数组）
         *
         * @example
         *
         * ```js
         * // 设置选中节点资源为 "张三"
         * minder.execCommand('resource', ['张三']);
         *
         * // 添加资源 "李四" 到选中节点
         * var resource = minder.queryCommandValue();
         * resource.push('李四');
         * minder.execCommand('resource', resource);
         *
         * // 清除选中节点的资源
         * minder.execCommand('resource', null);
         * ```
         */
            var ResourceCommand = kity.createClass("ResourceCommand", {
                base: Command,
                execute: function(minder, resource) {
                    var nodes = minder.getSelectedNodes();
                    if (typeof resource == "string") {
                        resource = [ resource ];
                    }
                    nodes.forEach(function(node) {
                        node.setData("resource", resource).render();
                    });
                    minder.layout(200);
                },
                queryValue: function(minder) {
                    var nodes = minder.getSelectedNodes();
                    var resource = [];
                    nodes.forEach(function(node) {
                        var nodeResource = node.getData("resource");
                        if (!nodeResource) return;
                        nodeResource.forEach(function(name) {
                            if (!~resource.indexOf(name)) {
                                resource.push(name);
                            }
                        });
                    });
                    return resource;
                },
                queryState: function(km) {
                    return km.getSelectedNode() ? 0 : -1;
                }
            });
            /**
         * @class 资源的覆盖图形
         *
         * 该类为一个资源以指定的颜色渲染一个动态的覆盖图形
         */
            var ResourceOverlay = kity.createClass("ResourceOverlay", {
                base: kity.Group,
                constructor: function() {
                    this.callBase();
                    var text, rect;
                    rect = this.rect = new kity.Rect().setRadius(4);
                    text = this.text = new kity.Text().setFontSize(12).setVerticalAlign("middle");
                    this.addShapes([ rect, text ]);
                },
                setValue: function(resourceName, color) {
                    var paddingX = 8, paddingY = 4, borderRadius = 4;
                    var text, box, rect;
                    text = this.text;
                    if (resourceName == this.lastResourceName) {
                        box = this.lastBox;
                    } else {
                        text.setContent(resourceName);
                        box = text.getBoundaryBox();
                        this.lastResourceName = resourceName;
                        this.lastBox = box;
                    }
                    text.setX(paddingX).fill(color.dec("l", 70));
                    rect = this.rect;
                    rect.setPosition(0, box.y - paddingY);
                    this.width = Math.round(box.width + paddingX * 2);
                    this.height = Math.round(box.height + paddingY * 2);
                    rect.setSize(this.width, this.height);
                    rect.fill(color);
                }
            });
            /**
         * @class 资源渲染器
         */
            var ResourceRenderer = kity.createClass("ResourceRenderer", {
                base: Renderer,
                create: function(node) {
                    this.overlays = [];
                    return new kity.Group();
                },
                shouldRender: function(node) {
                    return node.getData("resource") && node.getData("resource").length;
                },
                update: function(container, node, box) {
                    var spaceRight = node.getStyle("space-right");
                    var overlays = this.overlays;
                    var resource = node.getData("resource");
                    var minder = node.getMinder();
                    var i, overlay, x;
                    x = 0;
                    for (i = 0; i < resource.length; i++) {
                        x += spaceRight;
                        overlay = overlays[i];
                        if (!overlay) {
                            overlay = new ResourceOverlay();
                            overlays.push(overlay);
                            container.addShape(overlay);
                        }
                        overlay.setVisible(true);
                        overlay.setValue(resource[i], minder.getResourceColor(resource[i]));
                        overlay.setTranslate(x, -1);
                        x += overlay.width;
                    }
                    while (overlay = overlays[i++]) overlay.setVisible(false);
                    container.setTranslate(box.right, 0);
                    return new kity.Box({
                        x: box.right,
                        y: Math.round(-overlays[0].height / 2),
                        width: x,
                        height: overlays[0].height
                    });
                }
            });
            return {
                commands: {
                    resource: ResourceCommand
                },
                renderers: {
                    right: ResourceRenderer
                }
            };
        });
    }
};

//lib/km-core/src/module/select.js
_p[77] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        Module.register("Select", function() {
            var minder = this;
            var rc = minder.getRenderContainer();
            // 在实例上渲染框选矩形、计算框选范围的对象
            var marqueeActivator = function() {
                // 记录选区的开始位置（mousedown的位置）
                var startPosition = null;
                // 选区的图形
                var marqueeShape = new kity.Path();
                // 标记是否已经启动框选状态
                //    并不是 mousedown 发生之后就启动框选状态，而是检测到移动了一定的距离（MARQUEE_MODE_THRESHOLD）之后
                var marqueeMode = false;
                var MARQUEE_MODE_THRESHOLD = 10;
                return {
                    selectStart: function(e) {
                        // 只接受左键
                        if (e.originEvent.button || e.originEvent.altKey) return;
                        // 清理不正确状态
                        if (startPosition) {
                            return this.selectEnd();
                        }
                        startPosition = e.getPosition(rc).round();
                    },
                    selectMove: function(e) {
                        if (minder.getStatus() == "textedit") {
                            return;
                        }
                        if (!startPosition) return;
                        var p1 = startPosition, p2 = e.getPosition(rc);
                        // 检测是否要进入选区模式
                        if (!marqueeMode) {
                            // 距离没达到阈值，退出
                            if (kity.Vector.fromPoints(p1, p2).length() < MARQUEE_MODE_THRESHOLD) {
                                return;
                            }
                            // 已经达到阈值，记录下来并且重置选区形状
                            marqueeMode = true;
                            rc.addShape(marqueeShape);
                            marqueeShape.fill(minder.getStyle("marquee-background")).stroke(minder.getStyle("marquee-stroke")).setOpacity(.8).getDrawer().clear();
                        }
                        var marquee = new kity.Box(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y), selectedNodes = [];
                        // 使其犀利
                        marquee.left = Math.round(marquee.left);
                        marquee.top = Math.round(marquee.top);
                        marquee.right = Math.round(marquee.right);
                        marquee.bottom = Math.round(marquee.bottom);
                        // 选区形状更新
                        marqueeShape.getDrawer().pipe(function() {
                            this.clear();
                            this.moveTo(marquee.left, marquee.top);
                            this.lineTo(marquee.right, marquee.top);
                            this.lineTo(marquee.right, marquee.bottom);
                            this.lineTo(marquee.left, marquee.bottom);
                            this.close();
                        });
                        // 计算选中范围
                        minder.getRoot().traverse(function(node) {
                            var renderBox = node.getLayoutBox();
                            if (!renderBox.intersect(marquee).isEmpty()) {
                                selectedNodes.push(node);
                            }
                        });
                        // 应用选中范围
                        minder.select(selectedNodes, true);
                        // 清除多余的东西
                        window.getSelection().removeAllRanges();
                    },
                    selectEnd: function(e) {
                        if (startPosition) {
                            startPosition = null;
                        }
                        if (marqueeMode) {
                            marqueeShape.fadeOut(200, "ease", 0, function() {
                                if (marqueeShape.remove) marqueeShape.remove();
                            });
                            marqueeMode = false;
                        }
                    }
                };
            }();
            var lastDownNode = null, lastDownPosition = null;
            return {
                init: function() {
                    window.addEventListener("mouseup", function() {
                        marqueeActivator.selectEnd();
                    });
                },
                events: {
                    mousedown: function(e) {
                        var downNode = e.getTargetNode();
                        // 没有点中节点：
                        //     清除选中状态，并且标记选区开始位置
                        if (!downNode) {
                            this.removeAllSelectedNodes();
                            marqueeActivator.selectStart(e);
                            this.setStatus("normal");
                        } else if (e.originEvent.shiftKey) {
                            this.toggleSelect(downNode);
                        } else if (!downNode.isSelected()) {
                            this.select(downNode, true);
                        } else if (!this.isSingleSelect()) {
                            lastDownNode = downNode;
                            lastDownPosition = e.getPosition();
                        }
                    },
                    mousemove: marqueeActivator.selectMove,
                    mouseup: function(e) {
                        var upNode = e.getTargetNode();
                        // 如果 mouseup 发生在 lastDownNode 外，是无需理会的
                        if (upNode && upNode == lastDownNode) {
                            var upPosition = e.getPosition();
                            var movement = kity.Vector.fromPoints(lastDownPosition, upPosition);
                            if (movement.length() < 1) this.select(lastDownNode, true);
                            lastDownNode = null;
                        }
                        // 清理一下选择状态
                        marqueeActivator.selectEnd(e);
                    },
                    //全选操作
                    "normal.keydown": function(e) {
                        if (e.isShortcutKey("ctrl+a")) {
                            var selectedNodes = [];
                            this.getRoot().traverse(function(node) {
                                selectedNodes.push(node);
                            });
                            this.select(selectedNodes, true);
                            e.preventDefault();
                        }
                    }
                }
            };
        });
    }
};

//lib/km-core/src/module/style.js
_p[78] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        Module.register("StyleModule", function() {
            var styleNames = [ "font-size", "font-family", "font-weight", "font-style", "background", "color" ];
            var styleClipBoard = null;
            function hasStyle(node) {
                var data = node.getData();
                for (var i = 0; i < styleNames.length; i++) {
                    if (styleNames[i] in data) return true;
                }
            }
            return {
                commands: {
                    /**
                 * @command CopyStyle
                 * @description 拷贝选中节点的当前样式，包括字体、字号、粗体、斜体、背景色、字体色
                 * @state
                 *   0: 当前有选中的节点
                 *  -1: 当前没有选中的节点
                 */
                    copystyle: kity.createClass("CopyStyleCommand", {
                        base: Command,
                        execute: function(minder) {
                            var node = minder.getSelectedNode();
                            var nodeData = node.getData();
                            styleClipBoard = {};
                            styleNames.forEach(function(name) {
                                if (name in nodeData) styleClipBoard[name] = nodeData[name]; else {
                                    styleClipBoard[name] = null;
                                    delete styleClipBoard[name];
                                }
                            });
                            return styleClipBoard;
                        },
                        queryState: function(minder) {
                            var nodes = minder.getSelectedNodes();
                            if (nodes.length !== 1) return -1;
                            return hasStyle(nodes[0]) ? 0 : -1;
                        }
                    }),
                    /**
                 * @command PasteStyle
                 * @description 粘贴已拷贝的样式到选中的节点上，包括字体、字号、粗体、斜体、背景色、字体色
                 * @state
                 *   0: 当前有选中的节点，并且已经有复制的样式
                 *  -1: 当前没有选中的节点，或者没有复制的样式
                 */
                    pastestyle: kity.createClass("PastStyleCommand", {
                        base: Command,
                        execute: function(minder) {
                            minder.getSelectedNodes().forEach(function(node) {
                                for (var name in styleClipBoard) {
                                    if (styleClipBoard.hasOwnProperty(name)) node.setData(name, styleClipBoard[name]);
                                }
                            });
                            minder.renderNodeBatch(minder.getSelectedNodes());
                            minder.layout(300);
                            return styleClipBoard;
                        },
                        queryState: function(minder) {
                            return styleClipBoard && minder.getSelectedNodes().length ? 0 : -1;
                        }
                    }),
                    /**
                 * @command ClearStyle
                 * @description 移除选中节点的样式，包括字体、字号、粗体、斜体、背景色、字体色
                 * @state
                 *   0: 当前有选中的节点，并且至少有一个设置了至少一种样式
                 *  -1: 其它情况
                 */
                    clearstyle: kity.createClass("ClearStyleCommand", {
                        base: Command,
                        execute: function(minder) {
                            minder.getSelectedNodes().forEach(function(node) {
                                styleNames.forEach(function(name) {
                                    node.setData(name);
                                });
                            });
                            minder.renderNodeBatch(minder.getSelectedNodes());
                            minder.layout(300);
                            return styleClipBoard;
                        },
                        queryState: function(minder) {
                            var nodes = minder.getSelectedNodes();
                            if (!nodes.length) return -1;
                            for (var i = 0; i < nodes.length; i++) {
                                if (hasStyle(nodes[i])) return 0;
                            }
                            return -1;
                        }
                    })
                }
            };
        });
    }
};

//lib/km-core/src/module/text.js
_p[79] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        var FONT_ADJUST = {
            "微软雅黑,Microsoft YaHei": -.15,
            "arial black,avant garde": -.17,
            "default": -.15
        };
        var TextRenderer = kity.createClass("TextRenderer", {
            base: Renderer,
            create: function() {
                return new kity.Group().setId(utils.uuid("node_text"));
            },
            update: function(textGroup, node) {
                function getDataOrStyle(name) {
                    return node.getData(name) || node.getStyle(name);
                }
                var nodeText = node.getText();
                var textArr = nodeText ? nodeText.split("\n") : [ " " ];
                var lineHeight = node.getStyle("line-height");
                var fontSize = getDataOrStyle("font-size");
                var fontFamily = getDataOrStyle("font-family") || "default";
                var height = lineHeight * fontSize * textArr.length - (lineHeight - 1) * fontSize;
                var yStart = -height / 2;
                if (kity.Browser.ie) {
                    var adjust = FONT_ADJUST[fontFamily] || 0;
                    textGroup.setTranslate(0, adjust * fontSize);
                }
                var rBox = new kity.Box(), r = Math.round;
                this.setTextStyle(node, textGroup);
                var textLength = textArr.length;
                var textGroupLength = textGroup.getItems().length;
                var i, ci, textShape, text;
                if (textLength < textGroupLength) {
                    for (i = textLength, ci; ci = textGroup.getItem(i); ) {
                        textGroup.removeItem(i);
                    }
                } else if (textLength > textGroupLength) {
                    var growth = textLength - textGroupLength;
                    while (growth--) {
                        textShape = new kity.Text().setAttr("text-rendering", "inherit");
                        if (kity.Browser.ie) {
                            textShape.setVerticalAlign("top");
                        } else {
                            textShape.setAttr("dominant-baseline", "text-before-edge");
                        }
                        textGroup.addItem(textShape);
                    }
                }
                for (i = 0, text, textShape; text = textArr[i], textShape = textGroup.getItem(i); i++) {
                    textShape.setContent(text);
                    if (kity.Browser.ie) {
                        textShape.fixPosition();
                    }
                }
                this.setTextStyle(node, textGroup);
                var textHash = node.getText() + [ "font-size", "font-name", "font-weight", "font-style" ].map(getDataOrStyle).join("/");
                if (node._currentTextHash == textHash && node._currentTextGroupBox) return node._currentTextGroupBox;
                node._currentTextHash = textHash;
                return function() {
                    textGroup.eachItem(function(i, textShape) {
                        var y = yStart + i * fontSize * lineHeight;
                        textShape.setY(y);
                        var bbox = textShape.getBoundaryBox();
                        rBox = rBox.merge(new kity.Box(0, y, bbox.height && bbox.width || 1, fontSize));
                    });
                    var nBox = new kity.Box(r(rBox.x), r(rBox.y), r(rBox.width), r(rBox.height));
                    node._currentTextGroupBox = nBox;
                    return nBox;
                };
            },
            setTextStyle: function(node, text) {
                var hooks = TextRenderer._styleHooks;
                hooks.forEach(function(hook) {
                    hook(node, text);
                });
            }
        });
        var TextCommand = kity.createClass({
            base: Command,
            execute: function(minder, text) {
                var node = minder.getSelectedNode();
                if (node) {
                    node.setText(text);
                    node.render();
                    minder.layout();
                }
            },
            queryState: function(minder) {
                return minder.getSelectedNodes().length == 1 ? 0 : -1;
            },
            queryValue: function(minder) {
                var node = minder.getSelectedNode();
                return node ? node.getText() : null;
            }
        });
        utils.extend(TextRenderer, {
            _styleHooks: [],
            registerStyleHook: function(fn) {
                TextRenderer._styleHooks.push(fn);
            }
        });
        kity.extendClass(MinderNode, {
            getTextGroup: function() {
                return this.getRenderer("TextRenderer").getRenderShape();
            }
        });
        Module.register("text", {
            commands: {
                text: TextCommand
            },
            renderers: {
                center: TextRenderer
            }
        });
        module.exports = TextRenderer;
    }
};

//lib/km-core/src/module/view.js
_p[80] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        var ViewDragger = kity.createClass("ViewDragger", {
            constructor: function(minder) {
                this._minder = minder;
                this._enabled = false;
                this._bind();
                var me = this;
                this._minder.getViewDragger = function() {
                    return me;
                };
                this.setEnabled(false);
            },
            isEnabled: function() {
                return this._enabled;
            },
            setEnabled: function(value) {
                var paper = this._minder.getPaper();
                paper.setStyle("cursor", value ? "pointer" : "default");
                paper.setStyle("cursor", value ? "-webkit-grab" : "default");
                this._enabled = value;
            },
            move: function(offset, duration) {
                var minder = this._minder;
                var targetPosition = this.getMovement().offset(offset);
                this.moveTo(targetPosition, duration);
            },
            moveTo: function(position, duration) {
                if (duration) {
                    var dragger = this;
                    if (this._moveTimeline) this._moveTimeline.stop();
                    this._moveTimeline = this._minder.getRenderContainer().animate(new kity.Animator(this.getMovement(), position, function(target, value) {
                        dragger.moveTo(value);
                    }), duration, "easeOutCubic");
                    this._moveTimeline.on("finish", function() {
                        dragger._moveTimeline = null;
                    });
                    return this;
                }
                this._minder.getRenderContainer().setTranslate(position.round());
                this._minder.fire("viewchange");
            },
            getMovement: function() {
                var translate = this._minder.getRenderContainer().transform.translate;
                return translate ? translate[0] : new kity.Point();
            },
            getView: function() {
                var minder = this._minder;
                var c = minder._lastClientSize || {
                    width: minder.getRenderTarget().clientWidth,
                    height: minder.getRenderTarget().clientHeight
                };
                var m = this.getMovement();
                var box = new kity.Box(0, 0, c.width, c.height);
                var viewMatrix = minder.getPaper().getViewPortMatrix();
                return viewMatrix.inverse().translate(-m.x, -m.y).transformBox(box);
            },
            _bind: function() {
                var dragger = this, isTempDrag = false, lastPosition = null, currentPosition = null;
                function dragEnd(e) {
                    if (!lastPosition) return;
                    lastPosition = null;
                    e.stopPropagation();
                    // 临时拖动需要还原状态
                    if (isTempDrag) {
                        dragger.setEnabled(false);
                        isTempDrag = false;
                        if (dragger._minder.getStatus() == "hand") dragger._minder.rollbackStatus();
                    }
                    var paper = dragger._minder.getPaper();
                    paper.setStyle("cursor", dragger._minder.getStatus() == "hand" ? "-webkit-grab" : "default");
                    dragger._minder.fire("viewchanged");
                }
                this._minder.on("normal.mousedown normal.touchstart " + "inputready.mousedown inputready.touchstart " + "readonly.mousedown readonly.touchstart", function(e) {
                    if (e.originEvent.button == 2) {
                        e.originEvent.preventDefault();
                    }
                    // 点击未选中的根节点临时开启
                    if (e.getTargetNode() == this.getRoot() || e.originEvent.button == 2 || e.originEvent.altKey) {
                        lastPosition = e.getPosition("view");
                        isTempDrag = true;
                    }
                }).on("normal.mousemove normal.touchmove " + "readonly.mousemove readonly.touchmove " + "inputready.mousemove inputready.touchmove", function(e) {
                    if (e.type == "touchmove") {
                        e.preventDefault();
                    }
                    if (!isTempDrag) return;
                    var offset = kity.Vector.fromPoints(lastPosition, e.getPosition("view"));
                    if (offset.length() > 10) {
                        this.setStatus("hand", true);
                        var paper = dragger._minder.getPaper();
                        paper.setStyle("cursor", "-webkit-grabbing");
                    }
                }).on("hand.beforemousedown hand.beforetouchstart", function(e) {
                    // 已经被用户打开拖放模式
                    if (dragger.isEnabled()) {
                        lastPosition = e.getPosition("view");
                        e.stopPropagation();
                        var paper = dragger._minder.getPaper();
                        paper.setStyle("cursor", "-webkit-grabbing");
                    }
                }).on("hand.beforemousemove hand.beforetouchmove", function(e) {
                    if (lastPosition) {
                        currentPosition = e.getPosition("view");
                        // 当前偏移加上历史偏移
                        var offset = kity.Vector.fromPoints(lastPosition, currentPosition);
                        dragger.move(offset);
                        e.stopPropagation();
                        e.preventDefault();
                        e.originEvent.preventDefault();
                        lastPosition = currentPosition;
                    }
                }).on("mouseup touchend", dragEnd);
                window.addEventListener("mouseup", dragEnd);
                this._minder.on("contextmenu", function(e) {
                    e.preventDefault();
                });
            }
        });
        Module.register("View", function() {
            var km = this;
            /**
         * @command Hand
         * @description 切换抓手状态，抓手状态下，鼠标拖动将拖动视野，而不是创建选区
         * @state
         *   0: 当前不是抓手状态
         *   1: 当前是抓手状态
         */
            var ToggleHandCommand = kity.createClass("ToggleHandCommand", {
                base: Command,
                execute: function(minder) {
                    if (minder.getStatus() != "hand") {
                        minder.setStatus("hand", true);
                    } else {
                        minder.rollbackStatus();
                    }
                    this.setContentChanged(false);
                },
                queryState: function(minder) {
                    return minder.getStatus() == "hand" ? 1 : 0;
                },
                enableReadOnly: true
            });
            /**
         * @command Camera
         * @description 设置当前视野的中心位置到某个节点上
         * @param {kityminder.MinderNode} focusNode 要定位的节点
         * @param {number} duration 设置视野移动的动画时长（单位 ms），设置为 0 不使用动画
         * @state
         *   0: 始终可用
         */
            var CameraCommand = kity.createClass("CameraCommand", {
                base: Command,
                execute: function(km, focusNode) {
                    focusNode = focusNode || km.getRoot();
                    var viewport = km.getPaper().getViewPort();
                    var offset = focusNode.getRenderContainer().getRenderBox("view");
                    var dx = viewport.center.x - offset.x - offset.width / 2, dy = viewport.center.y - offset.y;
                    var dragger = km._viewDragger;
                    var duration = km.getOption("viewAnimationDuration");
                    dragger.move(new kity.Point(dx, dy), duration);
                    this.setContentChanged(false);
                },
                enableReadOnly: true
            });
            /**
         * @command Move
         * @description 指定方向移动当前视野
         * @param {string} dir 移动方向
         *    取值为 'left'，视野向左移动一半
         *    取值为 'right'，视野向右移动一半
         *    取值为 'up'，视野向上移动一半
         *    取值为 'down'，视野向下移动一半
         * @param {number} duration 视野移动的动画时长（单位 ms），设置为 0 不使用动画
         * @state
         *   0: 始终可用
         */
            var MoveCommand = kity.createClass("MoveCommand", {
                base: Command,
                execute: function(km, dir) {
                    var dragger = km._viewDragger;
                    var size = km._lastClientSize;
                    var duration = km.getOption("viewAnimationDuration");
                    switch (dir) {
                      case "up":
                        dragger.move(new kity.Point(0, size.height / 2), duration);
                        break;

                      case "down":
                        dragger.move(new kity.Point(0, -size.height / 2), duration);
                        break;

                      case "left":
                        dragger.move(new kity.Point(size.width / 2, 0), duration);
                        break;

                      case "right":
                        dragger.move(new kity.Point(-size.width / 2, 0), duration);
                        break;
                    }
                },
                enableReadOnly: true
            });
            return {
                init: function() {
                    this._viewDragger = new ViewDragger(this);
                },
                commands: {
                    hand: ToggleHandCommand,
                    camera: CameraCommand,
                    move: MoveCommand
                },
                events: {
                    statuschange: function(e) {
                        this._viewDragger.setEnabled(e.currentStatus == "hand");
                    },
                    mousewheel: function(e) {
                        var dx, dy;
                        e = e.originEvent;
                        if (e.ctrlKey || e.shiftKey) return;
                        if ("wheelDeltaX" in e) {
                            dx = e.wheelDeltaX || 0;
                            dy = e.wheelDeltaY || 0;
                        } else {
                            dx = 0;
                            dy = e.wheelDelta;
                        }
                        this._viewDragger.move({
                            x: dx / 2.5,
                            y: dy / 2.5
                        });
                        var me = this;
                        clearTimeout(this._mousewheeltimer);
                        this._mousewheeltimer = setTimeout(function() {
                            me.fire("viewchanged");
                        }, 100);
                        e.preventDefault();
                    },
                    "normal.dblclick readonly.dblclick": function(e) {
                        if (e.kityEvent.targetShape instanceof kity.Paper) {
                            this.execCommand("camera", this.getRoot(), 800);
                        }
                    },
                    paperrender: function() {
                        this.execCommand("camera", null, 0);
                        this._lastClientSize = {
                            width: this.getRenderTarget().clientWidth,
                            height: this.getRenderTarget().clientHeight
                        };
                    },
                    resize: function(e) {
                        var a = {
                            width: this.getRenderTarget().clientWidth,
                            height: this.getRenderTarget().clientHeight
                        }, b = this._lastClientSize;
                        this._viewDragger.move(new kity.Point((a.width - b.width) / 2 | 0, (a.height - b.height) / 2 | 0));
                        this._lastClientSize = a;
                    },
                    "selectionchange layoutallfinish": function(e) {
                        var selected = this.getSelectedNode();
                        if (!selected) return;
                        var dragger = this._viewDragger;
                        var view = dragger.getView();
                        var focus = selected.getLayoutBox();
                        var space = 150;
                        var tolerance = 150;
                        var dx = 0, dy = 0;
                        if (focus.right > view.right - tolerance) {
                            dx += view.right - focus.right - space;
                        } else if (focus.left < view.left + tolerance) {
                            dx += view.left - focus.left + space;
                        }
                        if (focus.bottom > view.bottom - tolerance) {
                            dy += view.bottom - focus.bottom - space;
                        }
                        if (focus.top < view.top + tolerance) {
                            dy += view.top - focus.top + space;
                        }
                        if (dx || dy) {
                            dragger.move(new kity.Point(dx, dy));
                        }
                    }
                }
            };
        });
    }
};

//lib/km-core/src/module/zoom.js
_p[81] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var utils = _p.r(52);
        var Minder = _p.r(39);
        var MinderNode = _p.r(41);
        var Command = _p.r(29);
        var Module = _p.r(40);
        var Renderer = _p.r(46);
        Module.register("Zoom", function() {
            var me = this;
            var timeline;
            function setTextRendering() {
                var value = me._zoomValue >= 100 ? "optimize-speed" : "geometricPrecision";
                me.getRenderContainer().setAttr("text-rendering", value);
            }
            function fixPaperCTM(paper) {
                var node = paper.shapeNode;
                var ctm = node.getCTM();
                var matrix = new kity.Matrix(ctm.a, ctm.b, ctm.c, ctm.d, (ctm.e | 0) + .5, (ctm.f | 0) + .5);
                node.setAttribute("transform", "matrix(" + matrix.toString() + ")");
            }
            kity.extendClass(Minder, {
                zoom: function(value) {
                    var paper = this.getPaper();
                    var viewport = paper.getViewPort();
                    viewport.zoom = value / 100;
                    viewport.center = {
                        x: viewport.center.x,
                        y: viewport.center.y
                    };
                    paper.setViewPort(viewport);
                    if (value == 100) fixPaperCTM(paper);
                },
                getZoomValue: function() {
                    return this._zoomValue;
                }
            });
            function zoomMinder(minder, value) {
                var paper = minder.getPaper();
                var viewport = paper.getViewPort();
                if (!value) return;
                setTextRendering();
                var duration = minder.getOption("zoomAnimationDuration");
                if (minder.getRoot().getComplex() > 200 || !duration) {
                    minder._zoomValue = value;
                    minder.zoom(value);
                    minder.fire("viewchange");
                } else {
                    var animator = new kity.Animator({
                        beginValue: minder._zoomValue,
                        finishValue: value,
                        setter: function(target, value) {
                            target.zoom(value);
                        }
                    });
                    minder._zoomValue = value;
                    if (timeline) {
                        timeline.pause();
                    }
                    timeline = animator.start(minder, duration, "easeInOutSine");
                    timeline.on("finish", function() {
                        minder.fire("viewchange");
                    });
                }
                minder.fire("zoom", {
                    zoom: value
                });
            }
            /**
         * @command Zoom
         * @description 缩放当前的视野到一定的比例（百分比）
         * @param {number} value 设置的比例，取值 100 则为原尺寸
         * @state
         *   0: 始终可用
         */
            var ZoomCommand = kity.createClass("Zoom", {
                base: Command,
                execute: zoomMinder,
                queryValue: function(minder) {
                    return minder._zoomValue;
                }
            });
            /**
         * @command ZoomIn
         * @description 放大当前的视野到下一个比例等级（百分比）
         * @shortcut =
         * @state
         *   0: 如果当前脑图的配置中还有下一个比例等级
         *  -1: 其它情况
         */
            var ZoomInCommand = kity.createClass("ZoomInCommand", {
                base: Command,
                execute: function(minder) {
                    zoomMinder(minder, this.nextValue(minder));
                },
                queryState: function(minder) {
                    return +!this.nextValue(minder);
                },
                nextValue: function(minder) {
                    var stack = minder.getOption("zoom"), i;
                    for (i = 0; i < stack.length; i++) {
                        if (stack[i] > minder._zoomValue) return stack[i];
                    }
                    return 0;
                },
                enableReadOnly: true
            });
            /**
         * @command ZoomOut
         * @description 缩小当前的视野到上一个比例等级（百分比）
         * @shortcut -
         * @state
         *   0: 如果当前脑图的配置中还有上一个比例等级
         *  -1: 其它情况
         */
            var ZoomOutCommand = kity.createClass("ZoomOutCommand", {
                base: Command,
                execute: function(minder) {
                    zoomMinder(minder, this.nextValue(minder));
                },
                queryState: function(minder) {
                    return +!this.nextValue(minder);
                },
                nextValue: function(minder) {
                    var stack = minder.getOption("zoom"), i;
                    for (i = stack.length - 1; i >= 0; i--) {
                        if (stack[i] < minder._zoomValue) return stack[i];
                    }
                    return 0;
                },
                enableReadOnly: true
            });
            return {
                init: function() {
                    this._zoomValue = 100;
                    this.setDefaultOptions({
                        zoom: [ 10, 20, 50, 100, 200 ]
                    });
                    setTextRendering();
                },
                commands: {
                    zoomin: ZoomInCommand,
                    zoomout: ZoomOutCommand,
                    zoom: ZoomCommand
                },
                events: {
                    "normal.mousewheel readonly.mousewheel": function(e) {
                        if (!e.originEvent.ctrlKey && !e.originEvent.metaKey) return;
                        var delta = e.originEvent.wheelDelta;
                        var me = this;
                        if (!kity.Browser.mac) {
                            delta = -delta;
                        }
                        // 稀释
                        if (Math.abs(delta) > 100) {
                            clearTimeout(this._wheelZoomTimeout);
                        } else {
                            return;
                        }
                        this._wheelZoomTimeout = setTimeout(function() {
                            var value;
                            var lastValue = me.getPaper()._zoom || 1;
                            if (delta < 0) {
                                me.execCommand("zoom-in");
                            } else if (delta > 0) {
                                me.execCommand("zoom-out");
                            }
                        }, 100);
                        e.originEvent.preventDefault();
                    }
                },
                commandShortcutKeys: {
                    zoomin: "ctrl+=",
                    zoomout: "ctrl+-"
                }
            };
        });
    }
};

//lib/km-core/src/protocol/json.js
_p[82] = {
    value: function(require, exports, module) {
        var data = _p.r(32);
        data.registerProtocol("json", module.exports = {
            fileDescription: "KityMinder 格式",
            fileExtension: ".km",
            dataType: "json",
            mineType: "application/json",
            encode: function(json) {
                return JSON.stringify(json);
            },
            decode: function(local) {
                return JSON.parse(local);
            }
        });
    }
};

//lib/km-core/src/protocol/markdown.js
_p[83] = {
    value: function(require, exports, module) {
        var data = _p.r(32);
        var LINE_ENDING_SPLITER = /\r\n|\r|\n/;
        var EMPTY_LINE = "";
        var NOTE_MARK_START = "<!--Note-->";
        var NOTE_MARK_CLOSE = "<!--/Note-->";
        function encode(json) {
            return _build(json, 1).join("\n");
        }
        function _build(node, level) {
            var lines = [];
            level = level || 1;
            var sharps = _generateHeaderSharp(level);
            lines.push(sharps + " " + node.data.text);
            lines.push(EMPTY_LINE);
            var note = node.data.note;
            if (note) {
                var hasSharp = /^#/.test(note);
                if (hasSharp) {
                    lines.push(NOTE_MARK_START);
                    note = note.replace(/^#+/gm, function($0) {
                        return sharps + $0;
                    });
                }
                lines.push(note);
                if (hasSharp) {
                    lines.push(NOTE_MARK_CLOSE);
                }
                lines.push(EMPTY_LINE);
            }
            if (node.children) node.children.forEach(function(child) {
                lines = lines.concat(_build(child, level + 1));
            });
            return lines;
        }
        function _generateHeaderSharp(level) {
            var sharps = "";
            while (level--) sharps += "#";
            return sharps;
        }
        function decode(markdown) {
            var json, parentMap = {}, lines, line, lineInfo, level, node, parent, noteProgress, codeBlock;
            // 一级标题转换 `{title}\n===` => `# {title}`
            markdown = markdown.replace(/^(.+)\n={3,}/, function($0, $1) {
                return "# " + $1;
            });
            lines = markdown.split(LINE_ENDING_SPLITER);
            // 按行分析
            for (var i = 0; i < lines.length; i++) {
                line = lines[i];
                lineInfo = _resolveLine(line);
                // 备注标记处理
                if (lineInfo.noteClose) {
                    noteProgress = false;
                    continue;
                } else if (lineInfo.noteStart) {
                    noteProgress = true;
                    continue;
                }
                // 代码块处理
                codeBlock = lineInfo.codeBlock ? !codeBlock : codeBlock;
                // 备注条件：备注标签中，非标题定义，或标题越位
                if (noteProgress || codeBlock || !lineInfo.level || lineInfo.level > level + 1) {
                    if (node) _pushNote(node, line);
                    continue;
                }
                // 标题处理
                level = lineInfo.level;
                node = _initNode(lineInfo.content, parentMap[level - 1]);
                parentMap[level] = node;
            }
            _cleanUp(parentMap[1]);
            return parentMap[1];
        }
        function _initNode(text, parent) {
            var node = {
                data: {
                    text: text,
                    note: ""
                }
            };
            if (parent) {
                if (parent.children) parent.children.push(node); else parent.children = [ node ];
            }
            return node;
        }
        function _pushNote(node, line) {
            node.data.note += line + "\n";
        }
        function _isEmpty(line) {
            return !/\S/.test(line);
        }
        function _resolveLine(line) {
            var match = /^(#+)?\s*(.*)$/.exec(line);
            return {
                level: match[1] && match[1].length || null,
                content: match[2],
                noteStart: line == NOTE_MARK_START,
                noteClose: line == NOTE_MARK_CLOSE,
                codeBlock: /^\s*```/.test(line)
            };
        }
        function _cleanUp(node) {
            if (!/\S/.test(node.data.note)) {
                node.data.note = null;
                delete node.data.note;
            } else {
                var notes = node.data.note.split("\n");
                while (notes.length && !/\S/.test(notes[0])) notes.shift();
                while (notes.length && !/\S/.test(notes[notes.length - 1])) notes.pop();
                node.data.note = notes.join("\n");
            }
            if (node.children) node.children.forEach(_cleanUp);
        }
        data.registerProtocol("markdown", module.exports = {
            fileDescription: "Markdown/GFM 格式",
            fileExtension: ".md",
            mineType: "text/markdown",
            dataType: "markdown",
            encode: function(json) {
                return encode(json);
            },
            decode: function(markdown) {
                return decode(markdown);
            }
        });
    }
};

//lib/km-core/src/protocol/png.js
_p[84] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var data = _p.r(32);
        var Promise = _p.r(44);
        var DomURL = window.URL || window.webkitURL || window;
        function loadImage(url, callback) {
            return new Promise(function(resolve, reject) {
                var image = document.createElement("img");
                image.onload = function() {
                    resolve(this);
                };
                image.onerror = function(err) {
                    reject(err);
                };
                image.crossOrigin = "";
                image.src = url;
            });
        }
        function getSVGInfo(minder) {
            var paper = minder.getPaper(), paperTransform, domContainer = paper.container, svgXml, svgContainer, svgDom, renderContainer = minder.getRenderContainer(), renderBox = renderContainer.getRenderBox(), width = renderBox.width + 1, height = renderBox.height + 1, blob, svgUrl, img;
            // 保存原始变换，并且移动到合适的位置
            paperTransform = paper.shapeNode.getAttribute("transform");
            paper.shapeNode.setAttribute("transform", "translate(0.5, 0.5)");
            renderContainer.translate(-renderBox.x, -renderBox.y);
            // 获取当前的 XML 代码
            svgXml = paper.container.innerHTML;
            // 回复原始变换及位置
            renderContainer.translate(renderBox.x, renderBox.y);
            paper.shapeNode.setAttribute("transform", paperTransform);
            // 过滤内容
            svgContainer = document.createElement("div");
            svgContainer.innerHTML = svgXml;
            svgDom = svgContainer.querySelector("svg");
            svgDom.setAttribute("width", renderBox.width + 1);
            svgDom.setAttribute("height", renderBox.height + 1);
            svgDom.setAttribute("style", 'font-family: Arial, "Microsoft Yahei","Heiti SC";');
            svgContainer = document.createElement("div");
            svgContainer.appendChild(svgDom);
            svgXml = svgContainer.innerHTML;
            // Dummy IE
            svgXml = svgXml.replace(' xmlns="http://www.w3.org/2000/svg" ' + 'xmlns:NS1="" NS1:ns1:xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:NS2="" NS2:xmlns:ns1=""', "");
            // svg 含有 &nbsp; 符号导出报错 Entity 'nbsp' not defined
            svgXml = svgXml.replace(/&nbsp;/g, "&#xa0;");
            blob = new Blob([ svgXml ], {
                type: "image/svg+xml"
            });
            svgUrl = DomURL.createObjectURL(blob);
            //svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgXml);
            return {
                width: width,
                height: height,
                dataUrl: svgUrl,
                xml: svgXml
            };
        }
        function encode(json, minder) {
            var resultCallback;
            /* 绘制 PNG 的画布及上下文 */
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            /* 尝试获取背景图片 URL 或背景颜色 */
            var bgDeclare = minder.getStyle("background").toString();
            var bgUrl = /url\((.+)\)/.exec(bgDeclare);
            var bgColor = kity.Color.parse(bgDeclare);
            /* 获取 SVG 文件内容 */
            var svgInfo = getSVGInfo(minder);
            var width = svgInfo.width;
            var height = svgInfo.height;
            var svgDataUrl = svgInfo.dataUrl;
            /* 画布的填充大小 */
            var padding = 20;
            canvas.width = width + padding * 2;
            canvas.height = height + padding * 2;
            function fillBackground(ctx, style) {
                ctx.save();
                ctx.fillStyle = style;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.restore();
            }
            function drawImage(ctx, image, x, y) {
                ctx.drawImage(image, x, y);
            }
            function generateDataUrl(canvas) {
                return canvas.toDataURL("png");
            }
            function drawSVG() {
                return loadImage(svgDataUrl).then(function(svgImage) {
                    drawImage(ctx, svgImage, padding, padding);
                    DomURL.revokeObjectURL(svgDataUrl);
                    return generateDataUrl(canvas);
                });
            }
            if (bgUrl) {
                return loadImage(bgUrl[1]).then(function(image) {
                    fillBackground(ctx, ctx.createPattern(image, "repeat"));
                    return drawSVG();
                });
            } else {
                fillBackground(ctx, bgColor.toString());
                return drawSVG();
            }
        }
        data.registerProtocol("png", module.exports = {
            fileDescription: "PNG 图片",
            fileExtension: ".png",
            mineType: "image/png",
            dataType: "png",
            encode: encode
        });
    }
};

//lib/km-core/src/protocol/svg.js
_p[85] = {
    value: function(require, exports, module) {
        var data = _p.r(32);
        data.registerProtocol("svg", module.exports = {
            fileDescription: "SVG 矢量图",
            fileExtension: ".svg",
            mineType: "image/svg+xml",
            dataType: "svg",
            encode: function(json, minder) {
                var paper = minder.getPaper(), paperTransform = paper.shapeNode.getAttribute("transform"), svgXml, svgContainer, svgDom, renderContainer = minder.getRenderContainer(), renderBox = renderContainer.getRenderBox(), transform = renderContainer.getTransform(), width = renderBox.width, height = renderBox.height, padding = 20;
                paper.shapeNode.setAttribute("transform", "translate(0.5, 0.5)");
                svgXml = paper.container.innerHTML;
                paper.shapeNode.setAttribute("transform", paperTransform);
                svgContainer = document.createElement("div");
                svgContainer.innerHTML = svgXml;
                svgDom = svgContainer.querySelector("svg");
                svgDom.setAttribute("width", width + padding * 2 | 0);
                svgDom.setAttribute("height", height + padding * 2 | 0);
                svgDom.setAttribute("style", 'font-family: Arial, "Microsoft Yahei",  "Heiti SC"; ' + "background: " + minder.getStyle("background"));
                svgDom.setAttribute("viewBox", [ renderBox.x - padding | 0, renderBox.y - padding | 0, width + padding * 2 | 0, height + padding * 2 | 0 ].join(" "));
                svgContainer = document.createElement("div");
                svgContainer.appendChild(svgDom);
                // need a xml with width and height
                svgXml = svgContainer.innerHTML;
                // svg 含有 &nbsp; 符号导出报错 Entity 'nbsp' not defined
                svgXml = svgXml.replace(/&nbsp;/g, "&#xa0;");
                // svg 含有 &nbsp; 符号导出报错 Entity 'nbsp' not defined
                return svgXml;
            }
        });
    }
};

//lib/km-core/src/protocol/text.js
_p[86] = {
    value: function(require, exports, module) {
        var data = _p.r(32);
        var LINE_ENDING = "\r", LINE_ENDING_SPLITER = /\r\n|\r|\n/, TAB_CHAR = "	";
        function repeat(s, n) {
            var result = "";
            while (n--) result += s;
            return result;
        }
        function encode(json, level) {
            var local = "";
            level = level || 0;
            local += repeat(TAB_CHAR, level);
            local += json.data.text + LINE_ENDING;
            if (json.children) {
                json.children.forEach(function(child) {
                    local += encode(child, level + 1);
                });
            }
            return local;
        }
        function isEmpty(line) {
            return !/\S/.test(line);
        }
        function getLevel(line) {
            var level = 0;
            while (line.charAt(level) === TAB_CHAR) level++;
            return level;
        }
        function getNode(line) {
            return {
                data: {
                    text: line.replace(new RegExp("^" + TAB_CHAR + "*"), "")
                }
            };
        }
        function decode(local) {
            var json, parentMap = {}, lines = local.split(LINE_ENDING_SPLITER), line, level, node;
            function addChild(parent, child) {
                var children = parent.children || (parent.children = []);
                children.push(child);
            }
            for (var i = 0; i < lines.length; i++) {
                line = lines[i];
                if (isEmpty(line)) continue;
                level = getLevel(line);
                node = getNode(line);
                if (level === 0) {
                    if (json) {
                        throw new Error("Invalid local format");
                    }
                    json = node;
                } else {
                    if (!parentMap[level - 1]) {
                        throw new Error("Invalid local format");
                    }
                    addChild(parentMap[level - 1], node);
                }
                parentMap[level] = node;
            }
            return json;
        }
        data.registerProtocol("text", module.exports = {
            fileDescription: "大纲文本",
            fileExtension: ".txt",
            dataType: "text",
            mineType: "text/plain",
            encode: function(json) {
                return encode(json, 0);
            },
            decode: function(local) {
                return decode(local);
            }
        });
    }
};

//lib/km-core/src/template/default.js
/**
 * @fileOverview
 *
 * 默认模板 - 脑图模板
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[87] = {
    value: function(require, exports, module) {
        var template = _p.r(50);
        template.register("default", {
            getLayout: function(node) {
                if (node.getData("layout")) return node.getData("layout");
                var level = node.getLevel();
                // 根节点
                if (level === 0) {
                    return "mind";
                }
                // 一级节点
                if (level === 1) {
                    return node.getLayoutPointPreview().x > 0 ? "right" : "left";
                }
                return node.parent.getLayout();
            },
            getConnect: function(node) {
                if (node.getLevel() == 1) return "arc";
                return "under";
            }
        });
    }
};

//lib/km-core/src/template/filetree.js
/**
 * @fileOverview
 *
 * 文件夹模板
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[88] = {
    value: function(require, exports, module) {
        var template = _p.r(50);
        template.register("filetree", {
            getLayout: function(node) {
                if (node.getData("layout")) return node.getData("layout");
                if (node.isRoot()) return "bottom";
                return "filetree-down";
            },
            getConnect: function(node) {
                if (node.getLevel() == 1) {
                    return "poly";
                }
                return "l";
            }
        });
    }
};

//lib/km-core/src/template/fish-bone.js
/**
 * @fileOverview
 *
 * 默认模板 - 鱼骨头模板
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[89] = {
    value: function(require, exports, module) {
        var template = _p.r(50);
        template.register("fish-bone", {
            getLayout: function(node) {
                if (node.getData("layout")) return node.getData("layout");
                var level = node.getLevel();
                // 根节点
                if (level === 0) {
                    return "fish-bone-master";
                }
                // 一级节点
                if (level === 1) {
                    return "fish-bone-slave";
                }
                return node.getLayoutPointPreview().y > 0 ? "filetree-up" : "filetree-down";
            },
            getConnect: function(node) {
                switch (node.getLevel()) {
                  case 1:
                    return "fish-bone-master";

                  case 2:
                    return "line";

                  default:
                    return "l";
                }
            }
        });
    }
};

//lib/km-core/src/template/right.js
/**
 * @fileOverview
 *
 * 往右布局结构模板
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[90] = {
    value: function(require, exports, module) {
        var template = _p.r(50);
        template.register("right", {
            getLayout: function(node) {
                return node.getData("layout") || "right";
            },
            getConnect: function(node) {
                if (node.getLevel() == 1) return "arc";
                return "bezier";
            }
        });
    }
};

//lib/km-core/src/template/structure.js
/**
 * @fileOverview
 *
 * 组织结构图模板
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[91] = {
    value: function(require, exports, module) {
        var template = _p.r(50);
        template.register("structure", {
            getLayout: function(node) {
                return node.getData("layout") || "bottom";
            },
            getConnect: function(node) {
                return "poly";
            }
        });
    }
};

//lib/km-core/src/theme/default.js
_p[92] = {
    value: function(require, exports, module) {
        var theme = _p.r(51);
        [ "classic", "classic-compact" ].forEach(function(name) {
            var compact = name == "classic-compact";
            /* jscs:disable maximumLineLength */
            theme.register(name, {
                background: '#3A4144 url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowQzg5QTQ0NDhENzgxMUUzOENGREE4QTg0RDgzRTZDNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowQzg5QTQ0NThENzgxMUUzOENGREE4QTg0RDgzRTZDNyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkMwOEQ1NDRGOEQ3NzExRTM4Q0ZEQThBODREODNFNkM3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkMwOEQ1NDUwOEQ3NzExRTM4Q0ZEQThBODREODNFNkM3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+e9P33AAAACVJREFUeNpisXJ0YUACTAyoAMr/+eM7EGGRZ4FQ7BycEAZAgAEAHbEGtkoQm/wAAAAASUVORK5CYII=") repeat',
                "root-color": "#430",
                "root-background": "#e9df98",
                "root-stroke": "#e9df98",
                "root-font-size": 24,
                "root-padding": compact ? [ 10, 25 ] : [ 15, 25 ],
                "root-margin": compact ? [ 15, 25 ] : [ 30, 100 ],
                "root-radius": 30,
                "root-space": 10,
                "root-shadow": "rgba(0, 0, 0, .25)",
                "main-color": "#333",
                "main-background": "#a4c5c0",
                "main-stroke": "#a4c5c0",
                "main-font-size": 16,
                "main-padding": compact ? [ 5, 15 ] : [ 6, 20 ],
                "main-margin": compact ? [ 5, 10 ] : 20,
                "main-radius": 10,
                "main-space": 5,
                "main-shadow": "rgba(0, 0, 0, .25)",
                "sub-color": "white",
                "sub-background": "transparent",
                "sub-stroke": "none",
                "sub-font-size": 12,
                "sub-padding": [ 5, 10 ],
                "sub-margin": compact ? [ 5, 10 ] : [ 15, 20 ],
                "sub-tree-margin": 30,
                "sub-radius": 5,
                "sub-space": 5,
                "connect-color": "white",
                "connect-width": 2,
                "main-connect-width": 3,
                "connect-radius": 5,
                "selected-background": "rgb(254, 219, 0)",
                "selected-stroke": "rgb(254, 219, 0)",
                "selected-color": "black",
                "marquee-background": "rgba(255,255,255,.3)",
                "marquee-stroke": "white",
                "drop-hint-color": "yellow",
                "sub-drop-hint-width": 2,
                "main-drop-hint-width": 4,
                "root-drop-hint-width": 4,
                "order-hint-area-color": "rgba(0, 255, 0, .5)",
                "order-hint-path-color": "#0f0",
                "order-hint-path-width": 1,
                "text-selection-color": "rgb(27,171,255)",
                "line-height": 1.5
            });
        });
    }
};

//lib/km-core/src/theme/fish.js
_p[93] = {
    value: function(require, exports, module) {
        var theme = _p.r(51);
        theme.register("fish", {
            background: "#3A4144 url(ui/theme/default/images/grid.png) repeat",
            "root-color": "#430",
            "root-background": "#e9df98",
            "root-stroke": "#e9df98",
            "root-font-size": 24,
            "root-padding": [ 35, 35 ],
            "root-margin": 30,
            "root-radius": 100,
            "root-space": 10,
            "root-shadow": "rgba(0, 0, 0, .25)",
            "main-color": "#333",
            "main-background": "#a4c5c0",
            "main-stroke": "#a4c5c0",
            "main-font-size": 16,
            "main-padding": [ 6, 20 ],
            "main-margin": [ 20, 20 ],
            "main-radius": 5,
            "main-space": 5,
            "main-shadow": "rgba(0, 0, 0, .25)",
            "sub-color": "black",
            "sub-background": "white",
            "sub-stroke": "white",
            "sub-font-size": 12,
            "sub-padding": [ 5, 10 ],
            "sub-margin": [ 10 ],
            "sub-radius": 5,
            "sub-space": 5,
            "connect-color": "white",
            "connect-width": 3,
            "main-connect-width": 3,
            "connect-radius": 5,
            "selected-background": "rgb(254, 219, 0)",
            "selected-stroke": "rgb(254, 219, 0)",
            "marquee-background": "rgba(255,255,255,.3)",
            "marquee-stroke": "white",
            "drop-hint-color": "yellow",
            "drop-hint-width": 4,
            "order-hint-area-color": "rgba(0, 255, 0, .5)",
            "order-hint-path-color": "#0f0",
            "order-hint-path-width": 1,
            "text-selection-color": "rgb(27,171,255)",
            "line-height": 1.5
        });
    }
};

//lib/km-core/src/theme/fresh.js
_p[94] = {
    value: function(require, exports, module) {
        var kity = _p.r(37);
        var theme = _p.r(51);
        function hsl(h, s, l) {
            return kity.Color.createHSL(h, s, l);
        }
        function generate(h, compat) {
            return {
                background: "#fbfbfb",
                "root-color": "white",
                "root-background": hsl(h, 37, 60),
                "root-stroke": hsl(h, 37, 60),
                "root-font-size": 16,
                "root-padding": compat ? [ 6, 12 ] : [ 12, 24 ],
                "root-margin": compat ? 10 : [ 30, 100 ],
                "root-radius": 5,
                "root-space": 10,
                "main-color": "black",
                "main-background": hsl(h, 33, 95),
                "main-stroke": hsl(h, 37, 60),
                "main-stroke-width": 1,
                "main-font-size": 14,
                "main-padding": [ 6, 20 ],
                "main-margin": compat ? 8 : 20,
                "main-radius": 3,
                "main-space": 5,
                "sub-color": "black",
                "sub-background": "transparent",
                "sub-stroke": "none",
                "sub-font-size": 12,
                "sub-padding": compat ? [ 3, 5 ] : [ 5, 10 ],
                "sub-margin": compat ? [ 4, 8 ] : [ 15, 20 ],
                "sub-radius": 5,
                "sub-space": 5,
                "connect-color": hsl(h, 37, 60),
                "connect-width": 1,
                "connect-radius": 5,
                "selected-stroke": hsl(h, 26, 30),
                "selected-stroke-width": "3",
                "blur-selected-stroke": hsl(h, 10, 60),
                "marquee-background": hsl(h, 100, 80).set("a", .1),
                "marquee-stroke": hsl(h, 37, 60),
                "drop-hint-color": hsl(h, 26, 35),
                "drop-hint-width": 5,
                "order-hint-area-color": hsl(h, 100, 30).set("a", .5),
                "order-hint-path-color": hsl(h, 100, 25),
                "order-hint-path-width": 1,
                "text-selection-color": hsl(h, 100, 20),
                "line-height": 1.5
            };
        }
        var plans = {
            red: 0,
            soil: 25,
            green: 122,
            blue: 204,
            purple: 246,
            pink: 334
        };
        var name;
        for (name in plans) {
            theme.register("fresh-" + name, generate(plans[name]));
            theme.register("fresh-" + name + "-compat", generate(plans[name], true));
        }
    }
};

//lib/km-core/src/theme/snow.js
_p[95] = {
    value: function(require, exports, module) {
        var theme = _p.r(51);
        [ "snow", "snow-compact" ].forEach(function(name) {
            var compact = name == "snow-compact";
            /* jscs:disable maximumLineLength */
            theme.register(name, {
                background: '#3A4144 url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowQzg5QTQ0NDhENzgxMUUzOENGREE4QTg0RDgzRTZDNyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowQzg5QTQ0NThENzgxMUUzOENGREE4QTg0RDgzRTZDNyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkMwOEQ1NDRGOEQ3NzExRTM4Q0ZEQThBODREODNFNkM3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkMwOEQ1NDUwOEQ3NzExRTM4Q0ZEQThBODREODNFNkM3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+e9P33AAAACVJREFUeNpisXJ0YUACTAyoAMr/+eM7EGGRZ4FQ7BycEAZAgAEAHbEGtkoQm/wAAAAASUVORK5CYII=") repeat',
                "root-color": "#430",
                "root-background": "#e9df98",
                "root-stroke": "#e9df98",
                "root-font-size": 24,
                "root-padding": compact ? [ 5, 10 ] : [ 15, 25 ],
                "root-margin": compact ? 15 : 30,
                "root-radius": 5,
                "root-space": 10,
                "root-shadow": "rgba(0, 0, 0, .25)",
                "main-color": "#333",
                "main-background": "#a4c5c0",
                "main-stroke": "#a4c5c0",
                "main-font-size": 16,
                "main-padding": compact ? [ 4, 10 ] : [ 6, 20 ],
                "main-margin": compact ? [ 5, 10 ] : [ 20, 40 ],
                "main-radius": 5,
                "main-space": 5,
                "main-shadow": "rgba(0, 0, 0, .25)",
                "sub-color": "black",
                "sub-background": "white",
                "sub-stroke": "white",
                "sub-font-size": 12,
                "sub-padding": [ 5, 10 ],
                "sub-margin": compact ? [ 5, 10 ] : [ 10, 20 ],
                "sub-radius": 5,
                "sub-space": 5,
                "connect-color": "white",
                "connect-width": 2,
                "main-connect-width": 3,
                "connect-radius": 5,
                "selected-background": "rgb(254, 219, 0)",
                "selected-stroke": "rgb(254, 219, 0)",
                "marquee-background": "rgba(255,255,255,.3)",
                "marquee-stroke": "white",
                "drop-hint-color": "yellow",
                "drop-hint-width": 4,
                "order-hint-area-color": "rgba(0, 255, 0, .5)",
                "order-hint-path-color": "#0f0",
                "order-hint-path-width": 1,
                "text-selection-color": "rgb(27,171,255)",
                "line-height": 1.5
            });
        });
    }
};

//lib/km-core/src/theme/wire.js
_p[96] = {
    value: function(require, exports, module) {
        var theme = _p.r(51);
        theme.register("wire", {
            background: "black",
            color: "#999",
            stroke: "none",
            padding: 10,
            margin: 20,
            "font-size": 14,
            "connect-color": "#999",
            "connect-width": 1,
            "selected-background": "#999",
            "selected-color": "black",
            "marquee-background": "rgba(255,255,255,.3)",
            "marquee-stroke": "white",
            "drop-hint-color": "yellow",
            "sub-drop-hint-width": 2,
            "main-drop-hint-width": 4,
            "root-drop-hint-width": 4,
            "order-hint-area-color": "rgba(0, 255, 0, .5)",
            "order-hint-path-color": "#0f0",
            "order-hint-path-width": 1,
            "text-selection-color": "rgb(27,171,255)",
            "line-height": 1.5
        });
    }
};

var moduleMapping = {
    "expose-editor": 1
};

function use(name) {
    _p.r([ moduleMapping[name] ]);
}
use('expose-editor');
})();