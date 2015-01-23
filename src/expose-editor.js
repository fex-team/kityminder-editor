/**
 * @fileOverview
 *
 * 打包暴露
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define('expose-editor', function(require, exports, module) {
    var kityminder = window.kityminder = require('../lib/km-core/src/kityminder');
    return module.exports = kityminder.Editor = require('./editor');
});