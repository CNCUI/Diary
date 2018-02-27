<%@ page language="java" pageEncoding="utf-8"%>
<div style="margin-left:200px;margin-top: 44px">
<form id="registForm">
	<input type="hidden" name="p_userid" id="p_userid" />
	<p style="font-size: 18px;">用户名：<input type="text" name="p_username" id="p_username" /></p><br>
	<p style="font-size: 18px;">姓&emsp;名：<input type="text" name="p_realname" id="p_realname" /></p><br>
	<p style="font-size: 18px;">电&emsp;话：<input type="text" name="p_phone" id="p_phone" /></p><br>
	<p style="font-size: 18px;">地&emsp;址：<input type="text" name="p_address" id="p_address" /></p><br>
	<p style="font-size: 18px;">邮&emsp;箱：<input type="text" name="p_email" id="p_email" /></p>
</form>
<button style="margin-left: 109px;margin-top: 20px;width: 63px;height: 30px;" onclick="updateInfo()">修改</button>
</div>
<script>
$(function(){
	$.post("front/front_getUserInfoById.action",function(redata){
		if(redata.success){
			console.info(redata);
			$("#p_userid").val(redata.id);
			$("#p_username").val(redata.username);
			$("#p_realname").val(redata.realname);
			$("#p_phone").val(redata.phone);
			$("#p_address").val(redata.address);
			$("#p_email").val(redata.email);
		}else{
			alert(redata.message);
		}
	},"json")
})

function updateInfo(){ 
	var flag = true;
	$("#registForm").find("input").each(function(){
		if(this.value == ''){
			flag = false;
		}
	})
	if(!flag){
		alert("请将表单填写完整");
		return false;
	}
	$.post("front/front_updateInfo.action",$("#registForm").serialize(),function(redata){
		if(redata.success){
			alert("修改成功");
			window.location.reload();
		}
	},"json")
}
</script>