angular.module('kityminderEditor').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ui/directive/colorPanel/colorPanel.html',
    "<ul class=\"color-list\"><li ng-repeat=\"c in seriesColor\" class=\"color-wrap\" ng-class=\"{'color-wrap-selected': minder.queryCommandValue('background') == c}\" ng-disabled=\"minder.queryCommandState('background') === -1\"><span ng-click=\"minder.execCommand('background', c)\" ng-style=\"{ 'background-color': c }\" class=\"color-item\" title=\"{{ c }}\"></span></li><li class=\"color-wrap\" ng-disabled=\"minder.queryCommandState('background') === -1\" ng-class=\"{'color-wrap-selected': minder.queryCommandValue('background') == customColor}\"><span colorpicker class=\"color-item\" ng-model=\"hexPicker\" ng-style=\"{ 'background-color': customColor }\" title=\"{{ hexPicker }}\"></span></li></ul>"
  );


  $templateCache.put('ui/directive/controlPanel/controlPanel.html',
    "<div class=\"divider\"></div><tabset><tab heading=\"{{ 'idea' | lang: 'ui/tabs'; }}\"><accordion close-others=\"false\"><accordion-group heading=\"{{ 'priority' | lang: 'panels'; }}\" is-open=\"true\"><priority-editor minder=\"minder\"></priority-editor></accordion-group><accordion-group heading=\"{{ 'progress' | lang: 'panels'; }}\" is-open=\"true\"><progress-editor minder=\"minder\"></progress-editor></accordion-group><accordion-group heading=\"{{ 'resource' | lang: 'panels'; }}\" is-open=\"true\"><resource-editor minder=\"minder\"></resource-editor></accordion-group></accordion></tab><tab heading=\"{{ 'appearence' | lang: 'ui/tabs'; }}\"><accordion close-others=\"false\"><accordion-group heading=\"{{ 'template' | lang: 'panels'; }}\" is-open=\"true\"><template-list minder=\"minder\" class=\"inline-directive\"></template-list><layout minder=\"minder\" class=\"inline-directive\"></layout></accordion-group></accordion><accordion close-others=\"false\"><accordion-group heading=\"{{ 'theme' | lang: 'panels'; }}\" is-open=\"true\"><theme-list minder=\"minder\"></theme-list></accordion-group></accordion><accordion close-others=\"false\"><accordion-group heading=\"{{ 'style' | lang: 'panels'; }}\" is-open=\"true\"><style-operator minder=\"minder\" class=\"inline-directive\"></style-operator></accordion-group></accordion><accordion close-others=\"false\"><accordion-group heading=\"{{ 'font' | lang: 'panels'; }}\" is-open=\"true\"><font-operator minder=\"minder\" class=\"inline-directive\"></font-operator></accordion-group></accordion><accordion close-others=\"false\"><accordion-group heading=\"{{ 'background' | lang: 'panels'; }}\" is-open=\"true\"><color-panel minder=\"minder\" class=\"inline-directive\"></color-panel></accordion-group></accordion></tab><tab heading=\"{{ 'note' | lang: 'panels'; }}\" select=\"refreshNotePanel()\"><note-editor minder=\"minder\" class=\"km-note\"></note-editor></tab></tabset>"
  );


  $templateCache.put('ui/directive/fontOperator/fontOperator.html',
    "<span class=\"dropdown font-size-list\" dropdown><div class=\"dropdown-toggle current-font-item\" dropdown-toggle ng-disabled=\"minder.queryCommandState('fontsize') === -1\"><a href class=\"current-font-item\" title=\"{{ 'fontsize' | lang: 'ui' }}\">{{ minder.queryCommandValue('fontsize') || '默认字号' }}</a> <span class=\"caret\"></span></div><ul class=\"dropdown-menu font-list\"><li ng-repeat=\"f in fontSizeList\" class=\"font-item-wrap\"><a ng-click=\"minder.execCommand('fontsize', f)\" class=\"font-item\" ng-class=\"{ 'font-item-selected' : f == minder.queryCommandValue('fontsize') }\" ng-style=\"{'font-size': f + 'px'}\">{{ f }}</a></li></ul></span> <span class=\"s-btn-icon font-bold\" ng-click=\"minder.execCommand('bold')\" ng-class=\"{'font-bold-selected' : minder.queryCommandState('bold') == 1}\" ng-disabled=\"minder.queryCommandState('bold') === -1\"></span> <span class=\"s-btn-icon font-italics\" ng-click=\"minder.execCommand('italic')\" ng-class=\"{'font-italics-selected' : minder.queryCommandState('italic') == 1}\" ng-disabled=\"minder.queryCommandState('italic') === -1\"></span><div class=\"font-color-wrap\"><span colorpicker class=\"font-color\" ng-model=\"hexPicker\" ng-style=\"{ 'background-color': customColor }\" ng-disabled=\"minder.queryCommandState('forecolor') === -1\" title=\"{{ hexPicker }}\"></span></div>"
  );


  $templateCache.put('ui/directive/kityminderEditor/kityminderEditor.html',
    "<div class=\"minder-editor-container\"><div class=\"minder-editor\" ng-style=\"{'right': (config.dividerWidth + config.ctrlPanelWidth) + 'px' }\"></div><div class=\"minder-divider\" minder-divider=\"config\" minder=\"minder\" ng-if=\"minder\" ng-style=\"{'width': config.dividerWidth + 'px', 'right': config.ctrlPanelWidth + 'px'}\"></div><div class=\"control-panel\" control-panel ng-if=\"minder\" ng-style=\"{'width': config.ctrlPanelWidth + 'px'}\"></div><div class=\"note-previewer\" note-previewer ng-if=\"minder\"></div></div>"
  );


  $templateCache.put('ui/directive/layout/layout.html',
    "<a ng-click=\"minder.execCommand('resetlayout')\" class=\"btn-wrap\" ng-disabled=\"minder.queryCommandState('resetlayout') === -1\"><span class=\"btn-icon reset-layout-icon\"></span> <span class=\"btn-label\">{{ 'resetlayout' | lang: 'ui/command' }}</span></a>"
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


  $templateCache.put('ui/directive/styleOperator/styleOperator.html',
    "<a ng-click=\"minder.execCommand('clearstyle')\" class=\"btn-wrap\" ng-disabled=\"minder.queryCommandState('clearstyle') === -1;\"><span class=\"btn-icon clear-style-icon\"></span> <span class=\"btn-label\">{{ 'clearstyle' | lang: 'ui' }}</span></a><div class=\"s-btn-group-vertical\"><a class=\"s-btn-wrap\" href ng-click=\"minder.execCommand('copystyle')\" ng-disabled=\"minder.queryCommandState('copystyle') === -1;\"><span class=\"s-btn-icon copy-style-icon\"></span> <span class=\"s-btn-label\">{{ 'copystyle' | lang: 'ui' }}</span></a> <a class=\"s-btn-wrap paste-style-wrap\" href ng-click=\"minder.execCommand('pastestyle')\" ng-disabled=\"minder.queryCommandState('pastestyle') === -1;\"><span class=\"s-btn-icon paste-style-icon\"></span> <span class=\"s-btn-label\">{{ 'pastestyle' | lang: 'ui' }}</span></a></div>"
  );


  $templateCache.put('ui/directive/templateList/templateList.html',
    "<span class=\"dropdown\" dropdown on-toggle=\"toggled(open)\"><div class=\"dropdown-toggle current-temp-item\" ng-disabled=\"minder.queryCommandState('template') === -1\" dropdown-toggle><a href class=\"temp-item {{ minder.queryCommandValue('template') }}\" title=\"{{ minder.queryCommandValue('template') | lang: 'template' }}\"></a> <span class=\"caret\"></span></div><ul class=\"dropdown-menu temp-list\"><li ng-repeat=\"(key, templateObj) in templateList\" class=\"temp-item-wrap\"><a ng-click=\"minder.execCommand('template', key);\" class=\"temp-item {{key}}\" ng-class=\"{ 'temp-item-selected' : key == minder.queryCommandValue('template') }\" title=\"{{ key | lang: 'template' }}\"></a></li></ul></span>"
  );


  $templateCache.put('ui/directive/themeList/themeList.html',
    "<span class=\"dropdown\" dropdown><div class=\"dropdown-toggle theme-item-selected\" dropdown-toggle ng-disabled=\"minder.queryCommandState('theme') === -1\"><a href class=\"theme-item\" ng-style=\"getThemeThumbStyle(minder.queryCommandValue('theme'))\" title=\"{{ minder.queryCommandValue('theme') | lang: 'theme'; }}\">{{ minder.queryCommandValue('theme') | lang: 'theme'; }}</a> <span class=\"caret\"></span></div><ul class=\"dropdown-menu theme-list\"><li ng-repeat=\"key in themeKeyList\" class=\"theme-item-wrap\"><a ng-click=\"minder.execCommand('theme', key);\" class=\"theme-item\" ng-style=\"getThemeThumbStyle(key)\" title=\"{{ key | lang: 'theme'; }}\">{{ key | lang: 'theme'; }}</a></li></ul></span>"
  );

}]);
