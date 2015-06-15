/*!
 * ====================================================
 * kityminder-editor - v1.0.21 - 2015-06-15
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
        assemble(_p.r(11));
        assemble(_p.r(15));
        assemble(_p.r(8));
        assemble(_p.r(9));
        assemble(_p.r(12));
        assemble(_p.r(7));
        assemble(_p.r(10));
        assemble(_p.r(13));
        assemble(_p.r(14));
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
        return module.exports = kityminder.Editor = _p.r(0);
    }
};

//src/hotbox.js
_p[2] = {
    value: function(require, exports, module) {
        return module.exports = window.HotBox;
    }
};

//src/lang.js
_p[3] = {
    value: function(require, exports, module) {}
};

//src/minder.js
_p[4] = {
    value: function(require, exports, module) {
        return module.exports = window.kityminder.Minder;
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
            var container;
            if (typeof this.selector == "string") {
                container = document.querySelector(this.selector);
            } else {
                container = this.selector;
            }
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
        var Debug = _p.r(16);
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
         * @param {string} condition
         *     监视的时机
         *         "* => *" （默认）
         *
         * @param  {Function} handler
         *     监视函数，当状态跳转的时候，会接收三个参数
         *         * from - 跳转前的状态
         *         * to - 跳转后的状态
         *         * reason - 跳转的原因
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

//src/runtime/history.js
/**
 * @fileOverview
 *
 * 历史管理
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[7] = {
    value: function(require, exports, module) {
        var jsonDiff = _p.r(19);
        function HistoryRuntime() {
            var minder = this.minder;
            var hotbox = this.hotbox;
            var MAX_HISTORY = 100;
            var lastSnap;
            var patchLock;
            var undoDiffs;
            var redoDiffs;
            function reset() {
                undoDiffs = [];
                redoDiffs = [];
                lastSnap = minder.exportJson();
            }
            function makeUndoDiff() {
                var headSnap = minder.exportJson();
                var diff = jsonDiff(headSnap, lastSnap);
                if (diff.length) {
                    undoDiffs.push(diff);
                    while (undoDiffs.length > MAX_HISTORY) {
                        undoDiffs.shift();
                    }
                    lastSnap = headSnap;
                    return true;
                }
            }
            function makeRedoDiff() {
                var revertSnap = minder.exportJson();
                redoDiffs.push(jsonDiff(revertSnap, lastSnap));
                lastSnap = revertSnap;
            }
            function undo() {
                patchLock = true;
                var undoDiff = undoDiffs.pop();
                if (undoDiff) {
                    minder.applyPatches(undoDiff);
                    makeRedoDiff();
                }
                patchLock = false;
            }
            function redo() {
                patchLock = true;
                var redoDiff = redoDiffs.pop();
                if (redoDiffs) {
                    minder.applyPatches(redoDiff);
                    makeUndoDiff();
                }
                patchLock = false;
            }
            function changed() {
                if (patchLock) return;
                if (makeUndoDiff()) redoDiffs = [];
            }
            function hasUndo() {
                return !!undoDiffs.length;
            }
            function hasRedo() {
                return !!redoDiffs.length;
            }
            function updateSelection(e) {
                if (!patchLock) return;
                var patch = e.patch;
                switch (patch.express) {
                  case "node.add":
                    minder.select(patch.node.getChild(patch.index), true);
                    break;

                  case "node.remove":
                  case "data.replace":
                  case "data.remove":
                  case "data.add":
                    minder.select(patch.node, true);
                    break;
                }
            }
            this.history = {
                reset: reset,
                undo: undo,
                redo: redo,
                hasUndo: hasUndo,
                hasRedo: hasRedo
            };
            reset();
            minder.on("contentchange", changed);
            minder.on("import", reset);
            minder.on("patch", updateSelection);
            var main = hotbox.state("main");
            main.button({
                position: "top",
                label: "撤销",
                key: "Ctrl + Z",
                enable: hasUndo,
                action: undo,
                next: "idle"
            });
            main.button({
                position: "top",
                label: "重做",
                key: "Ctrl + Y",
                enable: hasRedo,
                action: redo,
                next: "idle"
            });
        }
        window.diff = jsonDiff;
        return module.exports = HistoryRuntime;
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
_p[8] = {
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
_p[9] = {
    value: function(require, exports, module) {
        _p.r(18);
        var Debug = _p.r(16);
        var debug = new Debug("input");
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
                fsm.when("* -> input", enterInputMode);
                // when exited, commit or exit depends on the exit reason
                fsm.when("input -> *", function(exit, enter, reason) {
                    switch (reason) {
                      case "input-cancel":
                        return exitInputMode();

                      case "input-commit":
                      default:
                        return commitInputResult();
                    }
                });
                // lost focus to commit
                minder.on("beforemousedown", function() {
                    if (fsm.state() == "input") {
                        fsm.jump("normal", "input-commit");
                    }
                });
                minder.on("dblclick", function() {
                    if (minder.getSelectedNode()) {
                        editText();
                    }
                });
            }
            // let the receiver follow the current selected node position
            function setupReciverElement() {
                if (debug.flaged) {
                    receiverElement.classList.add("debug");
                }
                receiverElement.onmousedown = function(e) {
                    e.stopPropagation();
                };
                minder.on("layoutallfinish viewchange viewchanged selectionchange", function(e) {
                    // viewchange event is too frequenced, lazy it
                    if (e.type == "viewchange" && fsm.state() != "input") return;
                    updatePosition();
                });
                updatePosition();
            }
            // edit entrance in hotbox
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
            // edit for the selected node
            function editText() {
                receiverElement.innerText = minder.queryCommandValue("text");
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
                var planed = updatePosition;
                var focusNode = minder.getSelectedNode();
                if (!focusNode) return;
                if (!planed.timer) {
                    planed.timer = setTimeout(function() {
                        var box = focusNode.getRenderBox("TextRenderer");
                        receiverElement.style.left = Math.round(box.x) + "px";
                        receiverElement.style.top = (debug.flaged ? Math.round(box.bottom + 30) : Math.round(box.y)) + "px";
                        //receiverElement.focus();
                        planed.timer = 0;
                    });
                }
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
_p[10] = {
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
            var container = this.container;
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
                if (hotbox.state() == Hotbox.STATE_IDLE && fsm.state() == "hotbox") {
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
            //////////////////////////////////////////////
            /// 右键呼出热盒
            /// 判断的标准是：按下的位置和结束的位置一致
            //////////////////////////////////////////////
            var downX, downY;
            var MOUSE_RB = 2;
            // 右键
            container.addEventListener("mousedown", function(e) {
                if (e.button == MOUSE_RB) {
                    e.preventDefault();
                }
                if (fsm.state() == "hotbox") {
                    hotbox.active(Hotbox.STATE_IDLE);
                    fsm.jump("normal", "blur");
                } else if (fsm.state() == "normal" && e.button == MOUSE_RB) {
                    downX = e.clientX;
                    downY = e.clientY;
                }
            }, false);
            container.addEventListener("contextmenu", function(e) {
                e.preventDefault();
            });
            container.addEventListener("mouseup", function(e) {
                if (fsm.state() != "normal") {
                    return;
                }
                if (e.button != MOUSE_RB || e.clientX != downX || e.clientY != downY) {
                    return;
                }
                if (!minder.getSelectedNode()) {
                    return;
                }
                fsm.jump("hotbox", "content-menu");
            }, false);
            // 阻止热盒事件冒泡，在热盒正确执行前导致热盒关闭
            hotbox.$element.addEventListener("mousedown", function(e) {
                e.stopPropagation();
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
_p[11] = {
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
_p[12] = {
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
            main.button({
                position: "ring",
                key: "/",
                action: function() {
                    if (!minder.queryCommandState("expand")) {
                        minder.execCommand("expand");
                    } else if (!minder.queryCommandState("collapse")) {
                        minder.execCommand("collapse");
                    }
                },
                enable: function() {
                    return minder.queryCommandState("expand") != -1 || minder.queryCommandState("collapse") != -1;
                },
                beforeShow: function() {
                    if (!minder.queryCommandState("expand")) {
                        this.$button.children[0].innerHTML = "展开";
                    } else {
                        this.$button.children[0].innerHTML = "收起";
                    }
                }
            });
        }
        return module.exports = NodeRuntime;
    }
};

//src/runtime/priority.js
_p[13] = {
    value: function(require, exports, module) {
        function PriorityRuntime() {
            var minder = this.minder;
            var hotbox = this.hotbox;
            var main = hotbox.state("main");
            main.button({
                position: "top",
                label: "优先级",
                key: "P",
                next: "priority",
                enable: function() {
                    return minder.queryCommandState("priority") != -1;
                }
            });
            var priority = hotbox.state("priority");
            "123456789".replace(/./g, function(p) {
                priority.button({
                    position: "ring",
                    label: "P" + p,
                    key: p,
                    action: function() {
                        minder.execCommand("Priority", p);
                    }
                });
            });
            priority.button({
                position: "center",
                label: "移除",
                key: "Del",
                action: function() {
                    minder.execCommand("Priority", 0);
                }
            });
            priority.button({
                position: "top",
                label: "返回",
                key: "esc",
                next: "back"
            });
        }
        return module.exports = PriorityRuntime;
    }
};

//src/runtime/progress.js
_p[14] = {
    value: function(require, exports, module) {
        function ProgressRuntime() {
            var minder = this.minder;
            var hotbox = this.hotbox;
            var main = hotbox.state("main");
            main.button({
                position: "top",
                label: "进度",
                key: "G",
                next: "progress",
                enable: function() {
                    return minder.queryCommandState("progress") != -1;
                }
            });
            var progress = hotbox.state("progress");
            "012345678".replace(/./g, function(p) {
                progress.button({
                    position: "ring",
                    label: "G" + p,
                    key: p,
                    action: function() {
                        minder.execCommand("Progress", parseInt(p) + 1);
                    }
                });
            });
            progress.button({
                position: "center",
                label: "移除",
                key: "Del",
                action: function() {
                    minder.execCommand("Progress", 0);
                }
            });
            progress.button({
                position: "top",
                label: "返回",
                key: "esc",
                next: "back"
            });
        }
        return module.exports = ProgressRuntime;
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
_p[15] = {
    value: function(require, exports, module) {
        var key = _p.r(20);
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
_p[16] = {
    value: function(require, exports, module) {
        var format = _p.r(17);
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
_p[17] = {
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
 * innerText polyfill
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[18] = {
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

//src/tool/jsondiff.js
/**
 * @fileOverview
 *
 *
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[19] = {
    value: function(require, exports, module) {
        /*!
    * https://github.com/Starcounter-Jack/Fast-JSON-Patch
    * json-patch-duplex.js 0.5.0
    * (c) 2013 Joachim Wester
    * MIT license
    */
        var _objectKeys = function() {
            if (Object.keys) return Object.keys;
            return function(o) {
                var keys = [];
                for (var i in o) {
                    if (o.hasOwnProperty(i)) {
                        keys.push(i);
                    }
                }
                return keys;
            };
        }();
        function escapePathComponent(str) {
            if (str.indexOf("/") === -1 && str.indexOf("~") === -1) return str;
            return str.replace(/~/g, "~0").replace(/\//g, "~1");
        }
        function deepClone(obj) {
            if (typeof obj === "object") {
                return JSON.parse(JSON.stringify(obj));
            } else {
                return obj;
            }
        }
        // Dirty check if obj is different from mirror, generate patches and update mirror
        function _generate(mirror, obj, patches, path) {
            var newKeys = _objectKeys(obj);
            var oldKeys = _objectKeys(mirror);
            var changed = false;
            var deleted = false;
            for (var t = oldKeys.length - 1; t >= 0; t--) {
                var key = oldKeys[t];
                var oldVal = mirror[key];
                if (obj.hasOwnProperty(key)) {
                    var newVal = obj[key];
                    if (typeof oldVal == "object" && oldVal != null && typeof newVal == "object" && newVal != null) {
                        _generate(oldVal, newVal, patches, path + "/" + escapePathComponent(key));
                    } else {
                        if (oldVal != newVal) {
                            changed = true;
                            patches.push({
                                op: "replace",
                                path: path + "/" + escapePathComponent(key),
                                value: deepClone(newVal)
                            });
                        }
                    }
                } else {
                    patches.push({
                        op: "remove",
                        path: path + "/" + escapePathComponent(key)
                    });
                    deleted = true;
                }
            }
            if (!deleted && newKeys.length == oldKeys.length) {
                return;
            }
            for (var t = 0; t < newKeys.length; t++) {
                var key = newKeys[t];
                if (!mirror.hasOwnProperty(key)) {
                    patches.push({
                        op: "add",
                        path: path + "/" + escapePathComponent(key),
                        value: deepClone(obj[key])
                    });
                }
            }
        }
        function compare(tree1, tree2) {
            var patches = [];
            _generate(tree1, tree2, patches, "");
            return patches;
        }
        return module.exports = compare;
    }
};

