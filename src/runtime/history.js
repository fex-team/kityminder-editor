/**
 * @fileOverview
 *
 * 历史管理
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */


define(function(require, exports, module) {
    // var jsonDiff = require('../../bower_components/jsondiffpatch/public/build/jsondiffpatch');
    var jsonDiff = require('../tool/jsondiff');

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

        this.history = {
            reset: reset,
            undo: undo,
            redo: redo,
            hasUndo: hasUndo,
            hasRedo: hasRedo
        };
        reset();
        minder.on('contentchange', changed);
        minder.on('import', reset);

        var main = hotbox.state('main');
        main.button({
            position: 'top',
            label: '撤销',
            key: 'Ctrl + Z',
            enable: hasUndo,
            action: undo,
            next: 'idle'
        });
        main.button({
            position: 'top',
            label: '重做',
            key: 'Ctrl + Y',
            enable: hasRedo,
            action: redo,
            next: 'idle'
        });
    }

    window.diff = jsonDiff;

    return module.exports = HistoryRuntime;
});