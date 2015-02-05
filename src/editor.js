define(function(require, exports, module) {

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
            if (typeof runtimes[i] == 'function') {
                runtimes[i].call(this, this);
            }
        }
    }

    KMEditor.assemble = assemble;

    assemble(require('./runtime/container'));
    assemble(require('./runtime/fsm'));
    assemble(require('./runtime/minder'));
    assemble(require('./runtime/receiver'));
    assemble(require('./runtime/hotbox'));
    assemble(require('./runtime/input'));
    assemble(require('./runtime/node'));
    assemble(require('./runtime/jumping'));

    return module.exports = KMEditor;
});