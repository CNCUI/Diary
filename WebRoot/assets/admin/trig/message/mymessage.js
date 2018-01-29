$(function(){
	var messageInfo = {};
	messageInfo.url = {};
	messageInfo.url.del = 'message/myinfo_accept_delete.json';
	messageInfo.url.find = 'message/myinfo_accept_findPageList.json';
	messageInfo.url.updateState = 'message/myinfo_accept_updateState.json';
	messageInfo.url.findsend = 'message/myinfo_findMySendPageList.json';
	messageInfo.url.findmygroup = 'message/mygroupacceptinfo_findPageList.json';
	messageInfo.url.updatemygroupState = 'message/mygroupacceptinfo_updateState.json';
	messageInfo.url.delmygroup = 'message/mygroupacceptinfo_delete.json';
	messageInfo.url.delmysend = 'message/myinfo_delete.json';
	
	var tablerows = []; 
	var tablerows1 = []; 
	var tablerows2 = []; 
    var table = $('#trig-myaccept-table');
    // begin first table
    var ttable = undefined;
    var ttable1 = undefined;
    var ttable2 = undefined;
    var st;
    var et;
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
	
	//我的收件箱
    ttable = new TRIG.Datatable({
    		table : table, 
    		url : messageInfo.url.find, 
    		columns : [
    				   { "data": null,"render": function(data, type, row, mete){
    					   tablerows[row.mi_infoId] = row;
    						return '<input type="checkbox" class="checkboxes" value="'+row.mi_infoId+'"/>';   
    				   }, orderable: false, className: "trig-checkbox"},
	    				   { "data": "su_realName", "render":function(data,type,row,mete){
			                	 return '<span class="row-details row-details-close" dataid="'+row.mi_infoId+'"></span> ' + data;
			                 }},
    		                 { "data": "mi_content", "className" : "view-message"},  
    		                 { "data": "mia_acceptTime", "className":"trig-th-time view-message hidden-xs"}
    		],
    		queryParams:{
    			startTime: st,
				endTime2: et
    		},
    		order: [[3,'desc']],
    		drawCallback:function(){
    			var tb = $('#trig-myaccept-table tbody');
    			$.each(tb.children(),function(i,item){
    				var tr = $(item);
    				var infoid = $(item).find('td input[type=checkbox]').val();
    				if(!infoid){return;}
    				var row = tablerows[infoid]
    				if(row.mia_state == 'R'){
    					//已读
    					tr.removeClass('unread');
    				}else{
    					tr.addClass('unread');
    				}
    			});
    		}
    });
    
    // 显示更多字段值
    ttable.initMore(function(id) { 
   	 	var rowData = tablerows[id];
   		if(rowData.mia_state!='R') {
			$.post(messageInfo.url.updateState,"id=" + rowData.mia_acceptId, function(data){
				TRIG.successHandle(data);
				$('#trig-myaccept-table tbody span[dataid='+id+']').parent().parent().removeClass('unread');
				//消息
				TRIG.index.findMyinfoAcceptList();
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
    
      
	// 删除我的收件箱
	$("#deleteMyMessageInfoAccept").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += tablerows[this.value].mia_acceptId + ",";
			});   
			TRIG.trackPost(messageInfo.url.del, "ids=" + ids, function(data){
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
    // 查询
    $("#findMessageInfo1").bind('click', function() {
    	ttable1.query({ 
    		mi_content : $("#keywords1").val(),
    		startTime: st,
 		endTime2: et}); 
 	});
    
   //我的发件箱 
   ttable1 = new TRIG.Datatable({
		table : $('#trig-mysend-table'), 
		url : messageInfo.url.findsend, 
		columns : [
				   { "data": null,"render": function(data, type, row, mete){
					   tablerows1[row.mi_infoId] = row;
						return '<input type="checkbox" class="checkboxes" value="'+row.mi_infoId+'"/>';   
				   }, orderable: false, className: "trig-checkbox"},
    				   { "data": "su_realName"},
		                 { "data": "mi_content", "className" : "view-message"},  
		                 { "data": "mi_sendTime", "className":"trig-th-time view-message hidden-xs"}
		],
		queryParams:{
			startTime: st,
			endTime2: et
		},
		order: [[3,'desc']]
   });
   
   // 删除我的发件箱
	$("#deleteMysendInfoAccept").bind('click', function(){
		var objs = ttable1.getCheckbox();
		var rows = objs.size();
		TRIG.isDelSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(messageInfo.url.delmysend, "ids=" + ids, function(data){
				ttable1.reload();
			});
		});
	});
   //我的组消息
    ttable2 = new TRIG.Datatable({
		table : $('#trig-mygroup-table'), 
		url : messageInfo.url.findmygroup, 
		columns : [
				   { "data": null,"render": function(data, type, row, mete){
					   tablerows2[row.mgai_groupAcceptId] = row;
						return '<input type="checkbox" class="checkboxes" value="'+row.mgai_groupAcceptId+'"/>';   
				   }, orderable: false, className: "trig-checkbox"},
				   { "data": "mgi_groupName","className" : "view-message", "render":function(data,type,row,mete){
	                	 return '<span class="row-details row-details-close" dataid="'+row.mgai_groupAcceptId+'"></span> ' + data;
	                 }},
   				   		{ "data": "su_realname","className" : "view-message"},
		                 { "data": "mgi_content", "className" : "view-message"},  
		                 { "data": "mgi_sendTime", "className":"trig-th-time view-message hidden-xs"}
		],
		queryParams:{
			startTime: st,
			endTime2: et
		},
		order: [[4,'desc']],
		drawCallback:function(){
			var tb = $('#trig-mygroup-table tbody');
			$.each(tb.children(),function(i,item){
				var tr = $(item);
				var infoid = $(item).find('td input[type=checkbox]').val();
				if(!infoid){return;}
				var row = tablerows2[infoid];
				if(row.mgai_state == 'R'){
					//已读
					tr.removeClass('unread');
				}else{
					tr.addClass('unread');
				}
			});
		}
   });
// 显示更多字段值
   ttable2.initMore(function(id) { 
  	 	var rowData = tablerows2[id];
  		if(rowData.mgai_state!='R') {
			$.post(messageInfo.url.updatemygroupState,"id=" + id, function(data){
				TRIG.successHandle(data);
				$('#trig-mygroup-table tbody span[dataid='+id+']').parent().parent().removeClass('unread');
			});
		}
  	 	var sOut = '<table>';
  	 	sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
  	 	sOut += '<tr><td><div class="trig-more-content">消息ID：</div></td><td>' + rowData.mgai_groupInfoId + '</td></tr>';
  	 	sOut += '<tr><td><div class="trig-more-content">groupId：</div></td><td>' + rowData.mgi_groupId + '</td></tr>';
        sOut += '<tr><td><div class="trig-more-content">内容：</div></td><td>' + rowData.mgi_content + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">接收时间：</div></td><td>' + rowData.mgai_acceptTime + '</td></tr>';
        sOut += '</table>';
        return  sOut;
   });
  // 查询
  $("#findMessageInfo2").bind('click', function() {
  	ttable2.query({ 
  		mgi_content : $("#keywords2").val(),
  		startTime: st,
		endTime2: et}); 
	});
  
  $("#updateMygroupInfoAccept").bind('click', function(){
		var ids = ttable2.getCheckbox();  
		var rows = ids.size();
	  	if(TRIG.isSelectOne(rows)) {
	  		TRIG.progress();
  			ids.each(function(){
  				$.post(messageInfo.url.updatemygroupState,"id=" + this.value, function(data){
					
				});
			});   
			setTimeout(function(){
				ttable2.reload();
				TRIG.progressClose();
			}, 2000);
			}
	});
  	//删除我组消息
	$("#deleteMyGroup").bind('click', function(){
		alert(1);
		var objs = ttable2.getCheckbox();
		var rows = objs.size();
		
		TRIG.isDelSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(messageInfo.url.delmygroup, "ids=" + ids, function(data){
				ttable2.reload();
			});
		});
	});
 
  // 我的收件箱
  $('.inbox-nav > li.accept > a').click(function () {
     $('#acceptbox').css('display','block');
     $('#mysend').css('display','none');
     $('#mygroup').css('display','none');
     $('.inbox-nav > li.active').removeClass('active');
     $('.inbox-nav > li.accept').addClass('active');
     ttable.reload();
  });
// 我的发件箱
  $('.inbox-nav > li.sent > a').click(function () {
  	 $('#acceptbox').css('display','none');
  	 $('#mysend').css('display','block');
  	 $('#mygroup').css('display','none');
  	 $('.inbox-nav > li.active').removeClass('active');
       $('.inbox-nav > li.sent').addClass('active');
       ttable1.reload();
  });
  //我的组消息
  $('.inbox-nav > li.group > a').click(function () {
      $('#acceptbox').css('display','none');
      $('#mysend').css('display','none');
      $('#mygroup').css('display','block');
      $('.inbox-nav > li.active').removeClass('active');
      $('.inbox-nav > li.group').addClass('active');
      ttable2.reload();
   });
});