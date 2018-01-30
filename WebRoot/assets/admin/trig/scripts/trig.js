/**
 * Deyun Chen
 * @singleton
 */
var TRIG = TRIG || {};
// 工程路径
TRIG.PATH = '';
// 静态文件路径
TRIG.STATICPATH = '';
// 上传文件路径
TRIG.UPLOADPATH = '';
// 默认设置
TRIG.settings = {
		sound : true,
		msgLocation : 'toast-top-right',
		style : 'default',
		dataRecycleBin : true
};

//语言常量
TRIG.TEXT = TRIG.TEXT || {};
/** 系统常量 */
TRIG.Contants = {
	WIDTH_200 : 200,
	WIDTH_400 : 400,
	WIDTH_600 : 600,
	WIDTH_800 : 800,
	CSRF_PARA : 'frcs',
	CSRF_HEADER : 'frcs',
	CSRF_COOKIE : '__frcs'
};
//系统包
TRIG.system = TRIG.system || {};
//ID列宽
TRIG.system.idw = 230;
// 错误代码表
TRIG.ERRORCODES = [];
//错误代码表
TRIG.ERROR = {}; 
TRIG.ERROR.MESSAGE = 0; //没有错
TRIG.ERROR.ERROR = -1;  //系统错误
TRIG.ERROR.NOT_LOGIN = -2; //未登录
//信息对话框
TRIG.messager = TRIG.messager || {};

TRIG.messager._alert = function(type, message, alertname, fn) {
	if(fn) {
		 bootbox.alert(message, fn);  
	} else {
		toastr.options = {
	            closeButton: true,
	            debug: false,
	            positionClass: TRIG.settings.msgLocation,
	            showDuration: "1000",
	            hideDuration: "1000",
	            timeOut: "5000",
	            extendedTimeOut: "1000",
	            showEasing: "swing",
	            hideEasing: "linear",
	            showMethod: "fadeIn",
	            hideMethod: "fadeOut"
	        };
		toastr[type](message, alertname);
	}
	if(TRIG.settings.sound==true) {
		if(type=='error') {
			if(document.getElementById("ohoh_mp3"))
				document.getElementById("ohoh_mp3").play();
		} else {
			if(document.getElementById("ding_mp3"))
				document.getElementById("ding_mp3").play();
		}
	}
};

TRIG.messager.alertError = function(message, fn) {
	TRIG.messager._alert('error', message, TRIG.TEXT.PUBLIC.ERROR, fn);
};

TRIG.messager.alert = function(info, alertname, fn) {
	if(!alertname || alertname==''){//提示窗TITLE
		alertname = TRIG.TEXT.PUBLIC.TIP;
	}
	TRIG.messager._alert('info', info, alertname, fn);
};

TRIG.messager.alertSuccess = function(info, alertname) {
	if(!alertname || alertname==''){//提示窗TITLE
		alertname = TRIG.TEXT.PUBLIC.TIP;
	}
	TRIG.messager._alert('success', info, alertname);
};

TRIG.messager.confirm = function(title, msg, fn) {
	bootbox.setDefaults({locale:'zh_CN'});
	bootbox.confirm(msg, fn); 
};

/** 统一AJAX提交返回处理 */
TRIG.successHandle = function(data){
	try{
		var isobj = typeof(data) == "object" ;
		// 非对象
		if(!isobj) {
			data = $.parseJSON(data);
		}
		if(data.success==false){
			// 提示消息
			var msg = TRIG.ERRORCODES[data.errorCode];
			if(data.message) {
				msg = data.message;
			}
			// 未登录
			if(data.errorCode == TRIG.ERROR.NOT_LOGIN){
				TRIG.messager.alertError(data.errorCode + ":" + msg, function() {
						openlogin();
				});
			} else {
				TRIG.messager.alertError(data.errorCode + ":" + msg);
			}
		}
		return data;
	}catch(e){
		TRIG.messager.alertError(TRIG.TEXT.PUBLIC.SYSERROR_2 + "\n" + e.message);
	}
};
//更新/修改成功后提示
TRIG.updateSuccessAlert = function(){
	TRIG.messager.alertSuccess(TRIG.TEXT.PUBLIC.BTN.SAVE + TRIG.TEXT.PUBLIC.SUCCESS);
};

