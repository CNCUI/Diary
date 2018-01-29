$(function(){
	var cmsWebsite = {};
	cmsWebsite.url = {};
	cmsWebsite.url.add = 'cms/website_add.json';
	cmsWebsite.url.update = 'cms/website_update.json';
	cmsWebsite.url.del = 'cms/website_delete.json';
	cmsWebsite.url.find = 'cms/website_findList.json';
	cmsWebsite.url.updateContentManager = "cms/website_updateContentManager.json";
	cmsWebsite.url.aKeyToDelete = "cms/website_aKeyToDelete.json";
	//cmsWebsite.url.tree = 'cms/website_findTree.json';
	
	var pid = "3"; 
	/* 左菜单树
	$('#website_tree').jstree({
        "core" : {
            "themes" : {
                "responsive": false
            }, 
            // so that create works
            "check_callback" : true,
            'data' : {
            	'dataType' : "json",  
                'url' : function (node) {
                  return cmsWebsite.url.tree;
                },
                'data' : function (node) {
                  return { 'id' : node.id, 'cid':pid }; 
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
    }); */
	
	var tablerows = []; 
    var table = $('#trig-website-table');
    var ttable = new TRIG.Datatable({
		table : table, 
		url : cmsWebsite.url.find, 
		filter: true,
		paging : false,
		columns : [
				   { "data": null, "render": function(data, type, row, mete){ 
					   tablerows[row.cw_siteId] = row;
						return '<input type="checkbox" class="checkboxes" value="'+row.cw_siteId+'"/>';   
				   }, orderable: false, className: "trig-checkbox" },
		                 { "data": "cw_siteName", "render":function(data,type,row,mete){
		                	 return '<span class="row-details row-details-close" dataid="'+row.cw_siteId+'"></span> ' + data;
		                 } },
		                 { "data": "cw_siteType" },
		                 { "data": "cw_siteDir" },
		                 { "data": "cw_state" , "className" : "hidden-xs", "render" : function(value) {
		                	 return TRIG.getYesNoHtml(value);
		                 }},
		                 { "data": "cw_createTime" }
		],
		queryParams:{ cid: pid },
		order: [[4,'desc']], 
		dblclick : function() {   // 双击打开编辑浮层
			// 是否有修改权限
	    	if(TRIG.isPrivlege("updateCmsWebsite")) {
	    		showUpdate();
	    	}
		} 
    });
    
    TRIG.initTableContentPrivleg(pid);
    
    /*
    $('#website_tree').on('select_node.jstree', function(e,data) { 
    	pid = data.node.id;
    	if(pid=='#') pid="3";
    	var pv = $("#" +pid+"_anchor").attr('pv');
    	TRIG.initContentPrivleg(pv);
    	if(TRIG.isContentQuery(pv))
    		ttable.query({cid: pid});   
        return false;
    }); */
    
    ttable.next(); // 初始下一个按钮事件
    ttable.prev(); // 初始上一个按钮事件
    
    /*
    $("#website_tree_reload").bind('click', function(){ 
    	$('#website_tree').jstree('refresh_node', {id: '3'});   
    }); */
    
    function refreshtree() {
    	//$('#website_tree').jstree('refresh_node', {id: pid}); 
    }
    
    // 显示更多字段值
    ttable.initMore(function(id) { 
   	 var rowData = tablerows[id];
   	 var sOut = '<table>';
   	 sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">域名：</div></td><td>' + rowData.cw_domain + '</td></tr>';
        //sOut += '<tr><td><div class="trig-more-content">ITEM ID：</div></td><td>' + rowData.ci_itemId + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">水印图片：</div></td><td>' + rowData.cw_imgWatermark + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">默认图片：</div></td><td>' + rowData.cw_defaultImg + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">协议：</div></td><td>' + rowData.cw_protocol + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">是否主站：</div></td><td>' + rowData.cw_isMain + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">样式文件：</div></td><td>' + rowData.cw_mainCss + '</td></tr>';
        /*sOut += '<tr><td><div class="trig-more-content">FTP地址：</div></td><td>' + rowData.cw_ftpAddress + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">FTP用户名：</div></td><td>' + rowData.cw_ftpName + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">FTP密码：</div></td><td>' + rowData.cw_ftpPassword + '</td></tr>'; */
        sOut += '<tr><td><div class="trig-more-content">登录页面：</div></td><td>' + rowData.cw_loginPage + '</td></tr>'; 
        sOut += '<tr><td><div class="trig-more-content">404页面：</div></td><td>' + rowData.cw_page404 + '</td></tr>'; 
        sOut += '<tr><td><div class="trig-more-content">500页面：</div></td><td>' + rowData.cw_page500 + '</td></tr>'; 
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">禁用：</div></td><td>' + rowData.cw_state + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">描述：</div></td><td>' + rowData.cw_description + '</td></tr>'; 
        sOut += '</table>';
        return  sOut;
    });
    
    $("#website_list_reload").bind('click', function(){
    	ttable.reload();
    });
    
    // 内容选择
    //TRIG.CMS.selectItem('ci_itemId', false);
    
    // 新增
    $("#addCmsWebsite").bind('click',function(){
    	TRIG.formreset($("#websiteEditform"));
    	TRIG.hidePrveNext();
    	$("#cw_parentSiteId").val(pid);
    	/* 清除内容选择
    	TRIG.CMS.clearSelect('ci_itemId'); */
    	$("#cw_siteDir").attr("readonly", false);
    	$("#websiteEditModal").modal('show');
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
			TRIG.forminit($("#websiteEditform"), data);
			/*
			TRIG.CMS.selectItemData('ci_itemId', data.ci_itemId, false); 
			*/
			//$("#cw_siteDir").attr("readonly", true);
			$("#websiteEditModal").modal('show');
		}
    }
    
    // 打开修改编辑浮层
    $("#updateCmsWebsite").bind('click', function(){
    	showUpdate();
    });
    
    // 是否点击保存&关闭
    var saveclose = false;
    // 添加/编辑->保存
    TRIG.FormValidate("cms_website", "websiteEditform",  function (form) {
			var _url = cmsWebsite.url.add;
			var isadd = true;
			if($("#cw_siteId").val()!='') {
				_url = cmsWebsite.url.update;
				isadd = false;
			}
			TRIG.trackPost(TRIG.getContentUrl(_url, pid), $(form).serialize(), function(data){
				//ttable.reload();
				if(isadd == true) {
					TRIG.formreset($("#websiteEditform")); 
					$("#cw_parentSiteId").val(pid);
				}
				if(saveclose) {
					$("#websiteEditModal").modal('hide');  
				} 
				refreshtree();
				// 重新初始右侧站点管理列表
				TRIG.CMS.InitWebSiteList();
				TRIG.updateSuccessAlert(); 
			});
			return false;
    });
    $(".trigsaveclose").bind('click', function(){
    	saveclose = true; 
    }); 
    // 关闭编辑浮层刷新列表 
    $("#websiteEditModal").on('hidden', function(){
    	ttable.reload();
    	saveclose = false;
    });
    
    // 删除
    $("#deleteCmsWebsite").bind('click', function(){
    	var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelRecycleBinSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(TRIG.getContentUrl(cmsWebsite.url.del, pid), "ids=" + ids, function(data){
				ttable.reload();
				//refreshtree();
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
    
    $("#cw_imgWatermark_fb").bind('click', function(){
    	TRIG.UPLOAD.openImg('cw_imgWatermark');
    });
    $("#cw_imgWatermark_fvb").bind('click', function(){
    	TRIG.UPLOAD.openView($("#cw_imgWatermark").val(), TRIG.FILETYPE_IMG);
    });
    
    $("#cw_defaultImg_fb").bind('click', function(){
    	TRIG.UPLOAD.openImg('cw_defaultImg');
    });
    $("#cw_defaultImg_fvb").bind('click', function(){
    	TRIG.UPLOAD.openView($("#cw_defaultImg").val(), TRIG.FILETYPE_IMG);
    });
   
    $(".updateAddRolePrivlegeDef").bind('click', function(){
    	TRIG.trackPost(TRIG.getContentUrl(cmsWebsite.url.updateContentManager, pid), '', function(data){
    		TRIG.updateSuccessAlert(); 
		});
    });
    
    //一键删除
    $("#aKeyToDelete").bind('click', function(){
		TRIG.trackPost(cmsWebsite.url.aKeyToDelete, '', function(data){
			TRIG.messager.alertSuccess("删除成功！");
			ttable.reload();
		});
		
		
    });
});