//src/tool/key.js
_p[20] = {
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

//src/tool/keymap.js
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

var moduleMapping = {
    "expose-editor": 1
};

function use(name) {
    _p.r([ moduleMapping[name] ]);
}
angular.module('kityminderEditor', [
    'ui.bootstrap',
	'ui.codemirror',
	'colorpicker.module'
])
	.config(["$sceDelegateProvider", function($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			// Allow same origin resource loads.
			'self',
			// Allow loading from our assets domain.  Notice the difference between * and **.
			'http://agroup.baidu.com:8910/**',
			'http://agroup.baidu.com:8911/**'
		]);
	}]);
angular.module('kityminderEditor').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ui/directive/colorPanel/colorPanel.html',
    "<ul class=\"color-list\"><li ng-repeat=\"c in seriesColor\" class=\"color-wrap\" ng-class=\"{'color-wrap-selected': minder.queryCommandValue('background') == c}\" ng-disabled=\"minder.queryCommandState('background') === -1\"><span ng-click=\"minder.execCommand('background', c)\" ng-style=\"{ 'background-color': c }\" class=\"color-item\" title=\"{{ c }}\"></span></li><li class=\"color-wrap\" ng-disabled=\"minder.queryCommandState('background') === -1\" ng-class=\"{'color-wrap-selected': minder.queryCommandValue('background') == customColor}\"><span colorpicker class=\"color-item\" ng-model=\"hexPicker\" ng-style=\"{ 'background-color': customColor }\" title=\"{{ hexPicker }}\"></span></li></ul>"
  );


  $templateCache.put('ui/directive/controlPanel/controlPanel.html',
    "<div class=\"divider\"></div><tabset><tab heading=\"{{ 'idea' | lang: 'ui/tabs'; }}\"><accordion close-others=\"false\"><accordion-group heading=\"{{ 'priority' | lang: 'panels'; }}\" is-open=\"true\"><priority-editor minder=\"minder\"></priority-editor></accordion-group><accordion-group heading=\"{{ 'progress' | lang: 'panels'; }}\" is-open=\"true\"><progress-editor minder=\"minder\"></progress-editor></accordion-group><accordion-group heading=\"{{ 'resource' | lang: 'panels'; }}\" is-open=\"true\"><resource-editor minder=\"minder\"></resource-editor></accordion-group></accordion></tab><tab heading=\"{{ 'appearence' | lang: 'ui/tabs'; }}\"><accordion close-others=\"false\"><accordion-group heading=\"{{ 'template' | lang: 'panels'; }}\" is-open=\"true\"><template-list minder=\"minder\" class=\"inline-directive\"></template-list><layout minder=\"minder\" class=\"inline-directive\"></layout></accordion-group></accordion><accordion close-others=\"false\"><accordion-group heading=\"{{ 'theme' | lang: 'panels'; }}\" is-open=\"true\"><theme-list minder=\"minder\"></theme-list></accordion-group></accordion><accordion close-others=\"false\"><accordion-group heading=\"{{ 'style' | lang: 'panels'; }}\" is-open=\"true\"><style-operator minder=\"minder\" class=\"inline-directive\"></style-operator></accordion-group></accordion><accordion close-others=\"false\"><accordion-group heading=\"{{ 'font' | lang: 'panels'; }}\" is-open=\"true\"><font-operator minder=\"minder\" class=\"inline-directive\"></font-operator></accordion-group></accordion><accordion close-others=\"false\"><accordion-group heading=\"{{ 'background' | lang: 'panels'; }}\" is-open=\"true\"><color-panel minder=\"minder\" class=\"inline-directive\"></color-panel></accordion-group></accordion></tab><tab heading=\"{{ 'note' | lang: 'panels'; }}\" select=\"refreshNotePanel()\"><note-editor minder=\"minder\" class=\"km-note\"></note-editor></tab></tabset>"
  );


  $templateCache.put('ui/directive/fontOperator/fontOperator.html',
    "<span class=\"dropdown font-size-list\" dropdown><div class=\"dropdown-toggle current-font-item\" dropdown-toggle ng-disabled=\"minder.queryCommandState('fontsize') === -1\"><a href class=\"current-font-item\" title=\"{{ 'fontsize' | lang: 'ui' }}\">{{ minder.queryCommandValue('fontsize') || '默认字号' }}</a> <span class=\"caret\"></span></div><ul class=\"dropdown-menu font-list\"><li ng-repeat=\"f in fontSizeList\" class=\"font-item-wrap\"><a ng-click=\"minder.execCommand('fontsize', f)\" class=\"font-item\" ng-class=\"{ 'font-item-selected' : f == minder.queryCommandValue('fontsize') }\" ng-style=\"{'font-size': f + 'px'}\">{{ f }}</a></li></ul></span> <span class=\"s-btn-icon font-bold\" ng-click=\"minder.execCommand('bold')\" ng-class=\"{'font-bold-selected' : minder.queryCommandState('bold') == 1}\" ng-disabled=\"minder.queryCommandState('bold') === -1\"></span> <span class=\"s-btn-icon font-italics\" ng-click=\"minder.execCommand('italic')\" ng-class=\"{'font-italics-selected' : minder.queryCommandState('italic') == 1}\" ng-disabled=\"minder.queryCommandState('italic') === -1\"></span><div class=\"font-color-wrap\"><span colorpicker class=\"font-color\" ng-model=\"hexPicker\" ng-style=\"{ 'background-color': customColor }\" ng-disabled=\"minder.queryCommandState('forecolor') === -1\" title=\"{{ hexPicker }}\"></span></div>"
  );


  $templateCache.put('ui/directive/kityminderEditor/kityminderEditor.html',
    "<div class=\"minder-editor-container\"><div class=\"minder-editor\" ng-style=\"{'right': (config.dividerWidth + config.ctrlPanelWidth) + 'px' }\"></div><div class=\"minder-divider\" minder-divider=\"config\" minder=\"minder\" ng-if=\"minder\" ng-style=\"{'width': config.dividerWidth + 'px', 'right': config.ctrlPanelWidth + 'px'}\"></div><div class=\"control-panel\" control-panel ng-if=\"minder\" ng-style=\"{'width': config.ctrlPanelWidth + 'px'}\"></div><div class=\"note-previewer\" note-previewer ng-if=\"minder\"></div></div>"
  );


  $templateCache.put('ui/directive/layout/layout.html',
    "<a ng-click=\"minder.execCommand('resetlayout')\" class=\"btn-wrap\" ng-disabled=\"minder.queryCommandState('resetlayout') === -1\"><span class=\"btn-icon reset-layout-icon\"></span> <span class=\"btn-label\">{{ 'resetlayout' | lang: 'ui/command' }}</span></a>"
  );


  $templateCache.put('ui/directive/noteEditor/noteEditor.html',
    "<div class=\"km-note\" ng-show=\"noteEnabled\" ui-codemirror=\"{ onLoad: codemirrorLoaded }\" ng-model=\"noteContent\" ui-codemirror-opts=\"{\n" +
    "\t\tgfm: true,\n" +
    "\t\tbreaks: true,\n" +
    "\t\tlineWrapping : true,\n" +
    "\t\tmode: 'gfm',\n" +
    "        dragDrop: false,\n" +
    "        lineNumbers:true\n" +
    "\t }\"></div><p ng-show=\"!noteEnabled\" class=\"km-note-tips\">请选择节点编辑备注</p>"
  );


  $templateCache.put('ui/directive/notePreviewer/notePreviewer.html',
    "<div id=\"previewer-content\" ng-show=\"showNotePreviewer\" ng-style=\"previewerStyle\" ng-bind-html=\"noteContent\"></div>"
  );


  $templateCache.put('ui/directive/priorityEditor/priorityEditor.html',
    "<ul class=\"km-priority tool-group\" ng-disabled=\"commandDisabled\"><li class=\"km-priority-item tool-group-item\" ng-repeat=\"p in priorities\" ng-click=\"minder.execCommand('priority', p)\" ng-class=\"{ active: commandValue == p }\" title=\"{{ getPriorityTitle(p) }}\"><div class=\"km-priority-icon tool-group-icon priority-{{p}}\"></div></li></ul>"
  );


  $templateCache.put('ui/directive/progressEditor/progressEditor.html',
    "<ul class=\"km-progress tool-group\" ng-disabled=\"commandDisabled\"><li class=\"km-progress-item tool-group-item\" ng-repeat=\"p in progresses\" ng-click=\"minder.execCommand('progress', p)\" ng-class=\"{ active: commandValue == p }\" title=\"{{ getProgressTitle(p) }}\"><div class=\"km-progress-icon tool-group-icon progress-{{p}}\"></div></li></ul>"
  );


  $templateCache.put('ui/directive/resourceEditor/resourceEditor.html',
    "<div><div class=\"input-group\"><input class=\"form-control\" type=\"text\" ng-model=\"newResourceName\" ng-required ng-keypress=\"$event.keyCode == 13 && addResource(newResourceName)\" ng-disabled=\"!enabled\"> <span class=\"input-group-btn\"><button class=\"btn btn-default\" ng-click=\"addResource(newResourceName)\" ng-disabled=\"!enabled\">添加</button></span></div><ul class=\"km-resource\"><li ng-repeat=\"resource in used\" ng-disabled=\"!enabled\"><label style=\"background: {{resourceColor(resource.name)}}\"><input type=\"checkbox\" ng-model=\"resource.selected\" ng-disabled=\"!enabled\"> <span>{{resource.name}}</span></label></li></ul></div>"
  );


  $templateCache.put('ui/directive/styleOperator/styleOperator.html',
    "<a ng-click=\"minder.execCommand('clearstyle')\" class=\"btn-wrap\" ng-disabled=\"minder.queryCommandState('clearstyle') === -1;\"><span class=\"btn-icon clear-style-icon\"></span> <span class=\"btn-label\">{{ 'clearstyle' | lang: 'ui' }}</span></a><div class=\"s-btn-group-vertical\"><a class=\"s-btn-wrap\" href ng-click=\"minder.execCommand('copystyle')\" ng-disabled=\"minder.queryCommandState('copystyle') === -1;\"><span class=\"s-btn-icon copy-style-icon\"></span> <span class=\"s-btn-label\">{{ 'copystyle' | lang: 'ui' }}</span></a> <a class=\"s-btn-wrap paste-style-wrap\" href ng-click=\"minder.execCommand('pastestyle')\" ng-disabled=\"minder.queryCommandState('pastestyle') === -1;\"><span class=\"s-btn-icon paste-style-icon\"></span> <span class=\"s-btn-label\">{{ 'pastestyle' | lang: 'ui' }}</span></a></div>"
  );


  $templateCache.put('ui/directive/templateList/templateList.html',
    "<span class=\"dropdown\" dropdown on-toggle=\"toggled(open)\"><div class=\"dropdown-toggle current-temp-item\" ng-disabled=\"minder.queryCommandState('template') === -1\" dropdown-toggle><a href class=\"temp-item {{ minder.queryCommandValue('template') }}\" title=\"{{ minder.queryCommandValue('template') | lang: 'template' }}\"></a> <span class=\"caret\"></span></div><ul class=\"dropdown-menu temp-list\"><li ng-repeat=\"(key, templateObj) in templateList\" class=\"temp-item-wrap\"><a ng-click=\"minder.execCommand('template', key);\" class=\"temp-item {{key}}\" ng-class=\"{ 'temp-item-selected' : key == minder.queryCommandValue('template') }\" title=\"{{ key | lang: 'template' }}\"></a></li></ul></span>"
  );


  $templateCache.put('ui/directive/themeList/themeList.html',
    "<span class=\"dropdown\" dropdown><div class=\"dropdown-toggle theme-item-selected\" dropdown-toggle ng-disabled=\"minder.queryCommandState('theme') === -1\"><a href class=\"theme-item\" ng-style=\"getThemeThumbStyle(minder.queryCommandValue('theme'))\" title=\"{{ minder.queryCommandValue('theme') | lang: 'theme'; }}\">{{ minder.queryCommandValue('theme') | lang: 'theme'; }}</a> <span class=\"caret\"></span></div><ul class=\"dropdown-menu theme-list\"><li ng-repeat=\"key in themeKeyList\" class=\"theme-item-wrap\"><a ng-click=\"minder.execCommand('theme', key);\" class=\"theme-item\" ng-style=\"getThemeThumbStyle(key)\" title=\"{{ key | lang: 'theme'; }}\">{{ key | lang: 'theme'; }}</a></li></ul></span>"
  );

}]);

