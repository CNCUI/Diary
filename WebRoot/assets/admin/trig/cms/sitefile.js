$(function(){
	var cmsfile = {}; 
	cmsfile.url = {
		tree:'cms/sitefile_tree.json',
		list:'cms/sitefile_findList.json',
		upload:'cms/sitefile_upload.json',
		uploads:'cms/sitefile_uploadZip.json',
		uploadconfirm:'cms/sitefile_uploadconfirm.json',
		create:'tools/resource_createDir.json',
		del:'cms/sitefile_delete.json',
		delAll:'cms/sitefile_deleteAll.json',
		readFile:'cms/sitefile_readFile.json',
		saveFile:'cms/sitefile_saveFile.json'	
	};
	
	var siteid = TRIG.CMS.setRightWebSiteSelect('right-page-bar', function(id){
		siteid = id;
		$('#resource_tree').jstree('refresh_node', {id: '/', 'siteId' : siteid});   
	}).getId();
	
	var pid = "/"; 
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
                  return cmsfile.url.tree;
                },
                'data' : function (node) {
                  return { 'id' : node.id, 'siteId' : siteid }; 
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
	// 刷新树
	$("#resource_tree_reload").bind('click', function(){ 
    	$('#resource_tree').jstree('refresh_node', {id: '/', 'siteId' : siteid});   
    });
	
	var csseditor = CodeMirror.fromTextArea(document.getElementById("edit_text"), {
	 	mode: 'text/css',
        autoCloseTags: true,
		autoCloseBrackets: true,
		lineNumbers: true,
		lineWrapping: true,
		theme: "night",
		extraKeys: {
			"F11": function(cm) {
			  cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function(cm) {
			  if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			},
			"Alt-F": "findPersistent",
			"Ctrl-/": "autocomplete"
		  },
		  autofocus: true
	});
	var jseditor = CodeMirror.fromTextArea(document.getElementById("jsedit_text"), {
	 	mode: 'text/javascript',
        autoCloseTags: true,
		autoCloseBrackets: true,
		lineNumbers: true,
		lineWrapping: true,
		theme: "night",
		extraKeys: {
			"F11": function(cm) {
			  cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function(cm) {
			  if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			},
			"Alt-F": "findPersistent",
			"Ctrl-/": "autocomplete"
		  },
		  autofocus: true
	});
	var tablerows = []; 
    var table = $('#trig-resource-table');
    var ttable = new TRIG.Datatable({
		table : table, 
		url : cmsfile.url.list, 
		filter: true,
		paging : false,
		columns : [
				   { "data": null, "render": function(data, type, row, mete){ 
					   tablerows[row.name] = row;
						return '<input type="checkbox" class="checkboxes" value="'+row.name+'"/>';   
				   }, orderable: false, className: "trig-checkbox" },
		                 { "data": "name" },
		                 { "data": "updateTime" },
		                 { "data": "type" , "className" : "hidden-xs", "render":function(value, type, row) {
		                	 return "<img src='assets/admin/trig/fileicon/"+row.typeIcon+"' /> " + value;
		                 }},
		                 { "data": "size" , "className" : "hidden-xs"},
		                 { "data": "type", "render": function(data, type, row, mete) {
		                	 if(data == 'css' || data == 'js') {
		     					return "<a href=\"javascript:;\" class=\"btn default btn-xs purple edit\" data-type=\""+data+"\" data-name=\""+row.name+"\"><i class=\"fa fa-edit\"></i></a>";
		                	 } else {
		                		 return "<a href=\"javascript:;\" class=\"btn default btn-xs purple view\" data-type=\""+data+"\" data-name=\""+row.name+"\"><i class=\"fa fa-file\"></i></a>";
		                	 }
		                 }}
		],
		queryParams:{ id: pid , 'siteId' : siteid},
		order: [[1,'asc']],
		drawCallback : function() {
			$(".edit").each(function(){
				$(this).bind('click', function() {
					var name = $(this).attr('data-name');
					var type = $(this).attr('data-type');
					if(type == 'css') {
						$("#edit_id").val(pid);
						$("#edit_fileName").val(name);
						$("#fileEditModal").modal('show');
						setTimeout(
						    	 function(){
						    		 $.getJSON(cmsfile.url.readFile, 'id=' + pid +'&fileName=' + name, function(data) {
											csseditor.getDoc().setValue(data.message);
							   	    	    csseditor.refresh();
										});
								}, 500);
					} else { // js
						$("#jsedit_id").val(pid);
						$("#jsedit_fileName").val(name);
						$("#jsfileEditModal").modal('show');
						setTimeout(
						    	 function(){
						    		 $.getJSON(cmsfile.url.readFile, 'id=' + pid +'&fileName=' + name, function(data) {
											jseditor.getDoc().setValue(data.message);
											jseditor.refresh();
										});
								}, 500);
					}
				});
			});
			$(".view").each(function(){
				$(this).bind('click', function() {
					var name = $(this).attr('data-name');
					var type = $(this).attr('data-type');
					TRIG.UPLOAD.openView(pid + name, "png,jpg,jpge,bmp,gif".indexOf(type) > -1 ? TRIG.FILETYPE_IMG : TRIG.FILETYPE_FILE);
				});
			});
		}
    });
    
    // 显示更多字段值
    ttable.initMore(function(id) { 
   	 var rowData = tablerows[id];
   	 var sOut = '<table>';
        sOut += '<tr><td><div class="trig-more-content">类型：</div></td><td>' + rowData.type + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">大小：</div></td><td>' + rowData.size + '</td></tr>'; 
        sOut += '</table>';
        return  sOut;
    });
    
    $('#resource_tree').on('select_node.jstree', function(e,data) { 
    	pid = data.node.id;
    	if(pid=='#') pid="/";
    	ttable.query({id: pid, 'siteId' : siteid});   
        return false;
    });
    
    $("#resource_list_reload").bind('click', function(){
    	ttable.reload();
    });
    
    function refreshtree() {
    	$('#resource_tree').jstree('refresh_node', {id: pid, 'siteId' : siteid}); 
    }
    
 // 打开创建文件夹
    $("#createResourceManage").bind('click', function(){
    	$("#createDir").val('');
    	$("#id").val(pid);
    	$("#createModal").modal('show');
    });
    // 创建文件夹
    TRIG.Validate('createform', function(form){
    	TRIG.trackPost(cmsfile.url.create, $(form).serialize(), function(data){
				refreshtree();
				ttable.reload(); 
				$("#createModal").modal('hide');
				TRIG.messager.alert("创建成功");
    	});
    	return false;
    }, {
    	fileName : {
    		required : true
    	}
    });

    // 上传文件
    var temf = ""; // 上传文件存在，临时文件
    $("#uploadResourceManage").bind('click', function(){
    	$("#uploadModal").modal('show');
    });
    // 上传提交
    TRIG.Validate('uploadform', function(form){
    	var _url = cmsfile.url.upload;
		if(temf == $("#uploadfile").val()) {
			_url = cmsfile.url.uploadconfirm;
		}
		upload(_url);
    	return false;
    }, {
    	uploadfile : {
    		required : true
    	}
    });
    function upload(_url, zip) {
		TRIG.progress();
		_url += "?id=" + pid + "&" + TRIG.Contants.CSRF_PARA + "=" + getCookie(TRIG.Contants.CSRF_COOKIE);
		var ffv = zip ? $("#zipfile").val() : $("#uploadfile").val();
		$.ajaxFileUpload({  
			url: _url,  
			secureuri: false,  
			fileElementId: zip ? 'zipfile' : 'uploadfile',  
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
					if(zip) {
						$("#uploadsModal").modal('hide');
					}else{
						$("#uploadModal").modal('hide');
					}
					ttable.reload(); 
					refreshtree();
					TRIG.messager.alert("上传成功");
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
    
    // 批量上传，上传zip
    $("#uploadsResourceManage").bind('click', function(){
    	$("#uploadsModal").modal('show');
    });
    TRIG.Validate('uploadsform', function(form){
    	var _url = cmsfile.url.uploads;
		upload(_url, true);
    	return false;
    }, {
    	zipfile : {
    		required : true
    	}
    });
    
    $("#downloadResourceManage").bind('click', function(){
    	var objs = ttable.getCheckbox();
    	var rows = objs.size();
		if(TRIG.isSelectOne(rows)) {
			var id = objs.get(0).value ;
			var rowData = tablerows[id];
			if(rowData.type!='Folder') {
				document.getElementById("uploadiframe").src = cmsfile.url.download + "?id=" + pid + "&fileName=" + id+ "&" + TRIG.Contants.CSRF_PARA + "=" + getCookie(TRIG.Contants.CSRF_COOKIE);
			} else {
				TRIG.messager.alert("下载错误，文件夹还不能下载。");
			}
		}
    });
    
    // 删除
    $("#deleteResourceManage").bind('click', function(){
    	var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(cmsfile.url.del, "fileName=" + ids+"&id=" + pid, function(data){
				ttable.reload();
				refreshtree();
			});
		});
    });
    
    // 级联删除
    $("#deleteAllResourceManage").bind('click', function(){
    	var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(cmsfile.url.delAll, "fileName=" + ids+"&id=" + pid, function(data){
				ttable.reload();
				refreshtree();
			});
		});
    });
    
    TRIG.Validate('jsfileEditform', function(form){
    	TRIG.trackPost(cmsfile.url.saveFile, $(form).serialize(), function(data){
    		TRIG.updateSuccessAlert();
		});
    	return false;
    }, {
    	
    });
    
    TRIG.Validate('fileEditform', function(form){
    	TRIG.trackPost(cmsfile.url.saveFile, $(form).serialize(), function(data){
    		TRIG.updateSuccessAlert();
		});
    	return false;
    }, {
    	
    });
    
});