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

				scope.bgColor = minder.queryCommandValue('background') || currentTheme['background'] || '#fff';

				scope.$on('colorPicked', function(event, color) {
                    event.stopPropagation();
					scope.bgColor = color;
					minder.execCommand('background', color);
				});

				minder.on('interactchange', function() {
                    scope.customColor = minder.queryCommandValue('background') || '#000000';
                    scope.$apply();
				});

			}
		}
	});