function openlogin() {
	location.href = TRIG.PATH +  '/login.t';
}


//登录身份令牌
function getToken() {
	return getCookie('token');
}

//权限判断
var trigroles = '';//用户角色
var trigprivlegs = {};//权限权
//trigprivlegs['findUser'] = true;
//初始用户角色与权限
function setRolePriv(data){
	if(data.roles){
		trigroles = data.roles;
	}
	if(data.privlegs) {
		trigprivlegs = data.privlegs;
	}
}

TRIG.isRole = function(rolename) {
	return (trigroles + ",").indexOf(rolename + ",") > -1; 
};

TRIG.UserSuperAdmin = false;
/** 是否超级管理角色 */
TRIG.isSuperAdmin = function() {
	return TRIG.UserSuperAdmin;
};

TRIG.isPrivlege = function(pv) {
	// index.jsp 设置 
	if(TRIG.settings.priv.fun==false) {
		return true;
	}
	var isp = eval("trigprivlegs."+pv);
	if(isp == true){
		return true;
	}
	return false;
};
/** 初始操作按钮是否可用,无权禁用 */
TRIG.initPrivleg = function(div) {
	// 功能权限启用，index.jsp 设置 
	if(TRIG.settings.priv.fun) {
		var btns = null;
		if(div){
			btns = $(".trig-privbtn", div);
		}else{
			btns = $(".trig-privbtn");
		}
		
		btns.each(function(){
			var pv = $(this).attr('privkey');
			if(pv&&pv!=''){
				if(TRIG.isPrivlege(pv)==false) { 
					$(this).addClass('disabled');
					$(this).unbind('click');
					//$(this).remove(); 
				}
			}
		});
	}
};

String.prototype.StartWith = function(s) {
	if (s == null || s == "" || this.length == 0 || s.length > this.length)
		return false;
	if (this.substr(0, s.length) == s)
		return true;
	else
		return false;
	return true;
};

TRIG.isContentPrivlege = function(uv, pv) {
	if(TRIG.settings.priv.content==false || TRIG.isSuperAdmin()) {
		return true;
	}
	if(uv) {
		if(pv.StartWith('find') || pv.StartWith('Advanced')) { // 查询、高级查询
			if(uv=='B-write' || uv=="C-read" || uv == 'D-view') {
				return true;
			}
		}else {
			if(uv=='B-write') {
				return true;
			}
		}
	}
	return false;
};

TRIG.isContentQuery = function(pv) {
	if(TRIG.settings.priv.content==false || TRIG.isSuperAdmin()) {
		return true;
	}
	return pv && (pv=='B-write' || pv=='D-view' || pv=='C-read');
};
/** 内容权限,初始操作按钮是否可用,无权禁用 */
TRIG.initContentPrivleg = function(uv, div) {
	// 内容权限启用，index.jsp设置
	if(TRIG.settings.priv.content && TRIG.isSuperAdmin() == false) {
		var btns = null;
		if(div){
			btns = $(".trig-privbtn", div);
		}else{
			btns = $(".trig-privbtn");
		}
		btns.each(function(){
			var pv = $(this).attr("privkey");
			if(pv&&pv!=''){
				if(TRIG.isPrivlege(pv)) {
					if(TRIG.isContentPrivlege(uv, pv)==false){
						$(this).addClass('disabled');
						//$(this).unbind('click');
					} else {
						$(this).removeClass('disabled'); 
					}
				} else {
					//$(this).addClass('disabled');
				}
			}
		});
	}
};

TRIG.initTableContentPrivleg = function(id, div) {
	$.post(TRIG.PATH + '/role_content_findUserPrivlege.json','id='+id, function(data){
		data = TRIG.successHandle(data);
		if(data.success) {
			var uv = data.val;
			TRIG.initContentPrivleg(uv, div);
		}
	});
};

