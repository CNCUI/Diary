<%@ page contentType="text/html;charset=UTF-8"%>
<%@taglib prefix="s" uri="/struts-tags"%>
<%
	// 绝对路径PATH
	String path = request.getContextPath();
%>
<html lang="en"><head>
<meta charset="utf-8"/>
<title>晓涵火箭外卖前台</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"> 
<link href="assets/global/plugins/uniform/css/uniform.default.css" rel="stylesheet" type="text/css"/>
<link rel="stylesheet" type="text/css" href="assets/global/plugins/bootstrap-toastr/toastr.min.css"/>
<link rel="stylesheet" type="text/css" href="assets/global/plugins/select2/select2.css"/>
<link rel="stylesheet" type="text/css" href="assets/global/plugins/datatables/media/css/jquery.dataTables.css"/>
<%-- <link rel="stylesheet" type="text/css" href="<%=path%>/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css"/> --%>
<%-- <link rel="stylesheet" type="text/css" href="<%=path%>/assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css"/> --%>
<link rel="stylesheet" type="text/css" href="assets/global/plugins/jquery-multi-select/css/multi-select.css"/>
<link rel="stylesheet" type="text/css" href="frontend/css/main.css" />
<!-- checkbox -->
<link rel="stylesheet" type="text/css" href="assets/global/plugins/calendar-school/caleScho.css" />
<!-- 校历css -->
<link rel="stylesheet" type="text/css" href="assets/global/plugins/uniform/css/uniform.default.min.css" />
<link rel="shortcut icon" href="images/bsujf_favicon.ico"/>

<!-- select2 -->

<script src="assets/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/jquery-ui/jquery-ui.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/jquery.cokie.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/uniform/jquery.uniform.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/jquery-validation/js/jquery.validate.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/jquery-validation/js/localization/messages_zh.js" type="text/javascript"></script> 
<script type="text/javascript" src="assets/global/plugins/select2/select2.min.js"></script>
<script type="text/javascript" src="assets/global/plugins/select2/select2_locale_zh-CN.js"></script> 
<script type="text/javascript" src="assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js"></script>
<script type="text/javascript" src="assets/global/plugins/datatables/media/js/jquery.dataTables.min.js"></script>
<%-- <script type="text/javascript" src="<%=path%>/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js"></script> --%>
<script src="assets/global/plugins/bootstrap-modal/js/bootstrap-modal.js" type="text/javascript"></script>

<script src="assets/global/plugins/backstretch/jquery.backstretch.min.js" type="text/javascript"></script>

<script src="assets/admin/trig/scripts/trig.js" type="text/javascript" ></script>

<script src="assets/global/plugins/bootstrap-toastr/toastr.min.js"></script>
<script type="text/javascript">TRIG.PATH = '<%=request.getContextPath()%>';</script> 
<script src="assets/global/scripts/metronic.js" type="text/javascript"></script>
<script type="text/javascript" src="assets/admin/trig/locale/errorcode_zh_CN.js"></script>
<script type="text/javascript" src="assets/admin/trig/locale/tablecolumn_zh_CN.js"></script>
<script type="text/javascript" src="assets/admin/trig/locale/textreources_zh_CN.js"></script>

<script src="assets/admin/trig/scripts/trig-validate.js" type="text/javascript" ></script>
<script src="assets/admin/trig/scripts/trig-sys.js" type="text/javascript" ></script>
<script type="text/javascript" src="assets/admin/trig/scripts/ajaxfileupload.js"></script>
<!-- 校历js -->
<script src="assets/global/plugins/calendar-school/caleScho.js"></script>
<script src="assets/global/plugins/calendar-school/calendar-converter.js"></script>
<!-- 本项目公共的select加载方法 -->
<script src="assets/global/scripts/common-select.js"></script>
</head>
<body style="padding-bottom: 0px;padding-top: 110px;">
	<div class="top top_nav" id="tbox1">
		<img src="frontend/img/top2.png" width="100%"/>
	</div>
	<div class="clear"></div>
	<div class="middle_box">
		<div class="user_box"
			style="padding-top: 0; position: relative; z-index: 9999">
			<h1 class="user_box_title"></h1>
			<div class="user_left">
				<div class="user_left_top">
					<div class="userL_inf">
						<div style="width: 30%;">
							<span style="font-size: 26px;" class="username"></span>
							<span style="font-size: 26px;" class="zymc"></span>
							<a id="dlxt" href="javascript:login();">[登录系统]</a>
							<a id="tcxt" href="javascript:frontlogout();">[退出系统]</a>
						</div>
						<div>
							<p id="realname"></p>
							<p id="phone"></p>
							<p id="address"></p>
						</div>
						<div class = "stunj" style="float: right; height: 80px; line-height: 80px; font-size: 26px; color: #E94D3E; margin-right: 25px;"></div>
					</div>
					<ul class="userL_num">
						<li style="width: 120px;"><a href="#" class="stuXs"></a></li>
						<li style="width: 160px; border: 0"><a href="#" class="stuZy"></a></li>
						<input type="hidden" id="bjxx_xsh" name="bjxx_xsh" />
					</ul>

				</div>
				<ul class="user_left_bottom">
					<li class="lwmenu">
						<a id="front_start" class="lw start" url="front/front_getFoodList.action" style="padding: 0;"><span class="ulb3">商品列表</span></a>
					</li>
