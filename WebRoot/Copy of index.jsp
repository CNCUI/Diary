<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    <title>我的日记</title>
	<link rel="stylesheet" href="<%=basePath%>css/bootstrap.min.css">
	<link rel="stylesheet" href="<%=basePath%>css/bootstrap-theme.min.css">
	<script src="<%=basePath%>js/jquery-1.8.3.js"></script>
	<script src="<%=basePath%>js/bootstrap.min.js"></script>
  </head>
  
  <body>
    <div style="width:80%;height:auto;text-align:center;margin:0px auto;">
    	<table class="table table-hover" style="width:80%;height:auto;margin:0px auto;">
    		<tr>
		    	<td style="text-align:center;">
		    		<button type="button" onclick="add();" class="btn btn-primary">写日记</button>
		    	</td>
		    	<td style="text-align:center;">
		    		<button type="button" onclick="myDiary();" class="btn btn-success">我的日记</button>
		    	</td>
		    </tr>
    		<c:if test="${diaries!=null }">
    			<c:forEach items="${diaries }" var="d" varStatus="in">
		    		<tr>
		    			<td style="text-align:center;width:150px;height:40px;"><a href="findOne.action?id=${d.id }">${d.title }</a></td>
		    			<td style="text-align:center;width:200px;height:40px;">${d.createTime }</td>
		    			<td style="text-align:center;width:180px;height:40px;">
		    				<button type="button" class="btn btn-warning" onclick="update('${d.id }');">编辑</button>
		    				<button type="button" class="btn btn-danger" onclick="del('${d.id }');">删除</button>
		    			</td>
		    		</tr>
	    		</c:forEach>
    		</c:if>
		</table>
    </div>
    <c:if test="${diaries!=null }">
	    <ul style="list-style:none;margin-left:535px;">
				<li>
					<a class="prev" href="<%=basePath%>findPage.action?pageMethod=previous&currentPage=${sessionScope.pager.currentPage }">上一页</a>
					<span>第${sessionScope.pager.currentPage }页/共${sessionScope.pager.totalPages } 页</span>	
					<a class="next" href="<%=basePath%>findPage.action?pageMethod=next&currentPage=${sessionScope.pager.currentPage }">下一页</a>
				</li>
			</ul>
	</c:if>		
    <!-- 弹出提示框 -->
<button id="model_button" style="display:none;" class="btn btn-primary" data-toggle="modal" data-target="#mtk"></button>
	<div  class="modal fade bs-modal-lg" id="mtk" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
	      <div class="modal-dialog modal-sm">
	        <div class="modal-content">
	          <div class="modal-header">
	            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	            <h4 class="modal-title" id="myLargeModalLabel">消息提示</h4>
	          </div>
	          <div class="modal-body" id = "modal-body-mtk" style="text-align:center;line-height:40px;">
	          </div>
	          <div style="text-align:center;" id="modal-comfig-button">
	          		<button class="btn btn-info " id="modal-button" data-dismiss="modal" aria-hidden="true" >确定</button>
	          </div>
	          <br/>
	        </div><!-- /.modal-content -->
	    </div><!-- /.modal-dialog -->
</div><!-- /.modal --> <!-- 模态框结束 -->
<script type="text/javascript">
	/*
	*此处设置的是模态框中到确定按钮点击事件，
	*此事件主要用于隐藏模态框
	*/
	$("#modal-button").attr("onclick",function(){
		$("#mtk").on("hide.bs.modal",function(e){
			//此函数里,为空原因，主要是为了清空隐藏后的事件
		});
		$("#mtk").modal("hide");//手动隐藏模态框
	});
	
</script>
<c:if test="${sessionScope.msg!=null}">
	<script type="text/javascript">
		$("#modal-body-mtk").html("${sessionScope.msg}");
		$("#model_button").click();
		<%session.setAttribute("msg", null);%>/* 清空当前的session消息对话 */
	</script>
</c:if>
    <c:if test="${diaries==null }">
    	<script type="text/javascript">
    		window.location.href = "findPage.action";
    	</script>
    </c:if>
    <script type="text/javascript">
    		function myDiary(){
    			window.location.href = "findPage.action";
    		}
    	</script>
    <script type="text/javascript">
		function add(){
			location.href = "add.jsp";
		}
		//修改
		function update(id){
			window.location.href = "updateFindOne.action?id="+id;
		}
		//删除
	 	function del(id){
	 		var trL = $("#table_Id tr").length;
	 		if(trL<=1){
	 			alert("删了就没有了，留一条吧~");
	 		}else{
	 			if(confirm("确定要删除吗？")){
	 				window.location.href = "del.action?id="+id;
	 			}
	 			
	 		}
	 		
	 	}
	</script>
  </body>
</html>
