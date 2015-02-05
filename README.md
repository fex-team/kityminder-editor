KityMinder Editor
==========

## 简介

KityMinder Editor 是一款强大、简介、体验优秀的脑图编辑工具，适合用于编辑树/图/网等结构的数据。

编辑器由百度 [FEX](https://github.com/fex-team) 基于 [kityminder-core](https://github.com/fex-team/kityminder-core) 搭建，并且在[百度脑图](http://naotu.baidu.com)中使用。

## 使用

可参照 `demo` 目录下的两种使用方式，`dev.html` 使用 [CMD](https://github.com/seajs/seajs/issues/242) 的方式来加载，适用于开发环境；而 `editor.html` 使用打包压缩好的代码，适用于线上环境。

### dev.html

```html
<script src="../lib/kity/dist/kity.js"></script>
<script src="../bower_components/seajs/dist/sea-debug.js"></script>
<script>
/* global seajs */

seajs.config({
    base: '../src'
});

define('demo', function(require) {
    var Editor = require('editor');

    window.editor = new Editor('#minder-editor');
});

seajs.use('demo');

</script>
```

### editor.html

```html
<script src="../lib/kity/dist/kity.js"></script>
<script src="../kityminder.editor.js"></script>
<script>
/* global kityminder */
window.editor = new kityminder.Editor('#minder-editor');
</script>
```

## 数据导入导出

创建编辑器实例之后，可以使用四个接口进行数据的导入导出。

* `editor.minder.exportJson()` - 导出脑图数据为 JSON 对象
* `editor.minder.importJson(json)` - 导入 JSON 对象为当前脑图数据
* `editor.minder.exportData(protocol, option)` - 导出脑图数据为指定的数据格式，返回一个 Promise，其值为导出的结果
* `editor.minder.importData(protocol, data, option)` - 导入指定格式的数据为脑图数据，返回一个 Promise，其值为转换之后的脑图 Json 数据

目前支持的数据格式包括：

* `json` - JSON 字符串，支持导入和导出
* `text` - 纯文本格式，支持导入和导出
* `markdown` - Markdown 格式，支持导入和导出
* `svg` - SVG 矢量格式，仅支持导出
* `png` - PNG 位图格式，仅支持导出

数据格式的具体信息，可参考 [kityminder-core-wiki 的中的说明](https://github.com/fex-team/kityminder-core/wiki)。