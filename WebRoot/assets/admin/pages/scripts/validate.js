// 中文姓名验证
jQuery.validator.addMethod("chinese", function(value, element) {
	return /^[\u0391-\uFFE5]+$/.test(value);
}, "请正确填写您的中文名称");

// 电话号码验证
jQuery.validator.addMethod("tel", function(value, element) {
var tel = /^0\d{2,3}-?\d{7,8}$/; //电话号码格式010-12345678 0311-12345678
return (tel.test(value));
}, "请正确填写您的电话号码");

// 手机号码验证
jQuery.validator.addMethod("mobile", function(value, element) {
	var length = value.length;
	var mobile = /^1[3|4|5|7|8|9]\d{9}$/;
	return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");

//身份证号验证
jQuery.validator.addMethod("idcard", function(value, element) {
	return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value) || /^\d{18}(\d{2}[A-Za-z0-9])?$/i.test(value);
}, "请正确填写您的身份证件");
