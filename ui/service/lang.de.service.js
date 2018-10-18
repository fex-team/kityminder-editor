angular.module('kityminderEditor')
.service('lang.zh-cn', function() {
return {

'zh-cn':

{

'template':

{

'default':

'思维导图',

'tianpan':

'天盘图',

'structure':

'组织结构图',

'filetree':

'目录组织图',

'right':

'逻辑结构图',

'fish-bone':

'鱼骨头图'
},

'theme':

{

'classic':

'脑图经典',

'classic-compact':

'紧凑经典',

'snow':

'温柔冷光',

'snow-compact':

'紧凑冷光',

'fish':

'鱼骨图',

'wire':

'线框',

'fresh-red':

'清新红',

'fresh-soil':

'泥土黄',

'fresh-green':

'文艺绿',

'fresh-blue':

'天空蓝',

'fresh-purple':

'浪漫紫',

'fresh-pink':

'脑残粉',

'fresh-red-compat':

'紧凑红',

'fresh-soil-compat':

'紧凑黄',

'fresh-green-compat':

'紧凑绿',

'fresh-blue-compat':

'紧凑蓝',

'fresh-purple-compat':

'紧凑紫',

'fresh-pink-compat':

'紧凑粉',
'tianpan':'经典天盘',

'tianpan-compact':

'紧凑天盘'
},

'maintopic':

'中心主题',

'topic':

'分支主题',

'panels':

{

'history':

'历史',

'template':

'模板',

'theme':

'皮肤',

'layout':

'布局',

'style':

'样式',

'font':

'文字',

'color':

'颜色',

'background':

'背景',

'insert':

'插入',

'arrange':

'调整',

'nodeop':

'当前',

'priority':

'优先级',

'progress':

'进度',

'resource':

'资源',

'note':

'备注',

'attachment':

'附件',

'word':

'文字'
},

'error_message':

{

'title':

'哎呀，脑图出错了',


'err_load':

'加载脑图失败',

'err_save':

'保存脑图失败',

'err_network':

'网络错误',

'err_doc_resolve':

'文档解析失败',

'err_unknown':

'发生了奇怪的错误',

'err_localfile_read':

'文件读取错误',

'err_download':

'文件下载失败',

'err_remove_share':

'取消分享失败',

'err_create_share':

'分享失败',

'err_mkdir':

'目录创建失败',

'err_ls':

'读取目录失败',

'err_share_data':

'加载分享内容出错',

'err_share_sync_fail':

'分享内容同步失败',

'err_move_file':

'文件移动失败',

'err_rename':

'重命名失败',


'unknownreason':

'可能是外星人篡改了代码...',

'pcs_code':

{
3:
"不支持此接口",
4:
"没有权限执行此操作",
5:
"IP未授权",
110:
"用户会话已过期，请重新登录",
31001:
"数据库查询错误",
31002:
"数据库连接错误",
31003:
"数据库返回空结果",
31021:
"网络错误",
31022:
"暂时无法连接服务器",
31023:
"输入参数错误",
31024:
"app id为空",
31025:
"后端存储错误",
31041:
"用户的cookie不是合法的百度cookie",
31042:
"用户未登陆",
31043:
"用户未激活",
31044:
"用户未授权",
31045:
"用户不存在",
31046:
"用户已经存在",
31061:
"文件已经存在",
31062:
"文件名非法",
31063:
"文件父目录不存在",
31064:
"无权访问此文件",
31065:
"目录已满",
31066:
"文件不存在",
31067:
"文件处理出错",
31068:
"文件创建失败",
31069:
"文件拷贝失败",
31070:
"文件删除失败",
31071:
"不能读取文件元信息",
31072:
"文件移动失败",
31073:
"文件重命名失败",
31079:
"未找到文件MD5，请使用上传API上传整个文件。",
31081:
"superfile创建失败",
31082:
"superfile 块列表为空",
31083:
"superfile 更新失败",
31101:
"tag系统内部错误",
31102:
"tag参数错误",
31103:
"tag系统错误",
31110:
"未授权设置此目录配额",
31111:
"配额管理只支持两级目录",
31112:
"超出配额",
31113:
"配额不能超出目录祖先的配额",
31114:
"配额不能比子目录配额小",
31141:
"请求缩略图服务失败",
31201:
"签名错误",
31202:
"文件不存在",
31203:
"设置acl失败",
31204:
"请求acl验证失败",
31205:
"获取acl失败",
31206:
"acl不存在",
31207:
"bucket已存在",
31208:
"用户请求错误",
31209:
"服务器错误",
31210:
"服务器不支持",
31211:
"禁止访问",
31212:
"服务不可用",
31213:
"重试出错",
31214:
"上传文件data失败",
31215:
"上传文件meta失败",
31216:
"下载文件data失败",
31217:
"下载文件meta失败",
31218:
"容量超出限额",
31219:
"请求数超出限额",
31220:
"流量超出限额",
31298:
"服务器返回值KEY非法",
31299:
"服务器返回值KEY不存在"
}
},

'ui':

{

'shared_file_title':

'[分享的] {0} (只读)',

'load_share_for_edit':

'正在加载分享的文件...',

'share_sync_success':

'分享内容已同步',

'recycle_clear_confirm':

'确认清空回收站么？清空后的文件无法恢复。',


'fullscreen_exit_hint':

'按 Esc 或 F11 退出全屏',


'error_detail':

'详细信息',

'copy_and_feedback':

'复制并反馈',

'move_file_confirm':

'确定把 "{0}" 移动到 "{1}" 吗？',

'rename':

'重命名',

'rename_success':

'{0} 重命名成功',

'move_success':

'{0} 移动成功到 {1}',


'command':

{

'exportPNG':

'导出为PNG图片',

'exportSVG':

'导出为SVG图片',

'appendsiblingnode':

'插入同级主题',

'appendparentnode':

'插入上级主题',

'appendchildnode':

'插入下级主题',

'removenode':

'删除',

'editnode':

'编辑',

'arrangeup':

'上移',

'arrangedown':

'下移',

'resetlayout':

'整理布局',

'expandtoleaf':

'展开全部节点',

'expandtolevel1':

'展开到一级节点',

'expandtolevel2':

'展开到二级节点',

'expandtolevel3':

'展开到三级节点',

'expandtolevel4':

'展开到四级节点',

'expandtolevel5':

'展开到五级节点',

'expandtolevel6':

'展开到六级节点',

'fullscreen':

'全屏',

'outline':

'大纲'
},

'search':'搜索',


'export':

'导出',


'expandtoleaf':

'展开',


'back':

'返回',


'undo':

'撤销 (Ctrl + Z)',

'redo':

'重做 (Ctrl + Y)',


'tabs':

{

'file':

'文件',

'idea':

'思路',

'appearence':

'外观',

'view':

'视图'
},


'quickvisit':

{

'new':

'新建 (Ctrl + Alt + N)',

'save':

'保存 (Ctrl + S)',

'share':

'分享 (Ctrl + Alt + S)',

'feedback':

'反馈问题（F1）',

'editshare':

'编辑'
},


'menu':

{


'mainmenutext':

'百度脑图', // 主菜单按钮文本


'newtab':

'新建',

'opentab':

'打开',

'savetab':

'保存',

'sharetab':

'分享',

'preferencetab':

'设置',

'helptab':

'帮助',

'feedbacktab':

'反馈',

'recenttab':

'最近使用',

'netdisktab':

'百度云存储',

'localtab':

'本地文件',

'drafttab':

'草稿箱',

'downloadtab':

'导出到本地',

'createsharetab':

'当前脑图',

'managesharetab':

'已分享',


'newheader':

'新建脑图',

'openheader':

'打开',

'saveheader':

'保存到',

'draftheader':

'草稿箱',

'shareheader':

'分享我的脑图',

'downloadheader':

'导出到指定格式',

'preferenceheader':

'偏好设置',

'helpheader':

'帮助',

'feedbackheader':

'反馈'
},


'mydocument':

'我的文档',

'emptydir':

'目录为空！',

'pickfile':

'选择文件...',

'acceptfile':

'支持的格式：{0}',

'dropfile':

'或将文件拖至此处',

'unsupportedfile':

'不支持的文件格式',

'untitleddoc':

'未命名文档',

'overrideconfirm':

'{0} 已存在，确认覆盖吗？',

'checklogin':

'检查登录状态中...',

'loggingin':

'正在登录...',

'recent':

'最近打开',

'clearrecent':

'清空',

'clearrecentconfirm':

'确认清空最近文档列表？',

'cleardraft':

'清空',

'cleardraftconfirm':

'确认清空草稿箱？',


'none_share':

'不分享',

'public_share':

'公开分享',

'password_share':

'私密分享',

'email_share':

'邮件邀请',

'url_share':

'脑图 URL 地址：',

'sns_share':

'社交网络分享：',

'sns_share_text':

'“{0}” - 我用百度脑图制作的思维导图，快看看吧！（地址：{1}）',

'none_share_description':

'不分享当前脑图',

'public_share_description':

'创建任何人可见的分享',

'share_button_text':

'创建',

'password_share_description':

'创建需要密码才可见的分享',

'email_share_description':

'创建指定人可见的分享，您还可以允许他们编辑',

'ondev':

'敬请期待！',

'create_share_failed':

'分享失败：{0}',

'remove_share_failed':

'删除失败：{1}',

'copy':

'复制',

'copied':

'已复制',

'shared_tip':

'当前脑图被 {0}  分享，你可以修改之后保存到自己的网盘上或再次分享',

'current_share':

'当前脑图',

'manage_share':

'我的分享',

'share_remove_action':

'不分享该脑图',

'share_view_action':

'打开分享地址',

'share_edit_action':

'编辑分享的文件',


'login':

'登录',

'logout':

'注销',

'switchuser':

'切换账户',

'userinfo':

'个人信息',

'gotonetdisk':

'我的网盘',

'requirelogin':

'请 <a class="login-button">登录</a> 后使用',

'saveas':

'保存为',

'filename':

'文件名',

'fileformat':

'保存格式',

'save':

'保存',

'mkdir':

'新建目录',

'recycle':

'回收站',

'newdir':

'未命名目录',


'bold':

'加粗',

'italic':

'斜体',

'forecolor':

'字体颜色',

'fontfamily':

'字体',

'fontsize':

'字号',

'layoutstyle':

'主题',

'node':

'节点操作',

'saveto':

'另存为',

'hand':

'允许拖拽',

'camera':

'定位根节点',

'zoom-in':

'放大（Ctrl+）',

'zoom-out':

'缩小（Ctrl-）',

'markers':

'标签',

'resource':

'资源',

'help':

'帮助',

'preference':

'偏好设置',

'expandnode':

'展开到叶子',

'collapsenode':

'收起到一级节点',

'template':

'模板',

'theme':

'皮肤',

'clearstyle':

'清除样式',

'copystyle':

'复制样式',

'pastestyle':

'粘贴样式',

'appendsiblingnode':

'同级主题',

'appendchildnode':

'下级主题',

'arrangeup':

'前调',

'arrangedown':

'后调',

'editnode':

'编辑',

'removenode':

'移除',

'priority':

'优先级',

'progress':

{

'p1':

'未开始',

'p2':

'完成 1/8',

'p3':

'完成 1/4',

'p4':

'完成 3/8',

'p5':

'完成一半',

'p6':

'完成 5/8',

'p7':

'完成 3/4',

'p8':

'完成 7/8',

'p9':

'已完成',

'p0':

'清除进度'
},

'link':

'链接',

'image':

'图片',

'note':

'备注',

'insertlink':

'插入链接',

'insertimage':

'插入图片',

'insertnote':

'插入备注',

'removelink':

'移除已有链接',

'removeimage':

'移除已有图片',

'removenote':

'移除已有备注',

'resetlayout':

'整理',


'justnow':

'刚刚',

'minutesago':

'{0} 分钟前',

'hoursago':

'{0} 小时前',

'yesterday':

'昨天',

'daysago':

'{0} 天前',

'longago':

'很久之前',


'redirect':

'您正在打开连接 {0}，百度脑图不能保证连接的安全性，是否要继续？',

'navigator':

'导航器',


'unsavedcontent':

'当前文件还没有保存到网盘：\n\n{0}\n\n虽然未保存的数据会缓存在草稿箱，但是清除浏览器缓存会导致草稿箱清除。',


'shortcuts':

'快捷键',

'contact':

'联系与反馈',

'email':

'邮件组',

'qq_group':

'QQ 群',

'github_issue':

'Github',

'baidu_tieba':

'贴吧',


'clipboardunsupported':

'您的浏览器不支持剪贴板，请使用快捷键复制',


'load_success':

'{0} 加载成功',

'save_success':

'{0} 已保存于 {1}',

'autosave_success':

'{0} 已自动保存于 {1}',


'selectall':

'全选',

'selectrevert':

'反选',

'selectsiblings':

'选择兄弟节点',

'selectlevel':

'选择同级节点',

'selectpath':

'选择路径',

'selecttree':

'选择子树'
},

'popupcolor':

{

'clearColor':

'清空颜色',

'standardColor':

'标准颜色',

'themeColor':

'主题颜色'
},

'dialogs':

{

'markers':

{

'static':

{

'lang_input_text':

'文本内容：',

'lang_input_url':

'链接地址：',

'lang_input_title':

'标题：',

'lang_input_target':

'是否在新窗口：'
},

'priority':

'优先级',

'none':

'无',

'progress':

{

'title':

'进度',

'notdone':

'未完成',

'done1':

'完成 1/8',

'done2':

'完成 1/4',

'done3':

'完成 3/8',

'done4':

'完成 1/2',

'done5':

'完成 5/8',

'done6':

'完成 3/4',

'done7':

'完成 7/8',

'done':

'已完成'
}
},

'help':

{

},

'hyperlink':

{},

'image':

{},

'resource':

{}
},

'hyperlink':

{

'hyperlink':

'链接...',

'unhyperlink':

'移除链接'
},

'image':

{

'image':

'图片...',

'removeimage':

'移除图片'
},

'marker':

{

'marker':

'进度/优先级...'
},

'resource':

{

'resource':

'资源...'
}
}
}
});
