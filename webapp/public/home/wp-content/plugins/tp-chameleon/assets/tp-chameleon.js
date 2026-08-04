(function ($) {
	'use strict'
	$(document).ready(function () {
		// tp_chameleon.ready();
		var $preview = $('.tp-preview-images');
		$('.right-canvas .tp_demo').hover(
			function (event) {
				var url_prewview = $(this).attr('data-preview');
				if (url_prewview) {
					$preview.find('img').attr('src', url_prewview);
					$preview.show();
				}
			},
			function () {
				$preview.hide();
			}
		);
		$('.right-canvas .tp_demo').mousemove(function (event) {
			var y = (event.clientY);
			$preview.css('top', y - 250);
		});
		jQuery('#tp_style_selector').each(function () {
			var wrapper = jQuery(this);
			$('.style-toggle.toggle-demo').click(function (e) {
				e.preventDefault();
				wrapper.toggleClass('show');
			});
			// Close the demo selector on click on overlay.
			jQuery('body').on('click', '.tp-style-selector.show', function (e) {
				if (jQuery(e.target).hasClass('show')) {
					jQuery(e.target).find('.style-toggle.toggle-demo').trigger('click');
				}
			});

			// Close the demo selector on esc key.
			jQuery(document).on('keyup', function (e) {
				if (27 === e.keyCode && wrapper.hasClass('show')) {
					wrapper.find('.style-toggle.toggle-demo').trigger('click');
				}
			});
		});

		// Handle the filter clicks.

		if ('loading' in HTMLImageElement.prototype) {
			const images = document.querySelectorAll("img.lazyload");
			images.forEach(img => {
				img.src = img.dataset.src;
			});
		} else {
			// Dynamically import the LazySizes library
			let script = document.createElement("script");
			script.async = true;
			script.src =
				"https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.1.8/lazysizes.min.js";
			document.body.appendChild(script);
		}
		var $buyPopup = $('#tp_chameleon_popup.tp-buy-popup');
		if ($buyPopup.length) {
			var openBuyPopup = function () {
				$buyPopup.addClass('is-open').attr('aria-hidden', 'false');
				$('body').addClass('tp-buy-popup-open');
			};
			var closeBuyPopup = function () {
				$buyPopup.removeClass('is-open').attr('aria-hidden', 'true');
				$('body').removeClass('tp-buy-popup-open');
			};

			jQuery('body').on('click', 'a[href="#tp_chameleon_popup"]', function (e) {
				e.preventDefault();
				openBuyPopup();
			});
			$buyPopup.on('click', '[data-tp-buy-popup-close]', function (e) {
				e.preventDefault();
				closeBuyPopup();
			});
			$(document).on('keyup', function (e) {
				if (27 === e.keyCode && $buyPopup.hasClass('is-open')) {
					closeBuyPopup();
				}
			});

			if (window.location.hash === '#tp_chameleon_popup') {
				openBuyPopup();
			}
		}
	});

	jQuery(document).ready(function () {
		var timeouts = [];
		jQuery('.tp-filters-wrapper .tp-filters-cats input').on('change', function (e) {
			var wrapper = jQuery(this).closest('.tp-style-selector'),
				demos = wrapper.find('.tp-demo'),
				filterGroups = wrapper.find('.tp-filters-cats'),
				selections = {},
				counter = 1;
			e.preventDefault();

			var $this = jQuery(this);
			if ($this.is(':checked')) {
				if ($this.val() === 'all') {
					$this.closest('.tp-filters-cats').find('input').not($this).prop('checked', false);
				} else {
					$this.closest('.tp-filters-cats').find('input[value="all"]').prop('checked', false);
				}
			} else {
				if ($this.closest('.tp-filters-cats').find('input:checked').length === 0) {
					$this.closest('.tp-filters-cats').find('input[value="all"]').prop('checked', true);
				}
			}

			// Add active class to list item
			jQuery(this).closest('.tp-filters-cats').find('li').removeClass('active');
			jQuery(this).closest('.tp-filters-cats').find('input:checked').not('[value="all"]').closest('li').addClass('active');

			filterGroups.each(function (e) {
				var filterWrapper = jQuery(this),
					filterType = filterWrapper.data('type'),
					selected = new Array();

				// Get currently checked filters.
				filterWrapper.find('input:checked').each(function () {
					if ('all' === this.value) {
						return false;
					}
					selected.push(this.value);
				});

				// Add to the main selctions object.
				if (0 < selected.length) {
					selections[filterType] = selected;
				}
			});
			jQuery.each(timeouts, function (index, value) {
				clearTimeout(value);
			});

			// Hide all demos.
			demos.hide().addClass('demo-hidden');
			demos.each(function () {
				var demo = jQuery(this),
					compareData = demo.data(),
					selectionCount = 0;
				jQuery.each(compareData, function (filterType, selected) {
					var selectedString;

					// Return early if the data field is not present in the filter selection.
					if ('undefined' === typeof selections[filterType]) {
						return;
					}
					// Return early if selected is empty.
					if ('' === selected) {
						return;
					} else if (-1 === selected.indexOf(',')) {
						selected += ',';
					}

					selectedString = selected.split(',');
					jQuery.each(selectedString, function (index, value) {
						if (-1 !== jQuery.inArray(value, selections[filterType])) {
							selectionCount++;
							return false;
						}
					});
				});
				if (selectionCount === Object.keys(selections).length) {
					demo.show();
					timeouts.push(
						setTimeout(function () {
							demo.removeClass('demo-hidden');
						}, counter * 50)
					);
					counter++;
				}
			});
		});
	});
})(jQuery);