angular.module('kityminderEditor').service('commandBinder', function() {
	return {
		bind: function(minder, command, scope) {

			minder.on('interactchange', function() {
				scope.commandDisabled = minder.queryCommandState(command) === -1;
				scope.commandValue = minder.queryCommandValue(command);
				scope.$apply();
			});
		}
	};
});
angular.module('kityminderEditor')
	.service('config',  function() {

		return {
			_default: {
				ctrlPanelMin: 250,
				ctrlPanelWidth: parseInt(window.localStorage.__dev_minder_ctrlPanelWidth) || 250,
				dividerWidth: 3,
				defaultLang: 'zh-cn',
                defaultMode: 'edit'
			},
			getConfig: function(key) {
				return key == undefined ? this._default : (this._default[key] || null);
			},
			setConfig: function(obj) {
				this._default = obj;
			}
		}
	});
angular.module('kityminderEditor')
	.service('lang.zh-cn', function() {
		return {
			'zh-cn': {
				'template': {
					'default': '思维导图',
					'tianpan': '天盘图',
					'structure': '组织结构图',
					'filetree': '目录组织图',
					'right': '逻辑结构图',
					'fish-bone': '鱼骨头图'
				},
				'theme': {
					'classic': '脑图经典',
					'classic-compact': '紧凑经典',
					'snow': '温柔冷光',
					'snow-compact': '紧凑冷光',
					'fish': '鱼骨图',
					'wire': '线框',
					'fresh-red': '清新红',
					'fresh-soil': '泥土黄',
					'fresh-green': '文艺绿',
					'fresh-blue': '天空蓝',
					'fresh-purple': '浪漫紫',
					'fresh-pink': '脑残粉',
					'fresh-red-compat': '紧凑红',
					'fresh-soil-compat': '紧凑黄',
					'fresh-green-compat': '紧凑绿',
					'fresh-blue-compat': '紧凑蓝',
					'fresh-purple-compat': '紧凑紫',
					'fresh-pink-compat': '紧凑粉',
					'tianpan':'经典天盘',
					'tianpan-compact': '紧凑天盘'
				},
				'maintopic': '中心主题',
				'topic': '分支主题',
				'panels': {
					'history': '历史',
					'template': '模板',
					'theme': '皮肤',
					'layout': '布局',
					'style': '样式',
					'font': '文字',
					'color': '颜色',
					'background': '背景',
					'insert': '插入',
					'arrange': '调整',
					'nodeop': '当前',
					'priority': '优先级',
					'progress': '进度',
					'resource': '资源',
					'note': '备注',
					'attachment': '附件',
					'word': '文字'
				},
				'error_message': {
					'title': '哎呀，脑图出错了',

					'err_load': '加载脑图失败',
					'err_save': '保存脑图失败',
					'err_network': '网络错误',
					'err_doc_resolve': '文档解析失败',
					'err_unknown': '发生了奇怪的错误',
					'err_localfile_read': '文件读取错误',
					'err_download': '文件下载失败',
					'err_remove_share': '取消分享失败',
					'err_create_share': '分享失败',
					'err_mkdir': '目录创建失败',
					'err_ls': '读取目录失败',
					'err_share_data': '加载分享内容出错',
					'err_share_sync_fail': '分享内容同步失败',
					'err_move_file': '文件移动失败',
					'err_rename': '重命名失败',

					'unknownreason': '可能是外星人篡改了代码...',
					'pcs_code': {
						3: "不支持此接口",
						4: "没有权限执行此操作",
						5: "IP未授权",
						110: "用户会话已过期，请重新登录",
						31001: "数据库查询错误",
						31002: "数据库连接错误",
						31003: "数据库返回空结果",
						31021: "网络错误",
						31022: "暂时无法连接服务器",
						31023: "输入参数错误",
						31024: "app id为空",
						31025: "后端存储错误",
						31041: "用户的cookie不是合法的百度cookie",
						31042: "用户未登陆",
						31043: "用户未激活",
						31044: "用户未授权",
						31045: "用户不存在",
						31046: "用户已经存在",
						31061: "文件已经存在",
						31062: "文件名非法",
						31063: "文件父目录不存在",
						31064: "无权访问此文件",
						31065: "目录已满",
						31066: "文件不存在",
						31067: "文件处理出错",
						31068: "文件创建失败",
						31069: "文件拷贝失败",
						31070: "文件删除失败",
						31071: "不能读取文件元信息",
						31072: "文件移动失败",
						31073: "文件重命名失败",
						31079: "未找到文件MD5，请使用上传API上传整个文件。",
						31081: "superfile创建失败",
						31082: "superfile 块列表为空",
						31083: "superfile 更新失败",
						31101: "tag系统内部错误",
						31102: "tag参数错误",
						31103: "tag系统错误",
						31110: "未授权设置此目录配额",
						31111: "配额管理只支持两级目录",
						31112: "超出配额",
						31113: "配额不能超出目录祖先的配额",
						31114: "配额不能比子目录配额小",
						31141: "请求缩略图服务失败",
						31201: "签名错误",
						31202: "文件不存在",
						31203: "设置acl失败",
						31204: "请求acl验证失败",
						31205: "获取acl失败",
						31206: "acl不存在",
						31207: "bucket已存在",
						31208: "用户请求错误",
						31209: "服务器错误",
						31210: "服务器不支持",
						31211: "禁止访问",
						31212: "服务不可用",
						31213: "重试出错",
						31214: "上传文件data失败",
						31215: "上传文件meta失败",
						31216: "下载文件data失败",
						31217: "下载文件meta失败",
						31218: "容量超出限额",
						31219: "请求数超出限额",
						31220: "流量超出限额",
						31298: "服务器返回值KEY非法",
						31299: "服务器返回值KEY不存在"
					}
				},
				'ui': {
					'shared_file_title': '[分享的] {0} (只读)',
					'load_share_for_edit': '正在加载分享的文件...',
					'share_sync_success': '分享内容已同步',
					'recycle_clear_confirm': '确认清空回收站么？清空后的文件无法恢复。',

					'fullscreen_exit_hint': '按 Esc 或 F11 退出全屏',

					'error_detail': '详细信息',
					'copy_and_feedback': '复制并反馈',
					'move_file_confirm': '确定把 "{0}" 移动到 "{1}" 吗？',
					'rename': '重命名',
					'rename_success': '{0} 重命名成功',
					'move_success': '{0} 移动成功到 {1}',

					'command': {
						'appendsiblingnode': '插入同级主题',
						'appendchildnode': '插入下级主题',
						'removenode': '删除',
						'editnode': '编辑',
						'arrangeup': '上移',
						'arrangedown': '下移',
						'resetlayout': '整理布局',
						'expandtoleaf': '展开全部节点',
						'expandtolevel1': '展开到一级节点',
						'expandtolevel2': '展开到二级节点',
						'expandtolevel3': '展开到三级节点',
						'expandtolevel4': '展开到四级节点',
						'expandtolevel5': '展开到五级节点',
						'expandtolevel6': '展开到六级节点',
						'fullscreen': '全屏',
						'outline': '大纲'
					},

					'expandtoleaf': '展开',

					'back': '返回',

					'undo': '撤销 (Ctrl + Z)',
					'redo': '重做 (Ctrl + Y)',

					'tabs': {
						'idea': '思路',
						'appearence': '外观',
						'view': '视图'
					},

					'quickvisit': {
						'new': '新建 (Ctrl + Alt + N)',
						'save': '保存 (Ctrl + S)',
						'share': '分享 (Ctrl + Alt + S)',
						'feedback': '反馈问题（F1）',
						'editshare': '编辑'
					},

					'menu': {

						'mainmenutext': '百度脑图', // 主菜单按钮文本

						'newtab': '新建',
						'opentab': '打开',
						'savetab': '保存',
						'sharetab': '分享',
						'preferencetab': '设置',
						'helptab': '帮助',
						'feedbacktab': '反馈',
						'recenttab': '最近使用',
						'netdisktab': '百度云存储',
						'localtab': '本地文件',
						'drafttab': '草稿箱',
						'downloadtab': '导出到本地',
						'createsharetab': '当前脑图',
						'managesharetab': '已分享',

						'newheader': '新建脑图',
						'openheader': '打开',
						'saveheader': '保存到',
						'draftheader': '草稿箱',
						'shareheader': '分享我的脑图',
						'downloadheader': '导出到指定格式',
						'preferenceheader': '偏好设置',
						'helpheader': '帮助',
						'feedbackheader': '反馈'
					},

					'mydocument': '我的文档',
					'emptydir': '目录为空！',
					'pickfile': '选择文件...',
					'acceptfile': '支持的格式：{0}',
					'dropfile': '或将文件拖至此处',
					'unsupportedfile': '不支持的文件格式',
					'untitleddoc': '未命名文档',
					'overrideconfirm': '{0} 已存在，确认覆盖吗？',
					'checklogin': '检查登录状态中...',
					'loggingin': '正在登录...',
					'recent': '最近打开',
					'clearrecent': '清空',
					'clearrecentconfirm': '确认清空最近文档列表？',
					'cleardraft': '清空',
					'cleardraftconfirm': '确认清空草稿箱？',

					'none_share': '不分享',
					'public_share': '公开分享',
					'password_share': '私密分享',
					'email_share': '邮件邀请',
					'url_share': '脑图 URL 地址：',
					'sns_share': '社交网络分享：',
					'sns_share_text': '“{0}” - 我用百度脑图制作的思维导图，快看看吧！（地址：{1}）',
					'none_share_description': '不分享当前脑图',
					'public_share_description': '创建任何人可见的分享',
					'share_button_text': '创建',
					'password_share_description': '创建需要密码才可见的分享',
					'email_share_description': '创建指定人可见的分享，您还可以允许他们编辑',
					'ondev': '敬请期待！',
					'create_share_failed': '分享失败：{0}',
					'remove_share_failed': '删除失败：{1}',
					'copy': '复制',
					'copied': '已复制',
					'shared_tip': '当前脑图被 {0}  分享，你可以修改之后保存到自己的网盘上或再次分享',
					'current_share': '当前脑图',
					'manage_share': '我的分享',
					'share_remove_action': '不分享该脑图',
					'share_view_action': '打开分享地址',
					'share_edit_action': '编辑分享的文件',

					'login': '登录',
					'logout': '注销',
					'switchuser': '切换账户',
					'userinfo': '个人信息',
					'gotonetdisk': '我的网盘',
					'requirelogin': '请 <a class="login-button">登录</a> 后使用',
					'saveas': '保存为',
					'filename': '文件名',
					'fileformat': '保存格式',
					'save': '保存',
					'mkdir': '新建目录',
					'recycle': '回收站',
					'newdir': '未命名目录',

					'bold': '加粗',
					'italic': '斜体',
					'forecolor': '字体颜色',
					'fontfamily': '字体',
					'fontsize': '字号',
					'layoutstyle': '主题',
					'node': '节点操作',
					'saveto': '另存为',
					'hand': '允许拖拽',
					'camera': '定位根节点',
					'zoom-in': '放大（Ctrl+）',
					'zoom-out': '缩小（Ctrl-）',
					'markers': '标签',
					'resource': '资源',
					'help': '帮助',
					'preference': '偏好设置',
					'expandnode': '展开到叶子',
					'collapsenode': '收起到一级节点',
					'template': '模板',
					'theme': '皮肤',
					'clearstyle': '清除样式',
					'copystyle': '复制样式',
					'pastestyle': '粘贴样式',
					'appendsiblingnode': '同级主题',
					'appendchildnode': '下级主题',
					'arrangeup': '前调',
					'arrangedown': '后调',
					'editnode': '编辑',
					'removenode': '移除',
					'priority': '优先级',
					'progress': {
						'p1': '未开始',
						'p2': '完成 1/8',
						'p3': '完成 1/4',
						'p4': '完成 3/8',
						'p5': '完成一半',
						'p6': '完成 5/8',
						'p7': '完成 3/4',
						'p8': '完成 7/8',
						'p9': '已完成',
						'p0': '清除进度'
					},
					'link': '链接',
					'image': '图片',
					'note': '备注',
					'removelink': '移除已有连接',
					'removeimage': '移除已有图片',
					'removenote': '移除已有备注',
					'resetlayout': '整理',

					'justnow': '刚刚',
					'minutesago': '{0} 分钟前',
					'hoursago': '{0} 小时前',
					'yesterday': '昨天',
					'daysago': '{0} 天前',
					'longago': '很久之前',

					'redirect': '您正在打开连接 {0}，百度脑图不能保证连接的安全性，是否要继续？',
					'navigator': '导航器',

					'unsavedcontent': '当前文件还没有保存到网盘：\n\n{0}\n\n虽然未保存的数据会缓存在草稿箱，但是清除浏览器缓存会导致草稿箱清除。',

					'shortcuts': '快捷键',
					'contact': '联系与反馈',
					'email': '邮件组',
					'qq_group': 'QQ 群',
					'github_issue': 'Github',
					'baidu_tieba': '贴吧',

					'clipboardunsupported': '您的浏览器不支持剪贴板，请使用快捷键复制',

					'load_success': '{0} 加载成功',
					'save_success': '{0} 已保存于 {1}',
					'autosave_success': '{0} 已自动保存于 {1}',

					'selectall': '全选',
					'selectrevert': '反选',
					'selectsiblings': '选择兄弟节点',
					'selectlevel': '选择同级节点',
					'selectpath': '选择路径',
					'selecttree': '选择子树'
				},
				'popupcolor': {
					'clearColor': '清空颜色',
					'standardColor': '标准颜色',
					'themeColor': '主题颜色'
				},
				'dialogs': {
					'markers': {
						'static': {
							'lang_input_text': '文本内容：',
							'lang_input_url': '链接地址：',
							'lang_input_title': '标题：',
							'lang_input_target': '是否在新窗口：'
						},
						'priority': '优先级',
						'none': '无',
						'progress': {
							'title': '进度',
							'notdone': '未完成',
							'done1': '完成 1/8',
							'done2': '完成 1/4',
							'done3': '完成 3/8',
							'done4': '完成 1/2',
							'done5': '完成 5/8',
							'done6': '完成 3/4',
							'done7': '完成 7/8',
							'done': '已完成'
						}
					},
					'help': {

					},
					'hyperlink': {},
					'image': {},
					'resource': {}
				},
				'hyperlink': {
					'hyperlink': '链接...',
					'unhyperlink': '移除链接'
				},
				'image': {
					'image': '图片...',
					'removeimage': '移除图片'
				},
				'marker': {
					'marker': '进度/优先级...'
				},
				'resource': {
					'resource': '资源...'
				}
			}
		}
	});
