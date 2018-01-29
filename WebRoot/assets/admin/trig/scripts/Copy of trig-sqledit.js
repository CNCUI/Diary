var gIsIE = navigator.appName.indexOf("Microsoft") != -1; 

String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*$)/g, "");
};

SQLContentEditor = {
	// 初始edit	
	initialize : function(id){
		this.id = 'starter';
		var fo = new FlashObject(TRIG.PATH + "/assets/admin/trig/swf/starter.swf", this.id, '100%', '100%' , "10", "#869ca7");
		fo.addParam("quality", "high");
		fo.addParam("allowFullScreen", "false");
		fo.addParam("allowScriptAccess", "sameDomain");
		fo.addParam("flashvars","");
		fo.addParam("align", "middle");
		fo.addParam("wmode", "transparent");
		fo.write(id);
		if (gIsIE) {
			this.doc = window[this.id];
        } else {
        	this.doc = document[this.id];
        }
		this.doc.click();
	},
	insert : function(text){
		//alert(text);
		//this.iframe.focus();
		//this.doc.execCommand("insertHTML", false, text);
		return this.doc.setText(text, 1);
	},
	setSQL : function(text) {
		return this.doc.setText(text, 0);
	},
	getContents : function() {
		var sql = this.doc.getFocusText();
		if(sql&&sql!='') {
			return sql;
		}
		return this.doc.getText();
	},
	clear : function() {
		return this.doc.setText('', 0);
	},
	execCommand : function(comm) {
		if(comm=='Undo') {
			// 撤消
			
		} else if(comm=='Redo') {
			// 重复
		}
		//this.doc.execCommand(comm,false, false);
	},
	getHTML : function() {
		return this.doc.getText();
	}
};