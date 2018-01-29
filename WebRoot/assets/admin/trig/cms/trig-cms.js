
TRIG.CMS = TRIG.CMS || {};

TRIG.CMS.EditorType = "ueditor"; // ueditor/ckeditor
TRIG.CMS.TempateType = "freemarker";

TRIG.CMS.getStatusStr = function(status) {
	if(status=='0') {
		return '<span class="label label-sm label-info"> 新增 </span>';
	} else if(status=='1') {
		return '<span class="label label-sm label-warning"> 等待发布 </span>';
	} else if(status=='2') {
		return '<span class="label label-sm label-danger"> 撤消 </span>';
	} else if(status=='3') {
		return '<span class="label label-sm label-info"> 工作流 </span>';
	} else if(status=='4') {
		return '<span class="label label-sm label-success">	发布 </span>';
	} else if(status=='5') {
		return '<span class="label label-sm label-danger"> 删除 </span>';
	} else if(status=='6') {
		return '<span class="label label-sm label-danger"> 工作流被删除 </span>';
	} else if(status=='7') {
		return '<span class="label label-sm label-danger"> 工作流撤消 </span>';
	} else if(status=='8') {
		return '<span class="label label-sm label-danger"> 工作流审核未通过 </span>';
	} else if(status=='9') {
		return '<span class="label label-sm label-info"> 工作流级次审核 </span>';
	} else if(status=='10') {
		return '<span class="label label-sm label-info"> 栏目发布 </span>';
	} else if(status=='11') {
		return '<span class="label label-sm label-info"> 栏目撤消 </span>';
	}
	return "";
};

TRIG.CMS.setStatusSelect = function(id) {
	var opts = document.getElementById(id).options;
	opts.add(new Option('发布', '4'));
	opts.add(new Option('栏目发布', '10'));
	opts.add(new Option('撤消', '2'));
	opts.add(new Option('栏目撤消', '11'));
	opts.add(new Option('删除', '5'));
};

// 是否工作状态
TRIG.CMS.isWorkStatus = function(st) {
	// 等待发布、工作流状态
	return st == '1' || st == '3'; 
};

//标签选择,默认多选
TRIG.CMS.selectTag = function(id, multiple) {
	 $("#" + id).select2({
	        minimumInputLength: 0,   
	        multiple : multiple == false ? multiple : true, 
	        placeholder : '请选择标签',
	        allowClear: true,
	        ajax: {  
	            url: TRIG.PATH + "/cms/tag_select.json",
	            dataType: 'json',
	            data: function (term, page) {
	                return {
	                	ct_tagName : term,
	                	rows:10 
	                };
	            },
	            results: function (data, page) { // parse the results into the format expected by Select2.
	            	var datas = [];
	            	for(var i=0;i<data.data.length;i++) {
	            		datas.push({id:data.data[i].ct_tagId,text:data.data[i].ct_tagName});
	            	}
	                return {
	                    results: datas 
	                };
	            }
	        }
	    }); 
};

TRIG.CMS.selectItemTagData = function(id, itemid) {
	// 已绑定标签数据
	$.ajax({dataType: 'json', url : TRIG.PATH + '/cms/item_tag_findList.json', data: 'cit_itemId='+itemid, success: function(data) {
			var datas = [];
			for(var i=0; i<data.length;i++) {
				datas.push({id :  data[i].ct_tagId, text : data[i].ct_tagName});
			}	
			$("#" + id).select2('data', datas);
		}
	});
};

TRIG.CMS.selectTagData = function(id, ids) {
	if(ids) {
		// 已绑定标签数据
		$.ajax({dataType: 'json', url :TRIG.PATH +  '/cms/tag_selectIds.json', data: 'ids='+ids, success: function(data) {
				var datas = [];
				for(var i=0; i<data.length;i++) {
					datas.push({id :  data[i].ct_tagId, text : data[i].ct_tagName});
				}	
				$("#" + id).select2('data', datas);
			}
		});
	} else {
		TRIG.CMS.clearSelect(id);
	}
	
};

