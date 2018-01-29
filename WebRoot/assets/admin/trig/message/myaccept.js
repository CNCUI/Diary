$(function(){
	var messageInfo = {};
	messageInfo.url = {};
	messageInfo.url.del = 'message/myinfo_accept_delete.json';
	messageInfo.url.find = 'message/myinfo_accept_findPageList.json';
	messageInfo.url.updateState = 'message/myinfo_accept_updateState.json';
	
	var tablerows = []; 
    var table = $('#trig-myaccept-table');
    // begin first table
    var ttable = undefined;
 // 日期选择
	TRIG.daterangepicker("dashboard-report-range", function(start, end){
		st = start.format("YYYY-MM-DD");
		et = end.format("YYYY-MM-DD");
		if(ttable) {
			var un = $("#keywords").val();
	    	ttable.query({ 
	    		mi_content: un,
				startTime: st,
				endTime2: et
				});
		}
	});
    ttable = new TRIG.Datatable({
    		table : table, 
    		url : messageInfo.url.find, 
    		columns : [
    				   { "data": null, "render": function(data, type, row, mete){
    					   tablerows[row.mi_infoId] = row;
    						return '<input type="checkbox" class="checkboxes" value="'+row.mi_infoId+'"/>';   
    				   }, orderable: false, className: "trig-checkbox" },
    		                 { "data": "su_realName", "render":function(data,type,row,mete){
    		                	 return '<span class="row-details row-details-close" dataid="'+row.mi_infoId+'"></span> ' + data;
    		                 }},
    		                 { "data": "mi_content", "className" : "hidden-xs"},  
    		                 { "data": "mia_state" }, 
    		                 { "data": "mi_sendTime", "render":function(value, type, row) {
    		                	 if(value) {
    		     					return value;
    		     				}
    		     				return row.mi_createTime;
    		                 }},
    		                 { "data": "mia_acceptTime", "className" : "hidden-xs"}
    		],
    		queryParams:{
    			startTime: st,
				endTime2: et
    		},
    		order: [[4,'desc']] 
    });
    
    // 显示更多字段值
    ttable.initMore(function(id) { 
   	 	var rowData = tablerows[id];
   		if(rowData.mia_state!='R') {
			$.post(messageInfo.url.updateState,"id=" + rowData.mia_acceptId, function(data){
				TRIG.successHandle(data);
			});
		}
   	 	var sOut = '<table>';
   	 	sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">内容：</div></td><td>' + rowData.mi_content + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">接收时间：</div></td><td>' + rowData.mia_acceptTime + '</td></tr>';
        sOut += '</table>';
        return  sOut;
    });
    
    // 查询
    $("#findMessageInfo").bind('click', function() {
    	ttable.query({ 
    		mi_content : $("#keywords").val(),
    		startTime: st,
			endTime2: et}); 
	});
    
    
	// 删除
	$("#deleteMyMessageInfoAccept").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(sysIcon.url.del, "ids=" + ids, function(data){
				ttable.reload();
			});
		});
	});
	
	$("#updateMyMessageInfoAccept").bind('click', function(){
		var ids = ttable.getCheckbox();  
		var rows = ids.size();
    	if(TRIG.isSelectOne(rows)) {
    		TRIG.progress();
    		ids.each(function(){
				$.post(messageInfo.url.updateState,"id=" + tablerows[this.value].mia_acceptId, function(data) {
					
				});
			});   
			setTimeout(function(){
				ttable.reload();
				TRIG.progressClose();
			}, 2000);
		}
	});
	
});