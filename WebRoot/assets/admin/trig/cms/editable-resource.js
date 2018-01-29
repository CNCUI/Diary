(function ($) {
    "use strict";
    var Resource = function (options) {
        this.init('resource', options, Resource.defaults);
        
        //extend resource manually as $.extend not recursive 
        this.options.resource = $.extend({}, Resource.defaults.resource, options.resource);
    };

    $.fn.editableutils.inherit(Resource, $.fn.editabletypes.abstractinput);

    $.extend(Resource.prototype, {
        render: function () {
        	this.$tpl.find('#id').val('id');
        	this.$tpl.find('#name').val('name');
        	var selectbtn = this.$tpl.find('.select');
        	
        },
       
        value2html: function(value, element) {
            $(element).html(value);
        },

        html2value: function(html) {
            return html;
        },
        
        value2input: function(value) {
            this.$input.val(value);
        }, 

        activate: function() {
            //this.$input.data("resource").editor.focus();
        }
    });
    
    var input = '<div class="input-group">' + '<input type="hidden" id="id"/>';
	input += '<input type="text" class="form-control" readonly="readonly" id="name"/>';
	input += '<span class="input-group-btn">' 
		  + '<button class="btn default select"  type="button"><i class="fa fa-search"></i></button>'
		  + '</span>';
	input += '</div>';
	
    Resource.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl: input,
        inputclass: '',
        placeholder: null
    });
    
    $.fn.editabletypes.resource = Resource;

}(window.jQuery));