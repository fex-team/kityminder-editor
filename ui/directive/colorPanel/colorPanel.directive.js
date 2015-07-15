angular.module('kityminderEditor')
	.directive('colorPanel', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/colorPanel/colorPanel.html',
			scope: {
				minder: '='
			},
            replace: true,
			link: function(scope) {

				var minder = scope.minder;
				var currentTheme = minder.getThemeItems();

				scope.hexPicker = scope.hexPicker || currentTheme['background'] ;


				scope.$on('colorpicker-selected', function(e, msg) {
                    e.stopPropagation();

					// colorPicker 的 bug ： 初次选择 value 为 undefined
					minder.execCommand('background', msg.value);

					scope.customColor = msg.value;
				});

				minder.on('interactchange', function() {
                    scope.customColor = minder.queryCommandValue('background') || '#000000';
                    scope.$apply();
				});

			}
		}
	});