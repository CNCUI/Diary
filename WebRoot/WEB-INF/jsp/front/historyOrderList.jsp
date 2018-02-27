<%@ page language="java" pageEncoding="utf-8"%>
<div class="row">
	<div class="col-md-12">
		<!-- BEGIN EXAMPLE TABLE PORTLET--> 
		<div class="trig-table" style="margin-top: 28px">
			<div class="portlet-body trig-table-body" >
				<table class="table table-striped table-bordered table-hover" id="trig-bmBmsj-table">
				<thead>
				<tr>
					<th>订单号</th>
					<th>状态</th>
					<th>姓名</th> 
					<th>电话</th>
					<th>地址</th>
					<th>总价</th>
					<th>已选菜品</th>
					<th>备注</th>
				</tr>
				</thead>
				<tbody>
				
				</tbody>
				</table>
			</div>
		</div>
		<!-- END EXAMPLE TABLE PORTLET-->
	</div>
</div>
<div class="trig-bottom"></div>



<script>
var url = {};
var tablerows = [];
var ttable = null;
$(function(){
	$.post("front/front_historyOrderList.action",function(redata){
		if(!redata.success){
			alert("请先登陆");
			return false;
		}else{
			TRIG.LOADHTMLOrJs(function(){
				//时间bootstrap-timepicker.js (5 matches)
//		 		$(".datetimepicker").datetimepicker(); // 日期+时分秒  
				//对象定义
				var bmBmsj = function () {
						// 访问URL定义
						url = { 
								find : 'front/front_historyOrderList.action'
						};
						// 变量定义
						// 列表数据
						
						// 表格
						var table = $('#trig-bmBmsj-table');
					    
						// 列表初始
						var tableInit = function() {
							ttable = new TRIG.Datatable({
						    		table : table, 
						    		url : url.find, 
						    		columns : [
						    		            {"data": "num"},
						    		            {"data": "state","render":function(data,type,row,mete){
						    		            	var str = "";
						    		            	if(data == 0){
						    		            		str = "已下单";
						    		            	}else if(data == 1){
						    		            		str = "已接单";
						    		            	}else if(data == 2){
						    		            		str = "拒绝接单";
						    		            	}
						    		            	return str;
						    		            }},
						    		            {"data": "user_name"},
						    		            {"data": "phone"},
						    		            {"data": "address"},
						    		            {"data": "sumprice"},
						    		            {"data": "foods","render":function(data,type,row,mete){
						    		            	return data?data:"";
						    		            }},
						    		            {"data": "remarks"}
						    		],
						    		//TODO 这里设置排序列，从0开始。。。
			    					order: [[1,'desc']],
						    		dblclick : function() {   // 双击打开编辑浮层
//		 				    			// 是否有修改权限
						    	    	if(TRIG.isPrivlege("updateBmBmsj")) { 
						    	    		updateOpen();
						    	    	}
						    		},
						    		drawCallback : function(){
						    			$("#trig-bmBmsj-table_length").hide();
						    		}
						    });
							
							// 显示更多字段值
							ttable.initMore(function(id) { 
						    	 var rowData = tablerows[id];
						    	 var sOut = '<table>';
						    	 sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
						        //TODO 这里编写更多列显示。。。
						         sOut += '</table>';
						         return  sOut;
							});
						};
						
						
						// 表单数据保存，新增/修改保存
						var formSaveInit = function() {
							// 表单选择数据初始
							//TODO ...
							
							// 是否点击保存&关闭
						    var saveclose = false;
							
							// 点击保存关闭设置saveclose=true，保存时判断
						    $(".trigsaveclose").bind('click', function(){
						    	TRIG.SAVECLOSE = true; 
						    	saveclose = true;
						    });
						    
						    // 编辑浮层关闭刷新列表数据
						    $("#bmBmsjEditModal").on("hidden", function(){   
								ttable.reload();
								saveclose = false; 
							});
						};
						
						return {
							// 查询
							query : function() {
								ttable.query(TRIG.DataDeal.form2TTableQueryParams("trig-search-form"));
							},
							init : function() {
								tableInit();
								
								ttable.next(); // 初始下一个按钮事件
							    ttable.prev(); // 初始上一个按钮事件
							    
							    formSaveInit();
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
			    bmBmsj.init();
			    
			    /**
			     * 功能按钮事件绑定
			     */
			    // 查询
			    $("#findBmBmsj").bind('click', function() {
			    	bmBmsj.query();
				});
			    
		    });
			
			
			
		}
	},"json");
	
});

</script>