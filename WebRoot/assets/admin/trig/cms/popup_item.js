$(function(){
	//日期插件
	$(".form_datetime").datetimepicker({
        autoclose: true,
        todayBtn: true,
        isRTL: Metronic.isRTL(),
        format: "yyyy-mm-dd hh:ii", 
        pickerPosition: (Metronic.isRTL() ? "bottom-right" : "bottom-left")
    });

	//颜色选择器
	 $('.colorpicker-default').colorpicker({
	        format: 'hex'
	 });
	 
	 TRIG.dict.setSelectByNO("ci_authorId", "item_author"); // 作者选择
	 TRIG.dict.setSelectByNO("ci_sourceId", "item_source"); // 来源选择
	 
	// 标签选择 
	selectTag('itemtagids', true);
	// 题头图选择
	TRIG.CMS.selectResource('ci_resourceId', 'IMG_FILE', false);
	
	
	//标签选择,默认多选
	function selectTag(id, multiple) {
		 $("#" + id).select2({
		        minimumInputLength: 0,   
		        multiple : multiple == false ? multiple : true, 
		        placeholder : '请选择标签',
		        allowClear: true,
		        ajax: {  
		            url: TRIG.PATH+"/cms/tag_select.json",
		            dataType: 'json',
		            data: function (term, page) {
		                return {
		                	ct_tagName : term,
		                	rows:10 
		                };
		            },
		            results: function (data, page) { 
		            	var datas = [];
		            	for(var i=0;i<data.data.length;i++) {
		            		datas.push({id:data.data[i].ct_tagId,text:data.data[i].ct_tagName});
		            	}
		                return {
		                    results: datas 
		                };
		            }
		        }
		    }); 
	}

	
});