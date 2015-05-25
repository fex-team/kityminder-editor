angular.module('kityminderEditor')
	.directive('fontOperator', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/fontOperator/fontOperator.html',
			scope: {
				minder: '='
			},
			link: function(scope) {
				var minder = scope.minder;
				var currentTheme = minder.getThemeItems();

				scope.hexPicker = scope.hexPicker || currentTheme['main-color'] ;


				scope.fontSizeList = [10, 12, 16, 18, 24, 32, 48];

				scope.$on('colorpicker-selected', function(e, msg) {
					minder.execCommand('forecolor', msg.value);
					scope.customColor = msg.value;
				});

				minder.on('interactchange', function() {
					scope.customColor = minder.queryCommandValue('forecolor') || '#000000';
				});
			}
		}
	});