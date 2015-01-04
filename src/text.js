define(function(require, exports, module) {

    var key = require('./key');

    /**
     * 文本编辑扩展
     */
    function textExtension() {

        var runtime = this;
        var minder, hotbox, container, textEditor, editorMask;
        var editing;

        init();

        function init() {
            minder = runtime.minder;
            hotbox = runtime.hotbox;
            container = runtime.container;
            container.classList.add('km-editor');
            initEditorMask();
            initTextEditor();
            initHotBox();
            editing = false;
        }

        function initEditorMask() {
            editorMask = document.createElement('div');
            editorMask.classList.add('text-editor-mask');
            editorMask.style.display = 'none';
            editorMask.onmousedown = exitEditMode;
            container.appendChild(editorMask);
        }

        function initTextEditor() {
            textEditor = document.createElement('div');
            textEditor.contentEditable = true;
            textEditor.classList.add('text-editor');
            textEditor.style.display = 'none';
            // 阻止 hotbox 获得焦点
            textEditor.onmousedown = function(e) {
                e.stopPropagation();
            };
            textEditor.onkeydown = handleKeyDown;
            minder.on('layoutapply', updateEditorPosition);
            minder.on('viewchange', updateEditorPosition);
            container.appendChild(textEditor);
        }

        function initHotBox() {
            hotbox.state('main').button({
                position: 'center',
                label: '编辑',
                key: 'Enter|F2',
                action: edit,
                enable: function() {
                    return minder.queryCommandState('text') != -1;
                }
            });
        }

        function handleKeyDown(e) {
            if (!editing) return;
            switch(key.hash(e)) {
                case key.hash('enter'):
                    commitEditResult();
                    e.preventDefault();
                    break;
                case key.hash('esc'):
                case key.hash('tab'):
                case key.hash('insert'):
                    exitEditMode();
                    e.preventDefault();
                    break;
            }
        }

        function edit() {
            editing = minder.getSelectedNode();
            var box = editing.getRenderBox('TextRenderer');
            var text = minder.queryCommandValue('text');
            textEditor.style.display = 'block';
            textEditor.innerHTML = text && text.replace('<', '&lt;').replace('>', '&gt;');
            textEditor.style.minWidth = box.width + 'px';
            textEditor.style.minHeight = box.height + 'px';
            textEditor.style.minWidth = textEditor.clientWidth + 'px';
            textEditor.style.minHeight = textEditor.clientHeight + 'px';
            textEditor.style.marginTop = (box.height - textEditor.clientHeight) / 2 + 'px';
            textEditor.style.marginLeft = (box.width - textEditor.clientWidth) / 2 + 'px';
            updateEditorPosition({ node: editing });
            textEditor.focus();
            document.execCommand('selectAll', false, null);
            editorMask.style.display = 'block';
        }

        function updateEditorPosition(e) {
            if (!editing || e.node && e.node != editing) return;
            var box = editing.getRenderBox('TextRenderer');
            textEditor.style.transform = textEditor.style.webkitTransform =
                'translate3d(' + Math.round(box.x) + 'px, ' + Math.round(box.y) + 'px, 0)';
        }

        function commitEditResult() {
            minder.execCommand('text', textEditor.innerHTML.replace(/<br\s*\/?>/ig, '\n'));
            exitEditMode();
        }

        function exitEditMode() {
            textEditor.style.display = 'none';
            editorMask.style.display = 'none';
            hotbox.control();
            editing = false;
        }

        runtime.editText = edit;

    }

    module.exports = textExtension;
});