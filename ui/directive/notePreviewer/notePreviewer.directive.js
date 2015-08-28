// TODO: 使用一个 div 容器作为 previewer，而不是两个
angular.module('kityminderEditor')

	.directive('notePreviewer', ['$sce', function($sce) {
		return {
			restrict: 'A',
			templateUrl: 'ui/directive/notePreviewer/notePreviewer.html',
			link: function(scope, element) {
				var minder = scope.minder;
				var $container = element.parent();
				var $previewer = element.children();
				scope.showNotePreviewer = false;

				marked.setOptions({
					gfm: true,
					breaks: true
				});


				var previewTimer;
				minder.on('shownoterequest', function(e) {

					previewTimer = setTimeout(function() {
						preview(e.node);
					}, 300);
				});
				minder.on('hidenoterequest', function() {
					clearTimeout(previewTimer);
				});

				var previewLive = false;
				$(document).on('mousedown mousewheel DOMMouseScroll', function() {
					if (!previewLive) return;
					scope.showNotePreviewer = false;
					scope.$apply();
				});

				element.on('mousedown mousewheel DOMMouseScroll', function(e) {
					e.stopPropagation();
				});

				function preview(node, keyword) {
					var icon = node.getRenderer('NoteIconRenderer').getRenderShape();
					var b = icon.getRenderBox('screen');
					var note = node.getData('note');

					$previewer[0].scrollTop = 0;

					var html = marked(note);
					if (keyword) {
						html = html.replace(new RegExp('(' + keyword + ')', 'ig'), '<span class="highlight">$1</span>');
					}
					scope.noteContent = $sce.trustAsHtml(sanitizeHtml(html));
					scope.$apply(); // 让浏览器重新渲染以获取 previewer 提示框的尺寸

					var cw = $($container[0]).width();
					var ch = $($container[0]).height();
					var pw = $($previewer).outerWidth();
					var ph = $($previewer).outerHeight();

					var x = b.cx - pw / 2 - $container[0].offsetLeft;
					var y = b.bottom + 10 - $container[0].offsetTop;

					if (x < 0) x = 10;
					if (x + pw > cw) x = b.left - pw - 10 - $container[0].offsetLeft;
					if (y + ph > ch) y = b.top - ph - 10 - $container[0].offsetTop;


					scope.previewerStyle = {
						'left': Math.round(x) + 'px',
						'top': Math.round(y) + 'px'
					};

					scope.showNotePreviewer = true;

					var view = $previewer[0].querySelector('.highlight');
					if (view) {
						view.scrollIntoView();
					}
					previewLive = true;

					scope.$apply();
				}


                // 对字符做转义等处理。
                function sanitizeHtml(s) {
                    var div = document.createElement('div');
                    div.innerHTML = s;
                    var scripts = div.getElementsByTagName('script');
                    var i = scripts.length;
                    while (i--) {
                        scripts[i].parentNode.removeChild(scripts[i]);
                    }




                    return div.innerHTML;
                }

                function sanitizeAttr(domStr) {
                    var div = document.createElement('div');
                    div.innerHTML = domStr;

                    for (var j = 0; div.childNodes && (j < div.childNodes.length); j++) {
                        var node = div.childNodes[j];
                        for(var k = 0; node.attributes && (k < node.attributes.length); k++) {
                            var attrObj = node.attributes[k];
                            var attrName = attrObj.nodeName;

                            var pattern = /^on.*/g;
                            if (pattern.test(attrName.toLowerCase())) {
                                attrObj.removeAttribute(attrName);
                            }
                        }

                        if (node.childNodes.length) {
                            var temp = document.createElement('div');
                            temp.appendChild(node);
                            sanitizeAttr(temp.innerHTML);
                        }
                    }
                }
			}
		}
}]);