TRIG.getContentUrl = function(url, cid) {
	return url += (url.indexOf("?")>-1 ? "&" : "?") + "cid=" + cid;
};

//datagrid update 
TRIG.isSelectOne = function(rows) {
	if(!rows || rows==0){
		TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE); //选择一条记录
		return false;
	}
	if(rows>1){
		TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTNOTMORES);//不能多行
		return false;
	}
	return true;
};

TRIG.isSelect = function(rows) {
	if(rows==0){
		TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE); //至少一行
		return false;
	}
	return true;
};

//datagrid delete
TRIG.isDelSelectOne = function(rows, fn) {
	if(!rows){
		TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE); //至少一行
		return false;
	}
	TRIG.messager.confirm(TRIG.TEXT.PUBLIC.MESSAGE.DELMSGTITLE,rows + TRIG.TEXT.PUBLIC.MESSAGE.DELTIPW + TRIG.TEXT.PUBLIC.MESSAGE.DELTIP,function(r){
	//是否删除	
		if(r) {
			fn.call();
		}
	});
	return true;
};
// 放入回收站
TRIG.isDelRecycleBinSelectOne = function(rows, fn) {
	if(TRIG.settings.dataRecycleBin) {
		if(!rows){
			TRIG.messager.alert(TRIG.TEXT.PUBLIC.MESSAGE.SELECTONE); //至少一行
			return false;
		}
	
		TRIG.messager.confirm(TRIG.TEXT.PUBLIC.MESSAGE.DELMSGTITLE,rows + TRIG.TEXT.PUBLIC.MESSAGE.DELTIPW + TRIG.TEXT.PUBLIC.MESSAGE.DEL_RECYCLE_BIN_TIP,function(r){
		//是否删除	
			if(r) {
				fn.call();
			}
		});
	} else {
		return TRIG.isDelSelectOne(rows, fn);
	}
	return true;
};


//批量删除
TRIG.isDels = function(fn){
	TRIG.messager.confirm(TRIG.TEXT.PUBLIC.MESSAGE.DELMSGTITLE,TRIG.TEXT.PUBLIC.MESSAGE.DELSTIP,function(r){
	//是否删除	
		if(r) {
			fn.call();
		}
	});
};

// 进度加载，统一load...
TRIG.progress = function(_msg) {
	$('#ajax-modal-loading').modal({
		backdrop : 'static'
	});
};
TRIG.progressClose = function() {
	$('#ajax-modal-loading').modal('hide');
};


// log js
TRIG.LOG = {
		isdebug : true,
		isinfo : true,
		Debug: function(log) {
			if(TRIG.LOG.isdebug) {
				TRIG.Console.info(log, 'debug');
			}
		},
		Info: function(log) {
			if(TRIG.LOG.isinfo) {
				TRIG.Console.info(log);
			}
		},
		Error: function(log) {
			TRIG.Console.info(log, 'error');
		}
};
TRIG.Console = TRIG.Console || {};
TRIG.Console.info = function(log, level) {
	try{
		if(level) {
			if(level == 'error') {
				console.error(log);
			} else if(level == 'debug') {
				console.debug(log);
			} else if(level == 'info') {
				console.info(log);
			}
		} else {
			console.info(log);
		}
		
	}catch(e){}
};
// end log js

//cookie

//  设置，需与系统设置同步
TRIG.Cookie = {
		domain : '',
		secure : false,
		path : '/'
};

function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

function getCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) return getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}
function setCookie(name, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 3600000000);
    setCookieValue(name, value, exp);
}

function delCookes(name) {
    var date = new Date();
    //将date设置为过去的时间
    date.setTime(date.getTime() - 10000);
    //将userId这个cookie删除
    setCookieValue(name, '', date);
}

function setCookieValue(name, value, date) {
	document.cookie = name + "=" + value + "; expire=" + date.toGMTString() + "; path=" + (TRIG.PATH ? TRIG.PATH : TRIG.Cookie.path) + (TRIG.Cookie.domain ? ';domain=' + TRIG.Cookie.domain : '') +  (TRIG.Cookie.secure==true ? ';secure' : '');
}

