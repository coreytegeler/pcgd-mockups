$(function() {
	wrap();
	$('#manifesto .nav-link').click(function() {
		if(!$(this).hasClass('selected')) {
			var speed = 500;
			var scale = 3;
			var linkW = $(this).width();
			var linkH = $(this).height();
			var linkX = $(this).offset().left + linkW/2;
			var linkY = $(this).offset().top;

			// MIDDLE
			var newX = winW()/2 - linkX;
			// LEFT
			// var newX = 0;
			var newY = -linkY + 10;

			$('#manifesto').transition({
				x: newX,
				y: newY
			}, speed);

			$('#front').transition({
				scale: scale
			}, speed);

			$('body').addClass('zoom');


			$(this).addClass('selected');
			var id = $(this).attr('data-link');
			var marginTop = ($(this).height() * scale) + 40;

			$('#manifesto .nav-link.highlighted').removeClass('selected');

			$selectedSection = $('section#'+id);
			$selectedSection.css({marginTop: marginTop}).addClass('selected');

			setTimeout(function() {
				$blocks = shuffle($selectedSection.children('.blocks').children('.block'));
				$.each($blocks, function(i, block) {
					setTimeout(function() {
						$blocks.eq(i).addClass('show');	
					}, 30*i);
				});
			}, speed);

		} else {
			zoomOut();
		}

		function zoomOut() {
			$('#manifesto').transition({
				x: 0,
				y: 0
			});
			$('#manifesto .nav-link.selected').removeClass('selected');

			$('#front').transition({
				scale: 1
			}, 500);

			$('body').removeClass('zoom');

			$.each($blocks, function(i, block) {
				$blocks.eq(i).removeClass('show');	
				$blocks.eq(i).removeClass('hide');	
			});

			$('section.selected').removeClass('selected');
		}
	});

	$(window).resize(function() {

	});

	function wrap() {
		var manifesto = $('#manifesto .copy');
		var words = manifesto.text().split(' ');
		manifesto.empty();

		var links = [
			'students',
			'faculty',
			'alumni',
			'apply',
			'community'
		];

		$.each(words, function(i,word) {
			var link = links.indexOf(word);
			if(link != -1) {
				manifesto.append($("<span class='nav-link' data-link='" + word + "'>"+word+"</span>")).append('\u00A0');
			} 
			else {
				manifesto.append($("<span class='word'>"+word+"</span>")).append('<span> </span>');
			}

			if(i == words.length - 1) {
				typeset();
			}
		});
	}

	function typeset() {
		var t = 0;
		$('.word').click(function(e) {
			if(!$(this).is('.highlighted')) {
				if(e.shiftKey) {
					$(this).addClass('highlighted');
				} else {
					$('.word.highlighted').removeClass('highlighted');
					$(this).addClass('highlighted');	
				}
			} else {
				$(this).removeClass('highlighted');
			} 
		});

		$('#unselect').click(function(e) {
			$('.word.highlighted').removeClass('highlighted');
		});

		// $('body').click(function(e) {
		// 	console.log(!$(e.target).hasClass('word'));
		// 	if(!$(e.target).hasClass('word')) {
		// 		$('.word.selected').removeClass('selected');
		// 	}
		// });

		$('#fontSelect').change(function(e) {
			var font = e.target.value;
			$('.word.highlighted').attr('data-font', font);
		});

		$('.tool#editor #styling h3').click(function(e) {
			var style = $(this).attr('data-style');
			$selected = $('.word.highlighted');
			console.log(style, $selected.attr('data-style'));
			if(style === $selected.attr('data-style')) {
				$selected.attr('data-style', '');
			} else {
				$selected.attr('data-style', style);
			}
			
		});

		
		// $('.tool#editor').click(function() {
		// 	if($(this).hasClass('closed')) {
		// 		$(this).removeClass('closed');	
		// 	}
		// });
	}

	$('.tool#editor #close').click(function() {
		$('.tool#editor').toggleClass('closed','');
	});

	$('.tool#editor #lock').click(function() {
		$('body').toggleClass('locked','');
		if($('body').is('.locked')) {
			$(this).html('&#9754;');
		} else {
			$(this).html('&#9755;');
		}
		
	});

	$('body:not(.locked) .tool').draggable({
		start: function() {
			$(this).addClass('dragging');
		},
		stop: function() {
			$(this).removeClass('dragging');
		}
	});

	$('.tool#editor #background .square').click(function() {
		if($(this).attr('data-color')) {
			var color = $(this).attr('data-color');
			if($('body').attr('data-color') == color) {
				$('body').attr('data-color', '');	
			} else {
				$('body').attr('data-color', color);	
			}
		}
		if($(this).attr('data-pattern')) {
			var pattern = $(this).attr('data-pattern');
			if($('body').attr('data-pattern') == pattern) {
				$('body').attr('data-pattern', '');	
			} else {
				$('body').attr('data-pattern', pattern);	
			}
		}
	});



	masonryParams = {
		itemSelector: '.block',
		columnWidth: '.image:last-child',
		gutter: 20,
		isFitWidth: true,
		stamp: '.stamp'
	};

	$('.blocks').imagesLoaded(function() {
		$('.blocks').masonry(masonryParams);
	});
	

	$('.image').hover(function() {
		// var image = $(this).children('img').attr('src');
		// $('#imageViewer').css({'backgroundImage':'url("'+image+'")'});
		// $('#imageViewer').addClass('hover');
	}, function() {
		$('#imageViewer').not('.clicked').css({'backgroundImage':''});
		$('#imageViewer').removeClass('hover');
	});
	
	$('.image').click(function() {
		var image = $(this).children('img').attr('src');
		$('#imageViewer').css({'backgroundImage':'url("'+image+'")'});
		$('#imageViewer').removeClass('hover').addClass('clicked');
	});


	$('.nav-link').click(function(e) {
		if(!$(this).hasClass('selected')) {
			$(this).addClass('selected');
			var link = $(this)[0].attr('data-link');
			$section = $('section.selected');
			$allBlocks = $section.children('.blocks').children('.block.image');
			$.each($allBlocks, function(i, block) {
				$this = $(block);
				if(!$this.hasClass(link)) {
					$this.addClass('hide');
				} else {
					$this.removeClass('hide');
				}	
			});
			$('.blocks').masonry('layout');

			$.each($(this).parent('.text').children('.nav-link'), function(i, linkObj) {
				$this = $(linkObj);
				if($this[0].attr('data-link') != link) {
					$this.attr('data-style', 'strike');
				} else {
					$this.attr('data-style', '');
				}
			});
		} else {
			$(this).removeClass('selected');
			$section = $('section.selected');
			$allBlocks = $section.children('.blocks').children('.block.image');
			$.each($allBlocks, function(i, block) {
				$(block).removeClass('hide');
			});
			$('.blocks').masonry('layout');

			$.each($(this).parent('.text').children('.nav-link'), function(i, linkObj) {
				$(linkObj).attr('data-style', '');
			});
		}
	});
});