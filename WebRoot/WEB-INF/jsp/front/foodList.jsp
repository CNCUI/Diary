<%@ page language="java" pageEncoding="utf-8"%>
<div style="display: none">
	<table id="#trig-bmBmsj-table"></table>
</div>
<div class="row">
	<div>	
		类型：<input type="text" id="" name="" />
		名称：<input type="text" id="" name="" />
	</div>
	<div id="content" style="margin-top: 20px">
	</div>
</div>
<div style="display: none">
	<div id="clonediv" style="width: 266px;height:220px;float: left;margin-left:8px" class="col-md-4">
		<img id="pic" style="width: 266px;height: 88px" alt="" src="/uploadfiles/img/1519296712077-5600.jpg">
		<font id="name" style="font-size: 26px">宫保鸡丁</font><br>
		价格：¥<span id="price">26</span><br>
		数量<button onclick="reduce(this)" >-</button><input type="text" class="input" value="1" ><button onclick="add(this)" >+</button>
		<br><br>
		<input type="hidden" id="food_id" >
		<button onclick="buy(this)" style="font-size: 13px">立即订购</button>
	</div>
</div>
<div class="trig-bottom"></div>

<script>
var url = {};
$(function(){
	TRIG.LOADHTMLOrJs(function(){
		//对象定义
		url = {
				add : 'front/front_add1.action',
				update : 'sys/manager_updateFood.action',
				del : 'sys/manager_delFood.action',
				find : 'front/front_findFoodPageList.action',
		};
		
		$.post(url.find,function(redata){
			var redata = redata.data;
			for(var i=0;i<redata.length;i++){
				var cdiv = $("#clonediv").clone();
				$(cdiv).find("[id=pic]").attr("src",redata[i].pic);
				$(cdiv).find("[id=name]").text(redata[i].name);
				$(cdiv).find("[id=price]").text(redata[i].price);
				$(cdiv).find("[id=food_id]").val(redata[i].id);
				$("#content").append(cdiv);
			}
		},"json")
		
		
		showCookie();
    });
});
function add(obj){
	var val = $(obj).parent().find("input").eq(0).val();
	var c = Number(val)+1;
	$(obj).parent().find("input").eq(0).val(c);
}
function reduce(obj){
	var val = $(obj).parent().find("input").eq(0).val();
	if(val == 0) return false;
	var c = Number(val)-1;
	$(obj).parent().find("input").eq(0).val(c);
}
function showCookie(){
	$.post("front/front_showCookie.action",function(redata){
		console.info(redata);
		console.info(redata.data);
		var htm = ""
		var numprice = 0;
		for(var i=0;i<redata.data.length;i++){
			htm += "名称："+redata.data[i].name+"&nbsp;&nbsp;&nbsp;数量："+redata.data[i].num+"&nbsp;&nbsp;&nbsp;价格：¥"+redata.data[i].price+"<br>";
			numprice = Number(numprice) + Number(redata.data[i].price);
		}
		if(htm != ''){
			htm += "<br>总价：¥"+numprice;
		}
		$("#myorder").html(htm);
		$("#orderData").data("order",redata.data)
// 		alert($("#orderData").data("order"));
	},"json");
}
function buy(obj){
	var id = $(obj).parent().find("input").eq(1).val();
	var name = $(obj).parent().find("font").eq(0).html();
	var num = $(obj).parent().find("input").eq(0).val();
	var price = $(obj).parent().find("span").eq(0).html();
	var param = {
		id : id,
		name : name,
		num : num,
		price : num*price
	}
	console.info(param);
	$.post(url.add,param,function(re){
		showCookie();
	},"json")
}
</script>