// 清除表单值 
TRIG.formreset = function(form, defdata) {
	form.find('input[type=hidden]').each(function(){
		this.value = '';
	});
	if(defdata) {
		// 默认初始
		TRIG.forminit(form, defdata);
	} else {
		form.get(0).reset();
		//form.form('clear');
		//form.form('reset');
		// 清除隐藏域，因reset不消除这里
		TRIG.updateCheckRadioStyle(form);
	}
};

// 更新手动设置 checkbox radio 样式效果，form为jquery对象
TRIG.updateCheckRadioStyle = function(form) {
	var rr = form.find('input[type=radio], input[type=checkbox]');
	rr.each(function(){
		var f = $(this);
		jQuery.uniform.update(f); 
	});
};

function _checkField(form, name, val){
	var rr = form.find('input[name="'+name+'"][type=radio], input[name="'+name+'"][type=checkbox]');
	rr.prop('checked', false);
	rr.each(function(){
		var f = $(this);
		var type = f.attr('type');
		if (f.val() == val || (val && type == 'checkbox' && $.inArray(f.val(), val.split(",")) >= 0)){
			f.prop('checked', true);
		}
		jQuery.uniform.update(f); 
	});
	return rr;
}

TRIG.forminit = function(form, data) {
	form.get(0).reset();
	var sn = [];
	for(var name in data) {
		var val = data[name];
		var rr = _checkField(form, name, val);
		if (!rr.length) {
			$('input[name="'+name+'"]', form).val(val);
			$('textarea[name="'+name+'"]', form).val(val);
			$('select[name="'+name+'"]', form).val(val);
			$('span[name="'+name+'"]', form).text(val);
			if(val)  {
				$('select[name="'+name+'"]', form).attr('data-value', val);
				sn.push(name);
			}
		}
	}
	// 级联初始
	for(var i=0;i<sn.length;i++) {
		$('select[name="'+sn[i]+'"]', form).change();
	}
};

// 导出HTML初始
TRIG.initexpHTML = function(id, expurl, table) {
	// 是否有导出权限
	//if(TRIG.isPrivlege(id)) {
		var obj = $("#"+id);
		var oHTML = '';
		oHTML += '<li><a href="javascript:;" class="trig-export-file" type="1" pagetype="0">导出所有页面为CSV </a></li>';
		oHTML += '<li>	<a href="javascript:;" class="trig-export-file" type="2" pagetype="0">导出所有页面为XML </a></li>';
		oHTML += '<li><a href="javascript:;" class="trig-export-file" type="3" pagetype="0">导出所有页面为PDF </a></li>';
		oHTML += '<li><a href="javascript:;" class="trig-export-file" type="1" pagetype="1">导出当前页面为CSV </a></li>';
		oHTML += '<li><a href="javascript:;" class="trig-export-file" type="2" pagetype="1">导出当前页面为XML </a></li>';
		oHTML += '<li><a href="javascript:;" class="trig-export-file" type="3" pagetype="1">导出当前页面为PDF </a></li>';
		obj.html(oHTML);
		$(".trig-export-file" , obj).on("click", function(){
			var _the = $(this);
			TRIG.expdata(_the.attr('type'), expurl, table, _the.attr('pagetype'));
		});
	//}
};

// 导出 pagetype=0 全部
TRIG.expdata = function(type, url, table, pagetype) {
	if(url.indexOf('?')>-1) {
		url += "&";
	}else{
		url += "?";
	}
	var rows = 0;
	var page = 1;
	// 默认导出全部
	if(pagetype && table && pagetype=='1'){
		page = table.getPageNumber();
		rows= table.getPageSize();
	} 
	// 是否存在导出FORM
	if(!document.getElementById('expform')) {
		jQuery('<form action="" method="POST" name="expform" id="expform"></form>').appendTo(document.body);	
	}
	var expform = document.getElementById('expform');
	
	url += "exptype=" + type + "&rows=" + rows + "&page=" + page;
	var frcs = getCookie(TRIG.Contants.CSRF_COOKIE);
	if(frcs) {
		url += "&" + TRIG.Contants.CSRF_PARA + "=" + frcs;
	}
	// 查询条件
	var queryParams = table ? table.getQueryParams() : {};
	// 赋值
	$("#expform").html('');
	for(var key in queryParams){
		jQuery('<input type="hidden" name="'+ key +'" />').appendTo(expform);
	}
	//$("#expform").form('load', queryParams);
	TRIG.forminit($("#expform"), queryParams);
	
	expform.action = TRIG.PATH + "/" + url;
	expform.method = 'post'; 
	expform.submit();
};