angular.module('kityminderEditor')
    .filter('commandState', function() {
        return function(minder, command) {
            return minder.queryCommandState(command);
        }
    })
    .filter('commandValue', function() {
        return function(minder, command) {
            return minder.queryCommandValue(command);
        }
    });


angular.module('kityminderEditor')
	.filter('lang', ['config', 'lang.zh-cn', function(config, lang) {
		return function(text, block) {
			var defaultLang = config.getConfig('defaultLang');

			if (lang[defaultLang] == undefined) {
				return '未发现对应语言包，请检查 lang.xxx.service.js!';
			} else {

				var dict = lang[defaultLang];
				block.split('/').forEach(function(ele, idx) {
					dict = dict[ele];
				});

				return dict[text] || null;
			}

		};
	}]);
angular.module('kityminderEditor')
	.directive('colorPanel', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/colorPanel/colorPanel.html',
			scope: {
				minder: '='
			},
			link: function(scope) {

				var minder = scope.minder;
				var currentTheme = minder.getThemeItems();

				scope.hexPicker = scope.hexPicker || currentTheme['background'] ;

				scope.seriesColor = ['#e75d66', '#fac75b', '#99ca6a', '#00c5ad', '#3bbce0', '#425b71', '#ffffff'];

				scope.$on('colorpicker-selected', function(e, msg) {

					// colorPicker 的 bug ： 初次选择 value 为 undefined
					minder.execCommand('background', msg.value);

					scope.customColor = msg.value;
				});

				minder.on('interactchange', function() {
					var currentColor = minder.queryCommandValue('background') || '#000000';

					scope.customColor =  scope.seriesColor.indexOf(currentColor) == -1 ? currentColor : null;
				});

			}
		}
	});
