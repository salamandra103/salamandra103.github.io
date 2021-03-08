$(document).ready(function() {
    $('.js-header__burger').click(function (e) {
		$('nav.header__nav').toggleClass('active');
	});

	$(".js-header__nav a").on("click", function (e) {
		const id  = $(this).attr('href');
		if (/^#/.test(id)) {
			e.preventDefault();
			$('body,html').animate({
				scrollTop: $(id).offset().top - 50
			}, 500);
		}
	});

});