<!-- 					<li class="lwmenu"> -->
<%-- 						<a class="lw notice" url="stu/tzgg_tzggInit.htm" style="padding: 0;"><span class="ulb8">通知公告</span></a> --%>
<!-- 					</li> -->
					<li class="firt_li1 lwmenu"><span class="ulb1">我的订单</span> 
						<a class="lw hbk" url="front/front_todayOrderInit.action"><span>今日订单</span></a> 
						<a class="lw kb" url="front/front_historyOrderInit.action"><span>历史订单</span></a>
					</li>
					<li class="firt_li1 lwmenu"><span class="ulb9">个人中心</span>
						<a class="lw xj" url="front/front_updateInfoInit.action"><span>基本信息</span></a>
						<a class="lw mm" url="front/front_updateMmInit.action"><span>密码修改</span></a>
					</li>
					
				</ul>
			</div>
			<div class="user_right" style="position: relative"></div>
		</div>
	</div>

	<div class="clear"></div>
	<div class="footer">
		<div style="position:fixed;bottom:0;background-color: #8de9e9;margin-left: 35%;width:50%; z-index:9999">已选择：<br><span style="width:80%"  id="myorder"></span><button id="orderData" onclick="submitOrder(this)" style="margin-left: 70%">提交订单</button>&emsp;<button onclick="cancleOrder(this)">清空</button></div>
		<img src="frontend/img/bottom.png" width="100%"/>
	</div> 
	
	<div id="lodiv" style="display:none;position:fixed;bottom:0;background-color: #c4baba;width:50%; z-index:9999;left:30%;top:30%;height:30%">
		<button onclick="closelo(this)" style="float: right;">关闭</button>
		<div style="text-align: center;margin-top: 60px;">
			<div style="font-size: 18px">用户名：<input id="login_username" /></div>
			<div style="font-size: 18px">密&emsp;码：<input type="password" id="password" /></div>
			<div><button style="height:20px;width:60px;margin-left:51px;margin-top: 10px"  onclick="frontlogin()">登陆</button>&emsp;&emsp;&emsp;<a onclick="gotoregist()">注册</a></div>
		</div>
	</div>
	
	<div id="regist" style="display:none;position:fixed;bottom:0;background-color: #c4baba;width:50%; z-index:9999;left:30%;top:30%;height:30%">
		<button onclick="closelo(this)" style="float: right;">关闭</button>
		<div style="text-align: center;margin-top: 30px;">
			<form id="registForm">
				<div style="font-size: 18px">用户名：<input name="username" id="username" /></div>
				<div style="font-size: 18px">密&emsp;码：<input type="text" name="password" id="password" /></div>
				<div style="font-size: 18px">姓&emsp;名：<input type="text" name="realname" id="realname" /></div>
				<div style="font-size: 18px">电&emsp;话：<input type="text" name="phone" id="phone" /></div>
				<div style="font-size: 18px">地&emsp;址：<input type="text" name="address" id="address" /></div>
				<div style="font-size: 18px">邮&emsp;箱：<input type="text" name="email" id="email" /></div>
			</form>
			<div><button style="height:20px;width:60px;margin-left:61px;margin-top: 10px"  onclick="frontregister()">注册</button>&emsp;&emsp;&emsp;<a onclick="gotologin()">去登陆</a></div>
		</div>
	</div>
</body>


<script>
function gotoregist(){
	$("#lodiv").hide();
	$("#regist").show();
}
function frontregister(){
	var c = true;
	$("#registForm").find("input").each(function(){
		if(this.value == ''){
			c = false;
		}
	})
	if(!c){
		alert("请将表单填写完整");
		return false;
	}
	console.info($("#registForm").serialize());
// 	return false;
	$.post("front/front_frontregister.action",$("#registForm").serialize(),function(redata){
		if(data.success){
			alert("注册成功");
		}else{
			alert(data.message);
		}
	},"json");
}
function gotologin(){
	$("#lodiv").show();
	$("#regist").hide();
}
// 关闭登陆框
function closelo(obj){
	$(obj).parent().hide();
}
// 前台登陆
function frontlogin(){
	var username = $("#login_username").val();
	var password = $("#password").val();
	var param = {
		username :username,
		password :password
	}
	console.info(param);
// 	return false;
	$.post("login_frontLogin.action",param,function(redata){
		if(redata.success){
			console.info(redata);
			var data = redata.data;
			$("#realname").text(data.realname);
			$("#phone").text(data.phone);
			$("#address").text(data.address);
			$("#orderaddress").val(data.address);
			$("#dlxt").hide();
			$("#tcxt").show();
			alert("登陆成功");
			$("#lodiv").hide();
		}else{
			alert("用户名或密码错误");
		}
	},"json");
}