angular.module('kityminderEditor').directive('controlPanel', function() {
    return {
        templateUrl: 'ui/directive/controlPanel/controlPanel.html',
        restrict: 'A',
        link: function(scope) {

	        scope.refreshNotePanel = function() {
				scope.$broadcast('notePanelActived');
	        }
        }
    }
});
angular.module('kityminderEditor')
	.directive('fontOperator', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/fontOperator/fontOperator.html',
			scope: {
				minder: '='
			},
			link: function(scope) {
				var minder = scope.minder;
				var currentTheme = minder.getThemeItems();

				scope.hexPicker = scope.hexPicker || currentTheme['main-color'] ;


				scope.fontSizeList = [10, 12, 16, 18, 24, 32, 48];

				scope.$on('colorpicker-selected', function(e, msg) {
					minder.execCommand('forecolor', msg.value);
					scope.customColor = msg.value;
				});

				minder.on('interactchange', function() {
					scope.customColor = minder.queryCommandValue('forecolor') || '#000000';
				});
			}
		}
	});
angular.module('kityminderEditor')
	.directive('kityminderEditor', ['config', function(config) {
		return {
			restrict: 'EA',
			templateUrl: 'ui/directive/kityminderEditor/kityminderEditor.html',
			replace: true,
			scope: {
				onInit: '&'
			},
			link: function(scope, element, attributes) {

				var $minderEditor = element.children('.minder-editor')[0];

				function onInit(editor, minder) {
					scope.onInit({
						editor: editor,
						minder: minder
					});
				}

				if (typeof(seajs) != 'undefined') {
					/* global seajs */
					seajs.config({
						base: './src'
					});

					define('demo', function(require) {
						var Editor = require('editor');

						var editor = window.editor = new Editor($minderEditor);

						if (window.localStorage.__dev_minder_content) {
							editor.minder.importJson(JSON.parse(window.localStorage.__dev_minder_content));
						}

						editor.minder.on('contentchange', function() {
							window.localStorage.__dev_minder_content = JSON.stringify(editor.minder.exportJson());
						});

						window.minder = window.km = editor.minder;

						scope.editor = editor;
						scope.minder = minder;
						scope.$apply();

						onInit(editor, minder);
					});

					seajs.use('demo');

				} else if (window.kityminder && window.kityminder.Editor) {
					var editor = new kityminder.Editor($minderEditor);

					window.editor = scope.editor = editor;
					window.minder = scope.minder = editor.minder;

					onInit(editor, editor.minder);
				}

				scope.config = config.getConfig();

			}
		}
	}]);
