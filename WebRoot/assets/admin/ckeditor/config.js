/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.baseFloatZIndex = 99999; 
	config.skin = 'moono';
	
	config.toolbarGroups = [
          { name: 'mode',    groups: [ 'mode','doctools' ] },
	      { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
	      { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
	      //{ name: 'forms' },
	      '/',
	      { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
	      { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ] },
	      { name: 'links' },
	      { name: 'insert' },
	      '/',
	      { name: 'styles' },
	      { name: 'colors' },
	      { name: 'tools' },
	      { name: 'others' },
	      { name: 'about' }
    ];
	
	config.fillEmptyBlocks = false;
	//config.protectedSource.push(/<a[\s\S]*?><\/a>/g);
	//config.protectedSource.push(/<span[\s\S]*?><\/span>/g);
	config.allowedContent = true;
	
	config.format_tags = 'p;h1;h2;h3;pre';
	
	config.font_names = '宋体/宋体;黑体/黑体;微软雅黑/微软雅黑;'+ config.font_names ;

	// Make dialogs simpler.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	
	config.extraPlugins = 'flash';
	
	config.filebrowserImageBrowseLinkUrl = TRIG.PATH + '/cms/item_select_publish.t';
	config.filebrowserImageBrowseUrl  = TRIG.PATH + '/cms/resource_select_publish.t?type=IMG_FILE';
	config.filebrowserFlashBrowseUrl = TRIG.PATH + '/cms/resource_select_publish.t?type=VIDEO_FILE';
};
