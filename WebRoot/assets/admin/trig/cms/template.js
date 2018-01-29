$(function(){
	var cmsTemplate = {};
	cmsTemplate.url = {};
	cmsTemplate.url.add = 'cms/template_add.json';
	cmsTemplate.url.update = 'cms/template_update.json';
	cmsTemplate.url.del = 'cms/template_delete.json';
	cmsTemplate.url.find = 'cms/template_findPageList.json';
	cmsTemplate.url.addPublish = 'cms/template_addPublish.json';
	cmsTemplate.url.copy = 'cms/template_copy.json';
	cmsTemplate.url.copyAll='cms/template_copyAll.json';
	cmsTemplate.url.getFrontData='cms/template_getFrontData.json';
	cmsTemplate.url.returnedUpdate='cms/template_returnedUpdate.json';	
	cmsTemplate.url.selectService='cms/template_selectService.json';
	cmsTemplate.url.revoke='cms/template_revoke.json';
	cmsTemplate.url.exportTemplate='cms/template_exportTemplate.json';
	cmsTemplate.url.exportSite='cms/template_exportSite.t';
	cmsTemplate.url.uploads='cms/template_uploads.json';
	cmsTemplate.url.oneKeyGeneration='cms/template_oneKeyGeneration.json';
	
	var copyIds = "";//复制的站点ID
	var copyType="copy";//是否整站复制
	//广告选择列表
    function setAdList() {
    	$.getJSON('ad/ad_code_selectMenu.json?tempsourceid='+ siteid, function(data){
        	var options = document.getElementById("ctp_ad").options;
        	options.length = 1;
        	if(data.length!=0){
	        	for(var i=0;i<data.length;i++) {
	        	 var option = new Option(data[i].ac_codeName, data[i].ac_codeId);
	        	 options.add(option); 
	        	}	
        	}
        });
	}  
	//问卷调查选择列表
    function setQuestList() {
    	$.getJSON('online/online_quest_selectQuestMenu.json?tempsourceid='+ siteid, function(data){
        	var options = document.getElementById("ctp_quest").options;
        	options.length = 1;
        	for(var i=0;i<data.length;i++) {
        	 var option = new Option(data[i].oq_questName, data[i].oq_questId);
        	 options.add(option); 
        	}	
        });
	}
   
   //其他
    function setOthersList() {
    	var options = document.getElementById("ctp_others").options;
    	options.length = 1;
    	var option0 = new Option("内容评论", "0");
   	 	options.add(option0); 
   	 	var option1 = new Option("网站留言", "1");
   	 	options.add(option1); 
   	 	
   	 	var option2 = new Option("网站样式", "2");
	 	options.add(option2); 
	 	var option3 = new Option("网站监测", "3");
	 	options.add(option3); 
	 	var option4 = new Option("计数显示", "4");
	 	options.add(option4); 
    } 
	var defsiteid = TRIG.CMS.setRightWebSiteSelect('right-page-bar', function(id){
		siteid = id;//此处ID为站点ID
		copyType="copy";//切换站点时，默认复制
		//查询该站点的所有模板
		ttable.query({ctp_siteId : id});
		
		if(TRIG.isPrivlege("findAd")) {
			setAdList();
		}
		 if(TRIG.isPrivlege("findOnline")) {
			 setQuestList();
		 }
		 
		 setOthersList();
	}).getId();
	 
	var siteid = defsiteid;//设置一个默认的站点
	var tablerows = []; 
	var table = $('#trig-template-table');
	var ttable = new TRIG.Datatable({
			table : table, 
			url : cmsTemplate.url.find, 
			columns : [
					   { "data": null, "render": function(data, type, row, mete){
						   tablerows[row.ctp_templateId] = row;
							return '<input type="checkbox" class="checkboxes" value="'+row.ctp_templateId+'"/>';   
					   }, orderable: false, className: "trig-checkbox" },
					   
						   { "data": "ctp_templateName", "render":function(data,type,row,mete){
			                	 var c = '';
			                	 if (copyIds.indexOf(row.ctp_templateId+",")>-1 ){
				     				c = 'color:blue;';
				     			 }
			                	 if(copyType=="copyAll"){
				     				c = 'color:red;';
				     			 }
			                	 return '<span class="row-details row-details-close" dataid="'+row.ctp_templateId+'"></span> ' 
			                	 			+ '<span style="'+c+'">' + data + '</span>';
			                 } },
			                 { "data": "ctp_templateType", className: "hidden-xs" ,  "render": function(value){
			                	 return value == "4" ? "订阅" : value == "3" ? "栏目" : value == "2" ? "模块" : "页面";
			                 }}, 
			                 { "data": "ctp_isIndex", className: "hidden-xs" }, 
			                 { "data": "ctp_state", className: "hidden-xs" }, 
			                 { "data": "ctp_isUpdate",  "render": function(value){
			                	 return TRIG.getYesNoHtml(value);
			                 }},
			                 { "data": "ctp_status", "render": function(data) {
			                	 return TRIG.CMS.getStatusStr(data);
			                 }},
			                 { "data": "ctp_createTime", className: "hidden-xs" }
			],
			order: [[5,'desc']],
			queryParams : {
				ctp_siteId : defsiteid
			},
			dblclick : function() {   // 双击打开编辑浮层
				// 是否有修改权限
		    	if(TRIG.isPrivlege("updateCmsTemplate")) { 
		    		showUpdate();
		    	}
			} 
	});
	
	ttable.next(); // 初始下一个按钮事件
    ttable.prev(); // 初始上一个按钮事件
    
    // 查询
    $("#findCmsTemplate").bind('click', function() { 	
    	ttable.query({ ctp_templateName : $("#sTemplateName").val(), ctp_siteId : siteid});
	});
    
    // 高级查询
    TRIG.search('cms_template', $("#findCmsTemplate"), ttable);
    
 // 显示更多字段值
    ttable.initMore(function(id) { 
   	 var rowData = tablerows[id];
   	 var sOut = '<table>';
   	 	sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
   	 	sOut += '<tr><td><div class="trig-more-content">文件名称：</div></td><td>' + rowData.ctp_templateFile + '</td></tr>';
   	 	if(rowData.ctp_thumbnail) {
   	 	sOut += '<tr><td><div class="trig-more-content">缩略图：</div></td><td><img src="' + TRIG.UPLOADPATH + rowData.ctp_thumbnail + '" width="80px"/></td></tr>';
   	 	}
   	 	sOut += '<tr><td><div class="trig-more-content">描述：</div></td><td>' + rowData.ctp_description + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">禁用：</div></td><td>' + rowData.ctp_state + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">创建时间：</div></td><td>' + rowData.ctp_createTime + '</td></tr>';
        sOut += '</table>';
        return  sOut;
    });
    
    $("#ctp_thumbnail_fb").bind('click', function(){
    	TRIG.UPLOAD.openImg('ctp_thumbnail');
    });
    
    var templateEditor = CodeMirror.fromTextArea(document.getElementById("ctp_content"), {
		 	mode: 'htmlmixed',
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
			 
			  //autofocus: true
	   });
    
 // 新增浮层初始
    $("#addCmsTemplate").bind('click', function(){
    	
    	TRIG.CMS.selectPropertyList("ctp_property", "", siteid);
    	TRIG.hidePrveNext();
    	TRIG.formreset($("#templateEditform"));
    	$("#ctp_siteId").val(siteid);//给站点赋值
    	$("#ctp_item").select2('data',null);
		$("#ctp_service").select2('data',null);
		$("#ctp_component").select2('data',null);
		
    	$("#templateEditModal").modal('show'); 
    	setTimeout(
	    	 function(){
	    		 templateEditor.getDoc().setValue('');
	    	     templateEditor.refresh();
			}, 500);
    	
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
			TRIG.CMS.selectPropertyList("ctp_property",id, siteid);
			// 初始表单数据
			TRIG.forminit($("#templateEditform"), data);
			$("#ctp_item").select2('data',null);
			$("#ctp_service").select2('data',null);
			$("#ctp_component").select2('data',null);
			$("#templateEditModal").modal('show');
			setTimeout(
			 function(){
				templateEditor.getDoc().setValue(data.ctp_content);
				templateEditor.refresh();
			}, 500);
		}
    }
    
    // 打开修改编辑浮层
    $("#updateCmsTemplate").bind('click', function(){
    	showUpdate();
    });
    // 是否点击保存&关闭
    var saveclose = false;
    TRIG.FormValidate("cms_template", "templateEditform",  function (form) {
		var _url = cmsTemplate.url.add;
		var isadd = true;
		if($("#ctp_templateId").val()!='') {
			_url = cmsTemplate.url.update; 
			isadd = false; 
		}
		TRIG.trackPost(_url, $(form).serialize(), function(data){
			if(isadd == true) {
				TRIG.formreset($("#templateEditform")); 
				$("#ctp_siteId").val(siteid);
			}
			// 保存&关闭
			if(saveclose) {
				$("#templateEditModal").modal('hide'); 
			}
			TRIG.updateSuccessAlert();
		});
		// 必须flase，阻止form submit
		return false;
	}, 'ctp');
    
    $(".trigsaveclose").bind('click', function(){
    	saveclose = true; 
    });
    
	// 编辑浮层关闭刷新列表数据
	$("#templateEditModal").on("hidden", function(){   
		ttable.reload();
		saveclose = false; 
	});
	
	// 删除
	$("#deleteCmsTemplate").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelRecycleBinSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(cmsTemplate.url.del, "ids=" + ids, function(data){
				ttable.reload();
			});
		});
	});
	
	// 数据绑定
	// 是否初始化
	var datalist = false;
    // 当前选择TEMPLATE ID
    var bind_dataid = '';
    // 绑定类型
    var bind_datatype = '';
    
    var dataMultiSelect = null;
	// 下级模板
	$("#bindtemplate").bind('click', function(){
		var ids = ttable.getCheckbox();
		var rows = ids.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			openbinding('cms_template', ids.get(0).value, '下级模板'); 
		}
	});
	
	// 模板字段
	$("#bindtemplatefield").bind('click', function(){
		var ids = ttable.getCheckbox();
		var rows = ids.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			openbinding('cms_template_field', ids.get(0).value, '模板字段');
		}
	});
	//下级模板 (表名  模板ID 名字)
	function openbinding(type, dataid, name) {
		$("#sdataname").val(''); // 清除查询
		bind_dataid = dataid;
		bind_datatype = type;
		if(name)
			$("#bindtitle").text(name);
		
		//var dataopts = document.getElementById("dataids").options;
		//dataopts.length = 0;
		
		// 要绑定的数据
		$.ajax({dataType: 'json', url : 'cms/template_bindingdata.json', data: 'cd_dataType=' + type+'&site_id='+siteid, success: function(data) {
			var datas = [];	
			for(var i=0; i<data.length;i++) {
					//if(data[i].cd_dataId!=dataid && exists_data.indexOf(data[i].cd_dataId)==-1) {
					//	dataopts.add(new Option(data[i].cd_dataName, data[i].cd_dataId));
					//}
					datas.push({name:data[i].cd_dataName, id:data[i].cd_dataId});
				}
				// 已绑定数据
				$.ajax({dataType: 'json', url : 'cms/template_binding.json', data: 'cdb_dataId='+dataid+'&cd_dataType=' + type, success: function(data) {
						var initdatas = [];	
						for(var i=0; i<data.length;i++) {
							//$('#dataids').multiSelect('select', data[i].cdb_bindingDataId);
							initdatas.push({name:data[i].cd_dataName, id:data[i].cdb_bindingDataId});
						}
						if(datalist==false) {
							dataMultiSelect = new TRIG.multiSelect('dataids', datas, initdatas);
							datalist = true;
						} else {
							dataMultiSelect.refresh(datas, initdatas);
						}
					},async: false
				});
			},async: false
		});
		$("#cmsTemplatebindingModal").modal('show');
	}
	
	// 查询绑定数据
	$("#findBangDingData").bind('click', function(){
		dataMultiSelect.query($("#sdataname").val());
	});
	
	ttable.next('.databang-trig-next', function(){
		openbinding(bind_datatype, ttable.getCheckbox().val());
    }); // 初始下一个按钮事件
	ttable.prev('.databang-trig-prev', function(){
		openbinding(bind_datatype, ttable.getCheckbox().val());
    }); // 初始上一个按钮事件
	
	$("#cmsTemplatebindingsubmit").bind('click', function() {
		TRIG.progress();
		var ids = $("#dataids").val();
		if(!ids) ids = "";
		$.post('cms/template_saveBinding.json', "id="+bind_dataid+"&ids=" + ids+"&datatype=" + bind_datatype, function(data){ 
			TRIG.progressClose();
			data = TRIG.successHandle(data);
			if(data.success==true) {
				TRIG.updateSuccessAlert();
				$("#cmsTemplatebindingModal").modal('hide');
			}
		});
	});
	
	$("#addPublishCmsTemplate").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		if(rows==0){
			TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE); //必须选择一行
			return false;
		}else{
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});  
			TRIG.trackPost(cmsTemplate.url.addPublish, "ids=" + ids, function(data){
				ttable.reload();
				TRIG.messager.alert('发布成功'); 
			});
		}
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
	 
	 //复制
	 var oldSiteId="";
	 var isCopyAll=false;
	 $("#copyCmsTemplate").bind('click', function(){
		 var objs = ttable.getCheckbox();
	    	var rows = objs.size();
			if(rows>0) {
				var ids="";
				objs.each(function(){
					ids += this.value + ",";
				});   
				copyIds=ids;
				ttable.reload();
			} else {
				TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE);
			}
	 });
	 //粘贴
	 $("#pasteCmsTemplate").bind('click', function(){
		 
		 if(copyIds == "" && isCopyAll==false){//既没有点击复制也没有点击整站复制
			TRIG.messager.alert("没有粘贴的内容");
			return false;
		}
	    if(!isCopyAll){//复制
			TRIG.trackPost(cmsTemplate.url.copy,"ids=" + copyIds + "&siteid=" + siteid, function(data){
				if(data.message!=""){
					TRIG.messager.alert(data.message);
				}
				copyIds="";//粘贴成功清空ids
				ttable.reload();	
			});
	    }else{//整站复制
	    	TRIG.trackPost(cmsTemplate.url.copyAll,"oldSiteId=" + oldSiteId + "&newSiteId=" + siteid, function(data){	
	    		if(data.message!=""){
					TRIG.messager.alert(data.message);
				}
	    		isCopyAll=false;
	    		copyType="copy";
				oldSiteId="";
	    		ttable.reload();	
			});
	    }
	 });
	 //整站复制
	 $("#copyAllCmsTemplate").bind('click', function(){
		 if("没有数据"==$("#trig-template-table_info").text()){
			 TRIG.messager.alert("当前站点没有模板！");
		 }else{
			 isCopyAll=true;
			 copyType="copyAll";
			 oldSiteId=siteid;
			 ttable.reload();	 
		 }
		 
	 });
	 
	 //前后台模板内容的比较
	 $("#compareCmsTemplate").bind('click', function(){
		var ids = ttable.getCheckbox();
		var rows = ids.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			TRIG.showPrveNext(); 
			var id = ids.get(0).value;
			var data = tablerows[id];
			 //得到后台模板数据
			var backData=data.ctp_content;
			if(data.ctp_status=='4'){
				TRIG.trackPost(cmsTemplate.url.getFrontData,"id=" + id , function(data){
					//得到前台模板数据
					var frontData=data.CmsFrontTemplate.cft_content;	
					TRIG.txtDiffByTxt(frontData, backData, "前台模板", "后台模板");
					
				});
			}else{
				TRIG.messager.alert("请先发布");
			}
		}
		 
	 });
	 
	 //恢复更新
	 $("#returnedUpdate").bind('click', function(){
		var ids = ttable.getCheckbox();
		var rows = ids.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			TRIG.showPrveNext(); 
			var id = ids.get(0).value;
			var data = tablerows[id];
			
			if(data.ctp_status=='4'){
				TRIG.trackPost(cmsTemplate.url.returnedUpdate,"id=" + id , function(data){
					 ttable.reload();	
				});	
			}else{
				TRIG.messager.alert("请先发布");
			}	
		}
		 
	 });
	
	 TRIG.CMS.selectItemList("ctp_item",siteid); 
	 //item  2015/10/9
	 $("#ctp_item").bind("change",function(){ 
		    if($(this).val()==""){
		      return; 
		    } 
		    else{
		      //将选中的内容追加到模板
		      templateEditor.replaceSelection("${item."+$(this).val()+"}"); 
		    } 
	 }); 
	 
	 //component  2015/10/9
	 TRIG.CMS.selectComponentList("cms/component_select.json","ctp_component",siteid);
	 $("#ctp_component").bind("change",function(){ 
		    if($(this).val()==""){
		      return; 
		    } 
		    else{
		      //将选中的内容追加到模板
		    	if(TRIG.CMS.TempateType == 'freemarker') {
		    		templateEditor.replaceSelection("<#include \"component/"+$(this).val()+"\" />"); 
		    	} else if(TRIG.CMS.TempateType == 'beetl') {
		    		templateEditor.replaceSelection('<% include("component/'+$(this).val()+'"){} %>'); 
		    	}
		    } 
	 }); 
	 
	 //模板或者站点属性
	 $("#ctp_property").bind("change",function(){ 
		    if($(this).val()==""){
		      return; 
		    } 
		    else{
		      //将选中的内容追加到模板
		    	templateEditor.replaceSelection("property."+$(this).val()+""); 
		    } 
	 }); 
	
	//-----------service start-------------------
	TRIG.CMS.selectService('ctp_service'); //搜索查找service的内容
	 /**
	  * service浮层初始化
	  */
	var item_index=""; //记录内容id是第几个参数
	function initServiceModel(sd) {
		//初始化
		$("#link_item").select2('val', ''); //清空内容
		$("#item_id").hide();//隐藏内容
		item_index="";  //清空内容id参数位置记录
		$(".divAuto").remove(); //删除自动生成的div
		
		var val=$('input:radio[name="isValue"]:checked').val();//取值默认
		 if(val=="N"){
			 $("#variableDiv").show(); 
		 }else{
			 $("#variableDiv").hide();
		 }
		 $("#variable").val("");
		 //自动生成div
		 if(sd.size!=0){
			 //根据参数的个数自动生成div
			 for(var j=1;j<=sd.size;j++){
				if(sd.paramList[j-1].paramName == "内容ID"){
					TRIG.CMS.selectItem('link_item', false);
					//将内容隐藏域显示
					$("#item_id").show();
					item_index=j;//记录内容id是第几个参数 
				}else{
					var add="<div class='form-group divAuto'><label class='col-md-3 control-label'>"+sd.paramList[j-1].paramName+"</label><div class='col-md-6'><input type='text' class='form-control'  name='"+j+"' id='"+j+"' placeholder='"+sd.paramList[j-1].paramType+"'>	</div></div>";
					$("#div").append(add);
				}
			 }	
		 }
		 if(sd.note) $("#serviceModalTile").text(sd.note);
		 else $("#serviceModalTile").text('编辑');
		 $("#serviceModal").modal('show');  
	 }
	 
	
	/**
	 * 得到输入框的参数 组装成添加到编辑器中的内容
	 */
	function getVal(sd){
		//获取参数值
		var paramVal ="";
		var content=""; //最后插入的内容
		var isOk=false;
		if(sd.size==0){ //没有参数
			var val=$('input:radio[name="isValue"]:checked').val();	//是否取值
			if(val=="N"){ //定义 
				var variable=$("#variable").val(); //取得变量名
				if(variable!=""){
					if(TRIG.CMS.TempateType == 'freemarker') {
						content= "<#assign "+variable+" =service."+sd.name+"()/>"; //构造内容
					} else if(TRIG.CMS.TempateType == 'beetl') {
						content= "<% var "+variable+" = @service."+sd.name+"(); %>"
					}
				}else{
					return "1";//未填写变量
				}
			}else {
				content= "${service."+sd.name+"()}"; //构造内容
			}
		}else{	//有参数
			//得到输入的数值
			for(var i=1;i<=sd.size;i++){
				if(item_index == i){
					var item_id=$("#link_item").val();
					if(item_id !=""){
						paramVal +="\""+item_id+"\",";
					}else{
						return "2";
					}
				}else{
					var p=$("#"+i+"").val();
					if(p!=""){
						if(sd.paramList[i-1].paramType=="String"){
							paramVal +="\""+$("#"+i).val()+"\",";
						}else{
							paramVal +=$("#"+i).val()+",";
						}
					}else{
						return "3";//未填写参数
					}
				}
    		}
			//将paramVal去掉最后一个，
			paramVal=paramVal.substr(0, paramVal.length-1);
			//判断取值还是定义 
			var val=$('input:radio[name="isValue"]:checked').val();	
			if(val=="N"){
				var variable=$("#variable").val();
				if(variable!=""){
					if(TRIG.CMS.TempateType == 'freemarker') {
						content= "<#assign "+variable+" =service."+sd.name+"("+paramVal+")/>";
					} else if(TRIG.CMS.TempateType == 'beetl') {
						content= "<% var "+variable+" =@service."+sd.name+"("+paramVal+"); %>";
					}
				}else{
					return "1";
				}
			}else {
				content= "${service."+sd.name+"("+paramVal+")"+"}";
			}
		}
		return content;
	}
	
	 var sd="";
	 //service 2015/10/9
	 $("#ctp_service ").bind("change",function(){
		 if($(this).val()=="0"){
			 return;
		 }else{ 
			//在service方法的集合中找到选中的对象
		  	for(var i=0;i<TRIG.CMS.SERVICE_DATA.length;i++) {
        		if(TRIG.CMS.SERVICE_DATA[i].index==$(this).val()){
        			sd=TRIG.CMS.SERVICE_DATA[i];
        			break;
        		}
        	}
		  	initServiceModel(sd); //初始化
		 }
	 }); 
	
	//点击确定
  	$("#sure").bind("click",function(){ 
		var param=getVal(sd); //得到要添加的内容
		if(param == "1"){
			TRIG.messager.alert("未填写变量！");
		}else if(param == "2"){
			TRIG.messager.alert("未选择内容！");
		}else if(param == "3"){
			TRIG.messager.alert("未填写参数！");
		}else{
			//添加到模板
			templateEditor.replaceSelection(param);
			sd="";
			//关闭浮层
	    	$("#serviceModal").modal('hide');
		}
  	});
  	
	 //按钮的点击事件
	 $('input:radio[name="isValue"]').bind("click",function(){
		 var isShow=false;
		 var val=$(this).val();
		 if(val=="N"){
			 isShow=true;
		 }
		 if(isShow){
			 $("#variableDiv").show();
		 }else{
			 $("#variableDiv").hide();
		 }
	 });
	 
 	//隐藏浮层
 	 $("#serviceModal").on("hidden", function(){ 
		 //删除自动生成的div
		 $(".divAuto").remove();
	 });
	 //-----------service end-------------------
 	 
 	 if(TRIG.isPrivlege("findAd")) {
 		setAdList();
 	 }
	 
	 $("#ctp_ad").bind("change",function(){ 
		 	if($(this).val()==""){
		      return; 
		    } 
		    else{
		    	$.ajax({    url:'ad/ad_code_selectTempCode.json',
				       async: false ,
				    dataType: "json", 
				        type: "GET",  
				        data: "ac_codeId="+$(this).val(), 
				     success:function(data){
				    	 if(data.tempcodelist.length!=0)	
					     {
				           //将选中的内容追加到模板
					       templateEditor.replaceSelection(
					    	"\n<link rel=\"stylesheet\" href=\"${service.getContentPath()}/ad/css/ad.css\" />\n" +	   
					    	"\n<script src=\"${service.getContentPath()}/ad/ad.js\"></script>\n"+
					    	"\<!-- 广告位："+data.tempcodelist[0].ac_codeName+" --\>\n"+
					    	"<script>\n"+
					    	"//adid 代码位DIV ID\n" +
							"TRIG.AD('"+data.tempcodelist[0].ac_codeId+"', 'adid', '${item.itemId}');\n" +
							"</script>\n"
					       ); 
					     }
				}});
		    	
		    } 
	 }); 
	 //在线调查选择列表
	 if(TRIG.isPrivlege("findOnline")) {
		 setQuestList();
	 }
	 $("#ctp_quest").bind("change",function(){ 
		 	if($(this).val()==""){
		      return; 
		    } 
		    else{  
		    	//将选中的内容追加到模板
		    	templateEditor.replaceSelection("/online/op.t?id="+$(this).val()); 
			} 
	 }); 
	 
	 //其他
	 setOthersList();
	 //内容评论
	 $("#ctp_others").bind("change",function(){ 
		 	if($(this).val()=="0"){
		 		//将选中的内容追加到模板
			       templateEditor.replaceSelection(
			    	"\n<form id=\"commentform\">\n"+
			    	//"\t\t"+"<input type='hidden' name='cic_commentId' id='cic_commentId' />"+"\n"+
			    	//"\t\t"+"<input type='hidden' name='cic_userId' id='cic_userId' />"+"\n"+
			    	"\t\t"+"<input type='hidden' name='cic_itemId' id='cic_itemId' value='${item.itemId}'/>"+"\n"+
			    	"\t\t"+"<input type='hidden' name='ci_siteId' id='ci_siteId' value='${item.siteId}'/>\n"+
			    	"\t<div>\n"+	   
			    	"\t\t&nbsp;&nbsp;姓名:"+"<input type='text'  name='cic_userName' id='cic_userName'>"+"\n"+
			    	"\t</div>\n"+
			    	"\t<div>\n"+	   
			    	"\t\t评论内容:"+"<textarea rows='10' cols='22' class='form-control'  name='cic_commentContent' id='cic_commentContent'></textarea>"+"\n"+
			    	"\t</div>\n"+
			    	"\t<div>\n"+	   
			    	"\t\t"+"<input type='button'  name='提交' value='提交' id='submit' onclick='sub();return false;'>"+"\n"+
			    	"\t</div>\n"+
			    	"</form>\n"+

			    	"<script>\n"+
			    	"function sub(){\n"+
			    	"\t\t"+"$.ajax({ url:'${service.getContentPath()}/cms/comments_save.json'"+",\n"+
			    	"\t\t"+"dataType: 'json'"+",\n"+
			    	"\t\t"+"type: 'POST'"+",\n"+
			    	"\t\t"+"data: $('#commentform').serialize()"+",\n"+
			    	"\t\t"+"success:function(data){"+"\n"+
			    	"\t\t\t\t"+"alert('提交成功!')"+";\n"+
			    	"\t\t\t\t"+"$('#commentform')[0].reset()"+";\n"+
			    	"\t\t}\n"+
			    	"\t\t});\n"+
			    	"};\n"+
					"</script>\n"
			       ); 
			} 
		 	//网站留言
		    else if($(this).val()=="1"){  
		    	//将选中的内容追加到模板
		    	templateEditor.replaceSelection(
		    			"\n<form id=\"messageform\">\n"+
				    	//"\t\t"+"<input type='hidden' name='csm_siteMessageId' id='csm_siteMessageId' />"+"\n"+
				    	"\t\t"+"<input type='hidden' name='csm_siteId' id='csm_siteId' value='${item.siteId}'/>\n"+
				    	"\t<div>\n"+	   
				    	"\t\t姓名:"+"<input type='text'  name='csm_userName' id='csm_userName'>"+"\n"+
				    	"\t</div>\n"+
				    	"\t<div>\n"+	   
				    	"\t\t性别:"+"<input type='radio' name='csm_sex' id='csm_sex_m' value='M' >男"
				    	+"\t\t<input type='radio' name='csm_sex' id='csm_sex_f' value='F' >女"+"\n"+
				    	"\t</div>\n"+	
				    	"\t<div>\n"+	   
				    	"\t\t邮箱:"+"<input type='text'  name='csm_email' id='csm_email'>"+"\n"+
				    	"\t</div>\n"+
				    	"\t<div>\n"+	   
				    	"\t\t手机:"+"<input type='text'  name='csm_mobile' id='csm_mobile'>"+"\n"+
				    	"\t</div>\n"+
				    	"\t<div>\n"+	   
				    	"\t\t留言:"+"<textarea rows='10' cols='22' class='form-control'  name='csm_messageContent' id='csm_messageContent'></textarea>"+"\n"+
				    	"\t</div>\n"+
				    	"\t<div>\n"+	   
				    	"\t\t"+"<input type='button'  name='提交' value='提交' id='submit' onclick='sub();return false;'>"+"\n"+
				    	"\t</div>\n"+
				    	"</form>\n"+

				    	"<script>\n"+
				    	"function sub(){\n"+
				    	"\t\t"+"$.ajax({ url:'${service.getContentPath()}/cms/message_addMessage.json'"+",\n"+
				    	"\t\t"+"dataType: 'json'"+",\n"+
				    	"\t\t"+"type: 'POST'"+",\n"+
				    	"\t\t"+"data: $('#messageform').serialize()"+",\n"+
				    	"\t\t"+"success:function(data){"+"\n"+
				    	"\t\t\t\t"+"alert('提交成功!')"+";\n"+
				    	"\t\t\t\t"+"$('#messageform')[0].reset()"+";\n"+
				    	"\t\t}\n"+
				    	"\t\t});\n"+
				    	"};\n"+
						"</script>\n"
				   ); 
			} // 网站样式
		    else if($(this).val()=="2") {
		    	templateEditor.replaceSelection('<link rel="stylesheet" type="text/css" href="${service.getFrontPath()}/trigcms.css" />');
		    } // 网站监测
		    else if($(this).val()=="3") {
		    	templateEditor.replaceSelection('<script src="${service.getContentPath()}/content/js/trig.js"></script>\n' +
		    			'<script src="${service.getContentPath()}/content/js/trig-cms.js"></script>\n' + 
		    			'<script>\n TRIG.PATH ="${service.getContentPath()}"; \n var cms = new TRIG.CMS("${item.itemId}"); \n cms.AccessStartSave(); \n </script>');
		    } // 计数显示
		    else if($(this).val()=="4") {
		    	templateEditor.replaceSelection('浏览：<span id="vcount">0</span>\n ' +
		    			'评论：<span id="ccount">0</span>\n' +
		    			'分享：<span id="scount">0</span>\n' +
		    			'收藏：<span id="collcount">0</span>\n' +
		    			'赞：<span id="pcount">0</span>\n' +
		    			'<script>\n cms.GetActionCount(function(data){ \n' +
		    			   'if(data.success) { \n ' +
		    			    '     $("#vcount").text(data.data.browseCount);\n' +
		    			    '     $("#ccount").text(data.data.commentCount);\n' +
		    			    '     $("#scount").text(data.data.shareCount);\n' +
		    			    '     $("#collcount").text(data.data.collectCount);\n' +
		    			    '     $("#pcount").text(data.data.praiseCount);\n' +
		    				'   }\n' +
		    				' });  \n </script>');
		    }
	 }); 
	 
	 //模板撤销
	 $("#revokeCmsTemplate").bind("click",function(){ 	
			var objs = ttable.getCheckbox();
			var rows = objs.size();
			if(rows==0){
				TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE); //必须选择一行
				return false;
			}else{
				var ids = "";
				objs.each(function(){
					ids += this.value + ",";
				});  
				TRIG.trackPost(cmsTemplate.url.revoke, "ids=" + ids, function(data){
					ttable.reload();
					TRIG.messager.alert('撤销成功'); 
				});
			}
	 }); 
	 
	 //预览
	 $("#template_preview").bind("click", function(){
		 $("#templateEditform").get(0).submit();
	 });
	 
	 //导入
	 $("#importTemplate").bind('click', function(){
		 //上传zip
		 $("#uploadsModal").modal('show');
		
	});
	 //上传表单验证
	 TRIG.Validate('uploadsform', function(form){
	    	var _url = cmsTemplate.url.uploads;
			upload(_url);
	    	return false;
	    }, {
	    	zipfile : {
	    		required : true
	    	}
	    });
	 //上传zip
	 function upload(_url) {
			TRIG.progress();
			_url += "?siteid=" + TRIG.CMS.getWebsiteID() + "&" + TRIG.Contants.CSRF_PARA + "=" + getCookie(TRIG.Contants.CSRF_COOKIE);
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
						$("#uploadsModal").modal('hide');
						ttable.reload(); 
						TRIG.messager.alert("上传成功");
					}else {
						TRIG.successHandle(data);
					}
				},  
				error: function(data, status, e) {  
						alert(e);  
						TRIG.progressClose();
					}  
			});
		}
	 
	 //导出
	 $("#exportTemplate").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		if(TRIG.isSelect(rows)){
			var ids="";
			objs.each(function (){
				ids+=this.value+",";
			});
			window.open(cmsTemplate.url.exportTemplate + "?ids=" + ids);
		};
		
	});
	 //整站导出
	 $("#exportSite").bind('click', function(){
		 window.open(cmsTemplate.url.exportSite + "?siteid=" + TRIG.CMS.getWebsiteID());
	 });
	 //一键生成
	 $("#oneKeyGeneration").bind('click',function(){
		 TRIG.trackPost(cmsTemplate.url.oneKeyGeneration, "siteid=" + TRIG.CMS.getWebsiteID(), function(data){
				TRIG.messager.alert('生成成功'); 
			});
	 });
});

