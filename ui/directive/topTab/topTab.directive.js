angular.module('kityminderEditor')
    .directive('topTab', function() {
       return {
           restrict: 'A',
           templateUrl: 'ui/directive/topTab/topTab.html',
           scope: {
               minder: '=topTab',
               editor: '='
           },
           link: function(scope) {
                scope.select = function($event) {
                    console.log($event);
                };
           }
       }
    });