angular.module('kityminderEditor')
	.directive('layout', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/layout/layout.html',
			scope: {
				minder: '='
			},
			link: function(scope) {

			}
		}
	});
angular.module('kityminderEditor')
	.directive('minderDivider', ['config', function(config) {
		return {
			scope: {
				config: '=minderDivider',
                minder: '='
			},
			link: function($scope, element) {
                var minder = $scope.minder;
				var ctrlPanelMin = config.getConfig('ctrlPanelMin');
				var dividerWidth = config.getConfig('dividerWidth');

				var originalX, currentX;
				var isOnResizing = false;
				var bodyWidth = document.body.clientWidth;
				var ctrlPanelWidth = $scope.config.ctrlPanelWidth;


				element.on('mousedown', function(e) {
					originalX = e.pageX;
					isOnResizing = true;
				});

				$('body').on('mousemove', function(e) {
					if (isOnResizing) {
						currentX = e.clientX;
						var deltaX = (originalX - currentX);

						// 计算安全范围
						var deltaMax = bodyWidth - ctrlPanelWidth;
						var deltaMin = (ctrlPanelMin + dividerWidth) - ctrlPanelWidth;

						// 判断是否越界
						deltaX = deltaX > deltaMax ? deltaMax : deltaX;
						deltaX = deltaX < deltaMin ? deltaMin : deltaX;

						// 改变父 scope 的变量
						$scope.config.ctrlPanelWidth = ctrlPanelWidth + deltaX;
						$scope.$apply();
                        minder.fire('resize');
					}
				});

				window.addEventListener('mouseup', function(e) {
					ctrlPanelWidth = $scope.config.ctrlPanelWidth;
					window.localStorage.__dev_minder_ctrlPanelWidth = ctrlPanelWidth;
					isOnResizing = false;
					$scope.$apply();
				});
			}
		}
	}]);
