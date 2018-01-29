/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.baseFloatZIndex = 99999; 
	config.skin = 'office2013';
	
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
  	//modalDir 需要在jsp的replace方法里面加上值是标识上传的文件夹（默认上传到/uploadfiles/ckeditor/），addMorthDir标识是否增加时间月文件夹（0否，1是 默认否）
  	var $element = $(this.element.$);
  	var modalDir = $element.attr('modalDir');
  	var addMorthDir = $element.attr('addMorthDir');
  	config.filebrowserUploadUrl = TRIG.PATH + '/frontend/stu/cupload_uploadck.json?id=/uploadfiles/ckeditor/&uploadType=3&modalDir='+modalDir+'&addMorthDir='+addMorthDir; 
  	config.filebrowserImageUploadUrl = TRIG.PATH + '/frontend/stu/cupload_uploadck.json?id=/uploadfiles/ckeditor/&uploadType=2&modalDir='+modalDir+'&addMorthDir='+addMorthDir;
  	config.filebrowserFlashUploadUrl = TRIG.PATH + '/frontend/stu/cupload_uploadck.json?id=/uploadfiles/ckeditor/&uploadType=6&modalDir='+modalDir+'&addMorthDir='+addMorthDir;
};
