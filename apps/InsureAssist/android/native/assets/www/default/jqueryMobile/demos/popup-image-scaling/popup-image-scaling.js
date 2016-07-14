
/* JavaScript content from jqueryMobile/demos/popup-image-scaling/popup-image-scaling.js in folder common */
$( document ).on( "pagecreate", function() {
	$( ".photopopup" ).on({
		popupbeforeposition: function() {
			var maxHeight = $( window ).height() - 60 + "px";
			$( ".photopopup img" ).css( "max-height", maxHeight );
		}
	});
});
