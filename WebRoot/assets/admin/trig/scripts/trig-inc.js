/** TRIG 页面初始 */
TRIG.init = function() {
	// 编辑模态关闭时，删除编辑打开时加的记录锁。
	$('.trig-edit-lock-modal').on('hidden', function () {
		deleteLock(); 
	});
	
	//if(!$(".trig-edit-modal").is('noDraggable')) {
		$(".trig-edit-modal").draggable({  
		    handle:".modal-header"   //当拖动modal-header的时候整个层才会动的  
		});  
		$(".trig-edit-modal").find('.modal-header').css('cursor','move');
	//}
	
	$('.bs-select').selectpicker({
        iconBase: 'fa',
        tickIcon: 'fa-check'
    }); 
	
	// 固定表格上方功能按钮
	$(".table-toolbar").each(function(){
		if(!$(this).is('.notAnimate')) {
			var toph = 46;
			if(Metronic.getViewPort().width < 992) { // 手机设置，没有顶
				toph = 0;
			}
			$(this).stick_in_parent({
				offset_top : toph
			});
		}
	});
};

// 页面加载前配置
TRIG.pageInit = function() {
	TRIG.TABLE = [];
};
