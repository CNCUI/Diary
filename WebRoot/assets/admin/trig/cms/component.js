$(function(){
	var cmsComponent = {};
	cmsComponent.url = {};
	cmsComponent.url.add = 'cms/component_add.json';
	cmsComponent.url.update = 'cms/component_update.json';
	cmsComponent.url.del = 'cms/component_delete.json';
	cmsComponent.url.find = 'cms/component_findPageList.json';
	cmsComponent.url.copy = 'cms/component_copy.json';
	cmsComponent.url.paste = 'cms/component_paste.json';
	cmsComponent.url.addPublish = 'cms/component_addPublish.json';
	cmsComponent.url.getFrontData='cms/component_getFrontData.json';
	cmsComponent.url.returnedUpdateCmsComponent='cms/component_returnedUpdateCmsComponent.json';
	cmsComponent.url.selectService='cms/template_selectService.json';
	cmsComponent.url.revoke='cms/component_revoke.json';
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
		siteid = id;
		ttable.query({ cc_siteId : id}); 
		//TRIG.CMS.selectItemList("ctp_item",siteid); 
		
		//TRIG.CMS.selectComponentList("cms/component_select.json","ctp_component",siteid);
		if(TRIG.isPrivlege("findAd")) {
			setAdList();
		}
		 if(TRIG.isPrivlege("findOnline")) {
			 setQuestList();
		 }
		setOthersList();
	}).getId();
	var siteid = defsiteid;
	
	

	// 复制IDS，多个逗号隔开
	cmsComponent.copyids = "";
	// 复制目录
	//cmsComponent.copydirid = "";
	// 复制类型，copy 复制 cut 剪切
	cmsComponent.copytype = "copy";
	
	
	var tablerows = []; 
	var table = $('#trig-component-table');
	var ttable = new TRIG.Datatable({
			table : table, 
			url : cmsComponent.url.find, 
			columns : [
					   { "data": null, "render": function(data, type, row, mete){
						   tablerows[row.cc_componentId] = row;
							return '<input type="checkbox" class="checkboxes" value="'+row.cc_componentId+'"/>';   
					   }, orderable: false, className: "trig-checkbox" },
					   
					   { "data": "cc_componentName", "render":function(data,type,row,mete){
		                	 var c = '';
		                	 if (ids.indexOf(row.cc_componentId+",")>-1 ){
			     				c = 'color:blue;';
			     			 }
		                	 return '<span class="row-details row-details-close" dataid="'+row.cc_componentId+'"></span> ' 
		                	 			+ '<span style="'+c+'">' + data + '</span>';
		                 } },
			                 { "data": "cc_state", className: "hidden-xs" }, 
			                 { "data": "cc_isUpdate",  "render": function(value){
			                	 return TRIG.getYesNoHtml(value);
			                 }},
			                 { "data": "cc_status", "render": function(data) {
			                	 return TRIG.CMS.getStatusStr(data);
			                 }},
			                 { "data": "cc_createTime", className: "hidden-xs" }
			],
			order: [[5,'desc']],
			queryParams : {
				cc_siteId : defsiteid
			},
			dblclick : function() {   // 双击打开编辑浮层
				// 是否有修改权限
		    	if(TRIG.isPrivlege("updateCmsComponent")) { 
		    		showUpdate();
		    	}
			} 
	});
	
	ttable.next(); // 初始下一个按钮事件
    ttable.prev(); // 初始上一个按钮事件
    
    // 查询
    $("#findCmsComponent").bind('click', function() {
    	ttable.query({ cc_componentName : $("#sComponentName").val(),cc_siteId : siteid}); 
	});
    
    // 高级查询
    TRIG.search('cms_component', $("#findCmsComponent"), ttable);
    
    // 显示更多字段值
    ttable.initMore(function(id) { 
   	 var rowData = tablerows[id];
   	 var sOut = '<table>';
   	 	sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
   	 	sOut += '<tr><td><div class="trig-more-content">描述：</div></td><td>' + rowData.cc_description + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">禁用：</div></td><td>' + rowData.cc_state + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">创建时间：</div></td><td>' + rowData.cc_createTime + '</td></tr>';
        sOut += '</table>';
        return  sOut;
    });
    
    var componentEditor = CodeMirror.fromTextArea(document.getElementById("cc_componentContent"), {
		 mode: 'text/html',
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
    
    // 新增浮层初始
    $("#addCmsComponent").bind('click', function(){
    	TRIG.formreset($("#componentEditform"));
    	TRIG.hidePrveNext();
    	$("#cc_siteId").val(siteid);
    	
    	$("#ctp_item").select2('data',null);
		$("#ctp_service").select2('data',null);
		$("#ctp_component").select2('data',null);
    	//得到各站点组件列表
   	 	TRIG.CMS.selectComponentList("cms/component_select.json","ctp_component",siteid);
   	 	document.getElementById("ctp_item").innerHTML = "";
    	$("#componentEditModal").modal('show'); 
    	setTimeout(
   	    	 function(){
   	    		 componentEditor.getDoc().setValue('');
   	    	     componentEditor.refresh();
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
			
			$("#ctp_item").select2('data',null);
			$("#ctp_service").select2('data',null);
			$("#ctp_component").select2('data',null);
			//得到各站点组件列表(除去自身)
			TRIG.CMS.selectComponentList("cms/component_select.json","ctp_component",siteid,id);
			// 初始表单数据
			TRIG.forminit($("#componentEditform"), data);
			$("#componentEditModal").modal('show');
			setTimeout(
		    	 function(){
		    		 componentEditor.getDoc().setValue(data.cc_componentContent);
		    	     componentEditor.refresh();
				}, 500);
		}
    }
    
    // 打开修改编辑浮层
    $("#updateCmsComponent").bind('click', function(){
    	showUpdate();
    });
    // 是否点击保存&关闭
    var saveclose = false;
    TRIG.FormValidate("cms_component", "componentEditform",  function (form) {
		var _url = cmsComponent.url.add;
		var isadd = true;
		if($("#cc_componentId").val()!='') {
			_url = cmsComponent.url.update; 
			isadd = false; 
		}
		TRIG.trackPost(_url, $(form).serialize(), function(data){
			if(isadd == true) {
				TRIG.formreset($("#componentEditform")); 
				$("#cc_siteId").val(siteid);
			}
			// 保存&关闭
			if(saveclose) {
				$("#componentEditModal").modal('hide'); 
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
	$("#componentEditModal").on("hidden", function(){   
		ttable.reload();
		saveclose = false; 
	});
	
	// 删除
	$("#deleteCmsComponent").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelRecycleBinSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(cmsComponent.url.del, "ids=" + ids, function(data){
				ttable.reload();
			});
		});
	});
	// 复制
	 var ids="";
	 $("#copyCmsComponent").bind('click', function(){
		
	    	var objs = ttable.getCheckbox();
	    	var rows = objs.size();
			if(rows>0) {
				//var ids = "";
				objs.each(function(){
					ids += this.value + ",";
				});   
				cmsComponent.copyids = ids;
				cmsComponent.copytype = 'copy';
				ttable.reload();
			} else {
				TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE);
			}
	    });
    

    //粘贴
	 $("#pasteCmsComponent").bind('click', function(){
	    	if(ids == ""){
				TRIG.messager.alert("没有粘贴的内容");
				return false;
			}
			TRIG.trackPost(cmsComponent.url.copy,"ids=" +ids 
					+ "&siteid=" +siteid, function(data){
				if(data.message!="") alert(data.message);
					ttable.reload();
				  });
				ids="";
	    });
	//发布
	$("#addPublishCmsComponent").bind('click', function(){
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
			TRIG.trackPost(cmsComponent.url.addPublish, "ids=" + ids, function(data){
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
	
	 // 前后台组件比较
	$("#compareCmsComponent").bind('click', function(){
		var ids = ttable.getCheckbox();
		var rows = ids.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			TRIG.showPrveNext(); 
			var id = ids.get(0).value;
			var data = tablerows[id];
			//得到后台组件数据
			var backData=data.cc_componentContent;
			if(data.cc_status=='4'){
				TRIG.trackPost(cmsComponent.url.getFrontData,"id=" + id , function(data){
					var frontData=data.content;	
					TRIG.txtDiffByTxt(frontData, backData, "前台组件", "后台组件");
				});	
			}else{
				TRIG.messager.alert('请先发布！'); 
			}
			
		}
	});
	
	
	 //恢复更新
	 $("#returnedUpdateCmsComponent").bind('click', function(){
		var ids = ttable.getCheckbox();
		var rows = ids.size();
		// 是否选择单条记录
		if(TRIG.isSelectOne(rows)) {
			TRIG.showPrveNext(); 
			var id = ids.get(0).value;
			var data = tablerows[id];
			if(data.cc_status=='4'){
				TRIG.trackPost(cmsComponent.url.returnedUpdateCmsComponent,"id=" + id , function(data){
					ttable.reload();	 
				});	
			}else{
				TRIG.messager.alert('请先发布！'); 
			}
		} 
	 });
	 
	 //item option初始化
	 TRIG.CMS.selectItemList("ctp_item",siteid); 
	 //item  2015/10/9
	 $("#ctp_item").bind("change",function(){ 
		    if($(this).val()==""){
		      return; 
		    } 
		    else{
		      //将选中的内容追加到模板
		      componentEditor.replaceSelection("${item."+$(this).val()+"}"); 
		    } 
	 }); 
	 
	
	 //compont  2015/10/9
	 $("#ctp_component").bind("change",function(){ 
		    if($(this).val()==""){
		      return; 
		    } 
		    else{
		      //将选中的内容追加到模板
		     if(TRIG.CMS.TempateType == 'freemarker') {	
		    	 componentEditor.replaceSelection("<#include \""+$(this).val()+"\" />");
		     } else if(TRIG.CMS.TempateType == 'beetl') {
		    	 componentEditor.replaceSelection("<% include(\""+$(this).val()+"\"){} %>");
		     }
		    } 
	 }); 
	 
	
	 //service选择 2015/10/9  
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
						content= "<% var "+variable+" =@service."+sd.name+"(); %>"; 
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
	 //广告选择列表
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
				    	   componentEditor.replaceSelection(
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
		    	componentEditor.replaceSelection("/online/op.t?id="+$(this).val()); 
			} 
	 }); 
	 
	 //其他
	 setOthersList();
	 //内容评论
	 $("#ctp_others").bind("change",function(){ 
		 	if($(this).val()=="0"){
		 		//将选中的内容追加到模板
		 		componentEditor.replaceSelection(
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
		    	componentEditor.replaceSelection(
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
		    	componentEditor.replaceSelection('<link rel="stylesheet" type="text/css" href="${service.getFrontPath()}/trigcms.css" />');
		    }// 网站监测
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
			componentEditor.replaceSelection(param);
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
 	 
 	//组件撤销
	 $("#revokeCmsComponent").bind("click",function(){ 	
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
				TRIG.trackPost(cmsComponent.url.revoke, "ids=" + ids, function(data){
					ttable.reload();
					TRIG.messager.alert('撤销成功'); 
				});
			}
	 }); 
	 
	 //站点属性
	 TRIG.CMS.selectPropertyList("ctp_property",siteid);
	//内容添加到编辑器
	 $("#ctp_property").bind("change",function(){ 
		    if($(this).val()==""){
		      return; 
		    } 
		    else{
		      //将选中的内容追加到模板
		    	componentEditor.replaceSelection("property."+$(this).val()+""); 
		    } 
	 }); 
});