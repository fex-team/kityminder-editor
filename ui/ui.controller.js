angular.module('kmEditorUI', [
    'ui.bootstrap',
	'ui.codemirror'
])
	.config(function($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			// Allow same origin resource loads.
			'self',
			// Allow loading from our assets domain.  Notice the difference between * and **.
			'http://agroup.baidu.com:8910/**',
			'http://agroup.baidu.com:8911/**'
		]);
	})
.controller('uiController', function($scope, $element) {
	$scope.initEditor = function(editor, minder) {
		console.log(editor, minder);
	};
});