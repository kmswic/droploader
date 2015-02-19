CKEDITOR.plugins.add('droploader', {
	init: function (editor) {

		editor.on('contentDom', function () {
			editor.document.on('drop', function (e) {
				e.data.$.preventDefault();
				// Prepare dropped file for upload
				if (e.data.$.dataTransfer.files) {
					var files = e.data.$.dataTransfer.files;
					var fd = new FormData();
					for (var i=0; i<files.length; i++) {
						if (/.*\.(png|jpg|gif)$/.test(files[i].name)) {
							fd.append('upload', files[i]);
						}
					}
					// set an upload handler via CKEDITOR.tools
					fileUploadedHandler = CKEDITOR.tools.addFunction(function(url) {
						var img = new CKEDITOR.dom.element('img');
						img.setAttribute('src', url);
						editor.insertElement(img);
					});
					var xhr = new XMLHttpRequest();
					xhr.open('post', editor.config.filebrowserUploadUrl + 
						'?CKEditorFuncNum=' + fileUploadedHandler);
					xhr.responseType = 'document';
					xhr.onload = function (e) {
						if (this.status == 200) {
							// hack to run the callback (meant to be opened in pop-up window?)
							eval(this.response.getElementsByTagName('script')[0].innerHTML);
						}
					}
					xhr.send(fd);
				}
			});
			
		});
		
	},
});
