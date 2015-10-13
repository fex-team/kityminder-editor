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

		/*
		 * 增加对多节点赋值粘贴的处理
		 */
		function encode (node) {
			var _nodes = [];
			for (var i = 0, l = nodes.length; i < l; i++) {
				_nodes.push(minder.exportNode(nodes[i]));
			}
			return kmencode(Data.getRegisterProtocol('json').encode(_nodes));
		}

		var beforeCopy = function (e) {
			var clipBoardEvent = e;
			var state = fsm.state();

			switch (state) {
				case 'input': {
					break;
				}
				case 'normal': {
					var nodes = minder.getSelectedNodes();
					if (nodes.length) {
						var str = encode(nodes);
			            clipBoardEvent.clipboardData.setData('text/plain', str);
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

			var clipBoardEvent = e;
			var state = fsm.state();

			switch (state) {
				case 'input': {
					break;
				}
				case 'normal': {
					var nodes = minder.getSelectedNodes();
					if (nodes.length) {
			            clipBoardEvent.clipboardData.setData('text/plain', encode(nodes));
			            minder.execCommand('RemoveNode');
			        }
            		e.preventDefault();
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

			var clipBoardEvent = e;
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
						var nodes = decode(MimeType.getPureText(textData));
						var _node;
						for (var i = 0, l = nodes.length; i < l; i++) {
							_node = minder.createNode(null, node);
							minder.importNode(_node, nodes[i]);
							node.appendChild(_node);
						}
						minder.refresh();
					} else {
						minder.Text2Children(node, textData);						
					}
            		e.preventDefault();			
					break;
				}
			}
		}
		/**
		 * 由editor的receiver统一处理全部事件，包括clipboard事件
		 * @Editor: Naixor
		 * @Date: 2015.9.24
		 */
		receiver.element.addEventListener('copy', beforeCopy);
        receiver.element.addEventListener('cut', beforeCut);
        receiver.element.addEventListener('paste', beforePaste);
	}

	return module.exports = ClipboardRuntime;
});