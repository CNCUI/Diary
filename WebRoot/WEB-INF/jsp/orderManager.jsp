<%@ page language="java" pageEncoding="utf-8"%>
<div class="row">
	<div class="col-md-12">
		<!-- BEGIN EXAMPLE TABLE PORTLET--> 
		<div class="trig-table" >
			<div class="portlet-body trig-table-body" >
				<div class="table-toolbar" >
					<div class="row">
						<div class="col-md-12">
							<div class="btn-group">
								<button id="jiedan" class="btn green trig-privbtn"  >接单</button> 
							</div>
							<div class="btn-group">
								<button id="jujue" class="btn green trig-privbtn" >拒绝</button>
							</div>
							<div class="btn-group">
								<button id="shanchu" class="btn green trig-privbtn" >删除</button> 
							</div>
						</div>
					</div>
				</div>
				<table class="table table-striped table-bordered table-hover" id="trig-bmBmsj-table">
				<thead>
				<tr>
					<th class="table-checkbox">
						<input type="checkbox" class="group-checkable" data-set="#trig-bmBmsj-table .checkboxes"/>
					</th>
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


<!-- 模态框（Modal） -->
<div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
					&times;
				</button>
				<h4 class="modal-title" id="myModalLabel">
					编辑订单
				</h4>
			</div>
			<div class="modal-body">
				<form class="form-horizontal" role="form" id="editForm">
					<input type="text" name="type_id" id="type_id"/>
					<div class="form-group">
						<label for="username" class="col-sm-2 control-label">姓名</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="code" name="code"
								   placeholder="">
						</div>
					</div>
					<div class="form-group">
						<label for="realname" class="col-sm-2 control-label">电话</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="name" name="name"
								   placeholder="">
						</div>
					</div>
					<div class="form-group">
						<label for="realname" class="col-sm-2 control-label">地址</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="name" name="name"
								   placeholder="">
						</div>
					</div>
					<div class="form-group">
						<label for="realname" class="col-sm-2 control-label">总价</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="name" name="name"
								   placeholder="">
						</div>
					</div>
					<div class="form-group">
						<label for="realname" class="col-sm-2 control-label">已选菜品</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="name" name="name"
								   placeholder="">
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
				<button id="submitUser" type="button" class="btn btn-primary">提交</button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal -->
</div>



<script>
var url = {};
var tablerows = [];
var ttable = null;
$(function(){
	TRIG.LOADHTMLOrJs(function(){
		//时间bootstrap-timepicker.js (5 matches)
// 		$(".datetimepicker").datetimepicker(); // 日期+时分秒  
		//对象定义
		var bmBmsj = function () {
				// 访问URL定义
				url = { 
						jiedan : 'sys/manager_updateOrderState.action',
						jujue : 'sys/manager_updateOrderState.action',
						del : 'sys/manager_delOrder.action',
						find : 'sys/manager_findOrderPageList.action'
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
				    				  	{ 
				    				   		"data": null, 
				    				   		"render": function(data, type, row, mete){
										   		//TODO 这里是ID列，这里修改...
				    					   		tablerows[row.id] = row;
				    							return '<input name="kssjts" type="checkbox" class="checkboxes" value="'+row.id+'"/>'; 
				    							//TODO 这里是ID列，这里修改...  
				    				   		}, 
				    				   		orderable: false, 
				    				   		className: "trig-checkbox" 
				    				   	},
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
// 				    			// 是否有修改权限
				    	    	if(TRIG.isPrivlege("updateBmBmsj")) { 
				    	    		updateOpen();
				    	    	}
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
	    // 接单
	    $("#jiedan").bind('click', function(){
	    	var objs = ttable.getCheckbox();
			var rows = objs.size();
			if(rows >= 1) {
				var ids = "";
				objs.each(function(){
					ids += this.value + ",";
				}); 
				$.post(url.jiedan, "ids=" + ids+"&state=1", function(data){
					if(data.success){
						ttable.reload();
					}
					alert(data.message);
				},"json");
			}else{
				alert("请选择一条数据");
			}
	    });
	    // 拒绝
	    $("#jujue").bind('click', function(){
	    	var objs = ttable.getCheckbox();
			var rows = objs.size();
			if(rows >= 1) {
				var ids = "";
				objs.each(function(){
					ids += this.value + ",";
				}); 
				$.post(url.jujue, "ids=" + ids+"&state=2", function(data){
					if(data.success){
						ttable.reload();
					}
					alert(data.message);
				},"json");
			}else{
				alert("请选择一条数据");
			}
	    });
	    // 删除
	    $("#shanchu").bind('click', function(){
	    	var objs = ttable.getCheckbox();
			var rows = objs.size();
			if(rows >= 1) {
				var ids = "";
				objs.each(function(){
					ids += this.value + ",";
				}); 
				$.post(url.del, "ids=" + ids, function(data){
					if(data.success){
						ttable.reload();
					}
					alert(data.message);
				},"json");
			}else{
				alert("请选择一条数据");
			}
	    });
	    
    });
});

function checkNull(arr){
	var falg = true;
	for(var i=0;i<arr.length;i++){
		if($("#"+arr[i]).val() == ''){
			falg = false;
		}
	}
	return falg;
}
</script>