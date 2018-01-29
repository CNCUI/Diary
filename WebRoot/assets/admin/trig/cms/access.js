$(function(){
	var cmsItemAccess = {};
	cmsItemAccess.url = {};
	cmsItemAccess.url.del = 'cms/access_delete.json';
	cmsItemAccess.url.find = 'cms/access_findPageList.json';
	cmsItemAccess.url.exp = 'cms/access_export_list.json';
	
	var siteid = TRIG.CMS.setRightWebSiteSelect('right-page-bar', function(id){
		siteid = id;
		ttable.query({ 
			ci_itemName : $("#sitemname").val(''),
    		 'ci_siteId' : siteid
    	}); 
	}).getId();
	
	var tablerows = []; 
	var table = $('#trig-itemAccess-table');
	var ttable = new TRIG.Datatable({
			table : table, 
			url : cmsItemAccess.url.find, 
			columns : [
					   { "data": null, "render": function(data, type, row, mete){
						   tablerows[row.cia_accessId] = row;
							return '<input type="checkbox" class="checkboxes" value="'+row.cia_accessId+'"/>';   
					   }, orderable: false, className: "trig-checkbox" },
					   		 { "data": "ci_itemName", "render":function(data,type,row,mete){
    		                	 return '<span class="row-details row-details-close" dataid="'+row.cia_accessId+'"></span> ' + data;
    		                 }}, 
					   		// { "data": "cia_ip"},
			                 //{ "data": "cia_sessionid", className: "hidden-xs"},
			                 { "data": "cia_accessUrl" , className: "hidden-xs"}, 
			                 { "data": "cia_createTime" },
			                 { "data": "cia_endTime", className: "hidden-xs" }
			],
			order: [[3,'desc']],
			queryParams : {
				ci_siteId : siteid
			},
	});
	
	// 导出
	TRIG.initexpHTML('expCmsItemAccess', cmsItemAccess.url.exp, ttable);
	
	// 查询
    $("#findCmsItemAccess").bind('click', function() {
    	ttable.query({ ci_itemName : $("#sitemname").val(),ci_siteId : siteid}); 
	});
    
    // 高级查询
    TRIG.search('cms_item_access', $("#findCmsItemAccess"), ttable, 'a');
    
    // 显示更多字段值
    ttable.initMore(function(id) { 
   	 var rowData = tablerows[id];
   	 var sOut = '<table>';
   	 	sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
   	 	sOut += '<tr><td><div class="trig-more-content">ITEM ID：</div></td><td>' + rowData.cia_itemId + '</td></tr>';
   	 	sOut += '<tr><td><div class="trig-more-content">IP：</div></td><td>' + rowData.cia_ip + '</td></tr>';
   	 	sOut += '<tr><td><div class="trig-more-content">SESSION ID：</div></td><td>' + rowData.cia_sessionid + '</td></tr>';
   	 	sOut += '<tr class="visible-xs"><td><div class="trig-more-content">URL：</div></td><td>' + rowData.cia_accessUrl + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">结束时间：</div></td><td>' + rowData.cia_endTime + '</td></tr>';
        sOut += '<tr class="visible-xs"><td><div class="trig-more-content">浏览器类型：</div></td><td>' + (rowData.cia_obType ?rowData.cia_obType:'') + '</td></tr>';
        sOut += '</table>';
        return  sOut;
    });
    
    // 删除
	$("#deleteCmsItemAccess").bind('click', function(){
		var objs = ttable.getCheckbox();
		var rows = objs.size();
		TRIG.isDelRecycleBinSelectOne(rows,function(){
			var ids = "";
			objs.each(function(){
				ids += this.value + ",";
			});   
			TRIG.trackPost(cmsItemAccess.url.del, "ids=" + ids, function(data){
				ttable.reload();
			});
		});
	});

});