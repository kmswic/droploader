# Droploader - image upload plugin for CKEditor

This plugin allows to upload one or more images by dragging and dropping
into the editor window, using the standard file upload backend. This feature
will come bundled with CKEditor 4.5, which was in beta when this plugin
was first published. The new bundled plugin, however, uses a new, JSON-based API
and requires backend changes (as of this writing). If you cannot change
the backend or upgrade to 4.5, you might find this plugin useful.

## Requirements

- CKEditor 4.4.x (not tested with earlier versions)

## Installation

- Download Droploader
- Copy the `droploader` directory into `ckeditor/plugins`
- Add `droploader` to the `extraPlugins` setting in your CKEditor config
- Make sure that the `filebrowserUploadUrl` setting is set to your file upload 
  backend and that uploading via the "Upload" tab is working. If in doubt, 
  check the section "File Browser and Upload" in the CKEditor documentation.

## Usage

Simply drag and drop image files to the editor window and they will be uploaded
and inserted at the caret position. The inserted images will be transparent 
during upload and turn opaque when the upload is finished.

## Known bugs

- Dropping the same file multiple times will lead to unexpected behaviour. 
If you want the same image multiple times, you can upload it once and then copy 
within the document by ctrl-dragging (alt-dragging on a Mac).