function frontlogout(){
	$.post("login_frontlogout.action");
	window.location.reload()
}

	function gotohrefurl(url) {
		$.ajax({
			type : "GET",
			cache : false,
			url : url,
			dataType : "html",
			success : function(res) {
				$('.user_right').html(res);
			},
			error : function(xhr, ajaxOptions, thrownError) {
				$('.user_right').html(
						'<h4>Could not load the requested content.</h4>');
			}
		});
	}

	$('.lw').click(function() {
		var obj = $(this);
		var url = obj.attr('url');
		 var the = $(this);
         var hash =  this.className.substr(this.className.indexOf(" ")+1);
         url+= "#" + hash;
         location.href = "#" + hash;
         setCookie('hash', hash); 
		gotohrefurl(url);
		//删除其他选中样式，把ulb_select给当前选中的便签
		$('a span').removeClass('ulb_select');
		obj.find('span').addClass('ulb_select');
	});
	
function login() {
	$("#lodiv").show();
	$.getJSON('/frontend/logout.json','',function(data){
// 		location.href = TRIG.PATH+'/frontend/login.htm';
	});
}
function getQueryString() {
	var url = location.href;
	if(url.indexOf("#")>-1) {
		return url.substr(url.indexOf("#") + 1);
	}
	return null;
}

function gotourl(p) {
	if(p) { 
		$('.user_left_bottom .lw.' + p).click(); // load the content for the dashboard page. 
	}else{
		gotohrefurl(TRIG.PATH+'/frontend/stu/stuwork_init.htm'); 
	}
}
	
jQuery(document).ready(function() {
	// 登录判断
	$.post(TRIG.PATH+'/frontend/islogin.json', '' , function(data) { 
		data = $.parseJSON(data);
		if(data.success==false) {// 未登录
			location.href = TRIG.PATH+'/frontend/login.htm';
		}else{
			
			//标识登录了。左侧则把用户信息加载
			getuserInfo(data.data);
			
			var p = getQueryString(); 
		  	if(!p) {
			   p = "start";
		   	}
		   	gotourl(p);
			//$('.ulb8').addClass('ulb_select');
		}
	});


	function getuserInfo(data) {
		var un = "";
		var stunj = "";
		console.log(data)
		if(data) {
			if(data.xx_xm) {
				un = data.xx_xm;
			} else {
				un = data.xz_xh;
			}
			
			if(data.xx_njId){
				stunj = data.xx_njId;
			}
		}
		 $(".username").text(un);
		 var path = TRIG.PATH+data.xx_zp;
		 $("#datou").attr('src', path); 
		 $(".stunj").text(stunj);
		 $(".stuXs").text(data.xx_yxId?data.xx_yxId:'');
		 $(".stuZy").text(data.xx_zyId?data.xx_zyId:'');
		 $('#bjxx_xsh').val(data.xx_yxId?data.xx_yxId:'');
	};
});
	//照片加载发生错误时
	function error(){
		var path = TRIG.PATH+'/frontend/images/datou.png';
		$("#datou").attr("src", path);
	};
	
function initdata(data){
	$("#realname").text(data.realname);
	$("#phone").text(data.phone);
	$("#address").text(data.address);
	$("#dlxt").hide();
	$("#tcxt").show();
}
$(function(){
	$("#front_start").click();
	$.post("login_isLogin.action",function(redata){
		if(redata.success){
			console.info(redata.data);
			initdata(redata.data);
		}else{
			$("#tcxt").hide();
		}
	},"json")
})


function submitOrder(obj){
	var param = $(obj).data("order");
	
	if(typeof(param) == 'undefined'){
		alert("请选择菜品");
		return false;
	}
	if($("#realname").text() != '' && $("#orderaddress").val() == ''){
		alert("请填写地址");
		return false;
	}
	for(var i=0;i<param.length;i++){
		param[i].remark = $("#remark").val();
		param[i].orderaddress = $("#orderaddress").val();
	}
	console.info(JSON.stringify(param));
	$.post("front/front_submitOrder.action",{"param":JSON.stringify(param)},function(redata){
		console.info(redata);
		if(!redata.success){
			alert(redata.message);
		}else{
			alert("订单已提交");
			cancleOrder();
		}
	},"json")
}

function cancleOrder(){
	$.post("front/front_cleanCookie.action",function(){
		window.location.reload();
	},"json");
}
</script>

</html>