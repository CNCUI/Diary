/**
*	调用系统公共方法JS
*/
var PUBJS = PUBJS || {};

// 数据列表，使用 jquery datatable，start
// 默认行大小
PUBJS.PAGESIZE = 15;
// 默认可选择行大小
PUBJS.PAGELIST = [[10,15,30,50,100,-1],[10,15,30,50,100,'全部']]; 
// 当前页面所有datatable 表格 ID
PUBJS.TABLE = [];

PUBJS.TABLE_LANGUAGE = {
		"lengthMenu" : " _MENU_",
		"zeroRecords" : "抱歉， 没有找到",
		"processing" : "正在获取数据，请稍后...", 
		"info" : "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
		"infoEmpty" : "没有数据",
		"infoFiltered" : "",//"(从 _MAX_ 条数据中检索)",
		"zeroRecords" : "没有检索到数据",
		"sSearch": "搜索：", 
		"paginate" : {
			"first" : "首页",
			"previous" : "前一页",
			"next" : "后一页",
			"last" : "尾页"
		}
	};
/** 分页参数转换 */
PUBJS.addTablePage = function(d, opts) {
	if(d.order && d.order.length>0) {
		var orders = d.order;
		for(var i=0;i<orders.length;i++) { 
			if(i==0) {
				d.sort = d.columns[orders[i]['column']]['data'];
				d.order = d.order[i]['dir']; 
			} else {
				if(orders[i]['column']) {
					d.sort = d.sort + ',' + d.columns[orders[i]['column']]['data'];
					d.order = d.order + ',' + orders[i]['dir'];   
				} 
			}
		} 
	} 
	if(opts.paging!=false) { 
		d.rows = d.length;
		d.page = d.start/d.length+1; 
	}
	if(opts.filter) {
		d.searchKey = d.search['value']; 
	}
	// 将DATA TABLE传递参数赋空，将少参数传递
	d.columns = ''; 
	d.search = ''; 
};

