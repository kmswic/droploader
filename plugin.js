CKEDITOR.plugins.add('droploader', {
	init: function (editor) {
		var pluginDirectory = this.path;
		editor.addContentsCss(pluginDirectory + 'styles/droploader.css');
		function handleUpload(url) {
			if (isImg.test(url)) {
				var img = new CKEDITOR.dom.element('img');
				img.setAttribute('src', url);
				editor.insertElement(img);
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
				if (e.data.$.dataTransfer.types.indexOf('Files') > -1) {
					e.data.$.preventDefault();
				}
			});
			var dragEventCounter = 0;
			editor.document.on('dragenter', function(e) {
				// e.data.stopPropagation();
				console.log(dragEventCounter, e.data.$.target, e.data.$.relatedTarget);
				if (dragEventCounter == 0) {
					var marker = new CKEDITOR.dom.element('div');
					marker.setAttribute('id', 'drop_marker')
					.setText('Drop files here to upload');
					editor.insertElement(marker);
				};
				dragEventCounter++;
			});
			editor.document.on('dragleave', function(e) {
				// e.data.stopPropagation();
				dragEventCounter--;
				console.log(dragEventCounter, e.data.$.target, e.data.$.relatedTarget);
				if (dragEventCounter == 0) {
					editor.document.getById('drop_marker').remove();

				}
			})
			editor.document.on('drop', function (e) {

				editor.document.getById('drop_marker').remove();
				// Prepare dropped file for upload
				if (e.data.$.dataTransfer.files.length > 0) {
					e.data.$.preventDefault();
					var files = e.data.$.dataTransfer.files;
					var fd = new FormData();
				    var someFilesToUpload = false;
					for (var i=0; i<files.length; i++) {
						if (isImg.test(files[i].name) || 
							isAnotherSupportedType.test(files[i].name)) {
							fd.append('upload', files[i]);
							someFilesToUpload = true;
						}
					}
					// set an upload handler via CKEDITOR.tools
					if (someFilesToUpload) {
						fileUploadedHandler = CKEDITOR.tools.addFunction(handleUpload);
						var xhr = new XMLHttpRequest();
						xhr.open('POST', editor.config.filebrowserUploadUrl + 
							'?CKEditorFuncNum=' + fileUploadedHandler);
						xhr.responseType = 'document';
						xhr.onload = function (e) {
							if (this.status == 200) {
							// hack to run the callback (meant to be opened in pop-up window?)
							// eval(this.response.getElementsByTagName('script')[0].innerHTML);
							var responseCallback = new Function("", this.response.getElementsByTagName('script')[0].innerHTML);
							responseCallback();
							}
						}
						xhr.send(fd);
					}					
				}
			});
			
		});
		
	},
});
