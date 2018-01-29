$(function(){
	TRIG.LOADHTMLOrJs(function(){
		//对象定义
		var bsuJfLwrecord = function () {
				// 访问URL定义
				var url = { 
						find : TRIG.PATH+'/stulw/hk_findPageList.json'
				};
				// 变量定义
				// 列表数据
				var tablerows = [];
				// 表格
				var table = $('#trig-bsulwrecord-table');
				var ttable = null;
			    
				// 列表初始
				var tableInit = function() {
					ttable = new TRIG.Datatable({
				    		table : table, 
				    		url : url.find, 
				    		queryParams:{
				    			xn : $("#xn").val(),
								xq  : $("#xq").val(),
							},
				    		columns : [
										{ "data": "bjlt_jsm", "render":function(data,type,row,mete){
											tablerows[row.bjlgr_llId] = row;
											 return '<span class="row-details row-details-close" dataid="'+row.bjlgr_llId+'"></span> ' + data ;  
										} },
				    		            {"data": "bjlgr_zdJd", 
			    		                	"render":function(data,type,row,mete){
			    		                		//指导阶段（1选题 2开题 3 资料的收集和整理 4 撰写）
			    		                		if(data=='1'){
			    		                			return '选题';
			    		                		}else if(data=='2'){
			    		                			return '开题';
			    		                		}else if(data=='3'){
			    		                			return '资料的收集和整理';
			    		                		}else if(data=='4'){
			    		                			return ' 撰写'
			    		                		}else{
			    		                			return '其他';
			    		                		}
				    		                	 
				    		                 }
				    		            },
				    		            {"data": "bjlgr_lwQuestion_desc","orderable":false},
				    		            {"data": "bjlgr_lwFinishCondition_desc","orderable":false},
				    		            {"data": "bjlgr_lwAnswerQuestion_desc","orderable":false},
				    		            {"data": "bjlgr_lwNextTask_desc","orderable":false},
				    		            {"data": "bjlgr_createTime"}
				    		],
				    		//TODO 这里设置排序列，从0开始。。。
	    					order: [[6,'desc']]
				    });
					// 显示更多字段值
					ttable.initMore(function(id) { 
				    	 var rowData = tablerows[id];
				    	 var sOut = '<table>';
				    	// sOut += '<tr><td><div class="trig-more-content">ID：</div></td><td>' + id + '</td></tr>';
				    	 sOut += '<tr><td><div class="trig-more-content">存在问题：</div></td><td>' + rowData.bjlgr_lwQuestion + '</td></tr>';
				         sOut += '<tr><td><div class="trig-more-content">已进行的研究情况：</div></td><td>' + rowData.bjlgr_lwFinishCondition+ '</td></tr>';
				         sOut += '<tr><td><div class="trig-more-content">指导教师的解答：</div></td><td>' + rowData.bjlgr_lwAnswerQuestion+ '</td></tr>';
				         sOut += '<tr><td><div class="trig-more-content">下一步研究任务：</div></td><td>' + rowData.bjlgr_lwNextTask+ '</td></tr>';
				         sOut += '</table>';
				         return  sOut;
					});
					
				};
			
				var queryBaseInfo = function(){
					$.ajax({dataType: 'json', url : TRIG.PATH + '/stulw/hk_findMyTitle.json', data: {xn:$('#xn').val(),xq:$('#xq').val()}, success: function(data) {
						var html = '';
						var grouprow = $.parseJSON(data);
						if(grouprow.success==true){
							var row = grouprow.mylwtitle;
							if(row){
								$('.current_lwtitle').text(row.bjlt_title);
								$('.current_js').text(row.bjlt_jsm);
								$('#bjlgr_titleId').val(row.bjlt_titleId);
								$('#titleId').val(row.bjlt_titleId);
							}
						}
						
					}
					});
				}
				
				var formsaveData = function(){
					TRIG.Validatefrontend('lwrecordform', function(){
						var titleid = $('#bjlgr_titleId').val();
						if(!titleid){
							TRIG.messager.alertError('您未申请论文题目，请申请论文题目并且选择指导教师后才能提出问题！');
							return false;
						}
						$.post(TRIG.PATH+'/stulw/hk_saveLwRecord.json', $("#lwrecordform").serialize(), function(data){
							data = TRIG.successHandle(data);
							if(data.success==true) {
								TRIG.messager.alert('提交成功！');
								TRIG.formreset($("#lwrecordform"));
								$('#bjlgr_titleId').val($('#titleId').val());
								ttable.reload();
								$('#loglist').show();
								$('#add').hide();
							} else {
								
							}
						});
				    	return false; 
				    }, {
				    	bjlgr_lwQuestion: {
			                required: true
			            }
				    });
					
				}
				
				
				return {
					// 查询
					query : function() {
						ttable.query({xn:$('#xn').val(),xq:$('#xq').val()});  //TODO 查询字段这里修改
					},
					init : function() {
						tableInit();
						queryBaseInfo();
						formsaveData();
						$('.current_xn').text($('#xn').find("option:selected").text());
						$('.current_xq').text($('#xq').find("option:selected").text());
					},
					getTable : function() {
						return ttable;
					},
					getTableRows : function() {
						return tablerows;
					}
				};
		}(); // 定义并执行
		
		// 执行初始
	    bsuJfLwrecord.init();
	    
	    
	    
	   
    });
});