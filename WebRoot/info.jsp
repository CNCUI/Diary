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
    		<c:if test="${d!=null }">
    		<tr>
    			<td style="text-align:center;"><h1 style="color:orange">${d.title}</h1></td>
    		</tr>
		    <tr>
		    	<td style="text-align:center;color:orange">${d.createTime }</td>
		    </tr>
		    <tr>
		    	<td style="text-align:center;color:orange">${d.content }</td>
		    </tr>
		    <tr>
		    	<td style="text-align:center;color:orange">
		    		<button type="button" class="btn btn-success" onclick="back();">我的日记</button>
		    		<button type="button" onclick="add();" class="btn btn-primary">写日记</button>
		    	</td>
		    </tr>
    		</c:if>
		</table>
    </div>
    <script type="text/javascript">
		function back(){
			location.href = "index.jsp";
		}
	</script>
	<script type="text/javascript">
		function add(){
			location.href = "add.jsp";
		}
	</script>
  </body>
</html>
