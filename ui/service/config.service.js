angular.module('kityminderEditor')
	.service('config',  function() {

		return {
			_default: {
				ctrlPanelMin: 250,
				ctrlPanelWidth: parseInt(window.localStorage.__dev_minder_ctrlPanelWidth) || 250,
				dividerWidth: 3,
				defaultLang: 'zh-cn'
			},
			getConfig: function(key) {
				return key == undefined ? this._default : (this._default[key] || null);
			},
			setConfig: function(obj) {
				this._default = obj;
			}
		}
	});