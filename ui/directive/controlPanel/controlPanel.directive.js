angular.module('kmEditorUI').directive('controlPanel', function() {
    return {
        templateUrl: 'ui/directive/controlPanel/controlPanel.html',
        restrict: 'A',
        link: function(scope) {

	        scope.refreshNotePanel = function() {
				scope.$broadcast('notePanelActived');
	        }
        }
    }
});