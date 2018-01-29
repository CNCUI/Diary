<%@ page language="java" pageEncoding="utf-8"%>
<div class="row">
	<div class="col-md-12">
		<!-- BEGIN EXAMPLE TABLE PORTLET-->
		<div class="trig-table">
			<div class="portlet-body trig-table-body">
				<div class="table-toolbar">
					<div class="row">
						<div class="col-md-12">
							<div class="btn-group">
								<button id="addUser" class="btn green " >增加</button>
							</div>
							<div class="btn-group">
								<button id="updateUser" class="btn green ">修改</button>
							</div>
							<div class="btn-group">
								<button id="deleteUser" class="btn green ">删除</button>
							</div>
						</div>
					</div>
				</div>
				<table id="user-table-list" class="table table-striped table-bordered table-hover">  
			        <thead>  
			            <tr>  
			                <th class="center" style="width: 50px">
			                	<label>
			                        <input type="checkbox"/>  
			                    </label>  
			                </th>  
			                <th>用户名</th>  
			                <th>姓名</th>  
			                <th>电话</th>  
			                <th>邮箱</th>  
			                <th>地址</th>  
			                <th>状态</th>  
			            </tr>  
			        </thead>  
			    </table>  
			</div>
		</div>
		<!-- END EXAMPLE TABLE PORTLET-->
	</div>
