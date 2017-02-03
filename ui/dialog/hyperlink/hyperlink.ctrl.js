angular.module('kityminderEditor')
    .controller('hyperlink.ctrl', function ($scope, $modalInstance, link) {

        var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        $scope.R_URL = new RegExp(urlRegex, 'i');

        $scope.url = link.url || '';
        $scope.title = link.title || '';

        setTimeout(function() {
            var $linkUrl = $('#link-url');
            $linkUrl.focus();
            $linkUrl[0].setSelectionRange(0, $scope.url.length);
        }, 30);

        $scope.shortCut = function(e) {
            e.stopPropagation();

            if (e.keyCode == 13) {
                $scope.ok();
            } else if (e.keyCode == 27) {
                $scope.cancel();
            }
        };

        $scope.ok = function () {
            if($scope.R_URL.test($scope.url)) {
                $modalInstance.close({
                    url: $scope.url,
                    title: $scope.title
                });
            } else {
                $scope.urlPassed = false;

                var $linkUrl = $('#link-url');
                $linkUrl.focus();
                $linkUrl[0].setSelectionRange(0, $scope.url.length);
            }
            editor.receiver.selectAll();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            editor.receiver.selectAll();
        };

    });