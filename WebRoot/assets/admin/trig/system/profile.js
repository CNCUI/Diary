$(function(){
	$("#username").text(TRIG.User.su_userName);
	$("#realname").text(TRIG.User.su_realName);
	$("#sex").text(TRIG.User.su_sex=='F' ? '女' : TRIG.User.su_sex=='M' ? '男' : '未知');
	$("#mobile").text(TRIG.User.su_mobile ? TRIG.User.su_mobile : '');
	$("#email").text(TRIG.User.su_email ? TRIG.User.su_email : '');
	if(TRIG.settings.org) {
		$.getJSON('organization_find.json','id=' + TRIG.User.su_organizationId, function(data){
			if(data.success) {
			   $("#organization_name").text(data.data.so_organizationName);
			   $("#so_organizationName").val(data.data.so_organizationName); 
			}
		});
		//$("#organization_name").text(TRIG.User.so_organizationName ? TRIG.User.so_organizationName : '');
	}
	$("#last_login_date").text(TRIG.User.su_lastLoginDate ? TRIG.User.su_lastLoginDate : '');
	$("#trigroles").text(trigroles);
	if(TRIG.UserGroup) {
		$("#triggroups").text(TRIG.UserGroup);
	} else {
		$("#triggroups").closest("p").hide();
	}
	if(TRIG.settings.message) {
		//未读消息
		$("#usermsg").text($("#infocount").text()); 
	}
	
	new TRIG.Datatable({
			table : $("#user_login_table"), 
			url : 'userinfo_loginLogList.json', 
			columns : [
			                 { "data": "slt_loginTime" }, 
			                 { "data": "slt_endTime", "className":"hidden-xs" },
			                 { "data": "slt_loginIp" },
			                 { "data": "slt_loginType" , "render":function(value){
			                	 if (value == '1'){
			     					return TRIG.TEXT.LOGIN.type1;
			     				} else if(value == '2') {
			     					return TRIG.TEXT.LOGIN.type2;
			     				}
			     				else {
			     					return TRIG.TEXT.LOGIN.type0;
			     				}
    		                 }}
			],
			order: [[0,'desc']],
			paging:false 
	});
	
	if(TRIG.settings.message) {
		$.getJSON('message/myinfo_accept_findPageList.json', '', function(data){
			if(data.data.length>0) {
				var h = '';
				for(var i=0;i<data.data.length;i++) {
					h += '<li>';
					h += '<div class="col1" style="width:auto;">';
					h += '<div class="cont">';
					h += '<div class="cont-col1">';
					h += '<div class="label label-warning">';
					h += '<i class="fa fa-'+(data.data[i].su_userId=='admin'?'bell-o':'user')+'"></i>';
					h += '</div>';
					h += '</div>';
					h += '<div class="cont-col2">';
					h += '<div class="desc">';
					h += data.data[i].mi_content;
					h += '</div>';
					h += '</div>';
					h += '</div>';
					h += '</div>';
					h += '<div class="col2" style="float:right;width:auto;">';
					h += '<div class="date">';
					h += data.data[i].su_userName + ' ' + data.data[i].mi_sendTime;
					h += '</div>';
					h += '</div>';
					h += '</li>';
				}
				$(".feeds").html(h);
			}
		});
	}
	
	TRIG.forminit($("#userform"), TRIG.User);
	// 账号信息修改
	TRIG.FormValidate("sys_user", "userform",  function (form) {
			TRIG.trackPost('updateUserInfo.json', $(form).serialize(), function(data){
				TRIG.User = data.data;
				$(".username").text(TRIG.getUserName(TRIG.User));
				TRIG.updateSuccessAlert();
			});
			return false;
	});
	
	// 取消
	$("#userreset").bind('click', function(){
		document.getElementById("userform").reset();
		TRIG.forminit($("#userform"), TRIG.User);
	});
	
	// 密码修改
	TRIG.Validate("pwdform", function(form){
		TRIG.trackPost('userinfo_updatePassword.json', $(form).serialize(), function(data){
				TRIG.updateSuccessAlert();
				document.getElementById("pwdform").reset();
		});
		return false;
	}, {
    	su_password : {
    		required : true
    	}, 
    	su_password1 : {
    		required : true,
    	},
    	su_password2 : {
    		required : true,
    		equalTo : '#su_password1' 
    	}
    });
	
	// 头像修改
	if(TRIG.User.su_userAvatar) {
		$("#old_user_avatar").attr('src', TRIG.UPLOADPATH + TRIG.User.su_userAvatar);
		$(".img-responsive").attr('src', TRIG.UPLOADPATH + TRIG.User.su_userAvatar);
	}
	
	$("#user_avatar_submit").bind('click', function(){
		if($("#su_userAvatar").val()=='') {
			TRIG.messager.alert("请选择图片");
			return false;
		}
		TRIG.progress();
		var _url = TRIG.PATH + "/resource_tools_upload.json?id=/uploadfiles/images/&uploadType="+TRIG.FILETYPE_IMG+"&" + TRIG.Contants.CSRF_PARA + "=" + getCookie(TRIG.Contants.CSRF_COOKIE);
		$.ajaxFileUpload({  
			url: _url,  
			secureuri: false,  
			fileElementId: 'su_userAvatar',  
			dataType: 'json',  
		   beforeSend: function() { 
				//$("#loading").show();  
		   },  
			complete: function() {
			   //$("#loading").hide();  
			},  
			success: function(data, status) { 
				TRIG.progressClose();
				if(data.success==true) {
					var upavatar = data.filename;
					$.post('userinfo_updateAvatar.json','su_userAvatar='+upavatar, function(data){
						TRIG.User.su_userAvatar = upavatar;
						$("#useravatar").attr('src', TRIG.getUserAvatar(TRIG.User));
						$("#old_user_avatar").attr('src', TRIG.UPLOADPATH + upavatar);
						$(".fileinput-exists").click();
						TRIG.messager.alert("保存成功");
					});
				}else {
					TRIG.successHandle(data);
				}
			},  
			error: function(data, status, e) {  
					alert(e);  
					TRIG.progressClose();
				}  
		});
	});
	
	var defopts = document.getElementById("sud_pagesize").options;
	$.each(TRIG.PAGELIST[0], function(i, text){
		defopts.add(new Option(TRIG.PAGELIST[1][i], text)); 
	});
	//  个性化初始
	if(TRIG.UserDef) {
		TRIG.forminit($("#userdefform"), TRIG.UserDef);
		$(".defstyle li").each(function(){
			if($(this).attr('data-style') == TRIG.UserDef.sud_style) {
				$(this).css('border', 'solid 2px #d64635');
			}
		});
	}
	$(".defstyle li").bind('click', function(){
		$(".defstyle li").css('border', 'solid 1px #707070');
		$(this).css('border', 'solid 2px #d64635');
		$("#sud_style").val($(this).attr('data-style'));
	});
	$("#userdefreset").bind('click', function(){
		if(TRIG.UserDef) {
			TRIG.forminit($("#userdefform"), TRIG.UserDef);
		}else{
			document.getElementById("userdefform").reset();
		}
	});
	TRIG.Validate("userdefform",  function (form) {
		var url = 'user_def_addUser.json';
		if($("#sud_defId").val()!='') {
			url = 'user_def_updateUser.json';
		}
		TRIG.trackPost(url, $(form).serialize(), function(data){
			TRIG.UserDef = data.data;
			TRIG.initUserDef(data.data);
			$("#sud_defId").val(data.data.sud_defId);
			TRIG.updateSuccessAlert();
		});
		return false;
	}, {
		sud_pagesize : { 
    		required : true
    	}
	});
});