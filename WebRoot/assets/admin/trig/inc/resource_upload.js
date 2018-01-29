TRIG.FILETYPE_FILE = 6;
TRIG.FILETYPE_IMG = 2;
TRIG.FILETYPE_VIDEO = 5;
TRIG.FILEBACKCALL = null;

TRIG.UPLOAD = {
		url : TRIG.PATH + '/resource_tools_upload.json', // 文件名随机修改，主要是避免中文名称
		url2: TRIG.PATH + '/resource_tools_upload2.json', // 上传文件名不变，最好不要有中文
		createurl : TRIG.PATH + '/resource_tools_createDir.json',
		uploadID : '',
		GenName : true,
		FILEBACKCALL : undefined,
		ismodal:true,
		/**
		 * uploadID	上传成功后文件返回INPUT TEXT ID
		 * uploadType 上传文件类型
		 * id 上传文件保存目录，以/开始和结尾
		 * watermarkImg 水印图片
		 * modal 是否弹出浮层确认上传
		 */
		open : function(uploadID, uploadType, id, backcall, genname, watermarkImg, modal) {
			var upform = document.getElementById("publicUploadform");
			upform.id.value = id;
			upform.uploadID.value = uploadID;
			this.uploadID = uploadID;
			upform.uploadType.value = uploadType;
			if(modal==false) {
				$("#publicuploadfile").click();
				this.ismodal = false;
			} else {
				$("#publicUploadModal").modal('show');
				this.ismodal = true;
			}
			this.FILEBACKCALL = backcall;
			this.GenName = true;
			if(genname == false) {
				this.GenName = genname;
			}
			// 水印，JPG/PNG图片添加
			if(watermarkImg) {
				var upform = document.getElementById("publicUploadform");
				upform.watermarkImg.value = "/assets/admin/layout/img/logo.png";
			}
		},
		openImg : function(uploadID, watermarkImg) {
			this.open(uploadID, TRIG.FILETYPE_IMG, "/uploadfiles/images/", null, true, watermarkImg);
		},
		openFile : function(uploadID) {
			this.open(uploadID, TRIG.FILETYPE_FILE, "/uploadfiles/files/");
		},
		openVideo : function(uploadID) {
			this.open(uploadID, TRIG.FILETYPE_VIDEO, "/uploadfiles/videos/");
		},
		openDir : function(uploadID, id) {
			var upform = document.getElementById("publicUploadCreateform");
			if(id)
				upform.id.value = id;
			this.uploadID = uploadID;
			$("#publicUploadCreateModal").modal('show');
		},
		openView: function(filepath, type) {
			if(filepath) {
				if(type == TRIG.FILETYPE_IMG) {
					$("#uploadfileviewid").html('<img src="'+TRIG.PATH + filepath+'" style="max-height:300px"/><a href="'+TRIG.PATH + filepath + '" target="_blank"> 查看原图 </a>');
				} else {
					$("#uploadfileviewid").html('<a href="'+TRIG.PATH + filepath + '" target="_blank">'+ filepath + '</a>');
				}
				$("#publicUploadViewModal").modal('show');
			} else {
				TRIG.messager.alert("文件不能为空");
			}
		}
};

$(function(){
	$("#publicuploadfile").live('change', function() {
		if(TRIG.UPLOAD.ismodal == false) {
			if(this.value != "" ) {
				pervuploadname = this.value;
				$("#publicUploadform").submit();
			}
		}
	});
	// 上传文件
	TRIG.Validate('publicUploadform', function(form){
		Pace.track(function() {
			TRIG.progress();
			var _url = TRIG.UPLOAD.GenName ? TRIG.UPLOAD.url : TRIG.UPLOAD.url2;
			var upform = document.getElementById("publicUploadform");
			_url += "?id=" + upform.id.value + "&uploadType=" + upform.uploadType.value + "&watermarkImg="+upform.watermarkImg.value+"&" + TRIG.Contants.CSRF_PARA + "=" + getCookie(TRIG.Contants.CSRF_COOKIE);
			if($("#publicuploadfile").val() == "") {
				TRIG.progressClose();
				return false;
			}
			$.ajaxFileUpload({  
				url: _url,  
				secureuri: false,  
				fileElementId: 'publicuploadfile',  
				dataType: 'json',  
			   beforeSend: function() { 
					//$("#loading").show();  
			   },  
				complete: function() {
				   //$("#loading").hide();  
				},  
				success: function(data, status) { 
					TRIG.progressClose();
					//data = $.parseJSON(data);
					if(data.success==true) {
						$("#publicUploadModal").modal('hide');
						TRIG.messager.alert("上传成功");
						$("#" + TRIG.UPLOAD.uploadID).val(data.filename);
						if(TRIG.UPLOAD.FILEBACKCALL) {
							TRIG.UPLOAD.FILEBACKCALL.call(this, data.filename, data.sourceFilename);
						}
						TRIG.UPLOAD.FILEBACKCALL = undefined;
					}else {
						if(data.errorCode==10003) {
							TRIG.messager.alert("文件已存在");
						}else{
							TRIG.successHandle(data);
						}
					}
				},  
				error: function(data, status, e) {  
						TRIG.messager.alert(e);  
						TRIG.progressClose();
					}  
				});
		});
    	return false;
    }, {
    	uploadfile : {
    		required : true
    	}
    });
	// 创建文件夹
    TRIG.Validate('publicUploadCreateform', function(form){
    	var _url = TRIG.UPLOAD.createurl +"?" + TRIG.Contants.CSRF_PARA + "=" + getCookie(TRIG.Contants.CSRF_COOKIE);
    	$.post(_url, $(form).serialize(), function(data){
    		data = TRIG.successHandle(data);
			if(data.success==true) {
				$("#publicUploadCreateModal").modal('hide');
				var upform = document.getElementById("publicUploadCreateform");
				$("#" + TRIG.UPLOAD.uploadID).val(upform.id.value + upform.fileName.value);
				upform.reset();
			}
    	});
    	return false;
    }, {
    	fileName : {
    		required : true,
    		filename : true
    	}
    });
});