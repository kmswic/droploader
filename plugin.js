CKEDITOR.plugins.add('droploader', {
	init: function (editor) {

		var pluginDirectory = this.path;
		editor.addContentsCss(pluginDirectory + 'styles/droploader.css');

		function handleUpload(originalFilename, url) {
			if (isImg.test(url)) {
				var img = editor.document.$.querySelector(
					'[data-filename="' + originalFilename + '"]');
				img.setAttribute('src', url);
				img = new CKEDITOR.dom.element(img);
				img.removeClass('placeholder');
			} else if (isAnotherSupportedType.test(url)) {
				var link = new CKEDITOR.dom.element('a');
				link.setAttribute('href', url);
				link.textContents = url;
				editor.insertElement(link);
			}
		}

		var isImg = /.*\.(png|jpe?g|gif)$/;
		var isAnotherSupportedType = /\.(pdf)$/;

		editor.on('contentDom', function () {
			editor.document.on('dragover', function(e) {
				var types = e.data.$.dataTransfer.types
				// in Webkit types is an array, DOMStringList elsewhere
				if ((types.indexOf && types.indexOf('Files') > -1) ||
					(types.contains && types.contains('Files'))) {
					e.data.$.preventDefault();
				}
			});

			var lastTarget;

			editor.document.on('dragenter', function(e) {
				e.data.stopPropagation();
				editor.document.getBody().addClass('droploader-dragover');
				lastTarget = e.data.$.target;
			});

			editor.document.on('dragleave', function(e) {
				e.data.stopPropagation();
				if (lastTarget == e.data.$.target) {
					editor.document.getBody().removeClass('droploader-dragover');
				}
			})

			editor.document.on('drop', function (e) {
				editor.document.getBody().removeClass('droploader-dragover');
				// Prepare dropped file for upload
				if (e.data.$.dataTransfer.files.length > 0) {
					e.data.$.preventDefault();
					var files = e.data.$.dataTransfer.files;
					var fd = new FormData();
				    var filesToUpload = [];
					for (var i=0; i<files.length; i++) {
						var fileIsImage = isImg.test(files[i].name);
						var fileIsSupportedType = isAnotherSupportedType.test(files[i].name);
						if ( fileIsImage || fileIsSupportedType ) {
							fd.append('upload', files[i]);
							filesToUpload.push(files[i].name);
						}
						if (fileIsImage) {
							var placeholder = new CKEDITOR.dom.element('img');
							placeholder.addClass('placeholder');
							placeholder.setAttribute('data-filename', files[i].name);
							editor.insertElement(placeholder);
							var fr = new FileReader();
							fr.onload = function(e) {
								placeholder.setAttribute('src', fr.result);
							}
							fr.onerror = function(e) {
								throw new Error('Cannot load file: ' + files[i].name);
							}
							fr.readAsDataURL(files[i]);


						}
						// make a handler which remembers the original filename
						// and tell CKEditor to store it for execution
						fileUploadedHandler = CKEDITOR.tools.addFunction(
							handleUpload.bind(null, files[i].name));

						var xhr = new XMLHttpRequest();
						xhr.open('POST', editor.config.filebrowserUploadUrl + 
							'?CKEditorFuncNum=' + fileUploadedHandler);
						xhr.responseType = 'document';
						xhr.onload = function (e) {
							if (this.status == 200) {
								//  run the callback returned as script tag 
								callbackScript = this.response.getElementsByTagName('script');
								if (callbackScript.length > 0) {
									var responseCallback = new Function("", callbackScript[0].innerHTML);
									responseCallback();
								}
							}
						}
						xhr.send(fd);
					}					
				}
			});
		});
	}
});
