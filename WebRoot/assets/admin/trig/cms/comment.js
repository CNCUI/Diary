$(function(){
	var cmsItemComment = {};
	cmsItemComment.url = {};
	cmsItemComment.url.update = 'cms/comment_update.json';
	cmsItemComment.url.del = 'cms/comment_delete.json';
	cmsItemComment.url.find = 'cms/comment_findPageList.json';

	var pid = "5"; 
	var siteid = TRIG.CMS.setRightWebSiteSelect('right-page-bar', function(id){
		siteid = id;
		ci_itemName : $("#scommentitemname").val('');
		
		ttable.query({ cid: '5',
    		 'ci_siteId' : siteid
    	}); 
		$('#item_tree').jstree('refresh_node', {id: '5', 'ci_siteId' : siteid});   
	}).getId();
	
	
	
	var tablerows = []; 
	var table = $('#trig-itemComment-table');
	var ttable = new TRIG.Datatable({
			table : table, 
			url : cmsItemComment.url.find, 
			columns : [
					   { "data": null, "render": function(data, type, row, mete){
						   tablerows[row.cic_commentId] = row;
							return '<input type="checkbox" class="checkboxes" value="'+row.cic_commentId+'"/>';   
					   }, orderable: false, className: "trig-checkbox" },
					   		 { "data": "ci_itemName", "render":function(data,type,row,mete){
    		                	 return '<span class="row-details row-details-close" dataid="'+row.cic_commentId+'"></span> ' + data;
    		                 }}, 
					   		 { "data": "cic_userName"},
			                 { "data": "cic_commentContent", className: "hidden-xs"},
			                 { "data": "cic_replyId", "render":function(data){
			                	 var data2 = 'N';
			                	 if(data) {
			                		 data2 = 'Y';
			                	 }
			                	 return TRIG.getYesNoHtml(data2);
			                 }},
			                 { "data": "cic_status", "render":function(data){
			                	 return TRIG.CMS.getStatusStr(data);
			                 }}, 
			                 { "data": "cic_pubTime"  , className: "hidden-xs"}
			],
			order: [[5,'desc']],
			queryParams : {
				ci_siteId : siteid
			},
	});
	
	TRIG.CMS.selectItem('sitemId', false);
	
	// 查询
    $("#findCmsItemComment").bind('click', function() {
    	ttable.query({ ci_itemName : $("#scommentitemname").val(),ci_siteId : siteid, cic_itemId : $("#sitemId").val()}); 
	});
    
    // 高级查询
    TRIG.search('cms_item_comment', $("#findCmsItemComment"), ttable);
    
    // 显示更多字段值
    ttable.initMore(function(id) { 
   	 var rowData = tablerows[id];
   	 var sOut = '<table>';
   	 	sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
   	 	sOut += '<tr><td><div class="trig-more-content">内容ID：</div></td><td>' + rowData.cic_itemId + '</td></tr>';
   	 	sOut += '<tr><td><div class="trig-more-content">会员ID：</div></td><td>' + rowData.cic_userId + '</td></tr>';
   		sOut += '<tr class="visible-xs"><td><div class="trig-more-content">评论：</div></td><td>' + rowData.cic_commentContent + '</td></tr>';
   		sOut += '<tr><td><div class="trig-more-content">IP：</div></td><td>' + rowData.cic_ip + '</td></tr>';
   		sOut += '<tr class="visible-xs"><td><div class="trig-more-content">发布时间：</div></td><td>' + rowData.cic_pubTime + '</td></tr>';
        sOut += '<tr ><td><div class="trig-more-content">创建时间：</div></td><td>' + rowData.cic_createTime + '</td></tr>';
        sOut += '</table>';
        return  sOut;
    });
    
    // 发布
    $("#pulishCmsItemComment").bind('click', function(){
    	var objs = ttable.getCheckbox();
		var rows = objs.size();
		if(TRIG.isSelect(rows)) {
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(cmsItemComment.url.update, "cic_status=4&ids=" + ids, function(data){
				ttable.reload();
			});
		}
    });
    
    // 撤消
    $("#resetCmsItemComment").bind('click', function(){
    	var objs = ttable.getCheckbox();
		var rows = objs.size();
		if(TRIG.isSelect(rows)) {
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(cmsItemComment.url.update, "cic_status=2&ids=" + ids, function(data){
				ttable.reload();
			});
		}
    });
        
    // 删除
	$("#deleteCmsItemComment").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelRecycleBinSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(cmsItemComment.url.del, "ids=" + ids, function(data){
				ttable.reload();
			});
		});
	});
	
	

});