$(function(){
	var emailInfo = {};
	emailInfo.url = {};
	emailInfo.url.del = 'message/myinfo_accept_delete.json';
	emailInfo.url.find = 'message/myinfo_accept_findPageList.json';
	emailInfo.url.updateState = 'message/myinfo_accept_updateState.json';
	emailInfo.url.findsend = 'message/myinfo_findMySendPageList.json';
	emailInfo.url.delmysend = 'message/myinfo_delete.json';
	
	var tablerows = []; 
	var tablerows1 = []; 
	var tablerows2 = []; 
    var table = $('#trig-email-table');
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
			var un = $("#email_keywords").val();
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
    		url : emailInfo.url.find, 
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
    			var tb = $('#trig-email-table tbody');
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
			$.post(emailInfo.url.updateState,"id=" + rowData.mia_acceptId, function(data){
				TRIG.successHandle(data);
				$('#trig-email-table tbody span[dataid='+id+']').parent().parent().removeClass('unread');
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
    $("#findemailInfo").bind('click', function() {
    	ttable.query({ 
    		mi_content : $("#email_keywords").val(),
    		startTime: st,
			endTime2: et}); 
	});
    
      
	// 删除我的收件箱
	$("#deleteMyemailInfoAccept").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += tablerows[this.value].mia_acceptId + ",";
			});   
			TRIG.trackPost(emailInfo.url.del, "ids=" + ids, function(data){
				ttable.reload();
			});
		});
	});
	
	$("#updateMyemailInfoAccept").bind('click', function(){
		var ids = ttable.getCheckbox();  
		var rows = ids.size();
    	if(TRIG.isSelectOne(rows)) {
    		TRIG.progress();
    		ids.each(function(){
				$.post(emailInfo.url.updateState,"id=" + tablerows[this.value].mia_acceptId, function(data) {
					
				});
			});   
			setTimeout(function(){
				ttable.reload();
				TRIG.progressClose();
			}, 2000);
		}
	});
    // 查询
    $("#findemailInfo1").bind('click', function() {
    	ttable1.query({ 
    		mi_content : $("#email_keywords1").val(),
    		startTime: st,
 		endTime2: et}); 
 	});
    
   //我的发件箱 
   ttable1 = new TRIG.Datatable({
		table : $('#trig-myemail-table'), 
		url : emailInfo.url.findsend, 
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
	$("#deleteMyemailsend").bind('click', function(){
		var objs = ttable1.getCheckbox();
		var rows = objs.size();
		TRIG.isDelSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(emailInfo.url.delmysend, "ids=" + ids, function(data){
				ttable1.reload();
			});
		});
	});

  
  
 
  // 我的收件箱
  $('.inbox-nav > li.emailaccept > a').click(function () {
     $('#email_acceptbox').css('display','block');
     $('#email_mysend').css('display','none');
     $('.inbox-nav > li.active').removeClass('active');
     $('.inbox-nav > li.emailaccept').addClass('active');
     ttable.reload();
  });
// 我的发件箱
  $('.inbox-nav > li.emailsent > a').click(function () {
  	 $('#email_acceptbox').css('display','none');
  	 $('#email_mysend').css('display','block');
  	 $('.inbox-nav > li.active').removeClass('active');
       $('.inbox-nav > li.emailsent').addClass('active');
       ttable1.reload();
  });
 
});