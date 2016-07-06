angular.module('kityminderEditor')
	.provider('config',  function() {

		this.config = {
			// 右侧面板最小宽度
			ctrlPanelMin: 250,

			// 右侧面板宽度
			ctrlPanelWidth: parseInt(window.localStorage.__dev_minder_ctrlPanelWidth) || 250,

			// 分割线宽度
			dividerWidth: 3,

			// 默认语言
			defaultLang: 'zh-cn',

			// 放大缩小比例
			zoom: [10, 20, 30, 50, 80, 100, 120, 150, 200],

            // 图片上传接口
            imageUpload: 'server/imageUpload.php'
		};

		this.set = function(key, value) {
            var supported = Object.keys(this.config);
            var configObj = {};

            // 支持全配置
            if (typeof key === 'object') {
                configObj = key;
            }
            else {
                configObj[key] = value;
            }

            for (var i in configObj) {
                if (configObj.hasOwnProperty(i) && supported.indexOf(i) !== -1) {
                    this.config[i] = configObj[i];
                }
                else {
                    console.error('Unsupported config key: ', key, ', please choose in :', supported.join(', '));
                    return false;
                }
            }

            return true;
		};

		this.$get = function () {
			var me = this;

			return {
				get: function (key) {
                    if (arguments.length === 0) {
                        return me.config;
                    }

					if (me.config.hasOwnProperty(key)) {
						return me.config[key];
					}

					console.warn('Missing config key pair for : ', key);
					return '';
				}

			};
		}
	});