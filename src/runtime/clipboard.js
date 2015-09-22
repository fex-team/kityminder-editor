/**
 * @Desc: 处理editor的clipboard事件，只在支持ClipboardEvent并且不是FF的情况下工作
 * @Editor: Naixor
 * @Date: 2015.9.21
 */
define(function(require, exports, module) {

	function ClipboardRuntime () {
		var minder = this.minder;
		var Data = window.kityminder.data;

		if (!minder.supportClipboardEvent || kity.Browser.gecko) {
			return;
		};

		var fsm = this.fsm;
		var receiver = this.receiver;
		var MimeType = this.MimeType;
		
		var kmencode = MimeType.getMimeTypeProtocol('application/km'),
			decode = Data.getRegisterProtocol('json').decode;


		function encode (node) {
			var obj = minder.exportNode(node);
			return kmencode(Data.getRegisterProtocol('json').encode(obj));
		}

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
			            clipBoardEvent.clipboardData.setData('text/plain', encode(node));
			        }
            		e.preventDefault();			
					break;
				}
			}
		}

		var beforeCut = function (e) {
			if (minder.getStatus() !== 'normal') {
            	e.preventDefault();			
				return;
			};

			var clipBoardEvent = e.originEvent;
			var state = fsm.state();

			switch (state) {
				case 'input': {
					break;
				}
				case 'normal': {
					var node = minder.getSelectedNode();
					if (node) {
			            clipBoardEvent.clipboardData.setData('text/plain', encode(node));
			            minder.execCommand('RemoveNode');
			        }
            		e.preventDefault();			
					break;
				}
			}
		}

		var beforePaste = function(e) {
			if (minder.getStatus() !== 'normal') {
            	e.preventDefault();			
				return;
			};

			var clipBoardEvent = e.originEvent;
			var state = fsm.state();
			var textData = clipBoardEvent.clipboardData.getData('text/plain');

			switch (state) {
				case 'input': {
					// input状态下如果格式为application/km则不进行paste操作
					if (!MimeType.isPureText(textData)) {
						e.preventDefault();
						return;
					};
					break;
				}
				case 'normal': {
					/*
					 * 针对normal状态下通过对选中节点粘贴导入子节点文本进行单独处理
					 */
					var node = minder.getSelectedNode();
					
					if (MimeType.whichMimeType(textData) === 'application/km') {
						minder.execCommand('AppendChildNode');
						node = minder.getSelectedNode();
						minder.importNode(node, decode(MimeType.getPureText(textData)));
						minder.refresh();
					} else {
						minder.Text2Children(node, textData);						
					}
            		e.preventDefault();			
					break;
				}
			}
		}

		minder.on('beforeCopy', beforeCopy);
		minder.on('beforeCut', beforeCut);
		minder.on('beforePaste', beforePaste);
	}

	return module.exports = ClipboardRuntime;
});