$(function(){
	var cmsResource = {};
	cmsResource.url = {};
	cmsResource.url.add = 'cms/resource_add.json';
	cmsResource.url.addImgs = 'cms/resource_addImgs.t';
	cmsResource.url.update = 'cms/resource_update.json';
	cmsResource.url.del = 'cms/resource_delete.json';
	cmsResource.url.find = 'cms/resource_findPageList.json';
	cmsResource.url.tree = 'cms/resource_findTree.json?sort=cr_sortNo&order=asc';
	cmsResource.url.addPublish = 'cms/resource_addPublish.json';
	cmsResource.url.delPublish = 'cms/resource_delPublish.json';
	cmsResource.url.move = 'cms/resource_move.json';
	cmsResource.url.sorts = 'cms/resource_updateSorts.json';
	cmsResource.url.updateSort = 'cms/resource_updateSort.json';
	cmsResource.url.addLock = 'cms/resource_addLock.json';
	cmsResource.url.delLock = 'cms/resource_delLock.json';
	cmsResource.url.updateContentManager = 'cms/resource_updateContentManager.json';
	cmsResource.url.exportResourceSite= 'cms/resource_exportResourceSite.json';
	cmsResource.url.exportResource= 'cms/resource_exportResource.json';
	cmsResource.url.importResource= 'cms/resource_importResource.json';
	cmsResource.url.addFilePublish= 'cms/resource_addFilePublish.json';
	cmsResource.url.addPublishSite= 'cms/resource_addPublishSite.json';
	cmsResource.url.delFileResource = 'cms/resource_delFileResource.json';
	cmsResource.url.delSiteResource = 'cms/resource_delSiteResource.json';
	
	
	var movesortno = 6;
	var defpid = "3";
	var pid = defpid; 
	var pdir = "/cms/content/resource";
	var defaultdir = "/cms/content/resource";
	
	var getPVID = function() {
		return pid == defpid ? siteid : pid;
	}
	var siteid = TRIG.CMS.setRightWebSiteSelect('right-page-bar', function(id){
		siteid = id;
		ci_itemName : $("#sItemName").val('');
		$("#sTagName").val('');
		ttable.query({ cid: siteid,
    		 'cr_siteId' : siteid
    	}); 
		TRIG.initTableContentPrivleg(getPVID());
		$('#resource_tree').jstree('refresh_node', {id: defpid, 'cr_siteId' : siteid});   
	}).getId();
	
	// 左菜单树
	$('#resource_tree').jstree({
        "core" : {
            "themes" : {
                "responsive": false
            }, 
            // so that create works
            "check_callback" : true,
            'data' : {
            	'dataType' : "json",  
                'url' : function (node) {
                  return cmsResource.url.tree;
                },
                'data' : function (node) {
                  return { 'id' : node.id=='#'?'':node.id, 'cid': getPVID(), 'cr_siteId' : siteid }; 
                }
            }
        },
        "types" : {
            "default" : {
                "icon" : "fa fa-folder icon-state-warning icon-lg"
            },
            "file" : {
                "icon" : "fa fa-file icon-state-warning icon-lg"
            }
        },
        "plugins" : [ "state", "types" ]
    });
	

	var tablerows = []; 
    var table = $('#trig-resource-table');
    var ttable = new TRIG.Datatable({
		table : table, 
		url : cmsResource.url.find, 
		filter: true,
		columns : [
				   { "data": null, "render": function(data, type, row, mete){ 
					   tablerows[row.cr_resourceId] = row;
						return '<input type="checkbox" class="checkboxes" value="'+row.cr_resourceId+'"/>';   
				   }, orderable: false, className: "trig-checkbox" },
		                 { "data": "cr_fileName", "render":function(data,type,row,mete){
		                	 return '<span class="row-details row-details-close" dataid="'+row.cr_resourceId+'"></span> ' + data;
		                 } },
		                 { "data": "cr_fileType" },
		                 { "data": "cr_state" , "className" : "hidden-xs", "render" : function(value) {
		                	 return TRIG.getYesNoHtml(value);
		                 }},
		                 { "data": "cr_isUpdate" ,  "render": function(value){
		                	 return TRIG.getYesNoHtml(value);
		                 }},
		                 { "data": "cr_status" , "render":function(value){
		                	 return TRIG.CMS.getStatusStr(value);
		                 }},
		                 { "data": "cr_sortNo" },
		                 { "data": "cr_createTime"  , "className" : "hidden-xs"}
		                 
		],
		queryParams:{ cid: getPVID(), cr_siteId: siteid },
		order: [[7,'desc']], 
		dblclick : function() {   // 双击打开编辑浮层
			// 是否有修改权限
	    	if(TRIG.isPrivlege("updateCmsResource")) {
	    		showUpdate();
	    	}
	    	
		} ,
		dnd: {	// 拖动排序
			sort:movesortno,
			onDrop: function(id, previd, nextid){
	 			var moveid = previd;
	 			if(!previd) {
	 				moveid = nextid;
	 			}
	 			var rowData = tablerows[id];
	 			var moveData = tablerows[moveid];
	 			if(rowData.cr_sortNo > moveData.cr_sortNo) {
	 				moveid = nextid;
	 			}
	 			if(moveid)
		 			TRIG.trackPost(TRIG.getContentUrl(cmsResource.url.move, pid),'id=' + id + '&moveId=' + moveid, function(data){
							ttable.reload();
					});
			}
		}
    });
    
    TRIG.initTableContentPrivleg(getPVID());
    
    $('#resource_tree').on('select_node.jstree', function(e,data) { 
    	pid = data.node.id;
    	pdir = $("#" +pid+"_anchor").attr('dir');
    	if(!pdir){
    		pdir= defaultdir;
    	}
    	if(pid=='#') pid=defpid;
    	var pv = $("#" +pid+"_anchor").attr('pv');
    	TRIG.initContentPrivleg(pv);
    	if(TRIG.isContentQuery(pv))
    		ttable.query({cid: getPVID(),'cr_siteId' : siteid});   
        return false;
    });
    
    ttable.next(); // 初始下一个按钮事件
    ttable.prev(); // 初始上一个按钮事件
    
    $("#resource_tree_reload").bind('click', function(){ 
    	$('#resource_tree').jstree('refresh_node', {id: defpid,'cr_siteId' : siteid});   
    });
    
    function refreshtree() {
    	$('#resource_tree').jstree('refresh_node', {id: pid,'cr_siteId' : siteid}); 
    }
    
    // 显示更多字段值
    ttable.initMore(function(id) { 
	   	 var rowData = tablerows[id];
	   	 var sOut = '<table>';
	   	 sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">文件路径：</div></td><td>' + rowData.cr_filePath + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">共享：</div></td><td>' + rowData.cr_isShare + '</td></tr>';
	   	 sOut += '<tr class="visible-xs"><td><div class="trig-more-content">禁用：</div></td><td>' + rowData.cr_state + '</td></tr>';
	   	 sOut += '<tr class="visible-xs"><td><div class="trig-more-content">创建时间：</div></td><td>' + rowData.cr_createTime + '</td></tr>';
	   	 sOut += '<tr ><td><div class="trig-more-content">锁：</div></td><td>' + rowData.cr_fileLock + '</td></tr>';
	   	 if(rowData.cr_fileType == 'FILE') {
	   		sOut += '<tr ><td><div class="trig-more-content">下载次数：</div></td><td>' + rowData.cr_downloadNumber + '</td></tr>';
	   	 }
	   	 sOut += '</table>';
	   	 return  sOut;
    });
    
    $("#resource_list_reload").bind('click', function(){
    	ttable.reload();
    });
    
    function setSourceFilename(filename, sourcefilename) {
    	var obj = $("#cr_fileName");
		if(obj.val() == "") {
			obj.val(sourcefilename);
		}
    }
    
    function update_click() {
		var ft = $("#cr_fileType").val();
		var pdir2 = pdir + "/";
		if(pdir === defaultdir) {
			pdir2 = pdir2 + TRIG.CMS.getWebsiteDir(siteid) + "/";
    	}
		if(ft=="FILE") {
			TRIG.UPLOAD.open('cr_filePath', TRIG.FILETYPE_FILE, pdir2, setSourceFilename);	
		} else if(ft=="IMG_FILE") {
			// 加站点水印 
			TRIG.UPLOAD.open('cr_filePath', TRIG.FILETYPE_IMG, pdir2, setSourceFilename, true, TRIG.CMS.getWebsite().cw_imgWatermark ? TRIG.CMS.getWebsite().cw_imgWatermark : '');
		} else if(ft=="VIDEO_FILE") {
			TRIG.UPLOAD.open('cr_filePath', TRIG.FILETYPE_VIDEO, pdir2,setSourceFilename);
		} else {
			TRIG.UPLOAD.openDir('cr_filePath', pdir2);
		}
	}
    
    $("#cr_fileType").bind('change', function(){
    	var v = this.value;
    	if(v != 'FILE') {
    		$("#ispublicdiv").hide();
    	}else {
    		$("#ispublicdiv").show();
    	}
    });
    
    // 新增
    $("#addCmsResource").bind('click',function(){
    	TRIG.formreset($("#resourceEditform"));
    	TRIG.hidePrveNext();
    	$("#cr_parentResourceId").val(pid);
    	$("#cr_fileSize").val('0');
    	$("#cr_status").val('Y');
    	$("#cr_fileType").attr("disabled", false);
    	$("#cr_filePath_fb").removeClass("disabled");
    	$("#cr_filePath_fv").addClass("disabled");
    	$("#cr_filePath_fb").bind('click', function() {
			update_click();
		});
    	$("#cr_siteId").val(siteid);
    	$("#resourceEditModal").modal('show');
    });
    
    $("#addCmsResourceImgs").bind('click', function(){
    	$("#resourceImgsEditModal").modal('show');
    });
    
    // 查看
    $("#cr_filePath_fv").bind('click', function(){
    	var id = $("#cr_resourceId").val();
    	if(id) {
    		window.open('cms/resource_select_view.t?ids=' + id, '_blank');
    	}
    });
    
    TRIG.Validate('resourceImgsEditform', function(form){
    	var _url = TRIG.getContentUrl(cmsResource.url.addImgs, pid);
    	
    	TRIG.progress();
		_url += "&siteid="+siteid+"&id=" + pid + "&" + TRIG.Contants.CSRF_PARA + "=" + getCookie(TRIG.Contants.CSRF_COOKIE);
		$.ajaxFileUpload({  
			url: _url,  
			secureuri: false,  
			fileElementId: 'zipfile',  
			dataType: 'json',  
		   beforeSend: function() { 
				//$("#loading").show();  
		   },  
			complete: function() {
			   //$("#loading").hide();  
			},  
			success: function(data, status) { 
				TRIG.progressClose();
				//data = $.parseJSON(data);
				if(data.success==true) {
					$("#resourceImgsEditModal").modal('hide');
					ttable.reload(); 
					TRIG.messager.alert("保存成功");
				}else {
					TRIG.successHandle(data);
				}
			},  
			error: function(data, status, e) {  
					alert(e);  
					TRIG.progressClose();
				}  
		});
    	
    	return false;
    }, {
    	zipfile : {
    		required : true
    	}
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
			TRIG.forminit($("#resourceEditform"), data);
			$("#cr_fileType").attr('disabled', true);
			if($("#cr_fileType").val() == "DIR") {
				$("#cr_filePath_fb").addClass("disabled");
				$("#cr_filePath_fb").unbind('click');
			} else {
				$("#cr_filePath_fb").removeClass("disabled");
		    	$("#cr_filePath_fb").bind('click', function() {
					update_click();
				});
			}
			$("#cr_filePath_fv").removeClass("disabled");
			$("#resourceEditModal").modal('show');
		}
    }
    
    // 打开修改编辑浮层
    $("#updateCmsResource").bind('click', function(){
    	showUpdate();
    });
    
    // 是否点击保存&关闭
    var saveclose = false;
    // 添加/编辑->保存
    TRIG.FormValidate("cms_resource", "resourceEditform",  function (form) {
			var _url = cmsResource.url.add;
			var isadd = true;
			if($("#cr_resourceId").val()!='') {
				_url = cmsResource.url.update;
				isadd = false;
			}
			TRIG.trackPost(TRIG.getContentUrl(_url, pid), $(form).serialize(), function(data){
				if(isadd == true) {
					TRIG.formreset($("#resourceEditform")); 
					$("#cr_fileSize").val('0');
					$("#cr_status").val('Y');
					$("#cr_parentResourceId").val(pid);
					$("#cr_siteId").val(siteid);
				}
				if(saveclose) {
					$("#resourceEditModal").modal('hide');  
				} 
				refreshtree();
				TRIG.updateSuccessAlert(); 
			});
			return false;
    });
    $(".trigsaveclose").bind('click', function(){
    	saveclose = true; 
    }); 
    // 关闭编辑浮层刷新列表 
    $("#resourceEditModal").on('hidden', function(){
    	ttable.reload();
    	saveclose = false;
    });
    
    // 删除
    $("#deleteCmsResource").bind('click', function(){
    	var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelRecycleBinSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(TRIG.getContentUrl(cmsResource.url.del, pid), "ids=" + ids, function(data){
				ttable.reload();
				refreshtree();
			});
		});
    });
    
    // 重置排序
    $(".moveCmsResource").bind('click', function(){
    	TRIG.trackPost(TRIG.getContentUrl(cmsResource.url.sorts, pid),"id=" + pid, function(data){
				refreshtree();
				ttable.reload(); 
		});
    });
    
 // 修改排序值
    $(".resourceSort").bind('click', function(){
    	var ids = ttable.getCheckbox();  
		var rows = ids.size();
    	if(TRIG.isSelectOne(rows)) {
    		var rowData =  tablerows[ids.val()];
    		TRIG.forminit($("#resourceSortEditform"), rowData);
    		$("#resourceSortModal").modal('show');
    	}
    });
    
    TRIG.Validate("resourceSortEditform",  function (form) {
			TRIG.trackPost(TRIG.getContentUrl(cmsResource.url.updateSort, pid), $(form).serialize(), function(data){
				ttable.reload();
				$("#resourceSortModal").modal('hide');  
				refreshtree();
				TRIG.updateSuccessAlert(); 
			});
			return false;
	}, {
		cr_sortNo : { 
    		required : true,
    		integer : true
    	}
	});
    
    // 移动
    TRIG.move({
    	url: cmsResource.url.move,
    	ttable:ttable,
    	sort:movesortno,
    	obj:{
    		table: table,
    		up:$(".resourceUp"),
    		down:$(".resourceDown"),
    		top:$(".resourceTop"),
    		bottom:$(".resourceBottom")
    	}
    }, function(){
    	refreshtree();
    }, function(){
    	return pid;
    });
    
    $(".LockedNo").bind('click', function(){
    	var ids = ttable.getCheckbox();
		var rows = ids.size();
		if(TRIG.isSelectOne(rows)) {
			var id = ids.val();
			TRIG.trackPost(TRIG.getContentUrl(cmsResource.url.addLock, pid),'id=' + id,function(data){
					TRIG.updateSuccessAlert();
					ttable.reload();
			});
		}
    });
    
    $(".LockedYes").bind('click', function(){
    	var ids = ttable.getCheckbox();
		var rows = ids.size();
		if(TRIG.isSelectOne(rows)) {
			var id = ids.val();
			TRIG.trackPost(TRIG.getContentUrl(cmsResource.url.delLock, pid),'id=' + id,function(data){
					TRIG.updateSuccessAlert();
					ttable.reload();
			});
		}
    });
    
    /**
     * 发布
     */
    $(".addPublishCmsResource").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		if(rows==0){
			TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE); 
			return false;
		}else{
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});  
			TRIG.trackPost(TRIG.getContentUrl(cmsResource.url.addPublish, pid), "ids=" + ids, function(data){
				ttable.reload();
				TRIG.messager.alert('发布成功'); 
			});
		}
	});
    
    /**
     * 发布文件夹
     */
    $(".addPublishFileResource").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		if(rows==0){
			TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE); 
			return false;
		}else{
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});  
			TRIG.trackPost(TRIG.getContentUrl(cmsResource.url.addFilePublish, pid), "ids=" + ids, function(data){
				ttable.reload();
				TRIG.messager.alert('发布成功'); 
			});
		}
	});
    
    /**
     * 发布整站资源
     */
    $(".addPublishSiteResource").bind('click', function(){
    	TRIG.trackPost(TRIG.getContentUrl(cmsResource.url.addPublishSite, pid), "cr_siteId=" + siteid, function(data){
			ttable.reload();
			TRIG.messager.alert('发布成功'); 
		});
	});
    
    /**
     * 撤销
     */
    $(".delPublishCmsResource").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		if(rows==0){
			TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE); 
			return false;
		}else{
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});  
			TRIG.trackPost(TRIG.getContentUrl(cmsResource.url.delPublish, pid), "ids=" + ids, function(data){
				ttable.reload();
				TRIG.messager.alert('撤消成功'); 
			});
		}
	});
    /**
     * 撤销文件夹
     */
    $(".delFileResource").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		if(rows==0){
			TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE); 
			return false;
		}else{
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});  
			TRIG.trackPost(TRIG.getContentUrl(cmsResource.url.delFileResource, pid), "ids=" + ids, function(data){
				ttable.reload();
				TRIG.messager.alert('撤消成功'); 
			});
		}
	});
    
    /**
     * 撤销整站资源
     */
    $(".delSiteResource").bind('click', function(){
    	TRIG.trackPost(TRIG.getContentUrl(cmsResource.url.delSiteResource, pid), "cr_siteId=" + siteid, function(data){
			ttable.reload();
			TRIG.messager.alert('撤消成功'); 
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
    
    $(".updateAddRolePrivlegeDef").bind('click', function(){
    	TRIG.trackPost(TRIG.getContentUrl(cmsResource.url.updateContentManager, pid), 'id='+siteid, function(data){
    		TRIG.updateSuccessAlert(); 
		});
    });
    
  //导入Item
	 $("#importResource").bind('click', function(){
		 //上传zip
		 $("#uploadsModal").modal('show');
		
	});
	 //上传表单验证
	 TRIG.Validate('uploadsform', function(form){
	    	var _url = cmsResource.url.importResource;
			upload(_url, true);
	    	return false;
	    }, {
	    	zipfile : {
	    		required : true
	    	}
	    });
	 //上传zip
	 function upload(_url, zip) {
			TRIG.progress();
			_url += "?siteid=" + TRIG.CMS.getWebsiteID();
			var ffv = zip ? $("#resourceFile").val() : $("#uploadfile").val();
			$.ajaxFileUpload({  
				url: _url,  
				secureuri: false,  
				fileElementId: zip ? 'resourceFile' : 'uploadfile',  
				dataType: 'json',  
			   beforeSend: function() { 
			   },  
				complete: function() {
				},  
				success: function(data, status) { 
					TRIG.progressClose();
					if(data.success==true) {
						if(zip) {
							$("#uploadsModal").modal('hide');
						}else{
							$("#uploadModal").modal('hide');
						}
						ttable.reload(); //刷新表格
						//刷新树
						$('#resource_tree').jstree('refresh_node', {id: '3', 'cr_siteId' : TRIG.CMS.getWebsiteID()}); 
						TRIG.successHandle(data);
					}else {
						if(data.errorCode==10003) {
							TRIG.messager.alert("文件已存在，请重新选择并覆盖上传。");
							temf = ffv;
						}else{
							TRIG.successHandle(data);
						}
					}
				},  
				error: function(data, status, e) {  
						alert(e);  
						TRIG.progressClose();
					}  
			});
		}
	 
	 //导出内容
	 $("#exportResource").bind('click', function(){
		 var objs = ttable.getCheckbox();
			var rows = objs.size();
			if(TRIG.isSelect(rows)){
				var ids="";
				objs.each(function (){
					ids+=this.value+",";
				});
				window.open(cmsResource.url.exportResource + "?ids=" + ids+"&siteid=" + TRIG.CMS.getWebsiteID());
			};
	});
	 //导出整站内容
	 $("#exportSiteResource").bind('click', function(){
		 window.open(cmsResource.url.exportResourceSite + "?siteid=" + TRIG.CMS.getWebsiteID());
	});
});