// Datatable
PUBJS.Datatable = function(opts) {
	var options = opts;
	var table = options.table;
	// 查询参数
	var queryParams = options.queryParams ? options.queryParams : {};
	var pagenum = 1;
	var pagesize = options.pagesize ? options.pagesize : PUBJS.PAGESIZE;
	// 记录总数
	var recordsTotal = 0;
	// 是否监听行选中事件
	var trcli = opts.trclick != undefined ? opts.trclick : true;  
	// 拖动当前上级id
	var dndid = '';
	// 是否可拖动，解决未拖动时自动移动
	var isdnd = false;
	
	var tablesetting = {   
	    	"paginationType" : "full_numbers",
			"filter": options.filter ? true : false,  
			"paging": options.paging == false ? false : true,  
			"serverSide": true ,  
			"stateSave" : true,
			"processing":true,
			"ajax": { url : options.url, type: 'POST' ,data: function ( d ) {
				// 加截分页/排序参数
				PUBJS.addTablePage(d, options);
				// 添加查询条件
				for(var key in queryParams){  
					var val = queryParams[key];
					if(val) eval("d."+key+" = queryParams['" + key + "'];") ; 
				}
				if(options.paging != false) pagenum = d.page;
			}},
			"columns": options.columns,
            "destroy": true,
            "language": PUBJS.TABLE_LANGUAGE,
            "lengthMenu": options.pagelist ? options.pagelist : PUBJS.PAGELIST,
            "pageLength": pagesize,  
            "order" :  options.order, 
            "drawCallback": function (oSettings) { // run some code on table redraw
//                Metronic.initUniform($('input[type="checkbox"]', table)); // reinitialize uniform checkboxes on each table reload
                // 加行号
                $(".checkboxes", table).each(function(i){
    	    		$(this).attr("number", i); 
    	    		//$(this).parents('td').addClass("nodrag");
    	    	}); 
                if(options.drawCallback) {
                	options.drawCallback.call();
                }
                dndid = '';
                isdnd = false;
                // 拖动
                if(options.dnd) {
                	var order = this.api().order();
            		if(parseInt(order[0][0])==options.dnd.sort && (order[0][1]=='asc')) { 
            			table.tableDnD({
            				onDragClass: 'PUBJS-tablednd',
            				onDragStart: function(table, row) {
            	                dndid = $(row).prev('tr').find('.checkboxes').val();
            	                isdnd = true;
            	            }
            			});
            		}
                }
            }
	    };
		if(opts.tablesetting) {
			for(var key in opts.tablesetting){  
				var val = opts.tablesetting[key];
				if(val!=undefined) eval("tablesetting."+key+" = opts.tablesetting['" + key +"'];") ; 
			}
		}
	
	 var dtable = table.on('xhr.dt', function(e, settings, data){
//	    	PUBJS.successHandle(data);  
	    	if(options.load) { 
	    		options.load.call(options.load, data);
	    	}
	    	if(data.success) {
	    		recordsTotal = data.recordsTotal;
	    		// 当前记录数发生改变时跳转至第一页
    			if(data.success && data.data.length == 0) {
    				if(pagenum > 2) {
    					dtable.fnPageChange(pagenum - 2);
    				} 
    			}
	    	}
	    }).dataTable(tablesetting);
	 
	 
	    // 监听 TABLE CHECKBOX，加行选样式 
	 table.find('.group-checkable').change(function () {
	        var set = jQuery(this).attr("data-set"); 
	        var checked = jQuery(this).is(":checked");
	        jQuery(set).each(function () {
	            if (checked) {
	                $(this).attr("checked", true);
	                $(this).parents('tr').addClass("active");
	            } else {
	                $(this).attr("checked", false);
	                $(this).parents('tr').removeClass("active");
	            }
	        });
	        jQuery.uniform.update(set);
	    });
		
	    table.on('change', 'tbody tr .checkboxes', function (e) {
	    	var checked = jQuery(this).is(":checked");
	    	if(checked) {
	    		$(this).attr("checked", true);
	            $(this).parents('tr').addClass("active");
	    	}else {
	    		$(this).attr("checked", false);
	            $(this).parents('tr').removeClass("active");  
	        }
	    	 jQuery.uniform.update($(this));   
	    });
	    
	    if(trcli) { 
	    	table.on('click', 'tbody tr', function (e) {
	    		// 更多详细中的tr不触发
		    	if ($(e.target).is('.checkboxes') || $(e.target).is('.row-details') || $(this).find(".details").size()>0 || $(this).attr("role") == undefined) { 
		    	    return; 
		    	  }
		    	if($(this).is(".active") && !options.dblclick) {
		    		//$("tr", table).removeClass("active"); 
		    		$(this).removeClass("active");
		    		$(".checkboxes", $(this)).attr("checked", false);  
		    	} else {
		    		$("tr", table).removeClass("active");
					$(this).addClass("active");
					$(".checkboxes", table).attr("checked", false);  
			        $(".checkboxes", $(this)).attr("checked", true); 
		    	}
		        jQuery.uniform.update($(".checkboxes", table));   
			});
	    }
	    
	    if(options.dblclick) {
	    	table.on('dblclick', 'tbody tr', function (e) {
	    		// 更多详细中的tr不触发,双击+不触发
	    		if($(this).find(".details").size()>0 || $(this).attr("role") == undefined || $(e.target).is('.row-details') || $(e.target).is('.checkboxes')){  
	    			return ;
	    		}
	    		options.dblclick.call(this, e);
	        });
	    }
	   	    
	    return {
	    	getTable : function() { return dtable;},
	    	// 获取查询参数，用于导出等
	    	getQueryParams : function() { return queryParams; },
	    	getUrl : function() { return options.url; },
	    	getPageNumber : function() { return pagenum;},
	    	getPageSize : function() { return pagesize;},
	    	getRecordsTotal : function() { return recordsTotal;},
	    	// 执行查询操作
	    	query : function(q) {
	    		queryParams = q;
	    		dtable.api().ajax.reload();
	    		// 清除全选
	    		$('.group-checkable', table).attr("checked", false); 
	    		 jQuery.uniform.update($(".group-checkable", table));   
	    	},
	    	// 重新加载TABLE数据
	    	reload: function(callback) {
	    		var oldRecordsTotal = recordsTotal;
	    		// 保持当前分页
	    		dtable.api().ajax.reload(function(data){
	    			if(callback) callback.call(callback, data);
	    		}, false);
	    		// 清除全选
	    		$('.group-checkable', table).attr("checked", false); 
	    		 jQuery.uniform.update($(".group-checkable", table));   
	    	},
	    	initMore : function(viewmore) {
	    		//table.unbind('click', 'tbody .row-details');
	    		// 更多点击事件
	    	     table.on('click', 'tbody .row-details', function(e){
	    	     	var nTr = $(this).parents('tr')[0]; 
	    	     	var id = $(this).attr('dataid'); 
	    	     	if (dtable.fnIsOpen(nTr)) {
	    	            /* This row is already open - close it */
	    	            $(this).addClass("row-details-close").removeClass("row-details-open");
	    	            dtable.fnClose(nTr);
	    	        } else {
	    	            /* Open this row */
	    	            $(this).addClass("row-details-open").removeClass("row-details-close");
	    	            var strhtml = viewmore.call(this, id);
	    	            dtable.fnOpen(nTr, strhtml, 'details');
	    	        }
	    	     });
	    	     
	    	     // 快捷键关闭打开所有
	    	     var row_details_close = true;
	    	     var id = new Date().getTime();
	    	     PUBJS.TABLE.push(id);
	    	     table.attr('data-more-id', id);
	    	     $(document).keydown(function(e){
	    	    	 if(e.ctrlKey && e.which == 73) { // ctrl+i
	    	    		 // 是否当前存在table
	    	    		 var isshowtable = false;
	    	    		 if(PUBJS.TABLE) {
	    	    			 for(var i=0;i<PUBJS.TABLE.length;i++) {
	    	    				var id = table.attr('data-more-id');
	    	    				if(id == PUBJS.TABLE[i]) {
	    	    					isshowtable = true;
	    	    				}
	    	    			 }
	    	    		 }
	    	    		 if(isshowtable) {
	    	    		 	// 打开所有
		    	    	 	if(row_details_close) {
		    	    	 		row_details_close = false;
		    	    	 		$('tbody .row-details', table).each(function(){
		    	    	 			var nTr = $(this).parents('tr')[0]; 
		    	    	 			var id = $(this).attr('dataid'); 
		    	    	 			 $(this).addClass("row-details-open").removeClass("row-details-close");
		    	    	 			 var strhtml = viewmore.call(this, id);
		    	    	 			 dtable.fnOpen(nTr, strhtml, 'details');
		    	    	 		});
		    	    	 	} else { // 关闭所有
		    	    	 		row_details_close = true;
		    	    	 		$('tbody .row-details', table).each(function(){
		    	    	 			var nTr = $(this).parents('tr')[0]; 
			    	    	 		$(this).addClass("row-details-close").removeClass("row-details-open");
				    	            dtable.fnClose(nTr);
		    	    	 		});
		    	    	 	}
	    	    		 }
	    	    	 }
	    	     });
	    	},
	    	// 获取checkbox取
	    	getCheckbox : function() { 
	    		return $('.checkboxes:checked', table);
	    	},
	    	getNumber:function() {
	    		return  $('.checkboxes:checked', table).attr('number');  
	    	},
	    	getSort: function() {
	    		return sort;
	    	},
	    	getOrder: function() {
	    		return order;
	    	}
	    };
};





