angular.module('kmEditorUI').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ui/directive/controlPanel/controlPanel.html',
    "<tabset><tab heading=\"思路\"><accordion close-others=\"false\"><accordion-group heading=\"优先级\" is-open=\"true\"><priority-editor minder=\"minder\"></priority-editor></accordion-group><accordion-group heading=\"进度\" is-open=\"true\"><progress-editor minder=\"minder\"></progress-editor></accordion-group><accordion-group heading=\"资源\" is-open=\"true\"><resource-editor minder=\"minder\"></resource-editor></accordion-group></accordion></tab><tab heading=\"备注\" select=\"refreshNotePanel()\"><note-editor minder=\"minder\" class=\"km-note\"></note-editor></tab></tabset>"
  );


  $templateCache.put('ui/directive/kityminderEditor/kityminderEditor.html',
    "<div class=\"minder-editor-container\"><div class=\"minder-editor\"></div><div class=\"control-panel\" control-panel ng-if=\"minder\"></div><div class=\"note-previewer\" note-previewer ng-if=\"minder\"></div></div>"
  );


  $templateCache.put('ui/directive/noteEditor/noteEditor.html',
    "<div class=\"km-note\" ng-show=\"noteEnabled\" ui-codemirror=\"{ onLoad: codemirrorLoaded }\" ng-model=\"noteContent\" ui-codemirror-opts=\"{\n" +
    "\t\tgfm: true,\n" +
    "\t\tbreaks: true,\n" +
    "\t\tlineWrapping : true,\n" +
    "\t\tmode: 'gfm',\n" +
    "        dragDrop: false,\n" +
    "        lineNumbers:true\n" +
    "\t }\"></div><p ng-show=\"!noteEnabled\" class=\"km-note-tips\">请选择节点编辑备注</p>"
  );


  $templateCache.put('ui/directive/notePreviewer/notePreviewer.html',
    "<div id=\"previewer-content\" ng-show=\"showNotePreviewer\" ng-style=\"previewerStyle\" ng-bind-html=\"noteContent\"></div>"
  );


  $templateCache.put('ui/directive/priorityEditor/priorityEditor.html',
    "<ul class=\"km-priority tool-group\" ng-disabled=\"commandDisabled\"><li class=\"km-priority-item tool-group-item\" ng-repeat=\"p in priorities\" ng-click=\"minder.execCommand('priority', p)\" ng-class=\"{ active: commandValue == p }\" title=\"{{ getPriorityTitle(p) }}\"><div class=\"km-priority-icon tool-group-icon priority-{{p}}\"></div></li></ul>"
  );


  $templateCache.put('ui/directive/progressEditor/progressEditor.html',
    "<ul class=\"km-progress tool-group\" ng-disabled=\"commandDisabled\"><li class=\"km-progress-item tool-group-item\" ng-repeat=\"p in progresses\" ng-click=\"minder.execCommand('progress', p)\" ng-class=\"{ active: commandValue == p }\" title=\"{{ getProgressTitle(p) }}\"><div class=\"km-progress-icon tool-group-icon progress-{{p}}\"></div></li></ul>"
  );


  $templateCache.put('ui/directive/resourceEditor/resourceEditor.html',
    "<div><div class=\"input-group\"><input class=\"form-control\" type=\"text\" ng-model=\"newResourceName\" ng-required ng-keypress=\"$event.keyCode == 13 && addResource(newResourceName)\" ng-disabled=\"!enabled\"> <span class=\"input-group-btn\"><button class=\"btn btn-default\" ng-click=\"addResource(newResourceName)\" ng-disabled=\"!enabled\">添加</button></span></div><ul class=\"km-resource\"><li ng-repeat=\"resource in used\" ng-disabled=\"!enabled\"><label style=\"background: {{resourceColor(resource.name)}}\"><input type=\"checkbox\" ng-model=\"resource.selected\" ng-disabled=\"!enabled\"> <span>{{resource.name}}</span></label></li></ul></div>"
  );

}]);
