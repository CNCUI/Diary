<%@ page language="java" pageEncoding="utf-8"%>
<div>
	原密码：<input type="password" id="ymm"/>
	新密码：<input type="password" id="xmm"/>
	确认密码：<input type="password" id="xmm2"/>
	<button onclick="updateMm()">修改</button>
</div>
<script>
function updateMm(){
	var ymm = $("#ymm").val();
	var xmm = $("#xmm").val();
	var xmm2 = $("#xmm2").val();
	if(ymm == ''){
		alert("请填写原密码");
	}
	if(xmm == ''){
		alert("请填写新密码");
	}
	if(xmm2 == ''){
		alert("请填写确认密码");
	}
	if(xmm2 != xmm){
		alert("两次密码填写不一致");
	}
	var param = {
		ymm : ymm,
		xmm : xmm
	}
	$.post("front/front_updateMm.action",param,function(redata){
		alert(redata.message);
	},"json");
}
</script>