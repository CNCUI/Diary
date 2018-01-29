$(function(){
	//对象定义
	var weixinMsg = function () {
			// 访问URL定义
			var url = { 
					del : 'www/weixin/msg_delete.json',
					find : 'www/weixin/msg_findPageList.json'
			};
			// 变量定义
			var defsiteid = TRIG.WEIXIN.setRightInfoSelect('right-page-bar', function(id){
				siteid = id; //公众号id
				//刷新表格
				ttable.query({ 
		    		'wm_infoId' : siteid
		    	}); 
			}).getId();
			var siteid = defsiteid;//设置一个默认的站点
			// 列表数据
			var tablerows = [];
			// 表格
			var table = $('#trig-weixinMsg-table');
			var ttable = null;
		    
			// 列表初始
			var tableInit = function() {
				ttable = new TRIG.Datatable({
			    		table : table, 
			    		url : url.find, 
			    		columns : [{
										"data" : null,
										"render" : function(data, type, row, mete) {
											tablerows[row.wm_msgId] = row;
											return '<input type="checkbox" class="checkboxes" value="'
													+ row.wm_msgId + '"/>'; // TODO
																			// 这里是ID列，这里修改...
										},
										orderable : false,
										className : "trig-checkbox"
									},
									{
										"data" : "wu_nickname",
										"render" : function(data, type, row, mete) {
											if (data == null || data == "") {
												return '<span class="row-details row-details-close" dataid="'
														+ row.wm_msgId
														+ '"></span>';
											}
											return '<span class="row-details row-details-close" dataid="'
													+ row.wm_msgId
													+ '"></span>'
													+ data;
										}
									}, {
										"data" : "wm_msgType"
									}, {
										"data" : "wm_event"
									}, {
										"data" : "wm_eventKey"
									}, {
										"data" : "wm_content"
									}, {
										"data" : "wm_createTime"
									}, {
										"data" : "wm_agentId",
										"bVisible" : false
									}
			    		],
			    	
    					order: [[6,'desc']],
			    		dblclick : function() {   // 双击打开编辑浮层
			    			// 是否有修改权限
			    	    	if(TRIG.isPrivlege("updateWeixinMsg")) { 
			    	    		updateOpen();
			    	    	}
			    		},
			    		queryParams : {
			    			wm_infoId : defsiteid
						},
			    		
			    });
				
				// 显示更多字段值
				ttable.initMore(function(id) { 
			    	 var rowData = tablerows[id];
			    	 var sOut = '<table>';
			    	 sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
			    	 sOut += '<tr><td><div class="trig-more-content">企业应用ID：</div></td><td>' + rowData.wm_agentId + '</td></tr>';
			    	 
			         sOut += '</table>';
			         return  sOut;
				});
			};
			
			return {
				// 查询
				query : function() {
					ttable.query({ name : $("#name").val(),'wm_infoId' : siteid});  
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
						});
					});
				},
				init : function() {
					tableInit();
					
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
    weixinMsg.init();
    
    // 功能按钮事件绑定
    // 查询
    $("#findWeixinMsg").bind('click', function() {
    	weixinMsg.query();
	});
   
    $("#deleteWeixinMsg").bind('click', function(){
    	weixinMsg.del();
    });
  
});