/**
 * 首页
 */
TRIG.Index = {
		fixContentHeight : function() {
			
		},
		initMenu : function() {
			var menu = $('.hor-menu');
	        var currentAjax = null;  // 当前ajax请求
	        $('.ajaxify').on('click', function (e) {
	            e.preventDefault();
	            App.scrollTop();
	            var url = $(this).attr("href");
	            var pageContentBody = $('.page-container .page-content-wrapper');

	            menu.find('li.active').removeClass('active');
	            menu.find('li > a > .selected').remove();
	            menu.find('li.open').removeClass('open');

	            $(this).parents('li').each(function () {
	                $(this).addClass('active');

	                if ($(this).parent('ul.navbar-nav').size() === 1) {
	                    $(this).find('> a').append('<span class="selected"></span>');
	                }
	            });

	            if (App.getViewPort().width < 992 && $('.page-header-menu').is(':visible')) { // close the menu on mobile view while laoding a page 
	                $('.page-header .menu-togglerr').click();
	            }

	            App.startPageLoading();

	            var the = $(this);
	            var hash =  this.className.substr(this.className.lastIndexOf(" ")+1);
	            location.href = "#" + hash;
	            
	            if(the.attr('data-load')=='IFRAME') {
	            	pageContentBody.html('<div class="row" style="display:block;"><iframe id="iframepage" scrolling="yes" frameborder="no" src="'+ url +'" width="100%"  onload="TRIG.iFrameHeight()" style="display:block;"></iframe></div>'); 
	            	App.stopPageLoading();
	            } else if(the.attr('data-load')=='SKIP'){ //SIKP
	            	window.open(url, '_blank');
	            } else { // AJAX
	            	if(currentAjax) {
	                	currentAjax.abort();
	                	currentAjax = null;
	                }
	            	currentAjax = $.ajax({
		                type: "GET",
		                cache: false,
		                url: url,
		                dataType: "html",
		                success: function (res) {
		                	if(currentAjax == null) return false;
		
		                    App.stopPageLoading();
		                    TRIG.pageInit();
		                    TRIG.LOADHTMLOrJs(function(){
		                    	pageContentBody.html(res);
		                    })
		                    TRIG.Index.fixContentHeight(); // fix content height
		                    App.initAjax(); // initialize core stuff
		                    TRIG.init();	// page init
		                },
		                error: function (xhr, ajaxOptions, thrownError) {
		                    App.stopPageLoading();
		                    if(ajaxOptions!='abort')
		                    	pageContentBody.html('<h4>Could not load the requested content.</h4>');
		                }
		            });
	            }
	            
	            return false;
	        });
	        
	        // handle ajax link within main content
	        $('.page-content-wrapper').on('click', '.ajaxify', function (e) {
	            e.preventDefault();
	            var url = $(this).attr("href");
	            gotohrefurl(url);
	        });
	        
	        function gotohrefurl(url) {
	        	App.scrollTop();
	            var pageContentBody = $('.page-container .page-content-wrapper');
	            App.startPageLoading();
	            if (App.getViewPort().width < 992 && $('.page-header-menu').is(':visible')) { // close the menu on mobile view while laoding a page 
	                $('.page-header .menu-togglerr').click();
	            }
	            if(currentAjax) {
	            	currentAjax.abort();
	            	currentAjax = null;
	            }
	        	currentAjax = $.ajax({
	                type: "GET",
	                cache: false,
	                url: url,
	                dataType: "html",
	                success: function (res) {
	                	if(currentAjax == null) return false;
	                	
	                    App.stopPageLoading();
	                    TRIG.pageInit();
	                    TRIG.LOADHTMLOrJs(function(){
	                    	pageContentBody.html(res);
	                    })
	                    //pageContentBody.html(res);
	                    this.fixContentHeight(); // fix content height
	                    App.initAjax(); // initialize core stuff
	                    TRIG.init();	// page init
	                },
	                error: function (xhr, ajaxOptions, thrownError) {
	                	if(ajaxOptions!='abort')
	                		pageContentBody.html('<h4>Could not load the requested content.</h4>');
	                    App.stopPageLoading();
	                }
	            });
	        }
	        
	        
		},
		init : function() {
			this.initMenu();
		}
};

$(function(){
	$(document).keydown(function(e){
		 if(e.ctrlKey && e.which == 79) { // ctrl+o 退出
			 e.preventDefault();
			 logout();
		 } else if(e.ctrlKey && e.which == 76) { // ctrl+l 退出
			 e.preventDefault();
			 window.open('lock.t', '_self');
		 }
	});
	TRIG.Index.init();
});