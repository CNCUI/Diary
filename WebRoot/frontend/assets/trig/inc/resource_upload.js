TRIG.FILETYPE_FILE = 6;	// 文件+图
TRIG.FILETYPE_IMG = 2;
TRIG.FILETYPE_VIDEO = 5;
TRIG.FILEBACKCALL = null;

TRIG.UPLOAD = {
		url : TRIG.PATH + '/frontend/stu/resource_tools_upload.json', // 文件名随机修改，主要是避免中文名称
		url2: TRIG.PATH + '/frontend/stu/resource_tools_upload2.json', // 上传文件名不变，最好不要有中文
		url3: TRIG.PATH + '/frontend/stu/resource_tools_upload3.json', // 指定上传文件名，最好不要有中文
		createurl : TRIG.PATH + '/frontend/stu/resource_tools_createDir.json',
		uploadID : '',
		GenName : true,
		newFileName : '',
		FILEBACKCALL : undefined,
		ismodal:true,
		/**
		 * uploadID	上传成功后文件返回INPUT TEXT ID
		 * uploadType 上传文件类型
		 * id 上传文件保存目录，以/开始和结尾
		 * backcall 回调函数，将回传生成文件名、源文件名
		 * genname 是否随机生成文件名
		 * watermarkImg 水印图片
		 * modal 是否弹出浮层确认上传
		 * newFileName 指定上传文件名
		 */
		open : function(uploadID, uploadType, id, backcall, genname, watermarkImg, modal, newFileName) {
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
			this.newFileName = newFileName;
			if(upform.newFileName){upform.newFileName.value = newFileName ? newFileName : ''};
			if(genname == false) {
				this.GenName = genname;
			}
			// 水印，JPG/PNG图片添加
			if(watermarkImg) {
				upform.watermarkImg.value = "/assets/admin/layout/img/logo.png";
			}
		},
		openImg : function(uploadID, watermarkImg, backcall) {
			this.open(uploadID, TRIG.FILETYPE_IMG, "/uploadfiles/images/", backcall, true, watermarkImg);
		},
		openFile : function(uploadID, backcall) {
			this.open(uploadID, TRIG.FILETYPE_FILE, "/uploadfiles/files/", backcall);
		},
		openVideo : function(uploadID, backcall) {
			this.open(uploadID, TRIG.FILETYPE_VIDEO, "/uploadfiles/videos/", backcall);
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
					$("#uploadfileviewid").html('<img src="'+TRIG.UPLOADPATH + filepath+'" style="max-height:300px"/><a href="'+TRIG.UPLOADPATH + filepath + '" target="_blank"> 查看原图 </a>');
				} else {
					$("#uploadfileviewid").html('<a href="'+TRIG.UPLOADPATH + filepath + '" target="_blank">'+ filepath + '</a>');
				}
				$("#publicUploadViewModal").modal('show');
			} else {
				TRIG.messager.alert("文件不能为空");
			}
		},
		downloadfile:function(filepath,filename){
			var ext = filepath.substring(filepath.lastIndexOf('.'));
			var fn = filename+ext;
			openPostWindow(TRIG.PATH +"/frontend/stu/resource_tools_download1.json",filepath,fn);
		}
};

$(function(){
	$("#publicuploadfile").off('change').on('change', function() {
			if(TRIG.UPLOAD.ismodal == false) {
				if(this.value != "" ) {
					$("#publicUploadform").submit();
				}
			}
	});
	// 上传文件
	TRIG.Validate('publicUploadform', function(form){
		Pace.track(function() {
			TRIG.progress();
			var _url = TRIG.UPLOAD.newFileName ? TRIG.UPLOAD.url3 : TRIG.UPLOAD.GenName ? TRIG.UPLOAD.url : TRIG.UPLOAD.url2;
			var upform = document.getElementById("publicUploadform");
			_url += "?id=" + upform.id.value + "&uploadType=" + upform.uploadType.value + "&watermarkImg="+upform.watermarkImg.value+"&" + TRIG.Contants.CSRF_PARA + "=" + getCookie(TRIG.Contants.CSRF_COOKIE);
			if(TRIG.UPLOAD.newFileName) _url +="&newFileName=" + TRIG.UPLOAD.newFileName;
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

/** name 标识_blank 还是_sefl */
function openPostWindow(url, path,filename){       
    
    var tempForm = document.createElement("form");       
   
    tempForm.id="tempForm1";       
   
    tempForm.method="post";       
      
    //url  
    tempForm.action=url;       
    tempForm.target = "_blank"; 
    var hideInput = document.createElement("input");  
    hideInput.type="hidden";       
    //传入参数名,相当于get请求中的content=  
    hideInput.name= "id";  
    //传入传入数据，只传递了一个参数内容，实际可传递多个。  
    hideInput.value= path;     
    tempForm.appendChild(hideInput);
    
    var hideInput1 = document.createElement("input");
    hideInput1.type="hidden";
    hideInput1.name= "fileName"; 
    hideInput1.value= filename;  
    tempForm.appendChild(hideInput1);
    if (tempForm.addEventListener) {                    //所有主流浏览器，除了 IE 8 及更早 IE版本  
    	tempForm.addEventListener("submit", function(d){ 
    	});
    	document.body.appendChild(tempForm); 
    	var evt = document.createEvent('HTMLEvents');  
    	 evt.initEvent('submit',true,true);  
    	 tempForm.dispatchEvent(evt);   
    } else if (tempForm.attachEvent) {                  // IE 8 及更早 IE 版本  
    	tempForm.attachEvent("onsubmit", function(d){
    	});  
    	document.body.appendChild(tempForm); 
    	tempForm.fireEvent("onsubmit"); 
    }
    //必须手动的触发，否则只能看到页面刷新而没有打开新窗口  
    tempForm.submit();     
    document.body.removeChild(tempForm);
} 