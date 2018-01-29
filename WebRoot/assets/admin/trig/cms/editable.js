$(function(){
	$(document.body).append('<div style="top:10px;left:20px;float:right;position:fixed"><button id="cmsenable" class="btn blue">编辑/预览</button>');
	//$.fn.editable.defaults.mode = 'inline';
	$.fn.editable.defaults.inputclass = 'form-control';
    //$.fn.editable.defaults.url = '/post';
    $.fn.editable.defaults.success = function(response, newValue) {
    	var name = $(this).attr("cms-name");
    	var value = newValue;
    	var type = $(this).attr("cms-type"); // item/template
    	var datatype = $(this).attr("data-type");
    	var url = TRIG.PATH + "/cms/item_updateProperty.json";
    	if(type === 'template') {
    		url = TRIG.PATH + "/cms/item_updateField.json";
    	}
    	if(datatype == 'datetime') {
    		value = moment(newValue).format("YYYY-MM-DD HH:mm:ss");
    	} else if(datatype == 'date') {
    		value = moment(newValue).format("YYYY-MM-DD");
    	}
    	// 修改
    	$.post(url, {
    		cid: cms.pid,
    		id: cms.id,
    		name:name,
    		value:value
    	})
    };
	
    var editinit = false;
	$('#cmsenable').click(function () {
		if(editinit)
			$('.editable').editable('toggleDisabled');
		else {
			$(".cms-editor").each(function(){
				var _this = $(this);
				_this.editable();
			});
			editinit = true;
		}
    });
	
});