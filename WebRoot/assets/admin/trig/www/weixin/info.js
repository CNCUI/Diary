$(function(){
	var weixinInfo = {};
	weixinInfo.url = {};
	weixinInfo.url.add = 'www/weixin/info_add.json';
	weixinInfo.url.update = 'www/weixin/info_update.json';
	weixinInfo.url.del = 'www/weixin/info_delete.json';
	weixinInfo.url.find = 'www/weixin/info_findPageList.json';
	
	
	var tablerows = []; 
    var table = $('#trig-weixinInfo-table');
    var ttable = new TRIG.Datatable({
		table : table, 
		url : weixinInfo.url.find, 
		
		paging : false,
		columns : [
				   { "data": null, "render": function(data, type, row, mete){ 
					   tablerows[row.wi_infoId] = row;
						return '<input type="checkbox" class="checkboxes" value="'+row.wi_infoId+'"/>';   
				   }, orderable: false, className: "trig-checkbox" },
		                 { "data": "wi_weixinName", "render":function(data,type,row,mete){
		                	 return '<span class="row-details row-details-close" dataid="'+row.wi_infoId+'"></span> ' + data;
		                 } },
		           
						{ "data": "wi_userName" },
						{ "data": "wi_weixinType", "render":function(data,type,row,mete){
		                	 return data=='0'?"订阅 ": data=='1'?"服务 ":"企业";  
		                 }},
		                 { "data": "wi_weixinID" },
		                 { "data": "wi_appid" },
		                 { "data": "wi_state" , "className" : "hidden-xs", "render" : function(value) {
		                	 return TRIG.getYesNoHtml(value);
		                 }},
		                 { "data": "wi_createTime" }
		],
		order: [[7,'desc']], 
		dblclick : function() {   // 双击打开编辑浮层
			// 是否有修改权限
	    	if(TRIG.isPrivlege("updateWeixinInfo")) {
	    		showUpdate();
	    	}
		} 
    });
 
   
    ttable.next(); // 初始下一个按钮事件
    ttable.prev(); // 初始上一个按钮事件
   
  
    
    // 显示更多字段值
    ttable.initMore(function(id) { 
   	 var rowData = tablerows[id];
   	 var sOut = '<table>';
   	 sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">APPSECRET：</div></td><td>' + rowData.wi_appsecret + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">TOKEN(令牌)：</div></td><td>' + rowData.wi_token + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">消息加解密密钥：</div></td><td>' + rowData.wi_aeskey + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">消息加解密方式：</div></td><td>' + rowData.wi_aestype + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">创建人：</div></td><td>' + rowData.wi_createUserId + '</td></tr>';
        sOut += '</table>';
        return  sOut;
    });
    
    $("#website_list_reload").bind('click', function(){
    	ttable.reload();
    });
    
   
    // 新增
    $("#addWeixinInfo").bind('click',function(){
    	TRIG.formreset($("#weixinInfoEditform"));
    	TRIG.hidePrveNext();
    	$("#weixinInfoEditModal").modal('show');
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
			TRIG.forminit($("#weixinInfoEditform"), data);
			$("#weixinInfoEditModal").modal('show');
		}
    }
    
    // 打开修改编辑浮层
    $("#updateWeixinInfo").bind('click', function(){
    	showUpdate();
    });
    
    // 是否点击保存&关闭
    var saveclose = false;
    // 添加/编辑->保存
    TRIG.FormValidate("weixin_info", "weixinInfoEditform",  function (form) {
			var _url = weixinInfo.url.add;
			var isadd = true;
			if($("#wi_infoId").val()!='') {
				_url = weixinInfo.url.update;
				isadd = false;
			}
			TRIG.trackPost(_url, $(form).serialize(), function(data){
				
				if(isadd == true) {
					TRIG.formreset($("#weixinInfoEditform")); 
				}
				if(saveclose) {
					$("#weixinInfoEditModal").modal('hide');  
				} 
				TRIG.updateSuccessAlert(); 
			});
			return false;
    });
    $(".trigsaveclose").bind('click', function(){
    	saveclose = true; 
    }); 
    // 关闭编辑浮层刷新列表 
    $("#weixinInfoEditModal").on('hidden', function(){
    	ttable.reload();
    	saveclose = false;
    });
    
    // 删除
    $("#deleteWeixinInfo").bind('click', function(){
    	var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelRecycleBinSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(weixinInfo.url.del, "ids=" + ids, function(data){
				ttable.reload();
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
    
});