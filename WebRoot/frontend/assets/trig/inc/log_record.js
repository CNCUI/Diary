
TRIG.LOG.tablerows = []; 
TRIG.LOG.table = $('#trig-log-table');
TRIG.LOG.ttable = undefined;
TRIG.LOG.TableName = undefined;

TRIG.LOG.openLogs = function(id) {
	TRIG.LOG.tablerows = []; 
	if(TRIG.LOG.ttable == undefined) {
		TRIG.LOG.ttable = new TRIG.Datatable({
				table : TRIG.LOG.table, 
				url : TRIG.PATH + '/log_findLogList.json', 
				columns : [
								{ "data": null, "render": function(data, type, row, mete){
										TRIG.LOG.tablerows[row.sl_logId] = row;
										return '<input type="checkbox" class="checkboxes" value="'+row.sl_logId+'"/>';   
								},orderable: false, className: "trig-checkbox"},
				           		 { "data": "su_userName", "render":function(data,type,row,mete){
										return '<span class="row-details row-details-close" dataid="'+row.sl_logId+'"></span> '  + data; 
									}},
				                 { "data": "sl_logFunction" , "render": function(data, type, row, mete){
				                	 return data + (row.functionName ?  "(" + row.functionName + ")" : "");
				                 }},
				                 { "data": "sl_status","render":function(data,type,row,mete){
				                	 return data == 'N' ? '<span style="color:red">' + data + '</span>' : data;
				                 }  },
				                 { "data": "sl_createTime" }
				],
				order: [[4,'desc']],
				queryParams: {id : id}
				//trclick:false  
		});
		// 显示更多字段值
		TRIG.LOG.ttable.initMore(function(id) {
			 var rowData = TRIG.LOG.tablerows[id];
			 var sOut = '<div class="col-md-12"><table style="width:100%;">';   
			 sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + rowData.sl_logId + '</td></tr>';
		    sOut += '<tr><td><div class="trig-more-content">用户姓名：</div></td><td>' + rowData.su_realName + '</td></tr>';
		    sOut += '<tr><td><div class="trig-more-content">调用方法：</div></td><td>' +rowData.sl_logMethod + '</td></tr>';  
		    sOut += '<tr><td><div class="trig-more-content">描述：</div></td><td>' +rowData.sl_description + '</td></tr>';  
		    sOut += '<tr><td><div class="trig-more-content">数据：</div></td><td style="max-width:300px;word-break:break-all">' +rowData.sl_data + '</td></tr>';   
		    sOut += '</table></div>'; 
		    return  sOut;
		});
		
		// 比较
		$("#compareSysLog").bind('click', function(){
			var objs = TRIG.LOG.ttable.getCheckbox();
			var rows = objs.size();
			if(!rows || rows != 2){
				TRIG.messager.alert('请选择两条记录进行比较！'); 
				return false;
			}
			
			var rowData = TRIG.LOG.tablerows[objs.get(0).value];
			var rowData2 = TRIG.LOG.tablerows[objs.get(1).value];
			var jsondata = rowData.sl_data ? eval( "d=" + rowData.sl_data) : {};
			var jsondata2 = rowData2.sl_data ? eval( "d=" + rowData2.sl_data) : {};
			TRIG.LOG.KEYS = undefined;
			TRIG.LOG.JsonDiff(jsondata, jsondata2);
		}); 
	} else {
		TRIG.LOG.ttable.query({ id : id});
	}
	$("#sysLogModal").modal('show');
};

TRIG.LOG.JsonDiff = function(jsondata, jsondata2) {
	var tablename = TRIG.LOG.TableName; // 高级查询中设定
	if(tablename && TRIG.LOG.KEYS == undefined) {
		TRIG.LOG.KEYS = [];
		var t = tablename.toLowerCase();
		var cs = t.split("_");
		var c =  "";
		c = cs[0].substr(0, 1);
		if (cs.length > 1) {
			for(var i=1; i<cs.length; i++) {
				c += cs[i].substr(0, 1);
			}
		}
		$.ajax({async: false, url:TRIG.PATH + '/tools/table_column_findList.json',  data : 'stc_tableName='+tablename, success: function(data){
				data = $.parseJSON(data);
				for(var i=0;i<data.length;i++) {
					TRIG.LOG.KEYS[c + "_" + data[i].stc_aliasName] = data[i].stc_pageName;
				}
			} 
		});
	}
	
	// 是否JSON
	var jsonregx = new RegExp("^\{.+?}$");
	var isJsonObj = function(obj){
		var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length; 
		return isjson;
	};
	var isJson = function(obj) {
		isjson = isJsonObj(obj) || jsonregx.test(obj);
		return isjson;
	}
	var html = '<table style="width:100%;border-right:1px solid #EFEFEF;border-bottom:1px solid #EFEFEF">';
	var tdobjs = [];
	
	var diff = function(name, jsondata, jsondata2) {
		if(!isJsonObj(jsondata)) {
			eval("jsondata = " + jsondata);
			try{
					eval("jsondata2 = " + jsondata2);
				}catch(e) {
					jsondata2 = {};
			}
		}
		for(var key in jsondata){  
			if(!isJson(jsondata[key])) {
				if(key != 'ADMIN_USER_ID') { // 当前操作员不必比较
					
					var val = jsondata[key] ? jsondata[key] : "";
					var val2 = jsondata2 && jsondata2[key] ?jsondata2[key] : "";
					var tdname = name.replace(".", "_");
					while(tdname.indexOf(".") > 0) {
						tdname = tdname.replace(".", "_");
					}
					tdobjs.push({id:"rdiff"+ tdname + key, text: val});
					tdobjs.push({id:"rdiff"+ tdname + key + "_d2", text: val2});
					var keyname = TRIG.LOG.KEYS && TRIG.LOG.KEYS[key] ? "(" + TRIG.LOG.KEYS[key] + ")" : "";
					html = html + "<tr "+ (val===val2? "" : "style='color:red'") + ">";
					html = html + "<td style='border-left:1px solid #EFEFEF;border-top:1px solid #EFEFEF'>" + name + key + keyname + "</td><td style='border-left:1px solid #EFEFEF;border-top:1px solid #EFEFEF' id='rdiff"+ tdname + key +"'></td>";
					html = html + "<td style='border-left:1px solid #EFEFEF;border-top:1px solid #EFEFEF'>" + (val===val2? "=":"<span style='color:red'>!=</span>") + "</td><td style='border-left:1px solid #EFEFEF;border-top:1px solid #EFEFEF' id='rdiff"+ tdname + key +"_d2'></td>"
					html = html + "<td style='border-left:1px solid #EFEFEF;border-top:1px solid #EFEFEF'>" + (val && val.toString().indexOf('\n')>0 ? "<a href='javascript:;' onclick=\"TRIG.txtDiffByID('rdiff" + tdname + key + "', 'rdiff" + tdname+ key + "_d2');\">行对比</a>" : "&nbsp;") + "</td>";
					html = html + "</tr>";
				}
			} else {
				diff(name + key + ".", jsondata[key], jsondata2 ? jsondata2[key] : {});
			}
		}
	};
	
	diff("", jsondata, jsondata2);
	var html = html +  "</table>";
	$("#compareData").html(html);
	for (var int = 0; int < tdobjs.length; int++) {
		$("#" + tdobjs[int].id).get(0).appendChild(document.createTextNode(tdobjs[int].text));
	}
	$("#compareSysLogModal").modal('show');
};