angular.module('kityminderEditor')

	.directive('noteEditor', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/noteEditor/noteEditor.html',
			scope: {
				minder: '='
			},
			controller: ["$scope", function($scope) {
				var minder = $scope.minder;

				var isInteracting = false;
				var cmEditor;

				$scope.codemirrorLoaded =  function(_editor) {

					cmEditor = $scope.cmEditor = _editor;

					_editor.setSize('100%', '100%');
				};

				function updateNote() {
					var enabled = $scope.noteEnabled = minder.queryCommandState('note') != -1;
					var noteValue = minder.queryCommandValue('note') || '';

					if (enabled) {
						$scope.noteContent = noteValue;
					}

					isInteracting = true;
					$scope.$apply();
					isInteracting = false;
				}


				$scope.$watch('noteContent', function(content) {
					var enabled = minder.queryCommandState('note') != -1;

					if (content && enabled && !isInteracting) {
						minder.execCommand('note', content);
					}

					setTimeout(function() {
						cmEditor.refresh();
					});
				});

				$scope.$on('notePanelActived', function() {
					setTimeout(function() {
						cmEditor.refresh();
						cmEditor.focus();
					});
				});


				minder.on('interactchange', updateNote);
			}]
		}
	});
// TODO: 使用一个 div 容器作为 previewer，而不是两个
angular.module('kityminderEditor')

	.directive('notePreviewer', ['$sce', function($sce) {
		return {
			restrict: 'A',
			templateUrl: 'ui/directive/notePreviewer/notePreviewer.html',
			link: function(scope, element) {
				var minder = scope.minder;
				var $container = element.parent();
				var $previewer = element.children();
				scope.showNotePreviewer = false;

				marked.setOptions({
					gfm: true,
					breaks: true
				});


				var previewTimer;
				minder.on('shownoterequest', function(e) {

					previewTimer = setTimeout(function() {
						preview(e.node);
					}, 300);
				});
				minder.on('hidenoterequest', function() {
					clearTimeout(previewTimer);
				});

				var previewLive = false;
				$(document).on('mousedown mousewheel DOMMouseScroll', function() {
					if (!previewLive) return;
					scope.showNotePreviewer = false;
					scope.$apply();
				});

				element.on('mousedown mousewheel DOMMouseScroll', function(e) {
					e.stopPropagation();
				});

				function preview(node, keyword) {
					var icon = node.getRenderer('NoteIconRenderer').getRenderShape();
					var b = icon.getRenderBox('screen');
					var note = node.getData('note');

					$previewer[0].scrollTop = 0;

					var html = marked(note);
					if (keyword) {
						html = html.replace(new RegExp('(' + keyword + ')', 'ig'), '<span class="highlight">$1</span>');
					}
					scope.noteContent = $sce.trustAsHtml(html);
					scope.$apply(); // 让浏览器重新渲染以获取 previewer 提示框的尺寸

					var cw = $($container[0]).width();
					var ch = $($container[0]).height();
					var pw = $($previewer).outerWidth();
					var ph = $($previewer).outerHeight();

					var x = b.cx - pw / 2 - $container[0].offsetLeft;
					var y = b.bottom + 10 - $container[0].offsetTop;

					if (x < 0) x = 10;
					if (x + pw > cw) x = b.left - pw - 10 - $container[0].offsetLeft;
					if (y + ph > ch) y = b.top - ph - 10 - $container[0].offsetTop;


					scope.previewerStyle = {
						'left': Math.round(x) + 'px',
						'top': Math.round(y) + 'px'
					};

					scope.showNotePreviewer = true;

					var view = $previewer[0].querySelector('.highlight');
					if (view) {
						view.scrollIntoView();
					}
					previewLive = true;

					scope.$apply();
				}
			}
		}
}]);
angular.module('kityminderEditor')

    .directive('priorityEditor', ['commandBinder', function(commandBinder) {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/priorityEditor/priorityEditor.html',
            scope: {
                minder: '='
            },
            link: function($scope) {
                var minder = $scope.minder;
                var priorities = [];

                for (var i = 0; i < 10; i++) {
                    priorities.push(i);
                }

	            commandBinder.bind(minder, 'priority', $scope);

	            $scope.priorities = priorities;

	            $scope.getPriorityTitle = function(p) {
		            switch(p) {
			            case 0: return '移除优先级';
			            default: return '优先级' + p;
		            }
	            }
            }

        }
    }]);
