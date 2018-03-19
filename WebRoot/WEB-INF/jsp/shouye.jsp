<%@ page language="java" pageEncoding="utf-8"%>
<%String path = request.getContextPath(); %>
<div class="row" style="color: #4555c6;font-size: 22px">
	&emsp;&emsp;欢迎进入晓涵火箭外卖订餐系统
</div>
<div style="text-align:center;">

<img alt="" src="<%=path%>/upload/dog.jpg">

</div>
<script>
function renderData(data){
	if(data){
		return data;
	}else{
		return '';
	}
}
</script>

