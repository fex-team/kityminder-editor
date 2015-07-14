angular.module('kityminderEditor')
    .controller('image.ctrl', ['$http', '$scope', '$modalInstance', 'image', function($http, $scope, $modalInstance, image) {


        $scope.data = {
            list: [],
            url: image.url || '',
            title: image.title || '',
            R_URL: /^https?\:\/\/(\w+\.)+\w+/
        };


        // 搜索图片按钮点击事件
        $scope.searchImage = function() {
            $scope.list = [];

            getImageData()
                .success(function(json) {
                    if(json && json.data) {
                        for(var i = 0; i < json.data.length; i++) {
                            if(json.data[i].objURL) {
                                $scope.list.push({
                                    title: json.data[i].fromPageTitleEnc,
                                    src: json.data[i].objURL,
                                    url: json.data[i].fromURL
                                });
                            }
                        }
                    }
                })
                .error(function() {

                });
        };

        // 选择图片的鼠标点击事件
        $scope.selectImage = function($event) {
            var targetItem = $('#img-item'+ (this.$index));
            var targetImg = $('#img-'+ (this.$index));

            targetItem.siblings('.selected').removeClass('selected')
            targetItem.addClass('selected');

            $scope.data.url = targetImg.attr('src');
            $scope.data.title = targetImg.attr('alt');
        };

        $scope.ok = function () {
            $modalInstance.close({
                url: $scope.data.url,
                title: $scope.data.title
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        function getImageData(){
            var key = $scope.data.searchKeyword2;
            var keepOriginName = '1';
            var url = "http://image.baidu.com/i?ct=201326592&cl=2&lm=-1&st=-1&tn=baiduimagejson&istype=2&rn=3200&fm=index&pv=&word=" + key + "&ie=utf-8&oe=utf-8&keeporiginname=" + keepOriginName + "&" + +new Date + "&callback=JSON_CALLBACK";

            return $http.jsonp(url);
        }
    }]);