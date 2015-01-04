define(function(require, exports, module) {

    function nodeExtension() {
        var runtime = this;
        var minder;
        var hotbox;

        init();

        function init() {
            minder = runtime.minder;
            initHotBox();
        }

        function initHotBox() {
            hotbox = runtime.hotbox;
            var main = hotbox.state('main');

            var buttons = [
                '前移:Alt+Up:ArrangeUp',
                '下级:Tab:AppendChildNode',
                '同级:Ctrl+Enter:AppendSiblingNode',
                '后移:Alt+Down:ArrangeDown',
                '删除:Delete|Backspace:RemoveNode',
                '归纳:Shift+Tab|Shift+Insert:AppendParentNode'
            ];

            buttons.forEach(function(button) {
                var parts = button.split(':');
                var label = parts.shift();
                var key = parts.shift();
                var command = parts.shift();
                main.button({
                    position: 'ring',
                    label: label,
                    key: key,
                    action: function() {
                        if (command.indexOf('Append') === 0) {
                            minder.execCommand(command, '新主题');
                            if (runtime.editText) runtime.editText();
                        } else {
                            minder.execCommand(command);
                        }
                    },
                    enable: function() {
                        return minder.queryCommandState(command) != -1;
                    }
                });
            });
        }
    }

    module.exports = nodeExtension;
});