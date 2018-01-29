$(function(){
	var sysFunction = {};
	sysFunction.url = {};
	sysFunction.url.add = 'function_add.json';
	sysFunction.url.update = 'function_update.json';
	sysFunction.url.del = 'function_delete.json';
	sysFunction.url.dels = 'function_deletes.json';
	sysFunction.url.find = 'function_findList.json';
	
	var tablerows = []; 
    var table = $('#trig-function-table');
    // begin first table
    var ttable = new TRIG.Datatable({
    		table : table, 
    		url : sysFunction.url.find, 
    		columns : [
    				   { "data": null, "render": function(data, type, row, mete){
    					   tablerows[row.sf_sysFunctionId] = row;
    						return '<input type="checkbox" class="checkboxes" value="'+row.sf_sysFunctionId+'"/>';   
    				   }, orderable: false, className: "trig-checkbox" },
    		                 { "data": "sf_sysFunctionId", "className":"hidden-xs" },
    		                 { "data": "sf_functionName"},  
    		                 { "data": "sf_functionPrivDef" }, 
    		                 { "data": "sf_createTime" }
    		],
    		order: [[4,'desc']],
    		dblclick : function() {   // 双击打开编辑浮层
    			// 是否有修改权限
    	    	if(TRIG.isPrivlege("updateSysFunction")) { 
    	    		showUpdate();
    	    	}
    		} 
    });
    
    ttable.next(); // 初始下一个按钮事件
    ttable.prev(); // 初始上一个按钮事件
    
    // 新增浮层初始
    $("#addSysFunction").bind('click', function(){
    	TRIG.formreset($("#functionEditform"));
    	TRIG.hidePrveNext();
    	$("#functionEditModal").modal('show'); 
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
			TRIG.forminit($("#functionEditform"), data);
			$("#functionEditModal").modal('show');
		}
    }
    
    // 打开修改编辑浮层
    $("#updateSysFunction").bind('click', function(){
    	showUpdate();
    });
    // 是否点击保存&关闭
    var saveclose = false;
    TRIG.FormValidate("sys_function", "functionEditform",  function (form) {
		var _url = sysFunction.url.add;
		var isadd = true;
		if($("#sf_sysFunctionId").val()!='') {
			_url = sysFunction.url.update; 
			isadd = false; 
		}
		TRIG.trackPost(_url, $(form).serialize(), function(data){
			if(isadd == true) {
				TRIG.formreset($("#functionEditform")); 
			}
			// 保存&关闭
			if(saveclose) {
				$("#functionEditModal").modal('hide'); 
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
	$("#functionEditModal").on("hidden", function(){  
		ttable.reload();
		saveclose = false; 
	});
	
	// 删除
	$("#deleteSysFunction").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(sysFunction.url.del, "ids=" + ids, function(data){
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
    
});