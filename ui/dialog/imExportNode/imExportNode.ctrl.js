angular.module('kityminderEditor')
    .controller('imExportNode.ctrl', function ($scope, $modalInstance, title, defaultValue, type) {

        $scope.title = title;

        $scope.value = defaultValue;

        $scope.type = type;

        $scope.ok = function () {
            if ($scope.value == '') {
                return;
            }
            $modalInstance.close($scope.value);

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        setTimeout(function() {
            $('.single-input').focus();

            $('.single-input')[0].setSelectionRange(0, defaultValue.length);

        }, 30);

        $scope.shortCut = function(e) {
            e.stopPropagation();

            if (e.keyCode == 13 && e.shiftKey == false) {
                $scope.ok();
            }

            if (e.keyCode == 27) {
                $scope.cancel();
            }

            // tab 键屏蔽默认事件 和 backspace 键屏蔽默认事件
            if (e.keyCode == 9 || e.keyCode == 8) {
                e.preventDefault();
            }
        }

    });