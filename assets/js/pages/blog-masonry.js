/**
 * Base js functions
 */

$(document).ready(function(){
    var $container = $('.grid-boxes');

    var gutter = parseInt($container.attr("data-gutter-width"));
    var min_width = parseInt($container.attr("data-min-width"));
    var max_columns = parseInt($container.attr("data-max-columns"));
    $container.imagesLoaded( function(){
        $container.masonry({
            itemSelector : '.grid-boxes-in',
            gutterWidth: gutter,
            isAnimated: true,
            columnWidth: function( containerWidth ) {
                var box_width = 0;

		for(var c = max_columns; c>1; c--){
		    box_width = (((containerWidth - (c-1)*gutter)/c) | 0) ;
		    if (box_width >= min_width) break;
		}		    

                if (box_width < min_width) {
                    box_width = containerWidth;
                }
		$('.grid-boxes-in').width(box_width);
                return box_width;
              }
        });
    });
/*
    var gutter = 30;
    var min_width = 300;
    $container.imagesLoaded( function(){
        $container.masonry({
            itemSelector : '.grid-boxes-in',
            gutterWidth: gutter,
            isAnimated: true,
              columnWidth: function( containerWidth ) {
                var box_width = (((containerWidth - 2*gutter)/3) | 0) ;

                if (box_width < min_width) {
                    box_width = (((containerWidth - gutter)/2) | 0);
                }

                if (box_width < min_width) {
                    box_width = containerWidth;
                }

                $('.grid-boxes-in').width(box_width);

                return box_width;
              }
        });
    });

*/


});
