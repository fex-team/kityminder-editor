angular.module('kityminderEditor')
    .directive('expandLevel', ['$modal', function($modal) {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/expandLevel/expandLevel.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function($scope) {
                var minder = $scope.minder;

                $scope.levels = [1, 2, 3, 4, 5, 6];
            }
        }
    }]);