function checkNull(arr){
	var falg = true;
	for(var i=0;i<arr.length;i++){
		if($("#"+arr[i]).val() == ''){
			falg = false;
		}
	}
	return falg;
}