//取用户显示名，有真实姓名显示真实姓，无则显示帐号名
TRIG.getUserName = function(data) {
	var un = "";
	if(data) {
		if(data.su_realName) {
			un = data.su_realName;
		} else {
			un = data.su_userName;
		}
	}
	return un;
};

TRIG.getUserAvatar = function(data) {
	var un = TRIG.STATICPATH + "/assets/admin/layout/img/male.png";
	if(data) {
		if(data.su_userAvatar) {
			un = TRIG.UPLOADPATH + data.su_userAvatar;
		} else {
			if(data.su_sex == 'F')
			un = TRIG.STATICPATH + "/assets/admin/layout/img/female.png";
		}
	}
	return un;
};
// 用户个性化设置
TRIG.initUserDef = function(def) {
	if(def) {
		if(def.sud_pagesize && def.sud_pagesize>0) {
			TRIG.PAGESIZE = def.sud_pagesize;
		}
		if(def.sud_sound=='N') {
			TRIG.settings.sound = false;
		}
		if(def.sud_style) {
			TRIG.style = def.sud_style;
			$('#style_color').attr("href",  TRIG.STATICPATH + '/assets/admin/layout/css/themes/' + TRIG.style + ".css");
		}
		if(def.sud_msgLocation) {
			TRIG.settings.msgLocation = def.sud_msgLocation;
		}
		if(TRIG.CMS) {
			if(def.sud_editorType)
				TRIG.CMS.EditorType = def.sud_editorType;
		}
	}
};

// 时间比较,d1>d2
TRIG.dateCompare = function(d1, d2) {
	return d1.getTime()>d2.getTime();
} ;
// 结束时间是否大于开始时间
TRIG.startDateToEndDate = function(d1, d2) {
	if(d1&&d2) {
		d1 = new Date(Date.parse(d1.replace(/-/g,   "/")));
		d2 = new Date(Date.parse(d2.replace(/-/g,   "/")));
		return TRIG.dateCompare(d2, d1);
	}
	return true;
};

function disableLink(e) {
    // cancels the event
    e.preventDefault();
    return false;
}

TRIG.trackPost = function(url, para, sucfun, errfun) {
	//Pace.track(function() {
		TRIG.progress();
		$.post(url,para, function(data){
			TRIG.progressClose();
			data = TRIG.successHandle(data);
			if(data.success==true) {
				if(sucfun)
					sucfun.call(this, data);
			} else {
				if(errfun)
					errfun.call(this, data);
			}
		});
	//});
};

var Pace = {
		track : function(fun) {
			fun.call();
		}
};

TRIG.TreeUndetermined = function(treeid) {
	var ids = [];
	function setUids(nodes) {
    	for(var i=0;i<nodes.length;i++) {
    		if($("#" + treeid).jstree('is_undetermined', nodes[i])) { 
    			ids.push(nodes[i].id);
    			if(nodes[i].children && nodes[i].children.length>0) {
    				setUids(nodes[i].children);
    			}
    		}
    	}
    }
	var nodeall = $("#" + treeid).jstree('get_json'); 
	setUids(nodeall);
	return ids;
};

