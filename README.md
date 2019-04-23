KityMinder Editor
=================

--> [Chinese version](README.zh.md)

## Introduction

KityMinder Editor is a powerful, concise, and excellent mind map editing tool 
for editing data in structures such as trees/maps/nets.

The editor is built by Baidu [FEX](https://github.com/fex-team) based on 
[kityminder-core](https://github.com/fex-team/kityminder-core) and in 
[Baidu Brain Figure](http://naotu.baidu.com) used.

Their differences and connections are as follows:

![KityMinder Contact](relations.png "KityMinder Contact")

- [kityminder-core](https://github.com/fex-team/kityminder-core) is the core 
  part of kityminder, based on Baidu [FEX](https://github.com/fex-team) Graphics
  library [kity](https://github.com/fex-team/kity). It includes all the
  underlying support for visual representation of mind map data, simple
  editing functions.
- [kityminder-editor](https://github.com/fex-team/kityminder-editor) Built on
  kityminder-core, relying on AngularJS, including UI and hotbox
  [hotbox](https://github.com/ Fex-team/hotbox) is a function that is easy for
  users to input. Simply put, it is an editor.
- [Baidu mind map](http://naotu.baidu.com) Based on kityminder-editor, it has
  added third-party format import and export (FreeMind, XMind, MindManager), file
  storage, user authentication, file sharing, historical version, etc. logic.

## Features

- Basic operations: text editing, node folding, inserting, deleting, sorting,
  inducting, copying, cutting, pasting, etc.
- Style control: font, bold, italic, color, style copy, style paste, etc.
- Icon: priority, progress, etc.
- History: Undo / Redo
- Tags: Multi-label stickers
- Note: Support Markdown format comments
- Image: Support local/network/search image insertion
- Hyperlink: Support for HTTP/HTTPS/MAIL/FTP link insertion
- Layout: Support multiple layout switches
- Topic: Support for multiple theme switching
- Data import and export: support import of multiple formats, export of
  multiple formats (including images)
- Thumbnail: Support for thumbnail viewing/navigation

## Development and Use
The `index.html` in the root directory is the development environment, and the
`index.html` in the `dist` directory uses the packaged code for the online
environment.

1. Install [nodejs](http://nodejs.org) and [npm](https://docs.npmjs.com/getting-started/installing-node)
2. Initialize: Cut to the kityminder-editor root directory to run `npm run init`
3. Run `grunt dev` in the kityminder-editor root directory to start the project.
4. You can develop based on the `index.html` of the root directory, or view the
`index.html` for the production environment in the `dist` directory, Enjoy it!

In addition, kityminder-editor also provides a bower package for developers to
use directly. You can use the kityminder-editor project directory.
Run `bower install kityminder-editor`, then manually import the css and js files
that kityminder-editor depends on. See the specific file `index.html` in the
`dist` directory, it is recommended to use the npm package
[wireDep](https://www.npmjs.com/package/wiredep) to do it automatically.
See the `Gruntfile.js` in the root directory.

## Construct
Run `grunt build`. After the completion, the `dist` directory is the
kityminder-editor that can be run. Double-click `index.html` to open the
running example.

## Initial configuration
Users can configure `kityminder-editor` as needed. The specific usage is as
follows:
```
angular.module('kityminderDemo', ['kityminderEditor'])
    .config(function (configProvider) {
        configProvider.set('imageUpload', 'path/to/image/upload/handler');
    });

```

## Data import and export
Since kityminder-editor is built on kityminder-core, kityminder-core has five
common built-in import or export formats, after creating the editor instance,
you can use four interfaces to import and export data.

* `editor.minder.exportJson()` - Export mind map data to JSON objects
* `editor.minder.importJson(json)` - Import JSON object as current mind map data
* `editor.minder.exportData(protocol, option)` - Export mind map data to the
  specified data format, return a promise whose value is the result of the export
* `editor.minder.importData(protocol, data, option)` - Imports data in the
  specified format as mind map data, returns a promise whose value is the mind
  map after conversion Json data

Currently supported data formats include:

* `json` - JSON string, support for import and export
* `text` - plain text format, support for import and export
* `markdown` - Markdown format, support for import and export
* `svg` - SVG vector format, only supports export
* `png` - PNG bitmap format, only supports export

For more format support, you can load
[kityminder-protocol](https://github.com/fex-team/kityminder-protocol) to extend
third-party format support.

For specific information on the data format, refer to the [description in kityminder-core-wiki](https://github.com/fex-team/kityminder-core/wiki).

## Contact us
Questions and suggestions feedback:

[Github issues](https://github.com/fex-team/kityminder-editor/issues)

Mail group: kity@baidu.com
b
QQ discussion group: 475962105
