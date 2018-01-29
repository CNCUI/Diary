<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="/struts-tags" prefix="s" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>日记</title>
	
  <link rel="stylesheet" href="<%=basePath%>css/bootstrap.min.css">
	<link rel="stylesheet" href="<%=basePath%>css/bootstrap-theme.min.css">
	<script src="<%=basePath%>js/jquery-1.9.1.js"></script>
	<script src="<%=basePath%>js/bootstrap.min.js"></script>
  </head>
  <body>
    <div style="width:80%;height:auto;margin:0px auto;">
	    <form action="addDiary.action" method="post" id="myForm" >
	    	<table class="table table-hover" style="width:80%;height:auto;margin:0px auto;">
	    		<tr>
	    			<td>日记标题：<input type="text" id="title"  name="title" /><s:token></s:token></td>
	    		</tr>
	    		<tr>
	    			<td>
	    				日记内容：<br /><textarea id="content" name="content" rows="30" cols="120"></textarea><s:token></s:token>
	    			</td>
	    		</tr>
	    		<tr>
	    			<td>
		    			<button type="button" onclick="check();" class="btn btn-primary">保存</button>
		    			<button type="reset" class="btn btn-info">重置</button>
		    			<button type="button" class="btn btn-success" onclick="back();">返回首页</button>
	    			</td> 	
	    		</tr>
			</table>
		</form>	
    </div>
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
<script type="text/javascript">
	function check(){
		var title = $("#title").val();
		var content = $("#content").val();
		if($.trim(title)==""){
			$("#modal-body-mtk").html("请填写标题");
			$("#model_button").click();
			return false;
		}else if($.trim(title).length>=50){
			$("#modal-body-mtk").html("标题字数不能超过50个");
			$("#model_button").click();
			return false;
		}else if($.trim(content).length>=10000){
			$("#modal-body-mtk").html("日记内容字数不能超过10000个");
			$("#model_button").click();
			return false;
		}else if($.trim(content)==""){
			$("#modal-body-mtk").html("请填写内容");
			$("#model_button").click();
			return false;
		}else{
			$("#myForm").submit();
		}
	}
</script>
<script type="text/javascript">
	function back(){
		location.href = "index.jsp";
	}
</script>
  </body>
</html>