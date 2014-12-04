/*
 * Template Name: Unify - Responsive Bootstrap Template
 * Description: Business, Corporate, Portfolio, E-commerce and Blog Theme.
 * Version: 1.6
 * Author: @htmlstream
 * Website: http://htmlstream.com
*/

var App = function () {
    //Bootstrap Tooltips and Popovers
    function handleBootstrap() {
        /*Bootstrap Carousel*/
        jQuery('.carousel').carousel({
            interval: 15000,
            pause: 'hover'
        });

        /*Tooltips*/
        jQuery('.tooltips').tooltip();
        jQuery('.tooltips-show').tooltip('show');      
        jQuery('.tooltips-hide').tooltip('hide');       
        jQuery('.tooltips-toggle').tooltip('toggle');       
        jQuery('.tooltips-destroy').tooltip('destroy');       

        /*Popovers*/
        jQuery('.popovers').popover();
        jQuery('.popovers-show').popover('show');
        jQuery('.popovers-hide').popover('hide');
        jQuery('.popovers-toggle').popover('toggle');
        jQuery('.popovers-destroy').popover('destroy');
    }

    //Search Box (Header)
    function handleSearch() {    
        jQuery('.search').click(function () {
            if(jQuery('.search-btn').hasClass('fa-search')){
                jQuery('.search-open').fadeIn(500);
                jQuery('.search-btn').removeClass('fa-search');
                jQuery('.search-btn').addClass('fa-times');
            } else {
                jQuery('.search-open').fadeOut(500);
                jQuery('.search-btn').addClass('fa-search');
                jQuery('.search-btn').removeClass('fa-times');
            }   
        }); 
    }

    //Sidebar Navigation Toggle
    function handleToggle() {
        jQuery('.list-toggle').on('click', function() {
            jQuery(this).toggleClass('active');
        });

        /*
        jQuery('#serviceList').on('shown.bs.collapse'), function() {
            jQuery(".servicedrop").addClass('glyphicon-chevron-up').removeClass('glyphicon-chevron-down');
        }

        jQuery('#serviceList').on('hidden.bs.collapse'), function() {
            jQuery(".servicedrop").addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        }
        */
    }

    //Fixed Header
    function handleHeader() {
         jQuery(window).scroll(function() {
            if (jQuery(window).scrollTop()>100){
                jQuery(".header-fixed .header-sticky").addClass("header-fixed-shrink");
            }
            else {
                jQuery(".header-fixed .header-sticky").removeClass("header-fixed-shrink");
            }
        });
    }

    //Header Mega Menu
    function handleMegaMenu() {
        jQuery(document).on('click', '.mega-menu .dropdown-menu', function(e) {
            e.stopPropagation()
        })
    }

    return {
        init: function () {
            handleBootstrap();
            handleSearch();
            handleToggle();
            handleHeader();
            handleMegaMenu();
        },

        //Clients Logo
        initSliders: function () {
            jQuery('#clients-flexslider').flexslider({
                animation: "slide",
                easing: "swing",
                animationLoop: true,
                itemWidth: 1,
                itemMargin: 1,
                minItems: 2,
                maxItems: 9,
                controlNav: false,
                directionNav: false,
                move: 2
            });
            
            jQuery('#clients-flexslider1').flexslider({
                animation: "slide",
                easing: "swing",
                animationLoop: true,
                itemWidth: 1,
                itemMargin: 1,
                minItems: 2,
                maxItems: 5,
                controlNav: false,
                directionNav: false,
                move: 2
            });
            
            jQuery('#photo-flexslider').flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: false,
                itemWidth: 80,
                itemMargin: 0
            }); 
            
            jQuery('#testimonal_carousel').collapse({
                toggle: false
            });
        },

        //Counters 
        initCounter: function () {
            jQuery('.counter').counterUp({
                delay: 10,
                time: 1000
            });
        },

        //Parallax Backgrounds
        initParallaxBg: function () {
             jQuery(window).load(function() {
                jQuery('.parallaxBg').parallax("50%", 0.2);
                jQuery('.parallaxBg1').parallax("50%", 0.4);
            });
        },

    };

}();






