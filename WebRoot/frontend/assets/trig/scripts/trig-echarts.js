TRIG.EChartsInit = function() {
}

/**
 *百度图表公共方法显示
 *如果一个页面多个echart图表，如果出现有图表变形成紧凑，则试着把div（即containerID）设置min-width和min-height
 */

TRIG.ECharts = function(containerID, title, data, type, fn) {
	var chart = echarts.init(document.getElementById(containerID));

	var option = {};
	if (type == 'pie') { //饼图
		var legendData = []; //保存name
		if (data && data != '') {
			data = $.parseJSON(data);//将参数解析成json 格式 
			$.each(data, function(i, rowData) { //迭代参数
				var name = rowData.name;
				if ($.inArray(name, legendData) == -1) { //如果name不在legendData 中 ，则添加
					legendData.push(name);
				}
			});
		}
		option = {
			title : {
				text : title,
				x : 'center'
			},
			tooltip : {
				trigger : 'item',
				formatter : "{a} <br/>{b} : {c} ({d}%)"
			},
			legend : {
				orient : 'vertical',
				left : 'left',
				//data 的格式 =['直接访问','邮件营销','联盟广告']
				data : legendData
			},
			series : [ {
				name : title,
				type : 'pie',
				radius : '55%',
				center : [ '50%', '60%' ],
				// data 的格式 =[{value:335, name:'直接访问'}, {value:310, name:'邮件营销'},{value:234, name:'联盟广告'}]
				data : data,
				itemStyle : {
					emphasis : {
						shadowBlur : 10,
						shadowOffsetX : 0,
						shadowColor : 'rgba(0, 0, 0, 0.5)'
					}
				}
			} ]
		};
	} else if (type == 'bar') { // 单个 柱状图

		var legendData = []; //保存name
		var seriesData = []; //保存value
		if (data && data != '') {
			data = $.parseJSON(data);//将参数解析成json 格式 
			$.each(data, function(i, rowData) { //迭代参数
				var name = rowData.name;
				if ($.inArray(name, legendData) == -1) { //如果name不在legendData 中 ，则添加
					legendData.push(name);
				}
				seriesData.push(rowData.value);
			});
		}

		option = {
			title : {
				text : title
			},
			tooltip : {
				trigger : 'axis'
			},
			legend : {
				data : []
			},
			calculable : true,
			xAxis : [ {
				data : legendData
			//data 的格式 =['直接访问','邮件营销','联盟广告']
			} ],
			yAxis : [ {
				type : 'value'
			} ],
			series : [ {
				type : 'bar',
				data : seriesData,
				itemStyle : {
					normal : {
						color : "#FE8463"
					}
				}
			} ]
		};
	} else if (type == "line" || type == "bars") {
		if(type == "bars"){
			type="bar";
		}
		var legendData = [];
		var seriesPieName = [];
		var xAxisData = [];
		var seriesArray = [];
		var xAxisArray = [];
		var map = {};
		if (data && data != '') {
			data = $.parseJSON(data);
			$.each(data, function(i, rowData) {
				var seriesData = [];
				//循环data
				var categories = rowData.categories;
				if ($.inArray(categories, xAxisData) == -1) {
					//如果横轴的名称不存在 
					xAxisData.push(categories);
				
				}
				var name = rowData.name;
				var value = rowData.data;
				if (!value) {
					value = '-';//没值 则"-"
				}
				if ($.inArray(name, legendData) == -1) {
					legendData.push(name);
					//柱名称name
					if (type == 'bar' || type == 'line') {
						map[name] = seriesData;
					}
				}
				if (type == 'bar' || type == 'line') {
					map[name].push(value);
				}
			});

			$.each(map, function(key, value) {
				var obj = {
					'name' : key,
					'type' : type,
					'data' : value
				};

				//图表内容
				seriesArray.push(obj);

			});
			//横轴内容
			xAxisArray.push({
				'type' : 'category',
				'data' : xAxisData
			});
		}

		option = {
			title : {
				text : title,
			// subtext: '纯属虚构'
			},
			tooltip : {
				trigger : 'axis'
			},
			legend : {
				data : legendData
			},

			xAxis : xAxisArray,
			yAxis : {
				type : 'value',
				splitNumber : 10
			// 数值轴用，分割段数，默认为5
			},
			series : seriesArray
		};

	}
	if (fn) {
		fn.call(this, option); //回调函数 给当前option赋值 
	}
	chart.setOption(option);
};