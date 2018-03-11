<%@ page language="java" pageEncoding="utf-8"%>
<div style="margin-top: 60px;margin-left: 210px;font-size: 18px">
	<p style="font-size: 18px;">原密码：&emsp;<input type="password" id="ymm"/></p><br>
	<p style="font-size: 18px;">新密码：&emsp;<input type="password" id="xmm"/></p><br>
	<p style="font-size: 18px;">确认密码：<input type="password" id="xmm2"/></p><br>
	<button style="margin-left: 135px;width: 80px;height: 30px" onclick="updateMm()">修改</button>
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
	$.post("sys/manager_updateMm.action",param,function(redata){
		alert(redata.message);
	},"json");
}
</script>