angular.module('kityminderEditor')
    .directive('hyperLink', function() {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/hyperLink/hyperLink.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function($scope) {
                var minder = $scope.minder;
            }
        }
    });