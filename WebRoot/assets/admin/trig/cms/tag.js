$(function(){
	var cmsTag = {};
	cmsTag.url = {};
	cmsTag.url.add = 'cms/tag_add.json';
	cmsTag.url.update = 'cms/tag_update.json';
	cmsTag.url.del = 'cms/tag_delete.json';
	cmsTag.url.find = 'cms/tag_findPageList.json';
	
	var tablerows = []; 
	var table = $('#trig-tag-table');
	var ttable = new TRIG.Datatable({
			table : table, 
			url : cmsTag.url.find, 
			columns : [
					   { "data": null, "render": function(data, type, row, mete){
						   tablerows[row.ct_tagId] = row;
							return '<input type="checkbox" class="checkboxes" value="'+row.ct_tagId+'"/>';   
					   }, orderable: false, className: "trig-checkbox" },
					   		 { "data": "ct_tagName", "render":function(data,type,row,mete){
    		                	 return '<span class="row-details row-details-close" dataid="'+row.ct_tagId+'"></span> ' + data;
    		                 }}, 
					   		 { "data": "dictionary_name"},
			                 { "data": "ct_level"},
			                 { "data": "ct_state" , className: "hidden-xs", "render" : function(value) {
			                	 return TRIG.getYesNoHtml(value);
			                 }}, 
			                 { "data": "ct_createTime", className: "hidden-xs" }
			],
			order: [[5,'desc']],
			dblclick : function() {   // 双击打开编辑浮层
				// 是否有修改权限
		    	if(TRIG.isPrivlege("updateCmsTag")) { 
		    		showUpdate();
		    	}
			} 
	});
	
	ttable.next(); // 初始下一个按钮事件
    ttable.prev(); // 初始上一个按钮事件
    
    // 查询
    $("#findCmsTag").bind('click', function() {
    	ttable.query({ ct_tagName : $("#sTagName").val()}); 
	});
    
    // 高级查询
    TRIG.search('cms_tag', $("#findCmsTag"), ttable);
    
    // 显示更多字段值
    ttable.initMore(function(id) { 
   	 var rowData = tablerows[id];
   	 var sOut = '<table>';
   	 	sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
   	 	sOut += '<tr><td><div class="trig-more-content">类型ID：</div></td><td>' + rowData.ct_tagType + '</td></tr>';
   	 	sOut += '<tr><td><div class="trig-more-content">描述：</div></td><td>' + rowData.ct_description + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">禁用：</div></td><td>' + rowData.ct_state + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">创建时间：</div></td><td>' + rowData.ct_createTime + '</td></tr>';
        sOut += '</table>';
        return  sOut;
    });
    
    TRIG.dict.setSelectByNO("ct_tagType", "CMS_TAG");
    
    // 新增浮层初始
    $("#addCmsTag").bind('click', function(){
    	TRIG.formreset($("#tagEditform"));
    	TRIG.hidePrveNext();
    	$("#tagEditModal").modal('show'); 
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
			TRIG.forminit($("#tagEditform"), data);
			$("#tagEditModal").modal('show');
		}
    }
    
    // 打开修改编辑浮层
    $("#updateCmsTag").bind('click', function(){
    	showUpdate();
    });
    // 是否点击保存&关闭
    var saveclose = false;
    TRIG.FormValidate("cms_tag", "tagEditform",  function (form) {
		var _url = cmsTag.url.add;
		var isadd = true;
		if($("#ct_tagId").val()!='') {
			_url = cmsTag.url.update; 
			isadd = false; 
		}
		TRIG.trackPost(_url, $(form).serialize(), function(data){
			if(isadd == true) {
				TRIG.formreset($("#tagEditform")); 
			}
			// 保存&关闭
			if(saveclose) {
				$("#tagEditModal").modal('hide'); 
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
	$("#tagEditModal").on("hidden", function(){   
		ttable.reload();
		saveclose = false; 
	});
	
	// 删除
	$("#deleteCmsTag").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelRecycleBinSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(cmsTag.url.del, "ids=" + ids, function(data){
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