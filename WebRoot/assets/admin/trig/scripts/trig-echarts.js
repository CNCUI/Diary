TRIG.EChartsInit=function(){}

/**
*百度图表公共方法显示
*如果一个页面多个echart图表，如果出现有图表变形成紧凑，则试着把div（即containerID）设置min-width和min-height
*/

TRIG.ECharts = function(containerID, title, data, type, fn) {
	var chart = echarts.init(document.getElementById(containerID));
	var legendData = []; //保存name
	var seriesData = []; //保存value
	if(data && data!=''){ 
    	data = $.parseJSON(data);//将参数解析成json 格式 
    	$.each(data,function(i, rowData){  //迭代参数
    		var name = rowData.name;
    		if($.inArray(name,legendData)==-1){ //如果name不在legendData 中 ，则添加
    			legendData.push(name);
    		}
    		seriesData.push(rowData.value);
    	});
	}
	var option = {};
	if(type == 'pie') { //饼图
		option = {
		    title : {
		        text: title,
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        orient: 'vertical',
		        left: 'left',
		        //data 的格式 =['直接访问','邮件营销','联盟广告']
		        data: legendData 
		    },
		    series : [
		        {
		            name: title,
		            type: 'pie',
		            radius : '55%',
		            center: ['50%', '60%'],
		           // data 的格式 =[{value:335, name:'直接访问'}, {value:310, name:'邮件营销'},{value:234, name:'联盟广告'}]
		            data: data,
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
		};
	}else if(type == 'bar'){  // 单个 柱状图
		option = {
			    title : {
			        text: title
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    legend: {
			        data:[]
			    },
			    calculable : true,
			    xAxis : [
			        {
			            data : legendData //data 的格式 =['直接访问','邮件营销','联盟广告']
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            type:'bar',
			            data:seriesData,
			            itemStyle: {
                            normal: {
                                color: "#FE8463"
                            }
                        }
			        }
			    ]
			};
	}else if(type == "bars" || type == "line") {        
		option = {
			    title : {
			        text: title
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    legend: {
			        data:['蒸发量','降水量']
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'蒸发量',
			            type:'bar',
			            data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
			        },
			        {
			            name:'降水量',
			            type:'bar',
			            data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
			        }
			    ]
			};
	}
	if(fn) {
		fn.call(this, option); //回调函数 给当前option赋值 
	}
	chart.setOption(option);
};