$(function(){
	var cmsTemplateField = {};
	cmsTemplateField.url = {};
	cmsTemplateField.url.add = 'cms/template_field_add.json';
	cmsTemplateField.url.update = 'cms/template_field_update.json';
	cmsTemplateField.url.del = 'cms/template_field_delete.json';
	cmsTemplateField.url.find = 'cms/template_field_findList.json';
	cmsTemplateField.url.moveSort = 'cms/template_field_moveSort.json';
	cmsTemplateField.url.sorts = 'cms/template_field_updateSorts.json';
	
	var defsiteid = TRIG.CMS.setRightWebSiteSelect('right-page-bar', function(id){
		siteid = id;
		ttable.query({ ctf_siteId : id}); 
		setUserFields(id);
	}).getId();
	var siteid = defsiteid;
	
	var tablerows = []; 
	var table = $('#trig-templateField-table');
	var ttable = new TRIG.Datatable({
			table : table, 
			url : cmsTemplateField.url.find, 
			paging : false,
			columns : [
					   { "data": null, "render": function(data, type, row, mete){
						   tablerows[row.ctf_fieldId] = row;
							return '<input type="checkbox" class="checkboxes" value="'+row.ctf_fieldId+'"/>';   
					   }, orderable: false, className: "trig-checkbox" },
					   		 { "data": "ctf_fieldName", "render":function(data,type,row,mete){
    		                	 return '<span class="row-details row-details-close" dataid="'+row.ctf_fieldId+'"></span> ' + data;
    		                 }}, 
					   		 { "data": "ctf_fieldDefName"},
			                 { "data": "ctf_sortNo"},
			                 { "data": "ctf_state" , className: "hidden-xs", "render" : function(value) {
			                	 return TRIG.getYesNoHtml(value);
			                 }}, 
			                 { "data": "ctf_createTime", className: "hidden-xs" }
			],
			order: [[3,'asc']],
			queryParams : {
				ctf_siteId : defsiteid
			},
			dblclick : function() {   // 双击打开编辑浮层
				// 是否有修改权限
		    	if(TRIG.isPrivlege("updateCmsTemplateField")) { 
		    		showUpdate();
		    	}
			} 
	});
	
	ttable.next(); // 初始下一个按钮事件
    ttable.prev(); // 初始上一个按钮事件
    
    // 查询
    $("#findCmsTemplateField").bind('click', function() {
    	ttable.query({ ctf_fieldName : $("#sTemplateField").val(),ctf_siteId : siteid}); 
	});
    
    // 高级查询
    TRIG.search('cms_template_field', $("#findCmsTemplateField"), ttable);
    
    // 显示更多字段值
    ttable.initMore(function(id) { 
   	 var rowData = tablerows[id];
   	 var sOut = '<table>';
   	 	sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
   	 	sOut += '<tr><td><div class="trig-more-content">类型：</div></td><td>' + rowData.ctf_fieldType + '</td></tr>';
   	 	sOut += '<tr><td><div class="trig-more-content">可空：</div></td><td>' + rowData.ctf_nullable + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">禁用：</div></td><td>' + rowData.ctf_state + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">创建时间：</div></td><td>' + rowData.ctf_createTime + '</td></tr>';
        sOut += '</table>';
        return  sOut;
    });
    
    TRIG.dict.setSelectByNO('ctf_dictionaryId','cms_content_type');
    // 加载自定义字段
    function setUserFields(siteid) {
	    $.getJSON('cms/template_fieldType_findList.json', 'id=' + siteid, function(data) {
	    	var options = document.getElementById("ctf_fieldType").options;
	    	options.length = 21;
	    	for(var i=0;i<data.length;i++) {
	    		options.add(new Option(data[i].ctft_typeName + '(自定义)', data[i].ctft_typeDef));
	    	}
	    });
    }
    setUserFields(siteid);
    
    
    // 新增浮层初始
    $("#addCmsTemplateField").bind('click', function(){
    	TRIG.formreset($("#templateFieldEditform"));
    	TRIG.hidePrveNext();
    	$("#ctf_siteId").val(siteid);
    	$("#templateFieldEditModal").modal('show'); 
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
			TRIG.forminit($("#templateFieldEditform"), data);
			
			if (data.ctf_fieldType == 'dictionary' || data.ctf_fieldType == 'dictionarys' || data.ctf_fieldType == 'dictionary_Code') {
				$('#dictionaryDIV').show();
			} else {
				$('#dictionaryDIV').hide();
			}
			
			$("#templateFieldEditModal").modal('show');
		}
    }
    
    // 打开修改编辑浮层
    $("#updateCmsTemplateField").bind('click', function(){
    	showUpdate();
    });
    // 是否点击保存&关闭
    var saveclose = false;
    TRIG.FormValidate("cms_template_field", "templateFieldEditform",  function (form) {
		var _url = cmsTemplateField.url.add;
		var isadd = true;
		if($("#ctf_fieldId").val()!='') {
			_url = cmsTemplateField.url.update; 
			isadd = false; 
		}
		TRIG.trackPost(_url, $(form).serialize(), function(data){
			if(isadd == true) {
				TRIG.formreset($("#templateFieldEditform")); 
				$("#ctf_siteId").val(siteid);
			}
			// 保存&关闭
			if(saveclose) {
				$("#templateFieldEditModal").modal('hide'); 
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
	$("#templateFieldEditModal").on("hidden", function(){   
		ttable.reload();
		saveclose = false; 
	});
	
	// 删除
	$("#deleteCmsTemplateField").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelRecycleBinSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(cmsTemplateField.url.del, "ids=" + ids, function(data){
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
	 
	 
	 // 重置排序
    $(".moveCmsTemplateField").bind('click', function(){
    	TRIG.trackPost(cmsTemplateField.url.sorts, '', function(data){
				ttable.reload(); 
		});
    });
    
    // 移动
    TRIG.move({
    	url: cmsTemplateField.url.moveSort,
    	ttable:ttable,
    	sort:3,
    	obj:{
    		table: table,
    		up:$(".templateFieldUp"),
    		down:$(".templateFieldDown"),
    		top:$(".templateFieldTop"),
    		bottom:$(".templateFieldBottom")
    	}
    });
	
});