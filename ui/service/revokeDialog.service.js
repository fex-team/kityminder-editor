angular.module('kityminderEditor').service('revokeDialog', ['$modal', 'minder.service', function($modal, minderService) {

    minderService.registerEvent(function() {

        // 触发导入节点或导出节点对话框
        var minder = window.minder;

        minder.on('importNodeData', function() {
            //var image = minder.queryCommandValue('image');

            var importModal = $modal.open({
                animation: true,
                templateUrl: 'ui/dialog/imExportNode/imExportNode.tpl.html',
                controller: 'imExportNode.ctrl',
                size: 'md',
                resolve: {
                    title: function() {
                        return '导入节点';
                    },
                    defaultValue: function() {
                        return '';
                    },
                    type: function() {
                        return 'import';
                    }
                }
            });

            importModal.result.then(function(result) {
                console.log('123');
                //minder.execCommand('image', result.url, result.title || '');
            });
        });

        minder.on('exportNodeData', function() {
            //var image = minder.queryCommandValue('image');

            var exportModal = $modal.open({
                animation: true,
                templateUrl: 'ui/dialog/imExportNode/imExportNode.tpl.html',
                controller: 'imExportNode.ctrl',
                size: 'md',
                resolve: {
                    title: function() {
                        return '导出节点';
                    },
                    defaultValue: function() {
                        return '';
                    },
                    type: function() {
                        return 'export';
                    }
                }
            });

            exportModal.result.then(function(result) {
                console.log('export Node completed');
                //minder.execCommand('image', result.url, result.title || '');
            });
        });

    });

    return {};
}]);