</div>
<!-- 模态框（Modal） -->
<div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
					&times;
				</button>
				<h4 class="modal-title" id="myModalLabel">
					编辑用户
				</h4>
			</div>
			<div class="modal-body">
				<form class="form-horizontal" role="form" id="userForm">
					<input type="text" name="user_id" id="user_id"/>
					<div class="form-group">
						<label for="username" class="col-sm-2 control-label">用户名</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="username" name="username"
								   placeholder="">
						</div>
					</div>
					<div class="form-group">
						<label for="realname" class="col-sm-2 control-label">姓名</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="realname" name="realname"
								   placeholder="">
						</div>
					</div>
					<div class="form-group">
						<label for="lastname" class="col-sm-2 control-label">姓名</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="lastname" 
								   placeholder="">
						</div>
					</div>
					<div class="form-group">
						<label for="phone" class="col-sm-2 control-label">电话</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="phone" name="phone"
								   placeholder="">
						</div>
					</div>
					<div class="form-group">
						<label for="email" class="col-sm-2 control-label">邮箱</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="email" name="email"
								   placeholder="">
						</div>
					</div>
					<div class="form-group">
						<label for="address" class="col-sm-2 control-label">地址</label>
						<div class="col-sm-10">
							<input type="text" class="form-control" id="address" name="address"
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
		jQuery(function($) {  
			var url = {};
			url.addUser = "rest/page/addUser";
			url.updateUser = "rest/page/updateUser";
	        //初始化table  
	        var oTable1 = $('#user-table-list')  
	                .dataTable(
	                        {  
	                            "bPaginate" : true,//分页工具条显示  
	                            "sPaginationType" : "full_numbers",//分页工具条样式  
	                            "bStateSave" : true, //是否打开客户端状态记录功能,此功能在ajax刷新纪录的时候不会将个性化设定回复为初始化状态    
	                            "bScrollCollapse" : true, //当显示的数据不足以支撑表格的默认的高度  
	                            "bLengthChange" : true, //每页显示的记录数  
	                            "bFilter" : false, //搜索栏  
	                            "bSort" : true, //是否支持排序功能  
	                            "ordering" : false,//排序
	                            "bInfo" : true, //显示表格信息  
	                            "bAutoWidth" : true, //自适应宽度  
	                            "bJQueryUI" : false,//是否开启主题  
	                            "bDestroy" : true,  
	                            "bProcessing" : true, //开启读取服务器数据时显示正在加载中……特别是大数据量的时候，开启此功能比较好  
	                            "bServerSide" : true,//服务器处理分页，默认是false，需要服务器处理，必须true  
	                            "sAjaxDataProp" : "aData",//是服务器分页的标志，必须有   
	                            "sAjaxSource" : "sys/manager_findUserPageList.action",//通过ajax实现分页的url路径。    
	                            "aoColumns" : [//初始化要显示的列  
	                                    {  
	                                        "mDataProp" : "username",//获取列数据，跟服务器返回字段一致  
	                                        "sClass" : "center",//显示样式  
	                                        "bSortable" : false,
	                                        "mRender" : function(data, type, full) {//返回自定义的样式  
	                                            return "<label><input type='checkbox'/></label>";  
	                                        }  
	                                    },  
	                                    {  
	                                        "mDataProp" : "username",  
	                                        "mRender" : function(data, type, full) {  
	                                            return renderData(data); 
	                                        }    
	                                    },  
	                                    {  
	                                        "mDataProp" : "realname",  
	                                        "mRender" : function(data, type, full) {  
	                                            return renderData(data); 
	                                        }      
	                                    },  
	                                    {  
	                                        "mDataProp" : "phone",  
	                                        "mRender" : function(data, type, full) {  
	                                            return renderData(data); 
	                                        }    
	                                    },  
	                                    {  
	                                        "mDataProp" : "email",  
	                                        "mRender" : function(data, type, full) {  
	                                            return renderData(data); 
	                                        }    
	                                    },  
	                                    {  
	                                        "mDataProp" : "address",  
	                                        "mRender" : function(data, type, full) {  
	                                            return renderData(data); 
	                                        }    
	                                    },  
	                                    {  
	                                        "mDataProp" : "state",  
	                                        "mRender" : function(data, type, full) {  
	                                            return renderData(data); 
	                                        }    
	                                    } ],  
// 	                            "aoColumnDefs" : [ {//用来设置列一些特殊列的属性  
// 	                                "bSortable" : false,  
// 	                                "aTargets" : [0,1,2,3,4,6]  
// 	                            //第一列不排序  
// 	                            }],
	                            "aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0 , 1 , 2 ] }],
	                            "oLanguage" : {//语言设置  
	                                "sProcessing" : "处理中...",  
	                                "sLengthMenu" : "显示 _MENU_ 项结果",  
	                                "sZeroRecords" : "没有匹配结果",  
	                                "sInfo" : "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",  
	                                "sInfoEmpty" : "显示第 0 至 0 项结果，共 0 项",  
	                                "sInfoFiltered" : "(由 _MAX_ 项结果过滤)",  
	                                "sInfoPostFix" : "",  
	                                "sSearch" : "搜索:",  
	                                "sUrl" : "",  
	                                "sEmptyTable" : "表中数据为空",  
	                                "sLoadingRecords" : "载入中...",  
	                                "sInfoThousands" : ",",  
	                                "oPaginate" : {  
	                                    "sFirst" : "首页",  
	                                    "sPrevious" : "上页",  
	                                    "sNext" : "下页",  
	                                    "sLast" : "末页"  
	                                },
	                                "oAria" : {  
	                                    "sSortAscending" : ": 以升序排列此列",  
	                                    "sSortDescending" : ": 以降序排列此列"  
	                                }  
	                            }  
	                        });  
	  
	        //全选  
	        $('table th input:checkbox').on(  
	                'click',  
	                function() {  
	                    var that = this;  
	                    $(this).closest('table').find(  
	                            'tr > td:first-child input:checkbox').each(  
	                            function() {  
	                                this.checked = that.checked;  
	                                $(this).closest('tr').toggleClass('selected');  
	                            });  
	  
	                });  
	        
	        
	      $("#addUser").bind("click",function(){
	    	  $("#editModal").modal("show");
	    	  
	      })
	  
	      $("#submitUser").bind("click",function(){
	    	  var url="manager_addUser.action";
	    	  if($("#user_id").val() != ''){
		    	  url="manager_updateUser.action";
	    	  }
	    	  var data = $("#userForm").serialize();
	    	  console.info(data);
	    	  $('#user-table-list').dataTable();
// 	    	  $.post(url,data,function(response){
// 	    		  alert("修改成功");
// 	    	  })
	      })
	    });
		
</script>
<script>
function renderData(data){
	if(data){
		return data;
	}else{
		return '';
	}
}
</script>

