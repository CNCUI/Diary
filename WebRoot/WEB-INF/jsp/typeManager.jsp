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
								<button id="addUser" class="btn green trig-privbtn"  >增加</button> 
							</div>
							<div class="btn-group">
								<button id="updateUser" class="btn green trig-privbtn"  >修改</button> 
							</div>
							<div class="btn-group">
								<button id="deleteUser" class="btn green trig-privbtn" >删除</button> 
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
					<th>编号</th> 
					<th>类型</th> 
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
					编辑类型
				</h4>
			</div>
			<div class="modal-body">
				<form class="form-horizontal" role="form" id="editForm">
					<input type="text" name="type_id" id="type_id"/>
					<div class="form-group">
						<label for="username" class="col-sm-2 control-label">编号</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="code" name="code"
								   placeholder="">
						</div>
					</div>
					<div class="form-group">
						<label for="realname" class="col-sm-2 control-label">名称</label>
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
var ttable = null;
var tablerows = [];
$(function(){
	TRIG.LOADHTMLOrJs(function(){
		//时间bootstrap-timepicker.js (5 matches)
// 		$(".datetimepicker").datetimepicker(); // 日期+时分秒  
		//对象定义
		var bmBmsj = function () {
				// 访问URL定义
				url = {
						add : 'sys/manager_addType.action',
						update : 'sys/manager_updateType.action',
						del : 'sys/manager_delType.action',
						find : 'sys/manager_findTypePageList.action',
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
				    		            {"data": "code"},
				    		            {"data": "name"}
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
				
				var updateOpen = function() {
					var ids = ttable.getCheckbox();
					var rows = ids.size();
					// 是否选择单条记录
					if(rows == 1) {
						var id = ids.get(0).value;
						var data = tablerows[id];
						// 初始表单数据
						$("#user_id").val(data.id);
						$("#username").val(data.username);
						$("#realname").val(data.realname);
						$("#phone").val(data.phone);
						$("#email").val(data.email);
						$("#address").val(data.address);
// 						TRIG.forminit($("#editModal"), data);
						$("#editModal").modal('show');
					}else{
						alert("请选择一条数据");
					}
				};
				
				// 表单数据保存，新增/修改保存
				var formSaveInit = function() {
					// 表单选择数据初始
					//TODO ...
					
					// 是否点击保存&关闭
				    var saveclose = false;
					/*TRIG.FormValidate("bm_bmsj", "bmBmsjEditform",  function (form) { //TODO 工具->表管理设置规则
						var _url = url.add;
						var isadd = true;
						if($("#si_bmBmsjId").val()!='') {
							_url = url.update; 
							isadd = false; 
						}
						TRIG.trackPost(_url, $(form).serialize(), function(data){
							if(isadd == true) {
								TRIG.formreset($("#bmBmsjEditform")); 
							}
							// 保存&关闭
							if(saveclose) {
								$("#bmBmsjEditModal").modal('hide'); 
							}
							TRIG.updateSuccessAlert();
						});
						// 必须flase，阻止form submit
						return false;
					});*/
					
					TRIG.Validate("editForm",  function (form) { 
						var _url = url.add;
						if($("#type_id").val()!='') {
							_url = url.update; 
						}
						TRIG.trackPost(_url, $(form).serialize(), function(data){
							if(!data.success)
							{
								TRIG.messager.alertError(data.message);
								return false;
							}
							if(isadd == true) {
								TRIG.formreset($("#editForm")); 
							}
							// 保存&关闭
							if(saveclose) {
								$("#editModal").modal('hide'); 
							}
							TRIG.updateSuccessAlert();
						});
						// 必须flase，阻止form submit
						return false;
					},{
						username : {
							required : true
						},
						realname : {
							required : true
						}
					});
					
				    // 编辑浮层关闭刷新列表数据
				    $("#editModal").on("hidden", function(){
						ttable.reload();
					});
				};
				
				return {
					// 查询
					query : function() {
						ttable.query(TRIG.DataDeal.form2TTableQueryParams("trig-search-form"));
					},
					// 打开新增
					addWindowOpen : function() {
						TRIG.formreset($("#editForm"));
	    				TRIG.hidePrveNext();
	    				$("#editModal").modal('show');
					},
					// 打开修改/编辑
					updateWindowOpen : function() {
						updateOpen();
					},
					// 删除
					del : function() {
						var objs = ttable.getCheckbox();
						var rows = objs.size();
						TRIG.isDelSelectOne(rows,function(){
							var ids = "";
							objs.each(function(){
								ids += this.value + ",";
							});   
							TRIG.trackPost(url.del, "ids=" + ids, function(data){
								ttable.reload();
							});
						});
					},
					init : function() {
						tableInit();
						
						ttable.next(); // 初始下一个按钮事件
					    ttable.prev(); // 初始上一个按钮事件
					    
					    // 高级查询
					    //TRIG.search('bm_bmsj', $("#findBmBmsj"), ttable); //TODO ...
					    
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
		// 新增
	    $("#addUser").bind('click', function(){
	    	$("#editForm")[0].reset(); 
	    	$("#editModal").modal("show");
	    });
	    // 修改
	    $("#updateUser").bind('click', function(){
	    	var ids = ttable.getCheckbox();
			var rows = ids.size();
			// 是否选择单条记录
			if(rows == 1) {
				var id = ids.get(0).value;
				var data = tablerows[id];
				// 初始表单数据
				$("#type_id").val(data.id);
				$("#code").val(data.code);
				$("#name").val(data.name);
				$("#editModal").modal('show');
			}else{
				alert("请选择一条数据");
			}
	    });
	    // 删除
	    $("#deleteUser").bind('click', function(){
	    	var objs = ttable.getCheckbox();
			var rows = objs.size();
			if(rows >= 1) {
				var ids = "";
				objs.each(function(){
					ids += this.value + ",";
				}); 
				TRIG.trackPost(url.del, "ids=" + ids, function(data){
					if(data.success){
						ttable.reload();
					}
					alert(data.message);
				});
			}else{
				alert("请选择一条数据");
			}
	    });
	    $("#submitUser").bind('click', function(){
	    	var arr = ["code","name"]
	    	if(!checkNull(arr)){
	    		alert("请将表单必填项填写完整");
	    		return false;
	    	}
	    	var _url = url.add;
	    	if($("#type_id").val()){
	    		_url = url.update;
	    	}
	    	console.info($("#editForm").serialize());
	    	$.post(_url,$("#editForm").serialize(),function(data){
	    		if(data.success){
	    			$("#editModal").modal("hide");
	    			ttable.reload();
	    		}
	    		alert(data.message);
	    	},"json")
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