// 内容选择
TRIG.CMS.selectItem = function(id, multiple, isallsite) {
	$("#" + id).select2({
        minimumInputLength: 0,   
        multiple : multiple ? multiple : false, 
        placeholder : '请选择内容',
        allowClear: true,
        ajax: {  
            url: TRIG.PATH + "/cms/item_select_find.json",
            dataType: 'json',
            data: function (term, page) {
                return {
                	ci_itemName : term,
                	ci_siteId : isallsite!= true ? TRIG.CMS.getWebsiteID() : "", // 是否查找所有站点内容
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
};

TRIG.CMS.selectItemData = function(id, ids, multiple) {
	if(ids) {
		$.ajax({dataType: 'json', url : TRIG.PATH + '/cms/item_select_ids.json', data: 'ids='+ids, success: function(data) {
				var datas = [];
				for(var i=0; i<data.length;i++) {
					datas.push({id :  data[i].ci_itemId, text : data[i].ci_itemName});
				}
				if(multiple)
					$("#" + id).select2('data', datas);
				else 
					$("#" + id).select2('data', datas[0]);
			}
		});
	} else {
		TRIG.CMS.clearSelect(id);
	}
};

//资源选择
TRIG.CMS.selectResource = function(id, type, multiple) {
	$("#" + id).select2({
        minimumInputLength: 0,   
        multiple : multiple ? multiple : false, 
        allowClear: true,
        placeholder : '请选择资源',
        formatResult : function(state){
        	return (state.type == 'IMG_FILE' ? '<img src="' + TRIG.PATH + state.filePath + '" width="50"/> ' : '') + state.text;
        },
        formatSelection : function(state){
        	return (state.type == 'IMG_FILE' ? '<img src="' + TRIG.PATH + state.filePath + '" height="20"/> ' : '') + state.text;
        },
        ajax: {  
            url: TRIG.PATH + "/cms/resource_select_findList.json",
            dataType: 'json',
            data: function (term, page) {
                return {
                	searchKey : term,
                	cr_fileType : type,
                	cr_siteId : TRIG.CMS.getWebsiteID(),
                	rows:10 
                };
            },
            results: function (data, page) { // parse the results into the format expected by Select2.
            	var datas = [];
            	for(var i=0;i<data.data.length;i++) {
            		datas.push({id:data.data[i].cr_resourceId,text:data.data[i].cr_fileName, 
            			filePath : data.data[i].cr_filePath, type : data.data[i].cr_fileType });
            	}
                return {
                    results: datas 
                };
            }
        }
    });
};

TRIG.CMS.selectResourceData = function(id, ids, multiple) {
	if(ids) {
		$.ajax({dataType: 'json', url : TRIG.PATH + '/cms/resource_select_findIds.json', data: 'ids='+ids, success: function(data) {
				var datas = [];
				for(var i=0; i<data.rows.length;i++) {
					datas.push({id :  data.rows[i].cr_resourceId, text : data.rows[i].cr_fileName, 
            			filePath : data.rows[i].cr_filePath, type : data.rows[i].cr_fileType  });
				}
				if(multiple)
					$("#" + id).select2('data', datas);
				else 
					$("#" + id).select2('data', datas[0]);
			}
		});
	} else {
		TRIG.CMS.clearSelect(id);
	}
};

TRIG.CMS.clearSelect = function(id) {
	$("#" + id).select2('val', '');
};

TRIG.CMS.setRightWebSiteSelect = function(id, siteclick, isall) {
	if(TRIG.CMS.WebSiteList.length == 0) {
		TRIG.messager.alert("请先新增站点");
		//$(".trig-privbtn").addClass('disabled');
		return false;
	} 
	var rightdefwebsiteidCookie = getCookie('rightdefwebsiteid');
	var sitemap = [];
	var html = '<div class="page-toolbar">\
							<div class="btn-group pull-right">\
								<button type="button" class="btn btn-fit-height grey-salt dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-delay="1000" data-close-others="true">\
								<span id="rightdefwebsiteid"></span> <i class="fa fa-angle-down"></i>\
								</button>\
								<ul class="dropdown-menu pull-right" role="menu">';
	var rightdefwebsitename = '';
	if(isall) {
		html += '<li><a href="javascript:;" id="" class="rightwebsite">全部</a></li>';
		sitemap[''] = '全部';
	}
	for(var i=0;i<TRIG.CMS.WebSiteList.length;i++){
		if(rightdefwebsiteidCookie && TRIG.CMS.WebSiteList[i].cw_siteId == rightdefwebsiteidCookie) {
			rightdefwebsitename = TRIG.CMS.WebSiteList[i].cw_siteName;
		}
		html += '<li><a href="javascript:;" id="'+TRIG.CMS.WebSiteList[i].cw_siteId+'" class="rightwebsite">'+TRIG.CMS.WebSiteList[i].cw_siteName+'</a></li>';
		sitemap[TRIG.CMS.WebSiteList[i].cw_siteId] = TRIG.CMS.WebSiteList[i].cw_siteName;
	}
								
				html += '</ul>\
							</div>\
					</div>';
	$("#" + id).append(html);
	if(TRIG.CMS.WebSiteList.length > 0) {
		if(rightdefwebsitename == '') {
			if(isall) {
				rightdefwebsitename = '全部';
				rightdefwebsiteidCookie = '';
			} else {
				rightdefwebsitename = TRIG.CMS.WebSiteList[0].cw_siteName;
				rightdefwebsiteidCookie = TRIG.CMS.WebSiteList[0].cw_siteId;
			}
			setCookie('rightdefwebsiteid', rightdefwebsiteidCookie);
		}
		$("#rightdefwebsiteid").text(rightdefwebsitename);
	}
	var _setSiteId = function(id) {
		setCookie('rightdefwebsiteid', id);
		rightdefwebsiteidCookie = id;
		$("#rightdefwebsiteid").text(sitemap[id]);
	};
	
	$(".rightwebsite").bind('click', function() {
		_setSiteId(this.id);
		siteclick.call(this, this.id);
	});
	
	return {
		getId : function() {
			return rightdefwebsiteidCookie;
		}
	}
};

TRIG.CMS.getWebsiteDir = function(siteid) {
	for(var i=0;i<TRIG.CMS.WebSiteList.length;i++){
		if(TRIG.CMS.WebSiteList[i].cw_siteId == siteid)
			return TRIG.CMS.WebSiteList[i].cw_siteDir;
	}
	return "";
};

TRIG.CMS.getWebsiteID = function() {
	var siteid = getCookie('rightdefwebsiteid');
	if(!siteid) {
		siteid = TRIG.CMS.WebSiteList[0].cw_siteId;
	}
	return siteid;
};

TRIG.CMS.getWebsite = function(siteid) {
	siteid = siteid || getCookie('rightdefwebsiteid');
	for(var i=0;i<TRIG.CMS.WebSiteList.length;i++){
		if(TRIG.CMS.WebSiteList[i].cw_siteId == siteid)
			return TRIG.CMS.WebSiteList[i];
	}
	return {};
};

TRIG.CMS.InitWebSiteList = function() {
	$.getJSON(TRIG.PATH + '/cms/website_userList.json', '', function(data) {
		TRIG.CMS.WebSiteList = data;
	});
};

$(function() {
	TRIG.CMS.InitWebSiteList();
});

TRIG.CMS.createEditor = function(id, name) {
	var value = $("#" + name).val();
	TRIG.CMS.updateEditor(id, name, value);
};

TRIG.CMS.updateEditor = function(id, name, value) {
	if(TRIG.CMS.EditorType == 'ueditor') {
		try {
			UE.delEditor(name);
		} catch(e) { 
			// 可能已经清除
		}
		$("#" + name).remove(); // 清除，会多个合并提交
		$("#" + id).html('<script id="'+name+'"  name="'+name+'" type="text/plain"></script>');
		var ue = UE.getEditor(name, {
			initialFrameWidth: 'auto',
			zIndex: 99999,
			initialFrameHeight: 500,
			lang : 'zh-cn'
		});
		ue.ready(function(){
			if(value && value != 'null')
				this.setContent(value);
		});
	} else if(TRIG.CMS.EditorType == 'textarea') { // 不使用编辑器
		if($("#" + id).find('textarea').size()==0)
			$("#" + id).html('<textarea rows="5"  name="'+name+'" id="'+name+'">'+value+'</textarea>');
	} else {
		$("#" + id).html('<textarea rows="5"  name="'+name+'" id="'+name+'">'+value+'</textarea>');
		 CKEDITOR.replace(name, { on: {
				change: function(evt){
					$("#" + evt.editor.name).val(evt.editor.getData());
				}
			}, 
			height : '500px'
		});
	}
	
};

TRIG.CMS.updateEditorValue = function() {
	
};

TRIG.CMS.Editor = function(id, name) {
	var editor = null;
	if(TRIG.CMS.EditorType == 'ueditor') {
		editor = new TRIG.CMS.UEditor(id, name);
	} else if(TRIG.CMS.EditorType == 'textarea') { // 不使用编辑器
		editor = new TRIG.CMS.TextEditor(id, name);
	} else {
		editor = new TRIG.CMS.CKEditor(id, name);
	}
	return {
		getValue : function() {
			return editor.getValue();
		},
		setValue : function(value) {
			editor.setValue(value); 
		}, updateValue : function() {
			editor.updateValue();
		}, 
		init : function() {
			editor.init();
		}
	}
};

TRIG.CMS.UEditor = function(id, name) {
	try {
		UE.delEditor(name);
	} catch(e) { 
		// 可能已经清除
	}
	//<script src="'+TRIG.PATH+'/assets/admin/ueditor/dialogs/template/'+TRIG.CMS.getWebsiteID()+'.js?'+new Date().getTime()+'" type="text/javascript"></script>
	$("#" + id).html('<script id="'+name+'"  name="'+name+'" type="text/plain"></script>');
	var editor = UE.getEditor(name, {
		initialFrameWidth: 'auto',
		zIndex: 99999,
		initialFrameHeight: 500,
		lang : 'zh-cn'
	});
	
	return {
		getValue : function() {
			return editor.getContent();
		},
		setValue : function(value) {
			setTimeout(function(){
				if(value)
					editor.setContent(value);
				else
					editor.setContent('');
			}, 500);
		}, 
		updateValue : function(){
			$("[name='" + name+"']").val(editor.getContent());
		}, 
		init : function() {
			
		}
	}
};

TRIG.CMS.TextEditor = function(id, name) {
	if($("#" + id).find('textarea').size()==0)
		$("#" + id).html('<textarea rows="5"  name="'+name+'" id="'+name+'">'+value+'</textarea>');
	return {
		getValue : function() {
			return $("#" + name).val();
		},
		setValue : function(value) {
			$("#" + name).val(value);
		}, updateValue : function(){},
		init : function() {}
	}
};



TRIG.CMS.CKEditor = function(id, name) {
	var _init = function() {
		//加载当前站点下的模板配置文件
		CKEDITOR.config.templates_files = [TRIG.PATH +'/assets/admin/ckeditor/plugins/templates/templates/'+TRIG.CMS.getWebsiteID()+'.js?'+new Date().getTime()];
		var site = TRIG.CMS.getWebsite();
		//加载当前站点下的样式文件
		if(site.cw_mainCss)
			CKEDITOR.config.contentsCss = TRIG.PATH + site.cw_mainCss; 
		else
			CKEDITOR.config.contentsCss = '';
	}
	
	_init();
	
	$("#" + id).html('<textarea rows="5"  name="'+name+'" id="'+name+'"> </textarea>');
	var editor = CKEDITOR.replace(name, { on: {
			change: function(evt){
				$("#" + evt.editor.name).val(evt.editor.getData());
			}
		}, 
		height : '500px',
	});
	return {
		getValue : function() {
			return editor.getData();
		},
		setValue : function(value) { //value是原文本域的值
			//加载当前站点下的模板配置文件
			_init();
			if($("#itemEditModal").css("display") =='none') {
				$("#" + id).html('<textarea rows="5"  name="'+name+'" id="'+name+'">'+ value +'</textarea>');
				editor = CKEDITOR.replace(name, { on: {
						change: function(evt){
							$("#" + evt.editor.name).val(evt.editor.getData());
						}
					}, 
					height : '500px'
				});
			} else {
				editor.setData(value);
			}
		},
		updateValue : function(){
			$("#" + name).val(editor.getData());//修改
		}, 
		init : function() {
			_init();
		}
	}
};

//-------------在光标之后插入内容  start 2015/10/9-------------
$.fn.insertContent = function(myValue, t) {  
       var $t = $(this)[0];  
 
       if (document.selection) { //ie  
           this.focus();  
           var sel = document.selection.createRange();  
           sel.text = myValue;  
           this.focus();  
           sel.moveStart('character', -l);  
           var wee = sel.text.length;  
           if (arguments.length == 2) {  
               var l = $t.value.length;  
               sel.moveEnd("character", wee + t);  
               t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);  
               sel.select();  
           }  
       } else if ($t.selectionStart || $t.selectionStart == '0') {  
           var startPos = $t.selectionStart;  
             
           var endPos = $t.selectionEnd;  
           var scrollTop = $t.scrollTop;  
           $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);  
           /*this.focus();  
           $t.selectionStart = startPos + myValue.length;  
           $t.selectionEnd = startPos + myValue.length;  
           $t.scrollTop = scrollTop;  */
           if (arguments.length == 2) {  
               $t.setSelectionRange(startPos - t, $t.selectionEnd + t);  
               //this.focus();  
           }  
       }  
       else {  
           this.value += myValue;  
           //this.focus();  
       }         
   };  
   
   //接口输入搜索
   TRIG.CMS.SERVICE_DATA="";   //用于存储所找到的相关service的数据
   TRIG.CMS.selectService = function(id) {
		 $("#" + id).select2({
	        minimumInputLength: 0,   
	        multiple : false, 
	        placeholder : '接口',
	        
	        ajax: {  
	            url: TRIG.PATH + "/cms/template_selectService.json",
	            dataType: 'json',
	            data: function (term) {
	                return {
	                	service_name : term
	                };
	            },
	            results: function (data) { 
	            	TRIG.CMS.SERVICE_DATA=data;
	            	var datas = [];
	            	for(var i=0;i<data.length;i++) {
	            		datas.push({id:data[i].index,text:data[i].ctp_templateName});
	            	}
	                return {
	                    results: datas 
	                };
	            }
	        }
	    }); 
	};
	//内容输入搜索
	TRIG.CMS.selectItemList= function(id,siteid) {
		 $("#" + id).select2({
	        minimumInputLength: 0,   
	        multiple : false, 
	        placeholder : '内容',
	        ajax: {  
	            url:TRIG.PATH +  "/cms/template_selectItem.json",
	            dataType: 'json',
	            data: function (term) {
	                return {
	                	item_name : term,
	                	ctp_siteId: siteid
	                };
	            },
	            results: function (data) { 
	            	var datas = [];
	            	for(var i=0;i<data.length;i++) {
	            		datas.push({id:data[i].alias,text:data[i].ctp_templateName});
	            	}
	                return {
	                    results: datas 
	                };
	            }
	        }
	    }); 
	};
	
	//组件输入搜索
	TRIG.CMS.selectComponentList= function(url,id,siteid,cid) {
		 $("#" + id).select2({
	        minimumInputLength: 0,   
	        multiple : false, 
	        placeholder : '组件',
	        ajax: {  
	            url: url,
	            dataType: 'json',
	            data: function (term) {
	                return {
	                	cc_componentName : term,
	                	cc_siteId: siteid,
	                	cc_componentId:cid
	                };
	            },
	            results: function (data) { 
	            	var datas = [];
	            	for(var i=0;i<data.length;i++) {
	            		datas.push({id:data[i].cc_componentFile,text:data[i].cc_componentName});
	            	}
	                return {
	                    results: datas 
	                };
	            }
	        }
	    }); 
	};
	
	//模板属性输入搜索
	TRIG.CMS.selectPropertyList= function(id,ctp_templateId, siteid) {
		 $("#" + id).select2({
	        minimumInputLength: 0,   
	        multiple : false, 
	        placeholder : '模板属性',
	        ajax: {  
	            url: TRIG.PATH + "/cms/template_property_findPropertyList.json",
	            dataType: 'json',
	            data: function (term) {
	                return {
	                	ctp_propertyName : term,
	                	ctp_templateId: ctp_templateId,
	                	siteid : siteid
	                };
	            },
	            results: function (data) { 
	            	var datas = [];
	            	for(var i=0;i<data.length;i++) {
	            		datas.push({id:data[i].ctp_propertyName,text:data[i].ctp_propertyName});
	            	}
	                return {
	                    results: datas 
	                };
	            }
	        }
	    }); 
	};
	