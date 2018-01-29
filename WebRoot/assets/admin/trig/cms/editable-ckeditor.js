(function ($) {
    "use strict";
    var Ckeditor = function (options) {
        this.init('ckeditor', options, Ckeditor.defaults);
        
        //extend ckeditor manually as $.extend not recursive 
        this.options.ckeditor = $.extend({}, Ckeditor.defaults.ckeditor, options.ckeditor);
    };

    $.fn.editableutils.inherit(Ckeditor, $.fn.editabletypes.abstractinput);

    $.extend(Ckeditor.prototype, {
        render: function () {
            //generate unique id as it required for ckeditor
        	var id = 'textarea_'+(new Date()).getTime();
            this.$input.attr('id', id);
            CKEDITOR.replace(id, { on: {
					change: function(evt){
						$("#" + evt.editor.name).val(evt.editor.getData());
					}
				}
			});
                       
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
            //this.$input.data("ckeditor").editor.focus();
        }
    });

    Ckeditor.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        tpl:'<textarea></textarea>',
        inputclass: '',
        placeholder: null
    });

    $.fn.editabletypes.ckeditor = Ckeditor;

}(window.jQuery));