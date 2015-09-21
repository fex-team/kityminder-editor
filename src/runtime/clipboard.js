/**
 * @Desc: 处理editor的clipboard事件，只在支持ClipboardEvent并且不是FF的情况下工作
 * @Editor: Naixor
 * @Date: 2015.9.21
 */
define(function(require, exports, module) {
	var ClipboardRuntime = function() {
		var minder = this.minder;

		if (!minder.supportClipboardEvent || kity.Browser.gecko) {
			return;
		};

		var fsm = this.fsm;
		var receiver = this.receiver;
		var Node2Text = window.kityminder.data.getRegisterProtocol('text').Node2Text;

		var beforeCopy = function (e) {
			var clipBoardEvent = e.originEvent;
			var state = fsm.state();

			switch (state) {
				case 'input': {
					break;
				}
				case 'normal': {
					var node = minder.getSelectedNode();
					if (node) {
						// if (/^\s*$/.test(node.data.text)) {
						// 	node.data.text = "分支主题";
						// }
			            clipBoardEvent.clipboardData.setData('text/plain', Node2Text(node));
			        }
            		e.preventDefault();			
					break;
				}
			}
		}

		var beforeCut = function (e) {
			var clipBoardEvent = e.originEvent;
			var state = fsm.state();

			switch (state) {
				case 'input': {
					break;
				}
				case 'normal': {
					var node = minder.getSelectedNode();
					if (node) {
						// if (/^\s*$/.test(node.data.text)) {
						// 	node.data.text = "分支主题";
						// }
			            clipBoardEvent.clipboardData.setData('text/plain', Node2Text(node));
			            minder.execCommand('RemoveNode');
			        }
            		e.preventDefault();			
					break;
				}
			}
		}

		var beforePaste = function(e) {
			var clipBoardEvent = e.originEvent;
			var state = fsm.state();

			switch (state) {
				case 'input': {
					break;
				}
				case 'normal': {
					/*
					 * 针对normal状态下通过对选中节点粘贴导入子节点文本进行单独处理
					 */
					var textData = clipBoardEvent.clipboardData.getData('text/plain');
					var node = minder.getSelectedNode();
					minder.Text2Children(node, textData);
            		e.preventDefault();			
					break;
				}
			}
		}

		minder.on('beforeCopy', beforeCopy);
		minder.on('beforeCut', beforeCut);
		minder.on('beforePaste', beforePaste);
	}

	module.exports = ClipboardRuntime;
});