angular.module('kityminderEditor')
	.directive('progressEditor', ['commandBinder', function(commandBinder) {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/progressEditor/progressEditor.html',
			scope: {
				minder: '='
			},
			link: function($scope) {
				var minder = $scope.minder;
				var progresses = [];

				for (var i = 0; i < 10; i++) {
					progresses.push(i);
				}

				commandBinder.bind(minder, 'progress', $scope);

				$scope.progresses = progresses;

				$scope.getProgressTitle = function(p) {
					switch(p) {
						case 0: return '移除进度';
						case 1: return '未开始';
						case 9: return '全部完成';
						default: return '完成' + (p - 1) + '/8';

					}
				}
			}
		}
	}])
angular.module('kityminderEditor')

    .directive('resourceEditor', function () {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/resourceEditor/resourceEditor.html',
            scope: {
                minder: '='
            },
            controller: ["$scope", function ($scope) {
                var minder = $scope.minder;

	            var isInteracting = false;

                minder.on('interactchange', function () {
                    var enabled = $scope.enabled = minder.queryCommandState('resource') != -1;
                    var selected = enabled ? minder.queryCommandValue('resource') : [];
                    var used = minder.getUsedResource().map(function (resourceName) {
                        return {
                            name: resourceName,
                            selected: selected.indexOf(resourceName) > -1
                        }
                    });
                    $scope.used = used;

	                isInteracting = true;
                    $scope.$apply();
	                isInteracting = false;
                });

                $scope.$watch('used', function (used) {
                    if (minder.queryCommandState('resource') != -1 && used) {
                        var resource = used.filter(function (resource) {
                            return resource.selected;
                        }).map(function (resource) {
                            return resource.name;
                        });

	                    // 由于 interactchange 带来的改变则不用执行 resource 命令
	                    if (isInteracting) {
		                    return;
	                    }
                        minder.execCommand('resource', resource);
                    }
                }, true);

                $scope.resourceColor = function (resource) {
                    return minder.getResourceColor(resource).toHEX();
                };

                $scope.addResource = function (resourceName) {
	                var origin = minder.queryCommandValue('resource');
                    if (!resourceName || !/\S/.test(resourceName)) return;

	                if (origin.indexOf(resourceName) == -1) {
		                $scope.used.push({
			                name: resourceName,
			                selected: true
		                });
	                }

                    $scope.newResourceName = null;
                }
            }]
        };
    });
angular.module('kityminderEditor')
	.directive('styleOperator', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/styleOperator/styleOperator.html',
			scope: {
				minder: '='
			}
		}
	});
angular.module('kityminderEditor')
	.directive('templateList', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/templateList/templateList.html',
			scope: {
				minder: '='
			},
			link: function($scope) {
				$scope.templateList = kityminder.Minder.getTemplateList();

			}
		}
	});
angular.module('kityminderEditor')
	.directive('themeList', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/themeList/themeList.html',
			link: function($scope) {
				var themeList = kityminder.Minder.getThemeList();

				//$scope.themeList = themeList;

				$scope.getThemeThumbStyle = function (theme) {
					var themeObj = themeList[theme];
                    if (!themeObj) {
                        return;
                    }
					var style = {
						'color': themeObj['root-color'],
						'border-radius': themeObj['root-radius'] / 2
					};

					if (themeObj['root-background']) {
						style['background'] = themeObj['root-background'].toString();
					}

					return style;
				}

				// 维护 theme key 列表以保证列表美观（不按字母顺序排序）
				$scope.themeKeyList = [
					'classic',
					'classic-compact',
					'fresh-blue',
					'fresh-blue-compat',
					'fresh-green',
					'fresh-green-compat',
					'fresh-pink',
					'fresh-pink-compat',
					'fresh-purple',
					'fresh-purple-compat',
					'fresh-red',
					'fresh-red-compat',
					'fresh-soil',
					'fresh-soil-compat',
					'snow',
					'snow-compact',
					'fish',
					'wire'
				];
			}
		}
	});
use('expose-editor');
})();