$(function(){
	var cmsWorkflow = {};
	cmsWorkflow.url = {};
	cmsWorkflow.url.update = 'cms/workflow_update.json';
	cmsWorkflow.url.del = 'cms/workflow_delete.json';
	cmsWorkflow.url.find = 'cms/workflow_findPageList.json';
	cmsWorkflow.url.audit = 'cms/workflow_audit.json'
		
	//var pid = "3"; 
	var siteid = TRIG.CMS.setRightWebSiteSelect('right-page-bar', function(id){
		siteid = id;
		ci_itemName : $("#sworkflowitemname").val('');
		
		ttable.query({ cid: '3',
    		 'ci_siteId' : siteid
    	}); 
		//$('#item_tree').jstree('refresh_node', {id: '3', 'ci_siteId' : siteid});   
	}).getId();
	
	var tablerows = []; 
	var table = $('#trig-workflow-table');
	var ttable = new TRIG.Datatable({
			table : table, 
			url : cmsWorkflow.url.find, 
			columns : [
					   { "data": null, "render": function(data, type, row, mete){
						   tablerows[row.cwf_workflowId] = row;
							return '<input type="checkbox" class="checkboxes" value="'+row.cwf_workflowId+'"/>';   
					   }, orderable: false, className: "trig-checkbox" },
					   		 { "data": "ci_itemName", "render":function(data,type,row,mete){
    		                	 return '<span class="row-details row-details-close" dataid="'+row.cwf_workflowId+'"></span> ' + data;
    		                 }}, 
					   		 { "data": "cwf_workflow", "render":function(data){
			                	 return TRIG.CMS.getStatusStr(data);
			                 }},
			                 //{ "data": "cia_sessionid", className: "hidden-xs"},
			                 { "data": "cwf_status", "render":function(status){
			                	 	if(status=='1') {
			                			return '<span class="label label-sm label-warning"> 申请 </span>';
			                		} else if(status=='2') {
			                			return '<span class="label label-sm label-warning"> 转发申请 </span>';
			                		} else if(status=='3') {
			                			return '<span class="label label-sm label-info"> 已转发 </span>';
			                		} else if(status=='4') {
			                			return '<span class="label label-sm label-success">确认 </span>';
			                		} else if(status=='5') {
			                			return '<span class="label label-sm label-info"> 审核通过 </span>';
			                		} else if(status=='6') {
			                			return '<span class="label label-sm label-danger"> 工作流被删除 </span>';
			                		} else if(status=='7') {
			                			return '<span class="label label-sm label-danger"> 工作流撤消 </span>';
			                		} else if(status=='8') {
			                			return '<span class="label label-sm label-danger"> 工作流审核未通过 </span>';
			                		} else if(status=='9') {
			                			return '<span class="label label-sm label-info"> 工作流级次审核 </span>';
			                		} 
			                 }}, 
			                 { "data": "cwf_timingTime"  , className: "hidden-xs"},
			                 { "data": "su_realName" , className: "hidden-xs"},
			                 { "data": "cwf_createTime", className: "hidden-xs" }
			],
			order: [[6,'desc']], 
			queryParams : {
				ci_siteId : siteid
			},
			dblclick : function() {   // 双击打开编辑浮层
				// 是否有修改权限
		    	if(TRIG.isPrivlege("updateCmsWorkflow")) {
		    		showUpdate();
		    	}
			} 
	});
	
	ttable.next(); // 初始下一个按钮事件
    ttable.prev(); // 初始上一个按钮事件
	
	// 查询
    $("#findCmsWorkflow").bind('click', function() {
    	ttable.query({ ci_itemName : $("#sworkflowitemname").val(),ci_siteId : siteid}); 
	});
    
    // 显示更多字段值
    ttable.initMore(function(id) { 
   	 var rowData = tablerows[id];
   	 var sOut = '<table>';
   	 	sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
   	 	sOut += '<tr><td><div class="trig-more-content">ITEM ID：</div></td><td>' + rowData.cwf_itemId + '</td></tr>';
   	 	sOut += '<tr><td><div class="trig-more-content">描述：</div></td><td>' + rowData.cwf_description + '</td></tr>';
   		sOut += '<tr class="visible-xs"><td><div class="trig-more-content">创建人：</div></td><td>' + rowData.sysUser_realName + '</td></tr>';
   		sOut += '<tr class="visible-xs"><td><div class="trig-more-content">定时时间：</div></td><td>' + rowData.cwf_timingTime + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">创建时间：</div></td><td>' + rowData.cwf_createTime + '</td></tr>';
        sOut += '</table>';
        return  sOut;
    });
    
    TRIG.CMS.setStatusSelect('cwf_workflow');
    
    function showUpdate() {
    	var ids = ttable.getCheckbox();
		var rows = ids.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			TRIG.showPrveNext(); 
			var id = ids.get(0).value;
			var data = tablerows[id];
			// 初始表单数据
			TRIG.forminit($("#workflowEditform"), data);
			$("#workflowEditModal").modal('show');
		}
    }
    
    // 确认
    $("#updateCmsWorkflow").bind('click', function(){
    	showUpdate();
    });
    
 // 是否点击保存&关闭
    var saveclose = false;
    
    TRIG.Validate("workflowEditform",  function (form) {
		var _url = cmsWorkflow.url.update; 
		$("#cwf_status").val('4');
		TRIG.trackPost(_url, $(form).serialize(), function(data){
			// 保存&关闭
			if(saveclose) {
				$("#workflowEditModal").modal('hide'); 
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
	$("#workflowEditModal").on("hidden", function(){   
		ttable.reload();
		saveclose = false; 
	});
	
	$("#audit").bind('click', function(){
		var _url = cmsWorkflow.url.audit; 
		$("#cwf_status").val('5');
		TRIG.trackPost(_url, $("#workflowEditform").serialize(), function(data){
			TRIG.updateSuccessAlert();
		});
	});
	
	$("#auditnot").bind('click', function(){
		var _url = cmsWorkflow.url.audit; 
		$("#cwf_status").val('8');
		TRIG.trackPost(_url, $("#workflowEditform").serialize(), function(data){
			TRIG.updateSuccessAlert();
		});
	});
    
    // 删除->撤消工作流
	$("#deleteCmsWorkflow").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(cmsWorkflow.url.del, "ids=" + ids, function(data){
				ttable.reload();
			});
		});
	});
	
	// 预览 
   $(".cmsView").bind('click', function(){
	   var ids = ttable.getCheckbox();
		var rows = ids.size();
		if(TRIG.isSelectOne(rows)) {
			var id = ids.val();
			var rowData = tablerows[id];
			var type = TRIG.CMS.getWebsite(siteid).cw_siteType;
			var sd = TRIG.CMS.getWebsiteDir(siteid);
			var url = TRIG.PATH + '/cms/content' + (sd ? "/" + sd : "") + (rowData.ci_itemPath ? rowData.ci_itemPath : "") + '/' ;
			if(rowData.ci_fileName) {
				if(!(rowData.ci_fileName === 'index'))
					url += rowData.ci_fileName + '.htm';
			} else {
				url += rowData.ci_itemId + '.htm';
			}
			if(type == 'WAP') {
				window.open(url,"_blank", 'width=380 , height=720,scrollbars=yes');
			} else {
				window.open(url,'_blank');//'item_preview.htm?id=' + rowData.ci_itemId
			}
		} 
   });
});