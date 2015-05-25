angular.module('kityminderEditor')
	.directive('minderDivider', ['config', function(config) {
		return {
			scope: {
				config: '=minderDivider'
			},
			link: function($scope, element) {
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