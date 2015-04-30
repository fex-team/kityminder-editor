angular.module('kmEditorUI')

	.directive('noteEditor', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/noteEditor/noteEditor.html',
			scope: {
				minder: '='
			},
			controller: function($scope) {
				var minder = $scope.minder;

				var isInteracting = false;
				var cmEditor;

				$scope.codemirrorLoaded =  function(_editor) {

					cmEditor = $scope.cmEditor = _editor;

					_editor.setSize('100%', '100%');
				};

				function updateNote() {
					var enabled = $scope.noteEnabled = minder.queryCommandState('note') != -1;
					var noteValue = minder.queryCommandValue('note') || '';

					if (enabled) {
						$scope.noteContent = noteValue;
					}

					isInteracting = true;
					$scope.$apply();
					isInteracting = false;
				}


				$scope.$watch('noteContent', function(content) {
					var enabled = minder.queryCommandState('note') != -1;

					if (content && enabled && !isInteracting) {
						minder.execCommand('note', content);
					}
				});

				$scope.$on('notePanelActived', function() {
					setTimeout(function() {
						cmEditor.refresh();
						cmEditor.focus();
					});
				});


				minder.on('interactchange', updateNote);
			}
		}
	});