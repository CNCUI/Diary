var path1="<script src='"+PATH+"/assets/global/plugins/jquery-ui/jquery-ui.min.js' type='text/javascript'></script>";
var path2="<script src='"+PATH+"/assets/admin/trig/cms/zDialog.js' type='text/javascript'></script>";
var path3="<script src='"+PATH+"/assets/admin/trig/cms/zDrag.js' type='text/javascript'></script>";
var path4="<link href='"+PATH+"/cms/content/search/css/main.css' rel='stylesheet' type='text/css'/>";
document.write(path1);
document.write(path2);
document.write(path3);
document.write(path4); 

$(document.body).append('<a href="javascript:edit();">编辑</a>'); 

$(document.body).append('<div class="search_box">');
$(document.body).append('<input type="text" class="top_search_text"  id="q" value=""/>');
$(document.body).append('<input type="button" class="top_search_button" onclick="javascript:search();" />');
$(document.body).append('</div>');



function edit(){
	popup_info();
}

function popup_info() {
	var diag = new Dialog();/*固定宽高的信息弹出窗*/
	diag.Width = 1392;
	diag.Height = 800;
	diag.Title = "内容编辑";
	diag.URL = PATH+"/cms/itemEdit.htm?itemId="+ITEM_ID;
	diag.show();
}
function popup_alert()/*提示弹出窗*/
{
	Dialog.alert("操作成功！");
}
function popup_confirm()/*确认弹出窗*/
{
	Dialog.confirm('您确认要进行删除吗？');
}
function popup_close()/*关闭弹出窗*/
{
	parentDialog.close();
}

function search(){
	//得到搜索值
	var key=$("#q").val();
	window.location.href=PATH+'/search/search.t?key='+key;//跳转到搜索页面
}