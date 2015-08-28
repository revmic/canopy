(function($){

	/* ---------------------------------------------- /*
	 * Preloader
	/* ---------------------------------------------- */

	$(window).load(function() {
		$('#status').fadeOut();
		$('#preloader').delay(300).fadeOut('slow');
	});

	$(document).ready(function() {

		/* ---------------------------------------------- /*
		 * Smooth scroll / Scroll To Top
		/* ---------------------------------------------- */

		$('a[href*=#]').bind("click", function(e){
           
			var anchor = $(this);
			$('html, body').stop().animate({
				scrollTop: $(anchor.attr('href')).offset().top
			}, 1000);
			e.preventDefault();
		});

		$(window).scroll(function() {
			if ($(this).scrollTop() > 100) {
				$('.scroll-up').fadeIn();
			} else {
				$('.scroll-up').fadeOut();
			}
		});

		/* ---------------------------------------------- /*
		 * Navbar
		/* ---------------------------------------------- */

		$('.header').sticky({
			topSpacing: 0
		});

		$('body').scrollspy({
			target: '.navbar-custom',
			offset: 0
		});
		
        
		/* ---------------------------------------------- /*
		 * Home BG
		/* ---------------------------------------------- */

		toggle_facebook_like();

		var screen = $(".screen-height");
		screen.height();
		//alert($(window).width());

		if (screen.height() < 1000 && $(window).width() <= 768) {
			screen.height(1000);
		}

		if ($(window).width() < 450) {
			screen.height(3 * $(window).width())
		}

		$(window).resize(function() {
			toggle_facebook_like();

			if (screen.height() < 1000) {
				screen.height($(window).height());
			}
			if ($(window).width() < 450) {
				screen.height(3 * $(window).width())
			}
		});

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
			$('#home').css({'background-attachment': 'scroll'});
		} else {
			$('#home').parallax('50%', 0.1);
			// Focus cursor on contact form
			$("input:text:visible:first").focus();
		}


		/* ---------------------------------------------- /*
		 * WOW Animation
		/* ---------------------------------------------- */

		wow = new WOW({
			mobile: false
		});
		wow.init();


		/* ---------------------------------------------- /*
		 * E-mail validation
		/* ---------------------------------------------- */

		function isValidEmailAddress(emailAddress) {
			var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
			return pattern.test(emailAddress);
		}

		/* ---------------------------------------------- /*
		 * Contact form ajax
		/* ---------------------------------------------- */

		// Turn off the bubbles
		//form.addEventListener( "invalid", function( event ) {
		//	event.preventDefault();
		//}, true );

		$('#contact-form').submit(function(e) {

			e.preventDefault();
			
			var name_field = $('#c_name');
			var email_field = $('#c_email');
			var phone_field = $('#c_phone');
			var zip_field = $('#c_zip');

			var c_name = name_field.val();
			var c_email = email_field.val();
			var c_phone = phone_field.val();
			var c_zip = zip_field.val();
			var c_message = $('#c_message ').val();
			var ajax_response = $('#contact-form').find('.ajax-response');
			
			var formData = {
				'name' : c_name,
				'email' : c_email,
				'phone' : c_phone,
				'zip' : c_zip,
				'message' : c_message
			};

			// UI alerts for incorrect form data
			if (c_zip == '') {
				zip_field.addClass('input-error');
				zip_field.focus();
			} else {
				zip_field.removeClass('input-error');
			}
			if (c_phone == '') {
				phone_field.addClass('input-error');
				phone_field.focus();
			} else {
				phone_field.removeClass('input-error');
			}
			if (c_email == '' || !isValidEmailAddress(c_email)) {
				email_field.addClass('input-error');
				email_field.focus();
			} else {
				email_field.removeClass('input-error');
			}
			if (c_name == '') {
				name_field.addClass('input-error');
				name_field.focus();
			} else {
				name_field.removeClass('input-error');
			}

			// Message to display for incorrect input
			var validation_error = undefined;

			if (!isValidEmailAddress(c_email)) {
				validation_error = "Please check email address."
			}
			if (( c_name== '' || c_email == '' || c_phone == '' || c_zip == '')) {
				validation_error = "Please fill out required fields."
			}

			if (validation_error) {
				ajax_response.fadeIn(500);
				ajax_response.html(
					'<i class="fa fa-warning"></i> ' + validation_error
				).css("color", "#E7746F");
			} else {
				var email_spinner = $('#email_spinner');
				email_spinner.removeClass("icon-paper-plane");
				email_spinner.addClass("fa fa-cog fa-spin");

				$.ajax({
					type: 'POST',
					url: '/api/contact',
					//data: $('form').serialize(),
					data: formData,
					dataType: 'json',
					encode: true,
					success: function(res) {
						console.log(res);
						goog_report_conversion();

						ajax_response.fadeIn(500);
						ajax_response.html(
							'Your message was sent successfully. We will get back to you shortly.'
						).css("color", "green");

						email_spinner.removeClass("fa fa-cog fa-spin");
						email_spinner.addClass("fa fa-check-circle-o");
						$("#email").prop("disabled",true);

					},
					error: function(error) {
						console.log(error);
						ajax_response.html(
							"Failed to send message. Server error (" + error.status + "). Please call (917) 248-0172 or email us at support@canopy.care"
						).css("color", "red");
						email_spinner.removeClass("fa fa-cog fa-spin");
						email_spinner.addClass("fa fa-times");
					}
				});
			}
			return false;
		});
	});

})(jQuery);

function toggleChevron(e) {
	$(e.target)
		.prev('.panel-heading')
		.find("i.indicator")
		.toggleClass('fa-chevron-down fa-chevron-up');
}

var faq = $('#accordion');
faq.on('hide.bs.collapse', toggleChevron);
faq.on('shown.bs.collapse', toggleChevron);


function toggle_dropzone() {
	$("#dropzone-area").toggle(500);
}

function toggle_facebook_like() {
	// Show appropriate FB Like button
	if ($(window).width() < 768) {
		$('#fb-like-desktop').hide();
		$('#fb-like-mobile').show();
	} else {
		$('#fb-like-mobile').hide();
		$('#fb-like-desktop').show();
	}
}

function show_pricing() {
	$('html, body').animate({
		scrollTop: $("#accordion").offset().top
	}, 750);
	$('#collapse0').collapse('show');
}


/* ---------------------------------------------- /*
 * Skills
/* ---------------------------------------------- */
//var color = $('#home').css('backgroundColor');

//$('.skills').waypoint(function(){
//    $('.chart').each(function(){
//    $(this).easyPieChart({
//            size:140,
//            animate: 2000,
//            lineCap:'butt',
//            scaleColor: false,
//            barColor: '#FF5252',
//            trackColor: 'transparent',
//            lineWidth: 10
//        });
//    });
//},{offset:'80%'});


/* ---------------------------------------------- /*
 * Quote Rotator
/* ---------------------------------------------- */

	/*$( function() {

		- how to call the plugin:
		$( selector ).cbpQTRotator( [options] );
		- options:
		{
			// default transition speed (ms)
			speed : 700,
			// default transition easing
			easing : 'ease',
			// rotator interval (ms)
			interval : 8000
		}
		- destroy:
		$( selector ).cbpQTRotator( 'destroy' );

		$( '#cbp-qtrotator' ).cbpQTRotator();

	} );*/