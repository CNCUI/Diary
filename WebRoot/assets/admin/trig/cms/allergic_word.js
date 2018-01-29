$(function(){
	var cmsAllergicWord = {};
	cmsAllergicWord.url = {};
	cmsAllergicWord.url.add = 'cms/allergic_word_add.json';
	cmsAllergicWord.url.update = 'cms/allergic_word_update.json';
	cmsAllergicWord.url.del = 'cms/allergic_word_delete.json';
	cmsAllergicWord.url.find = 'cms/allergic_word_findPageList.json';
	cmsAllergicWord.url.is = 'cms/allergic_word_isAllergic.json';
	
	var tablerows = []; 
	var table = $('#trig-allergicWord-table');
	var ttable = new TRIG.Datatable({
			table : table, 
			url : cmsAllergicWord.url.find, 
			columns : [
					   { "data": null, "render": function(data, type, row, mete){
						   tablerows[row.caw_allergicWordId] = row;
							return '<input type="checkbox" class="checkboxes" value="'+row.caw_allergicWordId+'"/>';   
					   }, orderable: false, className: "trig-checkbox" },
			                 { "data": "caw_allergicWord"},
			                 { "data": "caw_state", "render" : function(value) {
			                	 return TRIG.getYesNoHtml(value);
			                 } }, 
			                 { "data": "caw_createTime" }
			],
			order: [[3,'desc']],
			dblclick : function() {   // 双击打开编辑浮层
				// 是否有修改权限
		    	if(TRIG.isPrivlege("updateCmsAllergicWord")) { 
		    		showUpdate();
		    	}
			} 
	});
	
	ttable.next(); // 初始下一个按钮事件
    ttable.prev(); // 初始上一个按钮事件
    
    // 查询
    $("#findCmsAllergicWord").bind('click', function() {
    	ttable.query({ caw_allergicWord : $("#sAllergicWorkName").val()}); 
	});
    
    // 高级查询
    TRIG.search('cms_allergic_word', $("#findCmsAllergicWord"), ttable);
    
 // 新增浮层初始
    $("#addCmsAllergicWord").bind('click', function(){
    	TRIG.formreset($("#allergicWordEditform"));
    	TRIG.hidePrveNext();
    	$("#allergicWordEditModal").modal('show'); 
    });
    
    // 修改加载表单数据
    function showUpdate() {
    	var ids = ttable.getCheckbox();
		var rows = ids.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			TRIG.showPrveNext(); 
			var id = ids.get(0).value;
			var data = tablerows[id];
			// 初始表单数据
			TRIG.forminit($("#allergicWordEditform"), data);
			$("#allergicWordEditModal").modal('show');
		}
    }
    
    // 打开修改编辑浮层
    $("#updateCmsAllergicWord").bind('click', function(){
    	showUpdate();
    });
    // 是否点击保存&关闭
    var saveclose = false;
    TRIG.FormValidate("cms_allergic_word", "allergicWordEditform",  function (form) {
		var _url = cmsAllergicWord.url.add;
		var isadd = true;
		if($("#caw_allergicWordId").val()!='') {
			_url = cmsAllergicWord.url.update; 
			isadd = false; 
		}
		TRIG.trackPost(_url, $(form).serialize(), function(data){
			if(isadd == true) {
				TRIG.formreset($("#allergicWordEditform")); 
			}
			// 保存&关闭
			if(saveclose) {
				$("#allergicWordEditModal").modal('hide'); 
			}
			TRIG.updateSuccessAlert();
		});
		// 必须flase，阻止form submit
		return false;
	});
    
    $(".trigsaveclose").bind('click', function(){
    	saveclose = true; 
    });
    
	// 编辑浮层关闭刷新列表数据
	$("#allergicWordEditModal").on("hidden", function(){   
		ttable.reload();
		saveclose = false; 
	});
	
	// 删除
	$("#deleteCmsAllergicWord").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelRecycleBinSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(cmsAllergicWord.url.del, "ids=" + ids, function(data){
				ttable.reload();
			});
		});
	});
	
	// 日志
	 $(".findSysLogs").bind('click', function(){
	    	var ids = ttable.getCheckbox();  
			var rows = ids.size();
	    	if(TRIG.isSelectOne(rows)) {
	    		var id = ids.get(0).value;
	    		TRIG.LOG.openLogs(id); 
	    	}
	 });
	 
	 $("#validCmsAllergicWord").bind('click', function(){
			var val =$("#isSAllergicWorkName").val();
			if(val!='') {
				TRIG.trackPost(cmsAllergicWord.url.is, 'caw_allergicWord=' + val, function(data){
					if(data.success) {
						TRIG.messager.alert('存在敏感词'); 
					}
				});
			}
		});
	
});