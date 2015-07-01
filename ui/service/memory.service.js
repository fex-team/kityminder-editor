/**
 * @fileOverview
 *
 * UI 状态的 LocalStorage 的存取文件，未来可能在离线编辑的时候升级
 *
 * @author: zhangbobell
 * @email : zhangbobell@163.com
 *
 * @copyright: Baidu FEX, 2015
 */
angular.module('kityminderEditor')
    .service('memory', function() {
    return {
        get: function(item) {
            var ls = window.localStorage;
            var memory = ls.uiMemory ? JSON.parse(ls.uiMemory) : {};
            return null || memory[item];
        },

        set: function(item, value) {
            var ls = window.localStorage;
            var memory = ls.uiMemory ? JSON.parse(ls.uiMemory) : {};
            memory[item] = value;
            ls.uiMemory = JSON.stringify(memory);
        }
    }
});