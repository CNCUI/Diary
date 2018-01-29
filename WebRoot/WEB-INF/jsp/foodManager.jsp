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
					<th>菜品名称</th> 
					<th>单价</th>
					<th>类型</th>
					<th>图片</th>
					<th>描述</th>
					<th>创建时间</th>
					<th>修改时间</th>
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
					编辑菜品
				</h4>
			</div>
			<div class="modal-body">
				<form class="form-horizontal" role="form" id="editForm">
					<input type="text" name="food_id" id="food_id"/>
					<div class="form-group">
						<label for="username" class="col-sm-2 control-label">菜品名称</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="name" name="name"
								   placeholder="">
						</div>
					</div>
					<div class="form-group">
						<label for="realname" class="col-sm-2 control-label">单价</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="price" name="price"
								   placeholder="">
						</div>
					</div>
					<div class="form-group">
						<label for="phone" class="col-sm-2 control-label">类型</label>
						<div class="col-sm-10">
							<select name="type" id="type" class="form-control select2">
								<option value="">--请选择--</option>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label for="email" class="col-sm-2 control-label">图片</label>
						<div class="col-sm-10">
							<input type="file" class="" name="file1" id="file1" value="0" onchange="formOperationInit.postImg(this,'img1','file_name','file_path')" />
						</div>
						<div class="col-sm-10">
                            <input type="hidden" name="file_name" id="file_name" value="0">
                            <input type="hidden" name="file_path" id="file_path" >
								<img style="width: 452px;height: 256px;" id="img1" onclick="" />
						</div>
					</div>
					<div class="form-group">
						<label for="address" class="col-sm-2 control-label">描述</label>
						<div class="col-sm-10">
							<textarea rows="10" cols="60" name="dscri" id="dscri"></textarea>
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
				<button id="submitFood" type="button" class="btn btn-primary">提交</button>
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
						add : 'sys/manager_addFood.action',
						update : 'sys/manager_updateFood.action',
						del : 'sys/manager_delFood.action',
						find : 'sys/manager_findFoodManegePageList.action',
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
				    					   		tablerows[row.id] = row;
				    							return '<input name="kssjts" type="checkbox" class="checkboxes" value="'+row.id+'"/>'; 
				    							//TODO 这里是ID列，这里修改...  
				    				   		}, 
				    				   		orderable: false, 
				    				   		className: "trig-checkbox" 
				    				   	},
				    		            {"data": "name"},
				    		            {"data": "price"},
				    		            {"data": "typeName","render":function(data,type,row,mete){
				    		            	if(data){
				    		            		return data;
				    		            	}else{
				    		            		return "";
				    		            	}
				    		            }},
				    		            {"data": "pic","render":function(data,type,row,mete){
				    		            	return "<img style='width:234px;height:234px' src='"+data+"'></img>";
				    		            }},
				    		            {"data": "dscri"},
				    		            {"data": "createtime","render":function(data,type,row,mete){
				    		            	if(data){
				    		            		return data;
				    		            	}else{
				    		            		return "";
				    		            	}
				    		            }},
				    		            {"data": "updatetime","render":function(data,type,row,mete){
				    		            	if(data){
				    		            		return data;
				    		            	}else{
				    		            		return "";
				    		            	}
				    		            }}
				    		],
				    		//TODO 这里设置排序列，从0开始。。。
	    					order: [[1,'dscri']],
				    		dblclick : function() {   // 双击打开编辑浮层
// 				    			// 是否有修改权限
				    	    	if(TRIG.isPrivlege("updateBmBmsj")) { 
				    	    		updateOpen();
				    	    	}
				    		}
				    });
					
					// 显示更多字段值
				};
				
				return {
					// 查询
					query : function() {
						ttable.query(TRIG.DataDeal.form2TTableQueryParams("trig-search-form"));
					},
					init : function() {
						tableInit();
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
				$("#food_id").val(data.id);
				$("#name").val(data.name);
				$("#price").val(data.price);
				$("#pic").val(data.pic);
				$("#img1").attr("src",data.pic);
				$("#dscri").val(data.dscri);
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
	    $("#submitFood").bind('click', function(){
	    	var arr = ["name","price","type","pic","dscri","file_path"];
	    	if(!checkNull(arr)){
	    		alert("请将表单必填项填写完整");
	    		return false;
	    	}
	    	var _url = url.add;
	    	if($("#food_id").val()){
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

var formOperationInit = {
		postImg : function (){
			var args = arguments;
			var obj = args[0] || {};
			var id = args[1] || {};
			var fileName = args[2] || {};
			var filePath = args[3] || {};
			
			var file = obj.files[0];
			$("#"+fileName).val(file.name);
			//判断类型是不是图片  
			if (!/image\/\w+/.test(file.type)) {
				alert("请确保文件为图像类型");
				return false;
			}
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(e) {
				var re = this.result;
// 				console.info(re);
				console.info(id);
				$("#"+id).attr('src', re);
				$("#"+id).attr('style', "width:452px;height:256px");
				var image = new Image();
				image.src = re;
				image.onload = function(){
				  var img64 = compress(image, 500, 400, 0.7);
					//上传文件到服务器
					$.ajax({
						url: "sys/manager_uplodaImg.action",
						dataType: 'json',
						type:'post',
						async : false,
						data : {"imgstr":img64},
						success: function(data) {
							$("#"+filePath).val(data.imgPath);
							$('#loadingToast').hide();
						}
					});
				};
				
			}
		}
}
function compress(img, width, height, ratio){
	var canvas, ctx, img64;
	canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height);
	img64 = canvas.toDataURL("image/jpeg", ratio);
	return img64;
};
</script>