function customize_theme(cfg){
    var base = BASE_STATIC_URL;
    if("true" == cfg["boxed"] ){
	jQuery("body").addClass("boxed-layout container");
    }
    var color = cfg["color"];
    if(color && color != ''){
	jQuery('#style_color').attr("href", base+"assets/css/themes/" + color + ".css");
    }

    var pattern = cfg["pattern"];
    if(pattern !="" && pattern != "none"){
	jQuery('body').attr('data-pattern', pattern);
	jQuery('body').css("background", "url("+base+"'assets/img/patterns/"+pattern+".png') repeat scroll 0 0 rgba(0, 0, 0, 0)");
	jQuery('.backstretch').remove();
    }

    var imgbkg = cfg["bg"];    
    if(imgbkg == 'none' || imgbkg == '') {
	jQuery('body').attr('data-background', '');
	jQuery('.backstretch').remove();
    } else {
	if(!jQuery('body').hasClass('boxed-layout')) {
	    jQuery(".boxed-layout-btn").trigger('click');
	}
	
	jQuery('body').attr('data-background', imgbkg);
	var data_background = jQuery('body').attr('data-background');
	if(data_background) {
	    jQuery.backstretch(data_background);
	    jQuery('body').addClass('transparent'); // remove backround color of boxed class
	}
    }

}






function customize_theme(cfg){
    var base = BASE_STATIC_URL;
    if("true" == cfg["boxed"] ){
	jQuery("body").addClass("boxed-layout container");
    }
    var color = cfg["color"];
    if(color && color != ''){
	jQuery('#style_color').attr("href", base+"assets/css/themes/" + color + ".css");
    }

    var pattern = cfg["pattern"];
    if(pattern !="" && pattern != "none"){
	jQuery('body').attr('data-pattern', pattern);
	jQuery('body').css("background", "url("+base+"'assets/img/patterns/"+pattern+".png') repeat scroll 0 0 rgba(0, 0, 0, 0)");
	jQuery('.backstretch').remove();
    }

    var imgbkg = cfg["bg"];    
    if(imgbkg == 'none' || imgbkg == '') {
	jQuery('body').attr('data-background', '');
	jQuery('.backstretch').remove();
    } else {
	if(!jQuery('body').hasClass('boxed-layout')) {
	    jQuery(".boxed-layout-btn").trigger('click');
	}
	
	jQuery('body').attr('data-background', imgbkg);
	var data_background = jQuery('body').attr('data-background');
	if(data_background) {
	    jQuery.backstretch(data_background);
	    jQuery('body').addClass('transparent'); // remove backround color of boxed class
	}
    }

}




function add_item_to_list(list,item){
    var elt = $("#c-"+list+"-"+item);
    var indicator =  elt.find('.status-indicator');
    var is_in_list = $(elt).hasClass('is-in-list');
    var action_link = $(elt).closest(".item-list").data().actionLink;
    $(indicator).html("<i class='fa fa-spinner fa-spin'></i>");
    $.ajax({
	url: action_link,
	data : {list : list, item: item, add:!is_in_list},
	success:function(response){
	    $(indicator).html(response);
	    if(is_in_list) $(elt).removeClass('is-in-list');
	    else 	$(elt).addClass('is-in-list');
	    }
    })
}



jQuery.fn.preventDoubleSubmission = function() {
  $(this).on('submit',function(e){
    var $form = $(this);

    if ($form.data('submitted') === true) {
      // Previously submitted - don't submit again
      e.preventDefault();
    } else {
      // Mark it so that the next submit can be ignored
      $form.data('submitted', true);
    }
  });

  // Keep chainability
  return this;
};


//$('form:not(.js-allow-double-submission)').preventDoubleSubmission();
