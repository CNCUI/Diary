$(function(){
	var cmsItem = {};
	cmsItem.url = {};
	cmsItem.url.add = 'cms/item_add.json';
	cmsItem.url.update = 'cms/item_update.json';
	cmsItem.url.del = 'cms/item_delete.json';
	cmsItem.url.find = 'cms/item_findPageList.json';
	cmsItem.url.tree = 'cms/item_findTree.json?order=asc&sort=ci_sortNo';
	cmsItem.url.selectTemplate = 'cms/template_select.json';
	cmsItem.url.templateField = 'cms/template_getFields.json';
	cmsItem.url.move = 'cms/item_move.json';
	cmsItem.url.moveMenu = 'cms/item_moveMenu.json';
	cmsItem.url.sorts = 'cms/item_updateSorts.json';
	cmsItem.url.updateSort = 'cms/item_updateSort.json';
	cmsItem.url.copy = 'cms/item_copy.json';
	cmsItem.url.addPublish = 'cms/item_addPublish.json';
	cmsItem.url.delPublish = 'cms/item_delPublish.json';
	cmsItem.url.addLock = 'cms/item_addLock.json';
	cmsItem.url.delLock = 'cms/item_delLock.json';
	cmsItem.url.addWorkflow = 'cms/item_addWorkflow.json';
	
	cmsItem.url.addGenerate = 'cms/item_generate_save.json';
	cmsItem.url.addGenerateList = 'cms/item_generate_saveList.json';
	
	cmsItem.url.updateContentManager = 'cms/item_updateContentManager.json';
	cmsItem.url.delWebsitePublish = 'cms/item_delWebsitePublish.json';
	cmsItem.url.delColumnPublish = 'cms/item_delColumnPublish.json';
	cmsItem.url.addWebsitePublish = 'cms/item_addWebsitePublish.json';
	cmsItem.url.addColumnPublish = 'cms/item_addColumnPublish.json';

	cmsItem.url.addWeixin = 'www/weixin/msg_send_add.json';
	
	cmsItem.url.exportItem = 'cms/item_exportItem.json';
	cmsItem.url.importItem = 'cms/item_importItem.json';
	cmsItem.url.exportItemSite = 'cms/item_exportItemSite.json';
	
	
	var defpid = "3";
	var pid = defpid; 
	var deftempid = ''; //默认模板ID
	
    function setTemplateList() {
    	var tid = $("#" +pid+"_anchor").attr('tid');
    	if(!tid) tid='';
    	// 模板选择列表
        $.getJSON(cmsItem.url.selectTemplate, 'id=' + tid + "&siteId=" + siteid, function(data){
        	var options = document.getElementById("ctp_templateId").options;
        	options.length = 1;
        	for(var i=0;i<data.length;i++) {
        		var option = new Option(data[i].ctp_templateName, data[i].ctp_templateId);
        		options.add(option); 
        	}
        });
    }
    
    var getPVID = function() {
    	return pid == defpid ? siteid : pid;
    };
    // 编辑器
    var itemEditor = new TRIG.CMS.Editor('ci_itemPageContent_html', 'ci_itemPageContent');
	var siteid = TRIG.CMS.setRightWebSiteSelect('right-page-bar', function(id){
		siteid = id;
		//TRIG.CMS.CKEditor.SAVEJS(siteid);
		ci_itemName : $("#sItemName").val('');
		TRIG.CMS.clearSelect('sTagId');
		
		ttable.query({ cid: siteid,
    		 'ci_siteId' : siteid
    	}); 
		$('#item_tree').jstree('refresh_node', {id: defpid, 'ci_siteId' : siteid});   
		pid = defpid;
		// 首页模板
		setTemplateList();
		// 内容权限
		TRIG.initTableContentPrivleg(getPVID());
		
		// 引用
		var qsiteoptions = $("#quote_site_id").get(0).options;
		var q2siteoptions = $("#quote2_siteId").get(0).options;
		qsiteoptions.length = 0;
		q2siteoptions.length = 0;
		for(var i=0;i<TRIG.CMS.WebSiteList.length;i++) {
			var opt = new Option(TRIG.CMS.WebSiteList[i].cw_siteName, TRIG.CMS.WebSiteList[i].cw_siteId);
			if(TRIG.CMS.WebSiteList[i].cw_siteId == siteid) {
				opt.selected = true;
			}
			qsiteoptions.add(opt);
			q2siteoptions.add(opt);
		}
		
		// 用户模板字段
		setUserFields(id);
		// 编辑器配置初始
		itemEditor.init();
	}).getId();
	
	TRIG.initTableContentPrivleg(getPVID());
	
	// 可引用站点初始
	var qsiteoptions = $("#quote_site_id").get(0).options;
	var q2siteoptions = $("#quote2_siteId").get(0).options;
	qsiteoptions.length = 0;
	q2siteoptions.length = 0;
	for(var i=0;i<TRIG.CMS.WebSiteList.length;i++) {
		var opt = new Option(TRIG.CMS.WebSiteList[i].cw_siteName, TRIG.CMS.WebSiteList[i].cw_siteId);
		if(TRIG.CMS.WebSiteList[i].cw_siteId == siteid) {
			opt.selected = true;
		}
		qsiteoptions.add(opt);
		q2siteoptions.add(opt);
	}
	
	// 复制IDS，多个逗号隔开
	cmsItem.copyids = "";
	// 复制目录
	cmsItem.copydirid = "";
	// 复制类型，copy 复制 cut 剪切
	cmsItem.copytype = "copy";
	var movesortno = 5;
	
	// 左菜单树
	$('#item_tree').jstree({
        "core" : {
            "themes" : {
                "responsive": false
            }, 
            // so that create works
            "check_callback" : true,
            'data' : {
            	'dataType' : "json",  
                'url' : function (node) {
                  return cmsItem.url.tree;
                },
                'data' : function (node) {
                  return { 'id' : node.id=='#'?'':node.id, 'cid':getPVID() , 'ci_siteId' : siteid}; 
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
    var table = $('#trig-item-table');
    
    var ttable = new TRIG.Datatable({
		table : table, 
		url : cmsItem.url.find, 
		//filetr: true,
		columns : [
				   { "data": null, "render": function(data, type, row, mete){ 
					   tablerows[row.ci_itemId] = row;
					   deftempid = row.ctp_templateId;
						return '<input type="checkbox" class="checkboxes" value="'+row.ci_itemId+'"/>';   
				   }, orderable: false, className: "trig-checkbox" },
		                 { "data": "ci_itemName", "render":function(data,type,row,mete){
		                	 var c = '';
		                	 if (cmsItem.copyids.indexOf(row.ci_itemId+",")>-1 && cmsItem.copydirid == pid){
		     					if(cmsItem.copytype == 'cut') {
		     						c = 'color:red;';
		     					} else {
		     						c = 'color:blue;';
		     					}
		     				}
		                	 
		                	 return '<span class="row-details row-details-close" dataid="'+row.ci_itemId+'"></span> ' 
		                	 			+ '<span style="'+c+'">' + (row.ci_isQuote == 'Y' ? '<span style="color:blue">[引用]</span>':'') + data + '</span>';
		                 } },
		                 { "data": "ci_isColumn" , "className" : "hidden-xs"},
		                 { "data": "ci_isUpdate",  "render": function(value){
		                	 return TRIG.getYesNoHtml(value);
		                 }},
		                 { "data": "ci_status" , "render":function(value){
		                	 return TRIG.CMS.getStatusStr(value);
		                 }},
		                 { "data": "ci_sortNo" },
		                 { "data": "ci_modifyTime"  , "className" : "hidden-xs"}
		                 
		],
		queryParams:{ cid: getPVID(), ci_siteId: siteid },
		order: [[6,'desc']], 
		dblclick : function() {   // 双击打开编辑浮层
			// 是否有修改权限
	    	if(TRIG.isPrivlege("updateCmsItem")) {
	    		showUpdate();
	    	}
		},
		dnd: {	// 拖动排序
			sort:movesortno,
			onDrop: function(id, previd, nextid){
	 			var moveid = previd;
	 			if(!previd) {
	 				moveid = nextid;
	 			}
	 			var rowData = tablerows[id];
	 			var moveData = tablerows[moveid];
	 			if(rowData.ci_sortNo > moveData.ci_sortNo) {
	 				moveid = nextid;
	 			}
	 			if(moveid)
		 			TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.move, pid),'id=' + id + '&moveId=' + moveid, function(data){
							ttable.reload();
					});
			}
		}
    });
    
    $('#item_tree').on('select_node.jstree', function(e,data) { 
    	pid = data.node.id;
    	if(pid=='#') pid=defpid;
    	var pv = $("#" +pid+"_anchor").attr('pv');
    	TRIG.initContentPrivleg(pv);
    	if(TRIG.isContentQuery(pv))
    		ttable.query({cid: getPVID(), 'ci_siteId' : siteid});   
    	
    	setTemplateList();
        
        return false;
    });
    
    ttable.next(); // 初始下一个按钮事件
    ttable.prev(); // 初始上一个按钮事件
    
    $("#item_tree_reload").bind('click', function(){ 
    	$('#item_tree').jstree('refresh_node', {id: defpid, 'ci_siteId' : siteid});   
    });
    
    function refreshtree() {
    	$('#item_tree').jstree('refresh_node', {id: pid, 'ci_siteId' : siteid}); 
    }
    
    // 显示更多字段值
    ttable.initMore(function(id) { 
	   	 var rowData = tablerows[id];
	   	 var sOut = '<table>';
	   	 sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">模板 ID：</div></td><td>' + rowData.ctp_templateId + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">模板名称：</div></td><td>' + rowData.ctp_templateName  + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">是否变化名称颜色：</div></td><td>' + (rowData.ci_isNameColor == 'Y'?'Y':'N') + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">名称颜色：</div></td><td>' + rowData.ci_nameColor + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">作者：</div></td><td>' + (rowData.ci_authorId?$("#ci_authorId option[value='"+rowData.ci_authorId+"']").text():"")  + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">来源：</div></td><td>' + (rowData.ci_sourceId?$("#ci_sourceId option[value='"+rowData.ci_sourceId+"']").text():"")  + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">标识：</div></td><td>' + rowData.ci_itemNo + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">路径：</div></td><td>' + rowData.ci_fileDir + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">发布日期：</div></td><td>' + rowData.ci_pubDate + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">PC发布：</div></td><td>' + (rowData.ci_isPc== 'Y'?'Y':'N') + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">WAP发布：</div></td><td>' + (rowData.ci_isWap== 'Y'?'Y':'N') + '</td></tr>';
	   	sOut += '<tr class="visible-xs"><td><div class="trig-more-content">栏目：</div></td><td>' + rowData.ci_isColumn + '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">导航：</div></td><td>' + (rowData.ci_isNavigation== 'Y'?'Y':'N') + '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">地图：</div></td><td>' + (rowData.ci_isMap== 'Y'?'Y':'N') + '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">热点：</div></td><td>' + (rowData.ci_isHot == 'Y'?'Y':'N')+ '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">首页Top：</div></td><td>' + (rowData.ci_isIndex== 'Y'?'Y':'N') + '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">栏目Top：</div></td><td>' + (rowData.ci_isColumnIndex== 'Y'?'Y':'N') + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">评论：</div></td><td>' + (rowData.ci_isComment== 'Y'?'Y':'N') + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">公开：</div></td><td>' + (rowData.ci_isPublic== 'Y'?'Y':'N') + '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">锁：</div></td><td>' + rowData.ci_itemLock + '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">标签：</div></td><td>' + (rowData.itemtagnames ?  rowData.itemtagnames : '')+ '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">静态：</div></td><td>' + (rowData.ci_isStatic == 'Y'?'Y':'N') + '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">访问名称：</div></td><td>' + rowData.ci_fileName + '</td></tr>';
	   	sOut += '<tr><td><div class="trig-more-content">SEO Title：</div></td><td>' + rowData.ci_seoTitle + '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">SEO KeyWord：</div></td><td>' + rowData.ci_seoKeyWord + '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">SEO Description：</div></td><td>' + rowData.ci_seoDescription + '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">描述：</div></td><td>' + rowData.ci_description + '</td></tr>';
	   	 sOut += '<tr><td><div class="trig-more-content">创建时间：</div></td><td>' + rowData.ci_createTime + '</td></tr>';
	   	 sOut += '<tr class="visible-xs"><td><div class="trig-more-content">修改时间：</div></td><td>' + rowData.ci_modifyTime + '</td></tr>';
	   	 sOut += '</table>';
	   	 return  sOut;
    });
    
    $("#item_list_reload").bind('click', function(){
    	ttable.reload();
    });
    
    TRIG.CMS.selectTag('sTagId', false);
    
    // 查询
    $("#findCmsItem").bind('click', function(){
    	ttable.query({ ci_itemName : $("#sItemName").val(), cid: getPVID(),
    		sTagId : $("#sTagId").val(), 'ci_siteId' : siteid
    	}); 
    });
    // 高级查询
    TRIG.search('cms_item', $("#findCmsItem"), ttable, 'i', function(data){
    	data.cid = getPVID();
    	data.ci_siteId = siteid;
    });
    
    
    $("#btn_ci_resourceId_text").bind('click', function(){
    	selectResourec('ci_resourceId', 'IMG_FILE', false);
    	/*var pdir2 = '/content/resource/' + TRIG.CMS.getWebsiteDir(siteid) + "/";
    	TRIG.UPLOAD.open('ci_resourceId', TRIG.FILETYPE_IMG, pdir2, null, true, TRIG.CMS.getWebsite(siteid).cw_imgWatermark ? TRIG.CMS.getWebsite(siteid).cw_imgWatermark : '', false);*/
    });
    
    $('#date-picker-pubDate').datepicker({
        autoclose: true,
        todayBtn: true,
        isRTL: Metronic.isRTL(),
        format: "yyyy-mm-dd", 
        pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
    });
	 $('.colorpicker-default').colorpicker({
	        format: 'hex'
	 });
    TRIG.dict.setSelectByNO("ci_authorId", "item_author"); // 作者选择
    TRIG.dict.setSelectByNO("ci_sourceId", "item_source"); // 来源选择
    
    // 新增
    $("#addCmsItem").bind('click',function(){
    	if(!siteid) {
    		TRIG.messager.alert("请先新增站点");
    	}
    	TRIG.hidePrveNext();
    	$("#ci_fileDir").attr('readonly',false); 
    	/*$("#item_tab3_li").addClass('disabled');
    	$("#item_tab3").bind('click', disableLink); */
    	$('#ctp_templateId').attr('disabled', false); 
    	addItemInit();
    	$("#itemEditModal").modal('show');
    });
    
    // 新增时数据初始
    function addItemInit() {
    	TRIG.formreset($("#itemEditform"));
    	$('#ci_nameColor').colorpicker('setValue', '#000000');  
    	$("#ci_parentItemId").val(pid);
    	$("#ctp_templateId").val(deftempid);
    	
    	// 编辑器值清空
    	itemEditor.setValue("");
    	
    	if(deftempid) {
    		setTemplateFieldHTML(deftempid);
    	}
    	// 初始到第一个tab，基本信息
    	$("#item_tab1").click();
    	TRIG.ClearError();
    	// 清除标签
    	TRIG.CMS.clearSelect('itemtagids');
    	// 设置内容站点
    	$("#ci_siteId").val(siteid);
    }
    
    // 用户定义字段
    var userTemplateFields = [];
    function setUserFields(siteid) {
	    $.getJSON('cms/template_fieldType_findList.json', 'id=' + siteid, function(data) {
	    	userTemplateFields = data;
	    });
    }
    setUserFields(siteid);
    
    function isUserFieldType(type) {
    	for(var i=0;i<userTemplateFields.length;i++) {
    		if(userTemplateFields[i].ctft_typeDef == type) {
    			return true;
    		}
    	}
    	return false;
    }
    
    function isUserFieldList(type) {
    	for(var i=0;i<userTemplateFields.length;i++) {
    		if(userTemplateFields[i].ctft_typeDef == type) {
    			if(userTemplateFields[i].ctft_category == '1') {
    				return true;
    			}
    			return false;
    		}
    	}
    	return false;
    }
    
    // 模板对应模板字段缓存
    var templateFields = [];
    // 要排序的数据
    var sortData = [];
    // 要排序的字段
    var sortDataField = '';
    // 模板字段HTML生成
    function setTemplateFieldHTML(ctp_templateId, ci_itemContent) {
    	// 模板字段
		var fields = templateFields[ctp_templateId];
		if(!fields) {
			// 模板字段
			$.ajax({dataType:'json',url:cmsItem.url.templateField,data:'id=' + ctp_templateId, success:function(data) {
				if(data.success==true) {
					templateFields[ctp_templateId] = fields = data.rows;
				}
			}, async:false});
		}
		// 清空已生成的自定义HTML
		$("#item_tmplate_fields_html").html('');
		
		// 自定义内容
		var content = {};
		if(ci_itemContent) {
			content = $.parseJSON(ci_itemContent);
		}
		for(var i=0; i<fields.length; i++) {
			// 自定义HTML
			var fieldhtml = '';
			var type = fields[i].ctf_fieldType;
			var _v = eval('v=content.'+fields[i].ctf_fieldDefName);
			var value='';
			if(_v) {
				value = _v;
			}
			var input = '<input type="text" name="'+ fields[i].ctf_fieldDefName +'" id="'+ fields[i].ctf_fieldDefName +'" value="'+ value +'" class="form-control" />';
			if(type == 'bigtext' ) {
				input = '<textarea rows="6" name="'+ fields[i].ctf_fieldDefName +'" id="'+ fields[i].ctf_fieldDefName +'" class="form-control">'+ value +'</textarea>';
			} else if(type == 'htmltext'){
				input = '<textarea rows="10" name="'+ fields[i].ctf_fieldDefName +'" id="'+ fields[i].ctf_fieldDefName +'" class="form-control">'+ value +'</textarea>';
			} else if(type == 'dictionary' || type == 'dictionary_Code')  {
				input = '<select name="'+ fields[i].ctf_fieldDefName +'" id="'+ fields[i].ctf_fieldDefName +'" class="form-control" data-value="'+value+'"><option value="">请选择</option></select>';
			} else if(type == 'date') {
				input = '<div class="input-group date form_datetime" id="date-picker-'+fields[i].ctf_fieldDefName+'" data-date-format="yyyy-mm-dd" >' + input;
				input += '<span class="input-group-btn">'
					 + '<button class="btn default date-reset" type="button"  onclick="$(\'#'+fields[i].ctf_fieldDefName+'\').val(\'\');"><i class="fa fa-times"></i></button>'
					 + '</span>';
				input += '<span class="input-group-btn">' 
						  + '<button class="btn default" type="button"><i class="fa fa-calendar"></i></button>'
						  + '</span>';
				input += '</div>';
			} else if(type == 'datetime') {
				input = '<div class="input-group date form_datetime" id="date-picker-'+fields[i].ctf_fieldDefName+'" >' + input;
				input += '<span class="input-group-btn">'
						 + '<button class="btn default date-reset" type="button"><i class="fa fa-times"></i></button>'
						 + '</span>';
				input += '<span class="input-group-btn">' 
						  + '<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>'
						  + '</span>';
				input += '</div>';
			} else if(type == 'imgfile' || type == 'imgfiles' || type == 'docfile' || type == 'docfiles' || type == 'file' || type == 'files' || type == 'videofile' || type == 'videofiles' ) {
				input = '<div class="input-group">' + '<input type="text" name="'+ fields[i].ctf_fieldDefName +'" id="'+ fields[i].ctf_fieldDefName +'"  class="form-control" />';
				//input += '<input type="text" id="_'+ fields[i].ctf_fieldDefName +'_Name" name="_'+ fields[i].ctf_fieldDefName +'_Name" value="'+ value +'"readonly="readonly"/>';
				input += '<span class="input-group-btn">' 
					  + '<button class="btn default" id="btn_'+fields[i].ctf_fieldDefName+'" data-i="'+i+'" type="button"><i class="fa fa-search"></i></button>';
					  if(type == 'imgfiles' || type == 'docfiles' || type == 'files' || type == 'videofiles') {
						  input +=  '<button class="btn default" type="button" data-i="'+i+'" id="btn_sort_'+fields[i].ctf_fieldDefName+'"><i class="fa fa-edit"></i></button>'
					  }
					  input += '<button class="btn default" type="button" data-i="'+i+'" id="btn_view_'+fields[i].ctf_fieldDefName+'"><i class="fa fa-file-o"></i></button>'
					  + '</span>';
				input += '</div>';
			} else if(type=='link') {
				input = '<div class="input-group">' ;
				input += '<input type="hidden" id="'+ fields[i].ctf_fieldDefName +'" name="'+ fields[i].ctf_fieldDefName +'" value=\''+value+'\'>';
				input += '<input type="text" id="link_'+ fields[i].ctf_fieldDefName +'"  value=\''+ viewTempLink(value) +'\' class="form-control" readonly="readonly"/>';
				input += '<span class="input-group-btn">'
					 + '<button class="btn default date-reset" type="button"  onclick="$(\'#'+fields[i].ctf_fieldDefName+'\').val(\'\'); $(\'#link_'+fields[i].ctf_fieldDefName+'\').val(\'\');"><i class="fa fa-times"></i></button>'
					 + '</span>';
				input += '<span class="input-group-btn">' 
					  + '<button class="btn default" id="btn_'+fields[i].ctf_fieldDefName+'" data-i="'+i+'" type="button"><i class="fa fa-edit"></i></button>'
					  + '</span>';
				input += '</div>';
			} else if(type == 'contents'){
				input = '<div class="input-group">' + '<input type="text" name="'+ fields[i].ctf_fieldDefName +'" id="'+ fields[i].ctf_fieldDefName +'"  class="form-control" />';
				//input += '<input type="text" id="_'+ fields[i].ctf_fieldDefName +'_Name" name="_'+ fields[i].ctf_fieldDefName +'_Name" value="'+ value +'"readonly="readonly"/>';
				input += '<span class="input-group-btn">' 
					 input +=  '<button class="btn default" type="button" data-i="'+i+'" id="btn_sort_'+fields[i].ctf_fieldDefName+'"><i class="fa fa-edit"></i></button>'
					  + '</span>';
				input += '</div>';
			} else if(isUserFieldType(type)) { // 自定义类型
				input = '<div class="input-group">' ;
				input += '<input type="hidden" id="'+ fields[i].ctf_fieldDefName +'" name="'+ fields[i].ctf_fieldDefName +'" value=\''+value+'\'>';
				if(isUserFieldList(type)) {
					input += '<textarea rows="6"  id="userField_'+ fields[i].ctf_fieldDefName +'" class="form-control" readonly="readonly">'+ viewTempUserField(type, value) +'</textarea>';
				} else {
					input += '<input type="text" id="userField_'+ fields[i].ctf_fieldDefName +'"  value=\''+ viewTempUserField(type, value) +'\' class="form-control" readonly="readonly"/>';	
				}
				input += '<span class="input-group-btn">'
					 + '<button class="btn default date-reset" type="button"  onclick="$(\'#'+fields[i].ctf_fieldDefName+'\').val(\'\');$(\'#userField_'+fields[i].ctf_fieldDefName+'\').val(\'\');"><i class="fa fa-times"></i></button>'
					 + '</span>';
				input += '<span class="input-group-btn">' 
					  + '<button class="btn default" id="btn_'+fields[i].ctf_fieldDefName+'" data-i="'+i+'" type="button"><i class="fa fa-edit"></i></button>'
					  + '</span>';
				input += '</div>';
			}
			fieldhtml += '<div class="form-group"><label class="col-md-2 control-label">'+ fields[i].ctf_fieldName +'</label><div class="col-md-8" id="input_'+fields[i].ctf_fieldDefName+'">'+ input +'</div></div>';
			$("#item_tmplate_fields_html").append(fieldhtml);
			
			// 验证规则
			if(document.getElementById(fields[i].ctf_fieldDefName)) 
				$("#" + fields[i].ctf_fieldDefName).rules("remove");
			var required = fields[i].ctf_nullable=='N' ? true : false;
			if(type == 'number') {
				$("#" + fields[i].ctf_fieldDefName).rules("add", { number : true});
			} else if(type == 'date'){
				$('#date-picker-' + fields[i].ctf_fieldDefName).datepicker({
	                rtl: Metronic.isRTL(),
	                orientation: "left",
	                autoclose: true
	            });
				$("#" + fields[i].ctf_fieldDefName).attr('readonly', true);
			} else if(type == 'datetime') {
				$('#date-picker-' + fields[i].ctf_fieldDefName).datetimepicker({
			        autoclose: true,
			        todayBtn: true,
			        isRTL: Metronic.isRTL(),
			        format: "yyyy-mm-dd hh:ii", 
			        pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
			    });
				$("#" + fields[i].ctf_fieldDefName).attr('readonly', true);
			} else if(type == 'dictionary') {
				TRIG.dict.setSelectByParent(fields[i].ctf_fieldDefName, fields[i].ctf_dictionaryId);
				//$("#" + fields[i].ctf_fieldDefName).val(value);
			} else if(type == 'dictionary_Code'){
				TRIG.dict.setSelectByParentAndCode(fields[i].ctf_fieldDefName, fields[i].ctf_dictionaryId);
			} else if(type == 'dictionarys') {
				TRIG.dict.setMultipleByParent(fields[i].ctf_fieldDefName, fields[i].ctf_dictionaryId, 'input_' + fields[i].ctf_fieldDefName, value);
			} else if(type == 'imgfile' || type == 'imgfiles' || type == 'docfile' || type == 'docfiles' || type == 'file' || type == 'files' || type == 'videofile' || type == 'videofiles') {
				$('#btn_' + fields[i].ctf_fieldDefName).bind('click', function(){
					var i = parseInt($(this).attr('data-i')); 
					var type = fields[i].ctf_fieldType;
					var rtype = '';
					var multiple = false;
					if(type == 'imgfile' || type == 'imgfiles') {
						rtype = 'IMG_FILE';
					} else if(type == 'docfile' || type == 'docfiles') { 
						rtype = 'FILE';
					} else if(type == 'videofile' || type == 'videofiles') {
						rtype = 'VIDEO_FILE';
					}
					if(type == 'imgfiles' || type == 'docfiles' || type == 'videofiles' || type == 'files') {
						multiple = true;
					}
					var dname = fields[i].ctf_fieldDefName;
					selectResourec(dname, rtype, multiple);
				});
				
				$('#btn_view_' + fields[i].ctf_fieldDefName).bind('click', function() {
					var i = parseInt($(this).attr('data-i')); 
					var dname = fields[i].ctf_fieldDefName;
			    	viewFiles(dname);
			    });
				
				var type = fields[i].ctf_fieldType;
				var rtype = 'FILE';
				var multiple = false;
				if(type == 'imgfile' || type == 'imgfiles') {
					rtype = 'IMG_FILE';
				} else if(type == 'docfile' || type == 'docfiles') { 
					rtype = 'FILE';
				} else if(type == 'videofile' || type == 'videofiles') {
					rtype = 'VIDEO_FILE';
				}
				if(type == 'imgfiles' || type == 'docfiles' || type == 'videofiles' || type == 'files') {
					multiple = true;
				}
				
				TRIG.CMS.selectResource(fields[i].ctf_fieldDefName, rtype, multiple);
				setResource(value, fields[i].ctf_fieldDefName, multiple);
				
				// 排序
				if(multiple) {
					$('#btn_sort_' + fields[i].ctf_fieldDefName).bind('click', function(){
						var i = parseInt($(this).attr('data-i')); 
						sortSelectData(fields[i].ctf_fieldDefName);
					});
				}
			} else if(type == 'htmltext') {
				CKEDITOR.replace(fields[i].ctf_fieldDefName, { on: {
						change: function(evt){
							$("#" + evt.editor.name).val(evt.editor.getData());
						}
					}
				});
				//TRIG.CMS.updateEditor('input_' + fields[i].ctf_fieldDefName, fields[i].ctf_fieldDefName, value);
			} else if(type == 'content') {
				TRIG.CMS.selectItem(fields[i].ctf_fieldDefName, false);
				TRIG.CMS.selectItemData(fields[i].ctf_fieldDefName, value, false);
			} else if(type == 'contents') {
				TRIG.CMS.selectItem(fields[i].ctf_fieldDefName, true);
				TRIG.CMS.selectItemData(fields[i].ctf_fieldDefName, value, true);
				
				$('#btn_sort_' + fields[i].ctf_fieldDefName).bind('click', function(){
					var i = parseInt($(this).attr('data-i')); 
					sortSelectData(fields[i].ctf_fieldDefName);
				});
			} else if(type=='link') {
				$("#btn_" + fields[i].ctf_fieldDefName).bind('click', function(data){
					var i = parseInt($(this).attr('data-i')); 
					var dname = fields[i].ctf_fieldDefName;
					openLinkEdit(dname);
				});
			} else if(isUserFieldType(type)){ // 用户定义字段
				$("#btn_" + fields[i].ctf_fieldDefName).bind('click', function(data){
					var i = parseInt($(this).attr('data-i')); 
					var dname = fields[i].ctf_fieldDefName;
					openUserFieldEdit(dname, fields[i].ctf_fieldType);
				});
			}
			
			if(required) {
				/*if(type == 'imgfile' || type == 'imgfiles' || type == 'docfile' || type == 'docfiles') {
					$('#_'+ fields[i].ctf_fieldDefName +'_Name').rules("add", { required : true});
				} else {*/
					if(document.getElementById(fields[i].ctf_fieldDefName)) 
						$("#" + fields[i].ctf_fieldDefName).rules("add", { required : true});
				//}
			}
		}
    }
    $("#ctp_templateId").live('change', function(){
    	setTemplateFieldHTML(this.value);
    });
    
    // 标签选择
    TRIG.CMS.selectTag('itemtagids', true);
    // 题头图选择
    TRIG.CMS.selectResource('ci_resourceId', 'IMG_FILE', false);
    
    // 模板字段多选数据排序更改
    $("#itemSelectSortBtn").bind('click', function(){
    	if(sortData) {
    		var resetSortData = [];
    		$(".sortDataItem").each(function(){
    			var i = parseInt($(this).attr('data-id'));
    			resetSortData.push(sortData[i]);
    		});
    		$("#" + sortDataField).select2('data', resetSortData);
    	}
    	$("#itemSelectSortModal").modal('hide');
    });
    function sortSelectData(fieldname) {
    	$("#itemSelectSortListOL").html('');
    	var data = $("#" + fieldname).select2('data');
		sortData = data;
		sortDataField = fieldname;
		for(var i=0;i<data.length;i++) {
			var html = '<li class="dd-item dd3-item sortDataItem" id="itemSelectSort_li_'+i+'" data-id="'+i+'">';
			html += '<div class="dd-handle dd3-handle"></div><div class="dd3-content" >'
			html += data[i].text + (data[i].filePath ? "["+data[i].filePath+"]" : "");
			html += ' </div></li>';
			$("#itemSelectSortListOL").append(html);
		}
		$('#nestable_itemSelectSortList').nestable();
		$('#itemSelectSortModal').modal('show');
    }
    
    // 修改加载表单数据
    function showUpdate() {
    	var ids = ttable.getCheckbox();
		var rows = ids.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			// 初始到第一个tab，基本信息
			$("#item_tab1").click();
			TRIG.ClearError();
			
			TRIG.showPrveNext();
			var id = ids.get(0).value;
			var data = tablerows[id];
			
			// 初始表单数据
			TRIG.forminit($("#itemEditform"), data);
			// 模板不能修改
			$('#ctp_templateId').attr('disabled', true);
			// 题头图
			TRIG.CMS.selectResourceData('ci_resourceId', data.ci_resourceId, false);
			
			// 内容标签 
			TRIG.CMS.selectItemTagData('itemtagids', id);
			
			/* 自定义字段显示 */
			setTemplateFieldHTML(data.ctp_templateId, data.ci_itemContent);
			$("#itemEditModal").modal('show');
			
			// 需在浮层打开之后
			itemEditor.setValue(data.ci_itemPageContent);
		}
    }
    
    // --------------资源选择
    var resouce_selectid = '';
    var resouce_selectid_val = '';
    var resouce_selecttype = '';
    var resouce_selectmultiple = false;
    var resouce_siteid = '';
    $("#select_resource_tree").jstree({
        "core" : {
            "themes" : {
                "responsive": false
            }, 
            // so that create works
            "check_callback" : true,
            'data' : {
            	'dataType' : "json",  
                'url' : function (node) {
                  return 'cms/resource_select_fileTree.json';
                },
                'data' : function (node) {
                	var _type = resouce_selecttype;
                	//resouce_siteid = siteid;
                	// 判断是否是站点，确定下级数据
                	if(node.id!='#') {
                		resouce_siteid = $("#" +node.id+"_anchor").attr('siteid');
                		$("#cr_siteId").val(resouce_siteid);
                		var t = $("#" +node.id+"_anchor").attr('type');
                		if(t=='website') _type = t;
                	}
                	return { 'managerSiteid': siteid, 'siteid': resouce_siteid, 'id' : node.id=='#'?'':node.id, 'sid' : resouce_selectid_val, 'type' :   resouce_selecttype, 'rtype' : _type}; 
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
    
    
    
    function selectResourec(textid, type, multiple) {
    	resouce_selectid = textid;
    	resouce_selectid_val = $("#" + textid).val();
    	resouce_selecttype = type;
    	resouce_selectmultiple = multiple;
    	$('#select_resource_tree').jstree('refresh');   
    	if(type) $("#cr_fileType").val(type);
    	$("#itemSourceModal").modal('show');
    }
    
    function setResource(ids, nameid, multiple) {
		if(ids && ids!="null") {
			TRIG.CMS.selectResourceData(nameid, ids, multiple);
		} else {
			TRIG.CMS.clearSelect(nameid);
		}
	}
    
    $("#itemSourceSelect").bind('click', function() {
    	var sids = '';
    	var snames = '';
    	var nodes = $("#select_resource_tree").jstree('get_selected', true);    
    	var kk = 0;
    	$.each(nodes, function(i,n){
    		var stype = $("#" +n.id+"_anchor").attr('type');
    		if(stype && stype!='DIR' && stype!='website') {
    			if(kk>0){
        			sids += ",";
        			snames += ",";
        		}
        		sids += n.id;
        		var path = $("#" +n.id+"_anchor").attr('path');
        		snames += n.text + "[" + path + "]";
        		kk++;
        		if(!resouce_selectmultiple) {
        			return false;
        		}
    		}
    	}); 
    	TRIG.CMS.selectResourceData(resouce_selectid, sids, resouce_selectmultiple);
    	$("#itemSourceModal").modal('hide');
    });
    
    function setSourceFilename(filename, sourcefilename) {
    	var obj = $("#cr_fileName");
		if(obj.val() == "") {
			obj.val(sourcefilename);
		}
    }
    
    var rpid = '';
    var upsiteid = siteid;
    $("#resourceUploadBtn").bind('click', function() {
    	var pdir2 = '';
    	var ft = $("#cr_fileType").val();
		var nodes = $("#select_resource_tree").jstree('get_selected', true);    
		if(nodes && nodes.length==0) {
			TRIG.messager.alert('请选择一个上传文件夹');
			return false;
		} 
		
    	$.each(nodes, function(i,n){
    		var stype = $("#" +n.id+"_anchor").attr('type');
    		if(stype =='DIR' || stype == 'website') {
    			pdir2 = $("#" +n.id+"_anchor").attr('path');
    			if(stype == 'website') {
    				rpid = '3';
    			} else {
    				rpid = n.id;
    			}
    			upsiteid = $("#" +n.id+"_anchor").attr('siteid');
    			$("#cr_parentResourceId").val(rpid);
        		return false;
    		}
    	}); 
    	
    	if(!pdir2) {
    		TRIG.messager.alert('请选择上传文件夹');
			return false;
    	}
    	pdir2 += "/";
    	
		if(ft=="FILE") {
			TRIG.UPLOAD.open('cr_filePath', TRIG.FILETYPE_FILE, pdir2, setSourceFilename, true, null, false);	
		} else if(ft=="IMG_FILE") {
			TRIG.UPLOAD.open('cr_filePath', TRIG.FILETYPE_IMG, pdir2, setSourceFilename, true, TRIG.CMS.getWebsite(siteid).cw_imgWatermark ? TRIG.CMS.getWebsite(siteid).cw_imgWatermark : '', false);
		} else if(ft=="VIDEO_FILE") {
			TRIG.UPLOAD.open('cr_filePath', TRIG.FILETYPE_VIDEO, pdir2, setSourceFilename, true, null, false);
		}
	});
    
    $("#cr_siteId").val(upsiteid); // 当前上传选择站点
    
    TRIG.FormValidate("cms_resource", "resourceUploadForm",  function (form) {
		var _url = 'cms/resource_add.json';
		
		TRIG.trackPost(TRIG.getContentUrl(_url, rpid), $(form).serialize(), function(data){
				$("#cr_filePath").val('');
				$("#cr_fileName").val('');
				// 单选上传保存时直接确认选择
				if(resouce_selectmultiple == false) {
					TRIG.CMS.selectResourceData(resouce_selectid, data.data.cr_resourceId, resouce_selectmultiple);
			    	$("#itemSourceModal").modal('hide');
				} 
				// 刷新并选中
				if(resouce_selectid_val && resouce_selectid_val.length > 0) {
					resouce_selectid_val = resouce_selectid_val + "," + data.data.cr_resourceId;
				} else {
					resouce_selectid_val = data.data.cr_resourceId;
				}
				if(rpid == '3') { // 刷新站点根目录 
					$('#select_resource_tree').jstree('refresh_node', {id: upsiteid}); 
				} else {
					$('#select_resource_tree').jstree('refresh_node', {id: rpid}); 
				}
				
		});
		return false;
    });
    
    $('#select_resource_tree').on('select_node.jstree', function(e,data) { 
    	var stype = $("#" +data.node.id+"_anchor").attr('type');
    	if(stype == "IMG_FILE")
    		$("#v_image_file").html(data.node.text + '：<img src="'+TRIG.PATH + $("#" +data.node.id+"_anchor").attr('path') +'"  style="max-height:300px"/>');
    	else if(stype == "website") 
    		$("#v_image_file").html('站点： ' + data.node.text );
    	else
    		$("#v_image_file").html(data.node.text + '： ' + $("#" +data.node.id+"_anchor").attr('path') );
    	
    	upsiteid = $("#" +data.node.id+"_anchor").attr('siteid');
    	
    	$("#cr_siteId").val(upsiteid);
	});
    
    // -----------------资源选择end
    
    // 打开修改编辑浮层
    $("#updateCmsItem").bind('click', function(){
    	showUpdate();
    });
    
    // 是否点击保存&关闭
    var saveclose = false;
    var isupdate = false;
    // 添加/编辑->保存
	TRIG.FormValidate("cms_item", "itemEditform", function(form) {
		if ($("#ctp_templateId").val() == '') {
			TRIG.messager.alert('请选择内容模板');
			return false;
		}
		var _url = cmsItem.url.add;
		var isadd = true;
		if ($("#ci_itemId").val() != '') {
			_url = cmsItem.url.update;
			isadd = false;
			var itemdata = tablerows[$("#ci_itemId").val()];
			if(itemdata.ci_isQuote == 'Y') {
				TRIG.messager.alert('引用内容不可编辑保存，请返回引用原始内容编辑。');
				return false;
			}
		}
		isupdate = true;
		itemEditor.updateValue()
		TRIG.trackPost(TRIG.getContentUrl(_url, pid), $(form).serialize(),
				function(data) {
					if (isadd == true) {
						addItemInit();
					}
					if (saveclose) {
						$("#itemEditModal").modal('hide');
					}
					refreshtree();
					TRIG.updateSuccessAlert();
				});
		return false;
	}, null, '');
	
	$(".trigsaveclose").bind('click', function() {
		saveclose = true;
	}); 
    // 关闭编辑浮层刷新列表
    $("#itemEditModal").on('hidden', function(){
    	if(isupdate) {
    		ttable.reload();
    	}
    	isupdate = false;
    	saveclose = false;
    });
    
    // 复制
    $(".copyCmsItem").bind('click', function(){
    	var objs = ttable.getCheckbox();
    	var rows = objs.size();
		if(rows>0) {
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			cmsItem.copyids = ids;
			cmsItem.copytype = 'copy';
			cmsItem.copydirid = pid;
			ttable.reload();
		} else {
			TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE);
		}
    });
    
    // 剪切
    $(".cutCmsItem").bind('click', function(){
    	var objs = ttable.getCheckbox();
    	var rows = objs.size();
		if(rows>0) {
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			cmsItem.copyids = ids;
			cmsItem.copytype = 'cut';
			cmsItem.copydirid = pid;
			ttable.reload();
		} else {
			TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE);
		}
    });
    
    // 粘贴
    $(".pasteCmsItem").bind('click', function(){
    	if(cmsItem.copyids == ""){
			TRIG.messager.alert("没有粘贴的内容");
			return false;
		}
		TRIG.progress();
		$.post(TRIG.getContentUrl(cmsItem.url.copy, pid),"ids=" + cmsItem.copyids + "&id=" + pid
				+ "&copytype=" + cmsItem.copytype + "&siteId=" + siteid, function(data){
			data = TRIG.successHandle(data);
			if(data.success==true) {
				cmsItem.copyids = "";
				ttable.reload();
				refreshtree();
				$('#item_tree').jstree('refresh_node', {id: cmsItem.copydirid}); 
			}
			TRIG.progressClose();
		});
    });
    
    // 删除
    $("#deleteCmsItem").bind('click', function(){
    	var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelRecycleBinSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.del, pid), "ids=" + ids, function(data){
				ttable.reload();
				refreshtree();
			});
		});
    });
    
    // 重置排序
    $(".moveCmsItem").bind('click', function(){
    	TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.sorts, pid),"id=" + pid, function(data){
				refreshtree();
				ttable.reload(); 
		});
    });
    
    // 移动
    TRIG.move({
    	url: cmsItem.url.move,
    	ttable:ttable,
    	sort:movesortno,
    	obj:{
    		table: table,
    		up:$(".itemUp"),
    		down:$(".itemDown"),
    		top:$(".itemTop"),
    		bottom:$(".itemBottom")
    	}
    }, function(){
    	refreshtree();
    }, function(){
    	return pid;
    });
    
    var updatesort = "";
    // 修改排序值
    $(".itemSort").bind('click', function(){
    	var ids = ttable.getCheckbox();  
		var rows = ids.size();
    	if(TRIG.isSelectOne(rows)) {
    		var rowData =  tablerows[ids.val()];
    		updatesort = rowData.ci_sortNo;
    		TRIG.forminit($("#itemSortEditform"), rowData);
    		$("#itemSortModal").modal('show');
    	}
    });
    
    TRIG.Validate("itemSortEditform",  function (form) {
    	/*if(updatesort == $("#updatesort").val()) {
    		return false;
    	}*/
			TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.updateSort, pid), $(form).serialize(), function(data){
				ttable.reload();
				$("#itemSortModal").modal('hide');  
				refreshtree();
				TRIG.updateSuccessAlert(); 
			});
			return false;
	}, {
		ci_sortNo : { 
    		required : true,
    		integer : true
    	}
	});
    
    // 工作流
    TRIG.CMS.setStatusSelect('cwf_workflow'); // 工作流状态
    
    $(".form_datetime").datetimepicker({
        autoclose: true,
        todayBtn: true,
        isRTL: Metronic.isRTL(),
        format: "yyyy-mm-dd hh:ii", 
        pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
    });
    
    $(".addCmsWorkflow").bind('click', function(){
    	var ids = ttable.getCheckbox();
		var rows = ids.size();
		if(TRIG.isSelectOne(rows)) {
			var id = ids.val();
			var rowData = tablerows[id];
			if(TRIG.CMS.isWorkStatus( rowData.ci_status)){
		   		TRIG.messager.alert("工作状态中");
		   		return false;
		   	}
			$("#cwf_itemId").val(id);
			$("#ci_itemName1").val(rowData.ci_itemName);
			$("#cmsWorkflowModal").modal('show');  
		}
    });
    
   $("#cmsWorkflowSave").bind('click', function(){
	   	var cwf_timingTime = $("#cwf_timingTime").val();
	   	if(cwf_timingTime!='') {
	   		if(cwf_timingTime.length<18) {
	   			cwf_timingTime = cwf_timingTime + ':00';
	   		} 
	   		$("#cwf_timingTime").val(cwf_timingTime); 
	   		if(TRIG.dateCompare(new Date(), new Date(Date.parse(cwf_timingTime.replace(/-/g,   "/"))))){
	   			TRIG.messager.alert("定时工作时间必须大于当前时间"); 
		   		return false;
		   	}
	   	}
	   
	   	TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.addWorkflow, pid), $("#cmsWorkflowform").serialize(), function(data){
	   		$("#cmsWorkflowModal").modal('hide');  
	   		ttable.reload();
	   		TRIG.updateSuccessAlert();
	   	});
   });
   
   // 预览 
   $(".cmsView").bind('click', function(){
	   var ids = ttable.getCheckbox();
		var rows = ids.size();
		if(TRIG.isSelectOne(rows)) {
			var id = ids.val();
			var rowData = tablerows[id];
			if(rowData.ci_isQuote == 'Y') {
				TRIG.messager.alert('引用内容不可预览，请返回引用原始内容预览。');
				return false;
			}
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
    	
    $(".LockedNo").bind('click', function(){
    	var ids = ttable.getCheckbox();
		var rows = ids.size();
		if(TRIG.isSelectOne(rows)) {
			var id = ids.val();
			TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.addLock, pid),'id=' + id,function(data){
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
			TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.delLock, pid),'id=' + id,function(data){
					TRIG.updateSuccessAlert();
					ttable.reload();
			});
		}
    });
    
    $(".addPublishCmsItem").bind('click', function(){
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
			TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.addPublish, pid), "ids=" + ids, function(data){
				ttable.reload();
				TRIG.messager.alert('发布成功'); 
			});
		}
	});
    
    $(".delPublishCmsItem").bind('click', function(){
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
			TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.delPublish, pid), "ids=" + ids, function(data){
				ttable.reload();
				TRIG.messager.alert('撤消成功'); 
			});
		}
	});
    
    // 生成HTML
    $(".addCmsItemGenerate").bind('click', function(){
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
			TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.addGenerate, pid), "ids=" + ids, function(data){
				ttable.reload();
				TRIG.messager.alert('生成HTML任务提交成功'); 
			});
		}
    });
    
    $(".addCmsItemGenerateList").bind('click', function(){
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
			TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.addGenerateList, pid), "ids=" + ids, function(data){
				ttable.reload();
				TRIG.messager.alert('生成所有子内容HTML任务提交成功'); 
			});
		}
    });
    
    //--------------- 字段编辑 start
    // Link
    var link_fieldid = '';
    TRIG.Validate('itemLinkform', function(form){
    	$.post('cms/item_genJson.json', $(form).serialize(), function(data){
    		$("#" + link_fieldid).val(data);
    		$("#link_" + link_fieldid).val(viewTempLink(data));
    		$("#itemLinkModal").modal('hide');
    	});
    	return false;
    }, {
    	/*link : {
    		required : true
    	}*/
    });
    TRIG.CMS.selectItem('link_item', false);
    TRIG.CMS.selectResource('link_resource', 'FILE', false);
    
    $("#linktype").bind('change', function() {
    	initLinkType(this.value);
    });
    
    function initLinkType(value) {
    	$(".link_type_div").hide();
    	$("#link_"+value+"_div").show();
    }
    
    $("#btn_resourcelink").bind('click', function(){
    	selectResourec('link_resource', 'FILE', false);
    });
    $("#btn_resourcelink_fv").bind('click', function(){
    	viewFiles('link_resource');
    });
    
    function openLinkEdit(id) {
    	link_fieldid = id ;
    	var value = $("#" + id).val();
    	if(value) value = $.parseJSON(value);
    	else value = { type : 'external'};
    	TRIG.forminit($("#itemLinkform"), value);
		initLinkType(value.type);
		TRIG.CMS.selectItemData('link_item', value.item, false);
    	TRIG.CMS.selectResourceData('link_resource', value.resource, false);
    	$("#itemLinkModal").modal('show');
    };
    
    // 用户字段
    var user_fieldid =  '';
    var user_fieldType =  '';
    var category = '0'; // 0 单表单 1 多表单
    var user_field_i = 0; // 当前编辑位置
    var user_field_count = 0; // 列表数
    var user_field_delcount = 0; // 删除数
    var user_field_add = true; // 是否新增
    var content = undefined;
    TRIG.Validate('userFieldform', function(form){
    	$.post('cms/item_genJson.json', $(form).serialize(), function(data){
    		if(category == '0') {
    			$("#" + user_fieldid).val(data);
    			$("#userField_" + user_fieldid).val(viewTempUserFieldForm(fieldTypeId, $.parseJSON(data)));
    		} else {
    			if(user_field_add == false) {
    				content[user_field_i] = $.parseJSON(data);
    				$("#userField_"+user_field_i).text(viewTempUserFieldForm(fieldTypeId, content[user_field_i]));
    			}
    			else {
    				var html = '<li class="dd-item dd3-item fieldEditItem" id="userField_li_'+user_field_count+'" data-id="'+user_field_count+'">';
	    			html += '<div class="dd-handle dd3-handle"></div><div class="dd3-content" ><span id="userField_'+user_field_count+'">'
	    		    html += viewTempUserFieldForm(fieldTypeId, $.parseJSON(data));
	    			html += ' </span><a class="fieldEdit" data-id="'+user_field_count+'">编辑</a> <a class="fieldDel" data-id="'+user_field_count+'">删除</a></div></li>';
	    			$("#fieldListOL").append(html);
	    			
        			$("#userField_li_" + user_field_count).find(".fieldEdit").bind('click', function(){
        				user_field_add = false;
        				var i = parseInt($(this).attr('data-id'));
        				user_field_i = i;
    	    			showForm(content[i]);
    	    		});
        			
        			$("#userField_li_" + user_field_count).find(".fieldDel").bind('click', function(){
    	    			var i = parseInt($(this).attr('data-id'));
    	    			$("#userField_li_" + i).remove();
    	    			content[i] = null;
    	    			user_field_i = i;
    	    			user_field_delcount += 1;
    	    		});
    	    		content[user_field_count] = $.parseJSON(data);
    	    		user_field_count += 1;
        		}
    		} 
    		$("#userFieldModal").modal('hide');
    	});
    	return false;
    }, {
    	
    });
    // 列表编辑保存
    $("#userFieldBtn").bind('click', function(){
    	var ddd = '[';
		 var k = 0;
		 $(".fieldEditItem").each(function(){
			 var i = parseInt($(this).attr('data-id')); 
			 if(content[i]) {
				 $.ajax({async:false, url:'cms/item_genJson.json', data:content[i], success:function(data){
						 if(k!=0) ddd += ",";
						 ddd += data;
						 k += 1;
				 	}
				 });
			 }
		 });
		 ddd += ']';
		 $("#" + user_fieldid).val(ddd);
		 $("#userField_" + user_fieldid).val(viewTempUserField(user_fieldType, ddd));
		 $("#userFieldListModal").modal('hide');
    });
    // 保存&继续
    $("#userFieldSaveBtn").bind('click', function(){
    	
    	return false;
    });
    
    var fieldTypeId = '';
    function showForm(content) {
    	if(user_field_add) {
    		$(".userField-prev").hide();
    		$(".userField-next").hide();
    	} else {
    		$(".userField-prev").show();
    		$(".userField-next").show();
    	}
		$("#userFieldformDiv").html('');
    	// 字段选项
    	$.getJSON('cms/template_fieldType_findItemList.json', 'id=' + fieldTypeId, function(data) {
    		for(var i=0;i<data.length;i++) {
    			var html = '';
    			var _v = eval('v=content.'+data[i].ctfti_itemDef);
    			var value='';
    			if(_v) {
    				value = _v;
    			}
    			var input = '<input type="text" name="'+ data[i].ctfti_itemDef +'" id="'+ data[i].ctfti_itemDef +'" value="'+ value +'" class="form-control" />';
    			var type = data[i].ctfti_itemType;
    			if(type == 'bigtext' ) {
    				input = '<textarea rows="6" name="'+ data[i].ctfti_itemDef +'" id="'+ data[i].ctfti_itemDef +'" class="form-control">'+ value +'</textarea>';
    			} else if(type == 'htmltext'){
    				input = '<textarea rows="10" name="'+ data[i].ctfti_itemDef +'" id="'+ data[i].ctfti_itemDef +'" class="form-control">'+ value +'</textarea>';
    			} else if(type == 'date') {
    				input = '<div class="input-group date form_datetime" id="date-picker-'+data[i].ctfti_itemDef+'" data-date-format="yyyy-mm-dd" >' + input;
    				input += '<span class="input-group-btn">'
    					 + '<button class="btn default date-reset" type="button"  onclick="$(\'#'+data[i].ctfti_itemDef+'\').val(\'\');"><i class="fa fa-times"></i></button>'
    					 + '</span>';
    				input += '<span class="input-group-btn">' 
    						  + '<button class="btn default" type="button"><i class="fa fa-calendar"></i></button>'
    						  + '</span>';
    				input += '</div>';
    			} else if(type == 'datetime') {
    				input = '<div class="input-group date form_datetime" id="date-picker-'+data[i].ctfti_itemDef+'" >' + input;
    				input += '<span class="input-group-btn">'
    						 + '<button class="btn default date-reset" type="button"><i class="fa fa-times"></i></button>'
    						 + '</span>';
    				input += '<span class="input-group-btn">' 
    						  + '<button class="btn default date-set" type="button"><i class="fa fa-calendar"></i></button>'
    						  + '</span>';
    				input += '</div>';
    			} else if(type == 'imgfile' || type == 'imgfiles' || type == 'docfile' || type == 'docfiles' || type == 'file' || type == 'files' || type == 'videofile' || type == 'videofiles' ) {
    				input = '<div class="input-group">' + '<input type="text" name="'+ data[i].ctfti_itemDef +'" id="'+ data[i].ctfti_itemDef +'"  class="form-control" />';
    				input += '<span class="input-group-btn">' 
    					  + '<button class="btn default" id="btn_'+data[i].ctfti_itemDef+'" data-i="'+i+'" type="button"><i class="fa fa-search"></i></button>';
    					 if(type == 'imgfiles' || type == 'docfiles'  || type == 'files'  || type == 'videofiles' ) {
    						 input +=  '<button class="btn default" type="button" data-i="'+i+'" id="btn_sort_'+data[i].ctfti_itemDef+'"><i class="fa fa-edit"></i></button>';
    					 }
    					  input += '<button class="btn default" type="button" data-i="'+i+'" id="btn_view_'+data[i].ctfti_itemDef+'"><i class="fa fa-file-o"></i></button>'
    					  + '</span>';
    				input += '</div>';
    			} else if(type=='link') {
    				input = '<div class="input-group">' ;
    				input += '<input type="hidden" id="'+ data[i].ctfti_itemDef +'" name="'+ data[i].ctfti_itemDef +'" value=\''+ value +'\' class="form-control" readonly="readonly"/>';
    				input += '<input type="text" id="link_'+ data[i].ctfti_itemDef +'" value=\''+ viewTempLink(value) +'\' class="form-control" readonly="readonly"/>';
    				input += '<span class="input-group-btn">'
    					 + '<button class="btn default date-reset" type="button"  onclick="$(\'#'+data[i].ctfti_itemDef+'\').val(\'\');$(\'#link_'+data[i].ctfti_itemDef+'\').val(\'\');"><i class="fa fa-times"></i></button>'
    					 + '</span>';
    				input += '<span class="input-group-btn">' 
    					  + '<button class="btn default" id="btn_'+data[i].ctfti_itemDef+'" data-i="'+i+'" type="button"><i class="fa fa-edit"></i></button>'
    					  + '</span>';
    				input += '</div>';
    			} else if(type == 'contents'){
    				input = '<div class="input-group">' + '<input type="text" name="'+ data[i].ctfti_itemDef +'" id="'+ data[i].ctfti_itemDef +'"  class="form-control" />';
    				input += '<span class="input-group-btn">' 
    					 input +=  '<button class="btn default" type="button" data-i="'+i+'" id="btn_sort_'+data[i].ctfti_itemDef+'"><i class="fa fa-edit"></i></button>'
    					  + '</span>';
    				input += '</div>';
    			}
    			html += '<div class="form-group"><label class="col-md-2 control-label">'+ data[i].ctfti_itemName +'</label><div class="col-md-8" id="user_input_'+data[i].ctfti_itemType+'">'+ input +'</div></div>';
    			
    			$("#userFieldformDiv").append(html);
    			// 验证规则
    			if(type == 'number') {
    				$("#" + data[i].ctfti_itemDef).rules("add", { number : true});
    			} else if(type == 'date'){
    				$('#date-picker-' + data[i].ctfti_itemDef).datepicker({
    	                rtl: Metronic.isRTL(),
    	                orientation: "left",
    	                autoclose: true
    	            });
    				$("#" + data[i].ctfti_itemDef).attr('readonly', true);
    			} else if(type == 'datetime') {
    				$('#date-picker-' + data[i].ctfti_itemDef).datetimepicker({
    			        autoclose: true,
    			        todayBtn: true,
    			        isRTL: Metronic.isRTL(),
    			        format: "yyyy-mm-dd hh:ii", 
    			        pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
    			    });
    				$("#" + data[i].ctfti_itemDef).attr('readonly', true);
    			} else if(type == 'imgfile' || type == 'imgfiles' || type == 'docfile' || type == 'docfiles' || type == 'file' || type == 'files' || type == 'videofile' || type == 'videofiles') {
    				$('#btn_' + data[i].ctfti_itemDef).bind('click', function(){
    					var i = parseInt($(this).attr('data-i')); 
    					var type = data[i].ctfti_itemType;
    					var rtype = '';
    					var multiple = false;
    					if(type == 'imgfile' || type == 'imgfiles') {
    						rtype = 'IMG_FILE';
    					} else if(type == 'docfile' || type == 'docfiles') { 
    						rtype = 'FILE';
    					} else if(type == 'videofile' || type == 'videofiles') {
    						rtype = 'VIDEO_FILE';
    					}
    					if(type == 'imgfiles' || type == 'docfiles' || type == 'videofiles' || type == 'files') {
    						multiple = true;
    					}
    					var dname = data[i].ctfti_itemDef;
    					selectResourec(dname, rtype, multiple);
    				});
    				
    				$('#btn_view_' + data[i].ctfti_itemDef).bind('click', function() {
    					var i = parseInt($(this).attr('data-i')); 
    					var dname = data[i].ctfti_itemDef;
    			    	viewFiles(dname);
    			    });
    				
    				var type = data[i].ctfti_itemType;
    				var rtype = 'FILE';
    				var multiple = false;
    				if(type == 'imgfile' || type == 'imgfiles') {
    					rtype = 'IMG_FILE';
    				} else if(type == 'docfile' || type == 'docfiles') { 
    					rtype = 'FILE';
    				} else if(type == 'videofile' || type == 'videofiles') {
    					rtype = 'VIDEO_FILE';
    				}
    				if(type == 'imgfiles' || type == 'docfiles' || type == 'videofiles' || type == 'files') {
    					multiple = true;
    				}
    				
    				TRIG.CMS.selectResource(data[i].ctfti_itemDef, rtype, multiple);
    				setResource(value, data[i].ctfti_itemDef, multiple);
    				if(multiple) {
    					$('#btn_sort_' + data[i].ctfti_itemDef).bind('click', function(){
        					var i = parseInt($(this).attr('data-i')); 
        					sortSelectData(data[i].ctfti_itemDef);
        				});
    				}
    			} else if(type == 'htmltext') {
    				CKEDITOR.replace(data[i].ctfti_itemDef, { on: {
    						change: function(evt){
    							$("#" + evt.editor.name).val(evt.editor.getData());
    						}
    					}
    				});
    			} else if(type == 'content') {
    				TRIG.CMS.selectItem(data[i].ctfti_itemDef, false);
    				TRIG.CMS.selectItemData(data[i].ctfti_itemDef, value, false);
    			} else if(type == 'contents') {
    				TRIG.CMS.selectItem(data[i].ctfti_itemDef, true);
    				TRIG.CMS.selectItemData(data[i].ctfti_itemDef, value, true);
    				$('#btn_sort_' + data[i].ctfti_itemDef).bind('click', function(){
    					var i = parseInt($(this).attr('data-i')); 
    					sortSelectData(data[i].ctfti_itemDef);
    				});
    			} else if(type=='link') {
    				$("#btn_" + data[i].ctfti_itemDef).bind('click', function(){
    					var i = parseInt($(this).attr('data-i')); 
    					var dname = data[i].ctfti_itemDef;
    					openLinkEdit(dname);
    				});
    			} 
    		}
    		
        	$("#userFieldModal").modal('show');
    	});
	}
    
    function openUserFieldEdit(def, type) {
    	user_fieldType = type;
    	user_fieldid = def;
    	var title = '';
    	for(var i=0;i<userTemplateFields.length;i++) {
    		if(userTemplateFields[i].ctft_typeDef == type) {
    			fieldTypeId = userTemplateFields[i].ctft_fieldTypeId;
    			title = userTemplateFields[i].ctft_typeName;
    			category = userTemplateFields[i].ctft_category;
    			break;
    		}
    	}
    	content = $("#" + def).val();
    	if(content) content = $.parseJSON(content);
    	else {
    		if(category == '0') content = {};
    		else content = [];
    	}
    	$("#userFieldModalTitle").text(title);
    	$("#userFieldListModalTitle").text(title);
    	if(category == '0'){ // 单表单
    		showForm(content);
    	} else { // 多表单
    		user_field_count = content.length;
    		//$.getJSON('cms/template_fieldType_findItemList.json', 'id=' + fieldTypeId, function(data) {
    			$("#fieldListOL").html('');
	    		for(var i=0;i<content.length;i++) {
	    			var html = '<li class="dd-item dd3-item fieldEditItem" id="userField_li_'+i+'" data-id="'+i+'">';
	    			html += '<div class="dd-handle dd3-handle"></div><div class="dd3-content" ><span id="userField_'+i+'">'
	    			html += viewTempUserFieldForm(fieldTypeId, content[i])
	    			html += ' </span><a class="fieldEdit" data-id="'+i+'">编辑</a> <a class="fieldDel" data-id="'+i+'">删除</a></div></li>';
	    			$("#fieldListOL").append(html);
	    			
	    			$('#nestable_userFieldList').nestable();
	    		}
	    		$(".fieldEdit").bind('click', function(){
	    			user_field_add = false;
    				var i = parseInt($(this).attr('data-id'));
    				user_field_i = i;
	    			showForm(content[i]);
	    		});
	    		$(".fieldDel").bind('click', function(){
	    			var i = parseInt($(this).attr('data-id'));
	    			user_field_i = i;
	    			user_field_delcount += 1;
	    			content[user_field_i] = null;
	    			$("#userField_li_" + i).remove();
	    		});
	    		
	    		$("#userFieldListModal").modal('show');
    		//});
    	}
    }
    
	$("#addUserFieldList").bind('click', function(){
		user_field_add = true;
		showForm({});
    });
	
	$(".userField-prev").bind('click', function(){
		var obj = $("#userField_li_"+(user_field_i));
		var prev = obj.prev();
		if(prev.size()==0) {
			TRIG.messager.alert('已是第一个了'); 
		}
		else {
			var i = parseInt(prev.attr('data-id'));
			user_field_i = i;
			showForm(content[i]);
		}
	});
	$(".userField-next").bind('click', function(){
		var obj = $("#userField_li_"+(user_field_i));
		var next = obj.next();
		if(next.size()==0) {
			TRIG.messager.alert('已是最后一个了'); 
		}
		else {
			var i = parseInt(next.attr('data-id'));
			user_field_i = i;
			showForm(content[i]);
		}
	});
    
    //--------------- 字段编辑 end
    
    $("#updateAddRolePrivlegeDef").bind('click', function(){
    	TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.updateContentManager, pid), 'id='+siteid, function(data){
    		TRIG.updateSuccessAlert(); 
		});
    });
    
    $(".delColumnPublishCmsItem").bind('click', function(){
    	var obj = ttable.getCheckbox();
		var rows = obj.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			TRIG.messager.confirm("提示","确认对栏目[" + tablerows[obj.get(0).value].ci_itemName + "]撤消？",function(r){
				//是否执行	
				if(r) {
					TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.delColumnPublish, pid), "id=" + obj.get(0).value, function(data){
						ttable.reload();
						TRIG.messager.alert('撤消成功'); 
					});
				}
			});
		}
	});
    
    $(".delWebsitePublishCmsItem").bind('click', function(){
			TRIG.messager.confirm("提示","确认对当前站点撤消？",function(r){
				//是否执行	
				if(r) {
					TRIG.trackPost(cmsItem.url.delWebsitePublish, "id=" + siteid, function(data){
						ttable.reload();
						TRIG.messager.alert('撤消成功'); 
					});
				}
			});
	});
    
    $(".addColumnPublishCmsItem").bind('click', function(){
    	var obj = ttable.getCheckbox();
		var rows = obj.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			TRIG.messager.confirm('提示', "确认对栏目[" + tablerows[obj.get(0).value].ci_itemName + "]发布？", function(r){
				//是否执行	
				if(r) {
					TRIG.trackPost(TRIG.getContentUrl(cmsItem.url.addColumnPublish, pid), "id=" + obj.get(0).value, function(data){
						ttable.reload();
						TRIG.messager.alert('发布成功'); 
					});
				}
			});
		}
	});
    
    $(".addWebsitePublishCmsItem").bind('click', function() {
			TRIG.messager.confirm("提示","确认对当前站点发布？",function(r){
				//是否执行	
				if(r) {
					TRIG.trackPost(cmsItem.url.addWebsitePublish, "id=" + siteid, function(data){
						ttable.reload();
						TRIG.messager.alert('发布成功'); 
					});
				}
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
    
    
    //工作流记录
    $(".workflowCmsItem").bind('click', function(){
    	var ids = ttable.getCheckbox();  
		var rows = ids.size();
		if(TRIG.isSelectOne(rows)) {
    		var id = ids.get(0).value;
    		workflow.openWorkflow(id, tablerows); 
    		
		}
    });
    
    var workflow = function() {
    	var url = {
    		find : 'cms/item_findWorkflowCountPageList.json'
    	};
    	
    	var tablerows = []; 
        var table = $('#trig-itemWorkflow-table');
        var ttable = undefined;
        var ttableRows = [];
        
        var _openWorkflow = function(id, rows) {
        	ttableRows = rows;
        	if(ttable == undefined) {
        		ttable = new TRIG.Datatable({
        				table : table, 
        				url : url.find,  
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
		        			cwf_itemId : id
		    			}
		        				
        		});
        		// 显示更多字段值
        		ttable.initMore(function(id) {
        			 var rowData = tablerows[id];
        			 var sOut = '<div class="col-md-12"><table style="width:100%">';   
        			 	sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
        	       	 	sOut += '<tr><td><div class="trig-more-content">ITEM ID：</div></td><td>' + rowData.cwf_itemId + '</td></tr>';
        	       	 	sOut += '<tr><td><div class="trig-more-content">描述：</div></td><td>' + rowData.cwf_description + '</td></tr>';
        	       	 sOut += '<tr><td><div class="trig-more-content">审核描述：</div></td><td>' + rowData.cwf_confirmDescription + '</td></tr>';
        	       		sOut += '<tr class="visible-xs"><td><div class="trig-more-content">创建人：</div></td><td>' + rowData.sysUser_realName + '</td></tr>';
        	       		sOut += '<tr class="visible-xs"><td><div class="trig-more-content">定时时间：</div></td><td>' + rowData.cwf_timingTime + '</td></tr>';
        	            sOut += '<tr class="visible-xs"><td><div class="trig-more-content">创建时间：</div></td><td>' + rowData.cwf_createTime + '</td></tr>';
        	            sOut += '</table>';
        		     return  sOut;
        		});
        	} else {
        		ttable.query({ cwf_itemId : id});
        	}
        	$("#cmsWorkflowCountModal").modal('show'); 
        };
       
    	return {
    		openWorkflow : function(id, rows) {
    			_openWorkflow(id, rows);
    		}
    	}
    }();
    
  
    // 版本浮层
    $(".versionCmsItem").bind('click', function(){
    	var ids = ttable.getCheckbox();  
		var rows = ids.size();
		if(TRIG.isSelectOne(rows)) {
    		var id = ids.get(0).value;
    		vsersion.openVersions(id, tablerows); 
    		
		}
    });
    //版本新增
    $("#addVersionCmsItem").bind('click', function(){
    	vsersion.addOpen();
    });
    
    var vsersion = function() {
    	var url = {
    		add : 'cms/version_add.json',
    		del : 'cms/version_delete.json',
    		find : 'cms/version_findPageList.json'
    	};
    	
    	var tablerows = []; 
        var table = $('#trig-itemVersion-table');
        var ttable = undefined;
        var ttableRows = [];
        
        var _openVersions = function(id, rows) {
        	ttableRows = rows;
        	$("#civ_itemId").val(id);
        	if(ttable == undefined) {
        		ttable = new TRIG.Datatable({
        				table : table, 
        				url : url.find,  
        				columns : [
        				           { "data": null, "render": function(data, type, row, mete){
        	    					   tablerows[row.civ_versionId] = row;
        	    						return '<input type="checkbox" class="checkboxes" value="'+row.civ_versionId+'"/>';   
        	    				   }, orderable: false, className: "trig-checkbox" },
        	    		                 { "data": "civ_versionName", "render":function(data,type,row,mete){
        	    		                	 return '<span class="row-details row-details-close" dataid="'+row.civ_versionId+'"></span> ' + data ;   
        	    		                 }},
        						   { "data": "civ_description" },
        				           { "data": "civ_createTime", className: "hidden-xs" }
        				],
        				order: [[3,'desc']],
        				queryParams: {civ_itemId : id}
        				
        		});
        		// 显示更多字段值
        		ttable.initMore(function(id) {
        			 var rowData = tablerows[id];
        			 var sOut = '<div class="col-md-12"><table style="width:100%">';   
        			 sOut += '<tr><td><div class="trig-more-content">版本ID：</div></td><td>' + rowData.civ_versionId + '</td></tr>';
        		     sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + rowData.civ_itemId + '</td></tr>';
        		     sOut += '<tr><td><div class="trig-more-content">创建人：</div></td><td>' +rowData.civ_createUserId + '</td></tr>';   
        		     sOut += '<tr><td><div class="trig-more-content">版本内容：</div></td><td style="max-width:300px;word-break:break-all">' + rowData.civ_versionContent + '</td></tr>';
         		     sOut += '</table></div>'; 
        		     return  sOut;
        		});
        	} else {
        		ttable.query({ civ_itemId : id});
        	}
        	$("#cmsVersionModal").modal('show'); 
        };
        
        TRIG.Validate("versionEditform",  function (form) {
    		var _url = url.add;
    		var isadd = true;
    		TRIG.trackPost(_url, $(form).serialize(), function(data){
    			//TRIG.formreset($("#versionEditform")); 
    			$("#civ_versionName").val('');
    			$("#civ_description").val('');
    			$("#versionEditModal").modal('hide'); 
    			TRIG.updateSuccessAlert();
    			ttable.reload();
    		});
    		// 必须flase，阻止form submit
    		return false;
    	},{
    		civ_versionName : {
    			required : true
    		}
    		
    	});
        
      //版本删除
       $("#delVersionCmsItem").bind('click', function(){
        	var objs = ttable.getCheckbox();
    		var rows = objs.size();
    		TRIG.isDelRecycleBinSelectOne(rows,function(){
    			var ids = "";
    			objs.each(function(){
    				ids += this.value + ",";
    			});   
    			TRIG.trackPost(url.del, "ids=" + ids, function(data){
    				ttable.reload();
    				
    			});
    		});
        });
       
       //版本比较
       $("#compareVersionCmsItem").bind('click', function(){
        	var objs = ttable.getCheckbox();
    		var rows = objs.size();

    		if(rows == 1) {
    			var rowData = ttableRows[$("#civ_itemId").val()];
    			var rowData2 = tablerows[objs.get(0).value].civ_versionContent;
    			TRIG.LOG.JsonDiff(rowData, eval("d=" + rowData2));
    		}
    		else if(rows == 2){ 
    			var rowData = tablerows[objs.get(0).value].civ_versionContent;
    		    var rowData2 = tablerows[objs.get(1).value].civ_versionContent;
    		
    		    TRIG.LOG.JsonDiff(eval("d=" + rowData), eval("d=" + rowData2));
      		}
    		else if(rows != 1 || rows != 2){
				TRIG.messager.alert('请选择一条或两条记录进行比较！'); 
				return false;
			}
     	});
       
       //版本恢复
       $("#recoverVersionCmsItem").bind('click', function(){
        	var objs = ttable.getCheckbox();
    		var rows = objs.size();

    		if(TRIG.isSelectOne(rows)) {
    			var data = ttableRows[$("#civ_itemId").val()];
    			var data2 = tablerows[objs.get(0).value].civ_versionContent;
    			data =eval("d=" + data2);
    			TRIG.messager.alert('请继续进行编辑保存！');
    			TRIG.forminit($("#itemEditform"), data);
    			$("#itemEditModal").modal('show');
    		}
    	});
        
    	return {
    		openVersions : function(id, rows) {
    			_openVersions(id, rows);
    		},
    		addOpen : function(){
    			$("#versionEditModal").modal('show');
    		}
    	}
    }();
    
    // 文件查看
    function viewFiles(id) {
    	var id = $("#" + id).val();
    	if(id) {
    		window.open('cms/resource_select_view.t?ids=' + id, '_blank');
    	} else {
    		TRIG.messager.alert('请先选择文件！');
    	}
    }
    
    $("#btn_ci_resourceId_fv").bind('click', function() {
    	viewFiles('ci_resourceId');
    	//TRIG.UPLOAD.openView($('#ci_resourceId').val(), TRIG.FILETYPE_IMG);
    });
    
    // 引用 start
    var quote_item_id = ''; // 当前选择内容
    var quoteTable = undefined;
    $("#addquotebtn").bind('click', function(){
    	var ids = ttable.getCheckbox();
		var rows = ids.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			quote_item_id = ids.val();
			if(quoteTable==undefined) { // 初始
				quoteTable = new TRIG.Datatable({
		    		table : $('#trig-quote-column-table'), 
		    		url : 'cms/item_quoteList.json', 
		    		columns : [
									{ "data": null, "render": function(data, type, row, mete){
											return '<input type="checkbox" class="checkboxes" value="'+row.ci_itemId+'"/>';   
									},orderable : false},
		    		                 { "data": "ci_itemId" , orderable : false},
		    		                 { "data": "pname", orderable: false}
		    		],
		    		order: [[2,'asc']], 
		    		queryParams : {
		    			id: quote_item_id,
		    			cid:getPVID()
		    		},
		    		paging:false
				});
			} else {
				quoteTable.query({id: quote_item_id, cid:getPVID()});
			}
			$("#quoteEditModal").modal('show');
		}
    });
    
    $("#quote_column_id").select2({
        minimumInputLength: 0,   
        multiple : false, 
        placeholder : '请选择栏目',
        ajax: {  
            url: "cms/item_select_find.json",
            dataType: 'json',
            data: function (term, page) {
                return {
                	ci_itemName : term,
                	ci_isColumn : 'Y', // 只能引用到栏目
                	ci_siteId : $("#quote_site_id").val(),
                	sort : "ci_sortNo",
                	order: "asc",
                	rows:10 
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
            	var datas = [];
            	for(var i=0;i<data.data.length;i++) {
            		datas.push({id:data.data[i].ci_itemId,text:data.data[i].ci_itemName});
            	}
                return {
                    results: datas 
                };
            }
        }
    });
    
    $("#addQuote").bind('click', function(){
    	var columnid = $("#quote_column_id").val();
    	if(columnid =='') {
    		TRIG.messager.alert('请选择引用栏目！');
    		return false;
    	}
    	TRIG.trackPost(TRIG.getContentUrl("cms/item_addQuote.json", pid), "id="+quote_item_id+"&moveId="+columnid, function(data){
    		$("#quote_column_id").select2('val','');
    		quoteTable.reload();
    	});
    });
    
    $("#deleteQuote").bind('click', function(){
    	var objs = quoteTable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(TRIG.getContentUrl("cms/item_deleteQuote.json", pid), "ids=" + ids, function(data){
				quoteTable.reload();
			});
		});
    });
    // 引用 end 
    
    // 添加引用 start
    $("#addquotebtn2").bind('click', function(){
    	$("#quoteEditModal2").modal('show');
    });
    
    $("#quote2_item_id").select2({
        minimumInputLength: 0,   
        multiple : false, 
        placeholder : '请选择内容',
        ajax: {  
            url: "cms/item_select_find.json",
            dataType: 'json',
            data: function (term, page) {
                return {
                	ci_itemName : term,
                	ci_siteId : $("#quote2_siteId").val(),
                	sort : "ci_sortNo",
                	order: "asc",
                	rows:10 
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
            	var datas = [];
            	for(var i=0;i<data.data.length;i++) {
            		datas.push({id:data.data[i].ci_itemId,text:data.data[i].ci_itemName});
            	}
                return {
                    results: datas 
                };
            }
        }
    });
    
    TRIG.Validate("quoteEditform", function(form){
    	TRIG.trackPost(TRIG.getContentUrl("cms/item_addQuote.json", pid), "id="+ $("#quote2_item_id").val() +"&moveId=" + pid , function(data){
    		if(data.success) {
				TRIG.messager.alert('保存成功！');
				ttable.reload();
		    	$("#quoteEditModal2").modal('hide');
    		}
		});
		return false;
    });
    // 添加引用 end
    
    TRIG.CMS.selectResource('winxin_ci_resourceId', 'IMG_FILE', false);
    $("#addweixinbtn").bind('click', function(){
    	var ids = ttable.getCheckbox();
		var rows = ids.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			var rowData = tablerows[ids.val()];
			TRIG.forminit($("#weixinEditform"), rowData);
			weixinlist();
			TRIG.CMS.selectResourceData('winxin_ci_resourceId', rowData.ci_resourceId, false);
			$("#weixinEditModal").modal('show');
		}
    });
    
    $("#btn_winxin_ci_resourceId_text").bind('click', function(){
    	selectResourec('winxin_ci_resourceId', 'IMG_FILE', false);
    	/*var pdir2 = '/content/resource/' + TRIG.CMS.getWebsiteDir(siteid) + "/";
    	TRIG.UPLOAD.open('winxin_ci_resourceId', TRIG.FILETYPE_IMG, pdir2, null, true, TRIG.CMS.getWebsite(siteid).cw_imgWatermark ? TRIG.CMS.getWebsite(siteid).cw_imgWatermark : '', false);*/
    });
    $("#btn_winxin_ci_resourceId_fv").bind('click', function() {
    	//TRIG.UPLOAD.openView($('#winxin_ci_resourceId').val(), TRIG.FILETYPE_IMG);
    	viewFiles('winxin_ci_resourceId');
    });
    
    function weixinlist() {
    	var options = $("#weixinno").get(0).options;
    	options.length = 1;
    	$.getJSON(TRIG.PATH + '/www/weixin/info_userList.json', '', function(data) {
    		for(var i=0;i<data.length;i++) {
	   	   		options.add(new Option(data[i].wi_weixinName, data[i].wi_infoId));
	   	   	}
    	});
    }
    
    /**
     * 保存发布到微信
     */
    TRIG.Validate("weixinEditform", function(form){
    	TRIG.trackPost(cmsItem.url.addWeixin, $(form).serialize(), function(data){
    		if(data.success) {
				//ttable.reload();
				TRIG.messager.alert('保存发布成功！');
		    	$("#weixinEditModal").modal('hide');
    		}
		});
		return false;
    });
    
    
    // 二维码
    $(".qrCodeCmsItem").bind('click', function(){
    	var ids = ttable.getCheckbox();
		var rows = ids.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			var rowData = tablerows[ids.val()];
			var siteobj = TRIG.CMS.getWebsite(siteid);
			var url = siteobj.cw_protocol + siteobj.cw_domain + TRIG.PATH + '/content/' +TRIG.CMS.getWebsiteDir(siteid) + rowData.ci_itemPath + '/' ;
			if(rowData.ci_fileName) {
				url += rowData.ci_fileName + '.htm';
			} else {
				url += rowData.ci_itemId + '.htm';
			}
	    	$("#qrcodeimg").html("<img src='tools/qrcode_encode.t?size=200&text="+url+"' />");
	    	$("#qrCodeEditModal").modal('show');
		}
    });
  
    //导入Item
	 $("#importItem").bind('click', function(){
		 //上传zip
		 $("#uploadsModal").modal('show');
		
	});
	 //上传表单验证
	 TRIG.Validate('uploadsform', function(form){
	    	var _url = cmsItem.url.importItem;
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
						ttable.reload(); //刷新表格
						//刷新树
						$('#item_tree').jstree('refresh_node', {id: '3', 'ci_siteId' : TRIG.CMS.getWebsiteID()});  
						TRIG.messager.alert("导入成功");
					}else{
						TRIG.successHandle(data);
					}
				},  
				error: function(data, status, e) {  
						alert(e);  
						TRIG.progressClose();
					}  
			});
		}
	 
	 //导出内容
	 $("#exportItem").bind('click', function(){

		var objs = ttable.getCheckbox();
		var rows = objs.size();
		if(TRIG.isSelect(rows)){
			var ids="";
			objs.each(function (){
				ids+=this.value+",";
			});
			window.open(cmsItem.url.exportItem + "?ids=" + ids);
		};
	});
	 //导出整站内容
	 $("#exportSiteItem").bind('click', function(){
		 window.open(cmsItem.url.exportItemSite + "?siteid=" + TRIG.CMS.getWebsiteID());
	});
	 
	 // 模板字段回显，让用户更好友的查看录入结果
	 // 链接字段显示
	 function viewTempLink(value) {
		 if(value) {
			 var json = $.parseJSON(value);
			 if(json.type == 'external') { // 外链
				 return "外部["+json.link+"|"+json.open+"]";
			 } else if(json.type == 'internal') { // 内链
				 var rs = '本站['
				 $.ajax({ dataType: 'json', async: false, url : 'cms/item_select_ids.json', data:'ids='+json.item, success : function(data) {
					 if(data.length>0)	
						 rs += data[0].ci_itemName;
				 	}
				 });
				 rs += "|" + json.open + ']'
				 return rs;
			 } else if(json.type == 'resource') { // 资源、附件
				 var rs = '资源['
					 $.ajax({ dataType: 'json', async: false, url : 'cms/resource_select_findIds.json', data:'ids='+json.resource, success : function(data) {
						 if(data.rows.length>0)	
							 rs += data.rows[0].cr_fileName + '|' + data.rows[0].cr_filePath;
					 	}
					 });
					 rs += "|" +json.open+ ']'
					 return rs;
			 }
		 }
		 return "";
	 }
	 // 内容字段显示
	 function viewTempContent(value) {
		 if(value) {
			 var rs = ''
			 $.ajax({ dataType: 'json', async: false, url : 'cms/item_select_ids.json', data:'ids='+value, success : function(data) {
					 for(var i=0;i<data.length;i++) {
						 if(i > 0) rs += ",";
						 rs += data[i].ci_itemName;
					 }
			 	}
			 });
			 return rs;
		 }
		 return "";
	 }
	 // 资源
	 function viewTempResource(value) {
		 if(value) {
			 var rs = ''
			 $.ajax({ dataType: 'json', async: false, url : 'cms/resource_select_findIds.json', data:'ids='+value, success : function(data) {
					 for(var i=0;i<data.rows.length;i++) {
						 if(i > 0) rs += ",";
						 rs +=  data.rows[0].cr_fileName + '|' + data.rows[0].cr_filePath;
					 }
			 	}
			 });
			 return rs;
		 }
		 return "";
	 }
	 // 自定义模板字段类型显示
	 function viewTempUserField(defType, jsondata) {
		 if(jsondata) {
			 var fieldTypeId = '';
			 var islist = false;
			 var rs = '';
			 for(var i=0;i<userTemplateFields.length;i++) {
	    		if(userTemplateFields[i].ctft_typeDef == defType) {
	    			fieldTypeId = userTemplateFields[i].ctft_fieldTypeId;
	    			islist = userTemplateFields[i].ctft_category == '1';
	    			break;
	    		}
			 }
			 if(islist) { // 列表
				 var datas = $.parseJSON(jsondata);
				 for(var i=0;i<datas.length;i++) {
					 if(i>0) rs += "\n";
					 rs += "{" + viewTempUserFieldForm(fieldTypeId, datas[i]) + "}";
				 }
			 } else {
				 rs = viewTempUserFieldForm(fieldTypeId, $.parseJSON(jsondata));
			 }
			 return rs;
		 }
		 return "";
	 }
	 
	 function viewTempUserFieldForm(fieldTypeId, content) {
		 var rs = '';
		 $.ajax({ dataType: 'json', async: false, url : 'cms/template_fieldType_findItemList.json',  data : 'id=' + fieldTypeId, success : function(data) {
			 for(var i=0;i<data.length;i++) {
				 if(i>0) rs += ',';
				 var type = data[i].ctfti_itemType;
				 var value = eval('v=content.'+data[i].ctfti_itemDef);
				 if(type != 'htmltext') {
					 rs += data[i].ctfti_itemName + ':';
					 if(value) {
						 // 资源
						 if(type == 'imgfile' || type == 'imgfiles' || type == 'docfile' || type == 'docfiles' || type == 'file' || type == 'files' || type == 'videofile' || type == 'videofiles') {
							 rs += viewTempResource(value);
						 } else if(type == 'content' || type == 'contents') {
							 rs += viewTempContent(value);
						 } else if(type == 'link') {
							 rs += viewTempLink(value);
						 } else {
							 rs += value;
						 }
					 } else {
						 rs += '""';
					 }
				 }
			 }
		 	}
		 });
		 return rs;
	 }
	 
});