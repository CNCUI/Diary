TRIG.WEIXIN = { 
	setRightInfoSelect : function(id, siteclick) {
		if(TRIG.WEIXIN.InfoList.length == 0) {
			TRIG.messager.alert("请先新增公众号");
			return {
				getId : function() {
					return "";
				}
			};
		} 
		
		var rightdefinfoidCookie = getCookie('rightdefinfoid');
		var sitemap = [];
		var html = '<div class="page-toolbar">\
								<div class="btn-group pull-right">\
									<button type="button" class="btn btn-fit-height grey-salt dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-delay="1000" data-close-others="true">\
									<span id="rightdefinfoid"></span> <i class="fa fa-angle-down"></i>\
									</button>\
									<ul class="dropdown-menu pull-right" role="menu">';
		var rightdefinfoname = '';
		for(var i=0;i<TRIG.WEIXIN.InfoList.length;i++){
			if(rightdefinfoidCookie && TRIG.WEIXIN.InfoList[i].wi_infoId == rightdefinfoidCookie) {
				rightdefinfoname = TRIG.WEIXIN.InfoList[i].wi_weixinName;
			}
			html += '<li><a href="javascript:;" id="'+TRIG.WEIXIN.InfoList[i].wi_infoId+'" class="rightinfo">'+TRIG.WEIXIN.InfoList[i].wi_weixinName+'</a></li>';
			sitemap[TRIG.WEIXIN.InfoList[i].wi_infoId] = TRIG.WEIXIN.InfoList[i].wi_weixinName;
		}
									
					html += '</ul>\
								</div>\
						</div>';
		$("#" + id).append(html);
		if(rightdefinfoname == '') {
			rightdefinfoname = TRIG.WEIXIN.InfoList[0].wi_weixinName;
			rightdefinfoidCookie = TRIG.WEIXIN.InfoList[0].wi_infoId;
		}
		$("#rightdefinfoid").text(rightdefinfoname);
		
		var _setSiteId = function(id) {
			setCookie('rightdefinfoid', id);
			rightdefinfoidCookie = id;
			$("#rightdefinfoid").text(sitemap[id]);
		};
		
		$(".rightinfo").bind('click', function() {
			_setSiteId(this.id);
			siteclick.call(this, this.id);
		});
		
		return {
			getId : function() {
				return rightdefinfoidCookie;
			}
		}
	},
	
	//用户选择 
	userSelect : function(id, multiple) {
		$("#" + id).select2({
	        minimumInputLength: 1,   
	        placeholder: "请选择用户 ",
	        multiple : multiple==true ? true : false,
	         ajax: {  
	             url:  'www/weixin/user_findPageList.json',
	             dataType: 'json',
	             data: function (term, page) {
	                 return {
	               	wu_nickname: term, 
	                 	rows:15 
	                 };
	             },
	             results: function (data, page) {
	           	var user=data.data;
	             	var datas = [];
	             	for(var i=0;i<user.length;i++) {
	             		datas.push({id:user[i].wu_userId,text:user[i].wu_nickname });
	             	}
	                 return {
	                     results: datas 
	                 };
	             }
	         }
	     });
		return { getVal : function(){
				return $("#" + id).val();
			}
		};
	}


};


$(function() {
	$.getJSON(TRIG.PATH + '/www/weixin/info_userList.json', '', function(data) {
		TRIG.WEIXIN.InfoList = data;
	});
});