// 日期范围选择器
TRIG.daterangepicker = function(id, backcall) {
	$('#'+id).daterangepicker({
		    opens: (Metronic.isRTL() ? 'right' : 'left'),
		    startDate: moment().subtract('days', 29),
		    endDate: moment(),
		    minDate: '2012/01/01',
		    maxDate:  new Date().getFullYear() + '/12/31', 
		    dateLimit: {
		        days: 60
		    },
		    showDropdowns: false,
		    showWeekNumbers: true,
		    timePicker: false,
		    timePickerIncrement: 1,
		    timePicker12Hour: true,
		    ranges: {
		        '今天': [moment(), moment()],
		        '昨天': [moment().subtract('days', 1), moment().subtract('days', 1)],
		        '7天': [moment().subtract('days', 6), moment()],
		        '30天': [moment().subtract('days', 29), moment()],
		        '本月': [moment().startOf('month'), moment().endOf('month')],
		        '上月': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
		    	'一年': [moment().subtract('year', 1), moment().subtract('days', 1)]
		    },
		    buttonClasses: ['btn btn-sm'],
		    applyClass: ' blue',
		    cancelClass: 'default',
		    format: 'YYYY/MM/DD',
		    separator: ' to ',
		    locale: {
		        applyLabel: '确认',
		        cancelLabel:'取消',
		        fromLabel: '从',
		        toLabel: '到',
		        customRangeLabel: '自定义',
		        daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
		        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		        firstDay: 1
		    }
		},
		function (start, end) {
		    $('#'+id + " span").html(start.format('YYYY/M/D') + ' - ' + end.format('YYYY/M/D')); 
		    backcall.call(backcall, start, end);
		}
	);
	$('#'+id + " span").html(moment().subtract('days', 29).format('YYYY/M/D') + ' - ' + moment().format('YYYY/M/D'));
	$('#'+id).show();
	backcall.call(backcall, moment().subtract('days', 29), moment());
	
};

TRIG.iFrameHeight = function() { 
	var ifm= document.getElementById("iframepage"); 
	var subWeb = document.frames ? document.frames["iframepage"].document : ifm.contentDocument; 
	if(ifm != null && subWeb != null) { 
		ifm.height = subWeb.body.scrollHeight; 
	} 
} ;

// 高级查询，默认无操作
TRIG.search = function() {
	
} ;

TRIG.getYesNoHtml = function(state) {
	if(state == 'Y') {
		return '<span class="label label-sm label-danger"> Y </span>';
	}
	return state;
};

TRIG.LOADHTMLOrJs = function(back) {
	if(TRIG.LOG.isdebug) {
		back.call(back);
	} else {
		try {
			back.call(back);
		}catch(e) {
			TRIG.LOG.Error(e);
		}
	}
};

/**
 * 数据处理
 */
TRIG.DataDeal = {
	// 将指定ID的form表单通过$('#formid').serialize()获取的值转成json字符串
   	formToJson: function (formId) {
   		var data = decodeURIComponent($("#"+ formId).serialize(), true);
       	data = data.replace(/&/g,"\",\"");
       	data = data.replace(/=/g,"\":\"");
       	data = "{\""+data+"\"}";
       	return data;
    },
    // 将指定ID的form表单通过$('#formid').serialize()获取的值转成适用于ttable查询使用的对象
    form2TTableQueryParams: function (formId) {
   		var data = decodeURIComponent($("#" + formId).serialize(), true);
   		data = data.replace(/&/g,"\",\"");
       	data = data.replace(/=/g,"\":\"");
       	data = "{\""+data+"\"}";
       	return $.parseJSON(data);
    }
};

//初始jquery ajax ，设置客户端不缓存
$(function(){
	$.ajaxSetup({
        cache: false,
        type: "post",
        //dataType: 'json',
        //async: false,
        timeout: 6000000, // 设置超时时间，30秒
        beforeSend: function(req, settings) { 
        	// csrf
        	var frcs = getCookie(TRIG.Contants.CSRF_COOKIE);
        	if(frcs) {
        		req.setRequestHeader(TRIG.Contants.CSRF_HEADER, frcs);
        	}
        },error: function(req, textStatus) {
        	TRIG.progressClose();
        	if(textStatus!='abort' && textStatus!='error') 
        		TRIG.messager.alertError(TRIG.TEXT.PUBLIC.SYSERROR_2);
        }
	});
	
	$.parseJSON = function(data) {
		if(! (typeof(data) == "object") ) {
			data = eval("d=" + data);
		}
		return data;
	};
	
});