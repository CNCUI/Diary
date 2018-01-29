$(function(){
	
	var siteid ="";
	var pid = "";
	//对象定义
	var weixinMenu = function () {
			// 访问URL定义
			var url = { 
					add : 'www/weixin/menu_add.json',
					update : 'www/weixin/menu_update.json',
					del : 'www/weixin/menu_delete.json',
					find : 'www/weixin/menu_findPageList.json',
					tree : 'www/weixin/menu_findTree.json',
					selectParentMenu : 'www/weixin/menu_selectParentMenu.json',
					move:'www/weixin/menu_move.json',
					updateSort:'www/weixin/menu_updateSort.json',
					sorts : 'www/weixin/menu_updateSorts.json',
					createWechatMenu : "www/weixin/menu_createWechatMenu.json"
			};
			
			// 变量定义
			var movesortno = 5; //移动时排序的字段
			var defpid = "6";
			pid = defpid; 
			var defsiteid = TRIG.WEIXIN.setRightInfoSelect('right-page-bar', function(id){
				siteid = id; //公众号id
				//刷新表格
				ttable.query({ 
					'wm_parentMenuId': defpid,
		    		'wm_infoId' : siteid
		    	}); 
				//刷新树
				$('#menu_tree').jstree('refresh_node', {id: defpid, 'wm_infoId' : siteid});   
				pid = defpid;
			}).getId();
			siteid = defsiteid;//设置一个默认的站点
			
			// 左菜单树
			$('#menu_tree').jstree({
		        "core" : {
		            "themes" : {
		                "responsive": false
		            }, 
		            // so that create works
		            "check_callback" : true,
		            'data' : {
		            	'dataType' : "json",  
		                'url' : function (node) {
		                  return url.tree;
		                },
		                'data' : function (node) {
		                  return { 'id' : node.id=='#'?'':node.id, 'cid':pid , 'wm_infoId' : siteid}; 
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
			
			//点击节点
			 $('#menu_tree').on('select_node.jstree', function(e,data) { 
			    	pid = data.node.id;//节点id
			    	ttable.query({'wm_parentMenuId': pid, 'wm_infoId' : siteid}); 
			    	setParentMenuList();
			        return false;
			    });
			    
			// 列表数据
			var tablerows = [];
			// 表格
			var table = $('#trig-weixinMenu-table');
			var ttable = null;
		    
			// 列表初始
			var tableInit = function() {
				ttable = new TRIG.Datatable({
			    		table : table, 
			    		url :url.find, 
			    		columns : [
			    				   { 
			    					   "data": null, 
			    					   "render": function(data, type, row, mete){
			    						   tablerows[row.wm_menuId] = row;
			    						   return '<input type="checkbox" class="checkboxes" value="'+row.wm_menuId+'"/>'; //TODO 这里是ID列，这里修改...  
			    					   }, 
			    					   orderable: false, 
			    					   className: "trig-checkbox" 
			    				   },
			    				   { 
			    					   "data": "wm_menuName", 
			    					   "render":function(data,type,row,mete){
			    		                	 return '<span class="row-details row-details-close" dataid="'+row.wm_menuId+'"></span> ' + data ;  //TODO 这里显示更多，这里修改ID...  
			    		                }
			    				   },
			    		           { "data": "wm_parentMenuName" },
			    		           { "data": "wm_menuType" },
			    		           { "data": "wm_menuKey" },
			    		           { "data": "wm_sortNo" },
			    		           { "data": "wm_createTime" }
			    		],
    					order: [[6,'desc']],
			    		dblclick : function() {   // 双击打开编辑浮层
			    			// 是否有修改权限
			    	    	if(TRIG.isPrivlege("updateWeixinMenu")) { 
			    	    		updateOpen();
			    	    	}
			    		},
			    		queryParams : {
			    			wm_infoId : defsiteid,
			    			wm_parentMenuId : defpid
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
						 			TRIG.trackPost(TRIG.getContentUrl(url.move, pid),'id=' + id + '&moveId=' + moveid, function(data){
											ttable.reload();
									});
							}
						}
			    });
				
				// 显示更多字段值
				ttable.initMore(function(id) { 
			    	 var rowData = tablerows[id];
			    	 var sOut = '<table>';
			    	 sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
			    	 sOut += '<tr><td><div class="trig-more-content">创建人：</div></td><td>' + rowData.wm_createUser+ '</td></tr>';
			    	 sOut += '<tr><td><div class="trig-more-content">公众号：</div></td><td>' + rowData.wm_infoId+ '</td></tr>';
			    	 sOut += '<tr><td><div class="trig-more-content">URL：</div></td><td>' + rowData.wm_url+ '</td></tr>';
			         sOut += '</table>';
			         return  sOut;
				});
			};
			
			
			
			var updateOpen = function() {
				var ids = ttable.getCheckbox();
				var rows = ids.size();
				// 是否选择单条记录
				if(TRIG.isSelectOne(rows)) {
					TRIG.showPrveNext(); 
					var id = ids.get(0).value;
					var data = tablerows[id];
					// 初始表单数据
					TRIG.forminit($("#weixinMenuEditform"), data);
					$("#weixinMenuEditModal").modal('show');
				}
			};
			
			// 表单数据保存，新增/修改保存
			var formSaveInit = function() {
				// 表单选择数据初始
				// 是否点击保存&关闭
			    var saveclose = false;
				TRIG.Validate("weixinMenuEditform",  function (form) { 
					var _url = url.add;
					var isadd = true;
					if($("#wm_menuId").val()!='') {
						_url =url.update; 
						isadd = false; 
					}
					TRIG.trackPost(_url, $(form).serialize(), function(data){
						if(isadd == true) {
							TRIG.formreset($("#weixinMenuEditform")); 
						}
						// 保存&关闭
						if(saveclose) {
							$("#weixinMenuEditModal").modal('hide'); 
						}
						TRIG.updateSuccessAlert();
					});
					// 必须flase，阻止form submit
					return false;
				},{
					wm_parentMenuId : {
						required : true
					},
					wm_menuName : {
						required : true
					}
				});
				
				// 点击保存关闭设置saveclose=true，保存时判断
			    $(".trigsaveclose").bind('click', function(){
			    	TRIG.SAVECLOSE = true; 
			    	saveclose = true;
			    });
			    
			    // 编辑浮层关闭刷新列表数据
			    $("#weixinMenuEditModal").on("hidden", function(){   
					ttable.reload();
					//刷新树
					$('#menu_tree').jstree('refresh_node', {id: defpid, 'wm_infoId' : siteid}); 
					saveclose = false; 
				});
			};
			
			return {
				// 查询
				query : function() {
					ttable.query({ 'wm_infoId' : siteid,'wm_parentMenuId': pid});  
				},
				// 打开新增
				addWindowOpen : function() {
					TRIG.formreset($("#weixinMenuEditform"));
    				TRIG.hidePrveNext();
    				$("#wm_infoId").val(siteid);//给公众号赋值
    				setParentMenuList(pid);
    				$("#weixinMenuEditModal").modal('show');
				},
				// 打开修改/编辑
				updateWindowOpen : function() {
					updateOpen();
				},
				// 删除
				del : function() {
					var objs = ttable.getCheckbox();
					var rows = objs.size();
					TRIG.isDelSelectOne(rows,function(){
						var ids = "";
						objs.each(function(){
							ids += this.value + ",";
						});   
						TRIG.trackPost(url.del, "ids=" + ids, function(data){
							ttable.reload();
							//刷新树
							$('#menu_tree').jstree('refresh_node', {id: defpid, 'wm_infoId' : siteid}); 
						});
					});
				},
				// 发布到微信
				createWechatMenu : function() {
					TRIG.trackPost(url.createWechatMenu, "wm_infoId=" + siteid, function(data){
						 if(data.success){
							 TRIG.messager.alertSuccess(data.message);
						 }else{
							 TRIG.messager.alertError(data.message);
						 }
					});
				},
				init : function() {
					tableInit();
					
					ttable.next(); // 初始下一个按钮事件
				    ttable.prev(); // 初始上一个按钮事件
				    formSaveInit();
				    
				    //移动
				    TRIG.move({
				    	url: url.move,
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
				    	//刷新树
						$('#menu_tree').jstree('refresh_node', {id: defpid, 'wm_infoId' : siteid}); 
				    }, function(){
				    	return pid;
				    });	
				    
				    
				    // 重置排序
				    $(".moveCmsItem").bind('click', function(){
				    	TRIG.trackPost(TRIG.getContentUrl(url.sorts, pid),"id=" + pid, function(data){
								//refreshtree();
								ttable.reload(); 
						});
				    });
				    
				    
				    
				    var updatesort = "";
				    // 修改排序值
				    $(".itemSort").bind('click', function(){
				    	var ids = ttable.getCheckbox();  
						var rows = ids.size();
				    	if(TRIG.isSelectOne(rows)) {
				    		var rowData =  tablerows[ids.val()];
				    		updatesort = rowData.wm_sortNo;
				    		TRIG.forminit($("#itemSortEditform"), rowData);
				    		$("#itemSortModal").modal('show');
				    	}
				    });
				    
				    TRIG.Validate("itemSortEditform",  function (form) {
				    
							TRIG.trackPost(TRIG.getContentUrl(url.updateSort, pid), $(form).serialize(), function(data){
								ttable.reload();
								$("#itemSortModal").modal('hide');  
								//refreshtree();
								TRIG.updateSuccessAlert(); 
							});
							return false;
					}, {
						wm_sortNo : { 
				    		required : true,
				    		integer : true
				    	}
					});
				},
				getTable : function() {
					return ttable;
				},
				getTableRows : function() {
					return tablerows;
				}
					
			};
			
			
			
	}(); // 定义并执行
	
	// 执行初始
    weixinMenu.init();
    
    // 设置新增页面下拉菜单
    function setParentMenuList(menuId) {
    	//组件选择列表
        $.getJSON('www/weixin/menu_selectParentMenu.json?wm_infoId='+siteid, function(data){
        	var options = document.getElementById("wm_parentMenuId").options;
        	options.length = 1;
        	for(var i=0;i<data.length;i++) {
        		var option = new Option(data[i].wm_menuName, data[i].wm_menuId);
        		options.add(option); 
        		if(menuId == data[i].wm_menuId){
        			option.selected = true;
        		}
        	}	
        });
	  }  
    //setParentMenuList();
    
    TRIG.dict.setSelectByNOAndCode('wm_menuType','WXMENU_TYPE');
    
   
    // 功能按钮事件绑定
    // 查询
    $("#findWeixinMenu").bind('click', function() {
    	weixinMenu.query();
	});
    $("#addWeixinMenu").bind('click', function(){
    	weixinMenu.addWindowOpen();
    });
    $("#updateWeixinMenu").bind('click', function(){
    	weixinMenu.updateWindowOpen();
    });
    $("#deleteWeixinMenu").bind('click', function(){
    	weixinMenu.del();
//    	setParentMenuList();
    });
    // 发布到微信
    $("#createWechatMenu").bind('click', function(){
    	weixinMenu.createWechatMenu();
    });
    
   
    
    // 日志
    $(".findSysLogs").bind('click', function(){
    	var ids = weixinMenu.getTable().getCheckbox();  
		var rows = ids.size();
    	if(TRIG.isSelectOne(rows)) {
    		var id = ids.get(0).value;
    		TRIG.LOG.openLogs(id); 
    	}
    });
});