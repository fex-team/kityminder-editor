angular.module('kityminderEditor')
	.directive('colorPanel', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/colorPanel/colorPanel.html',
			scope: {
				minder: '='
			},
			link: function(scope) {

				var minder = scope.minder;
				var currentTheme = minder.getThemeItems();

				scope.hexPicker = scope.hexPicker || currentTheme['background'] ;

				scope.seriesColor = ['#e75d66', '#fac75b', '#99ca6a', '#00c5ad', '#3bbce0', '#425b71', '#ffffff'];

				scope.$on('colorpicker-selected', function(e, msg) {

					// colorPicker 的 bug ： 初次选择 value 为 undefined
					minder.execCommand('background', msg.value);

					scope.customColor = msg.value;
				});

				minder.on('interactchange', function() {
					var currentColor = minder.queryCommandValue('background') || '#000000';

					scope.customColor =  scope.seriesColor.indexOf(currentColor) == -1 ? currentColor : null;
				});

			}
		}
	});