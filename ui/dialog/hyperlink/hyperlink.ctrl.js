angular.module('kityminderEditor')
    .controller('hyperlink.ctrl', function ($scope, $modalInstance, link) {

        $scope.R_URL = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;

        $scope.url = link.url || '';
        $scope.title = link.title || '';

        $scope.ok = function () {
            $modalInstance.close({
                url: $scope.url,
                title: $scope.title
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });