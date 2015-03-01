$(function() {
	wrap();
	$('.nav-link').click(function() {
		if(!$(this).hasClass('selected')) {
			var pageName = $(this).data('link');
			if(!$('body').hasClass('zoom')) {
				zoomIn(pageName);
				loadContent(pageName);
			} else {
				$('body').addClass('switching');
				zoomOut();
				setTimeout(function() {
					zoomIn(pageName);
					$('body').removeClass('switching');
				},500);
			}
		} else {
			zoomOut();
		}
	});

	function zoomIn(pageName) {
		$header = $('#manifesto .nav-link[data-link="'+pageName+'"]');
		var speed = 500;
		var scale = 3;
		var linkW = $header.width();
		var linkH = $header.height();
		var linkX = $header.offset().left;
		var linkY = $header.offset().top;
		var newX = winW()/2 - (linkX + linkW/2);
		var newY = -linkY + 10;
		$('#manifesto').transition({
				x: newX,
				y: newY
		}, speed);
		$('#front').transition({
			scale: scale
		}, speed);
		$('body').addClass('zoom');
		$('.nav-link[data-link="'+pageName+'"]').addClass('selected');
		var marginTop = $header.height()*scale + 80;
		$('#manifesto .word.highlighted').removeClass('highlighted');
		$selectedSection = $('section#'+pageName);
		$selectedSection.css({marginTop: marginTop}).addClass('selected');

		setTimeout(function() {
			$blocks = shuffle($selectedSection.children('.blocks').children('.block'));
			$.each($blocks, function(i, block) {
				setTimeout(function() {
					if($selectedSection.hasClass('selected')) {
						$blocks.eq(i).addClass('show');		
					}
				}, 30*i);
			});
		}, speed);
	}

	function zoomOut() {
		$blocks = $('section.page.selected .blocks .block')
		$('#manifesto').transition({
			x: 0,
			y: 0
		});
		$('.nav-link.selected').removeClass('selected');
		$('section.page.selected').removeClass('selected');
		$('#front').transition({
			scale: 1
		}, 500);

		$('body').removeClass('zoom');

		$blocks.removeClass('show');


		$section = $('section.selected');
		$allBlocks = $section.children('.blocks').children('.block.image');
		$.each($allBlocks, function(i, block) {
			$(block).removeClass('hide');
			$(block).removeClass('show');
		});
		$('.blocks').masonry('layout');

		$.each($(this).parent('.text').children('.nav-link'), function(i, link) {
			$(link).attr('data-style', '');
		});
	}

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
	}


	$('.tool .close').click(function() {
		$tool = $(this).parent().parent().parent();
		console.log($tool);
		$tool.toggleClass('closed');
		if($tool.is('.closed')) {
			$(this).html('&#x261F;');
		} else {
			$(this).html('&#x261D;');
		}
	});

	$('.tool .lock').click(function() {
		$('body').toggleClass('locked','');
		if($('body').is('.locked')) {
			$(this).html('&#x261C;');
		} else {
			$(this).html('&#x261E;');
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

	$('.tool#editor .square').click(function() {
		$(this).toggleClass('selected');

		$highlighted = $('.word.highlighted');

		if($(this).attr('data-color')) {
			var color = $(this).attr('data-color');
			$('body').attr('data-color', color);	
		} else if($(this).attr('data-pattern')) {
			var pattern = $(this).attr('data-pattern');
			if($('body').attr('data-pattern') == pattern) {
				$('body').attr('data-pattern', '');	
			} else {
				$('body').attr('data-pattern', pattern);	
			}
		} else if ($(this).attr('data-underline')) {
			var underline = $(this).attr('data-underline');

			if($highlighted.attr('data-underline') == underline) {
				$highlighted.attr('data-underline', '');	
			} else {
				$highlighted.attr('data-underline', underline);
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
	
	
	$('.image').click(function() {
		if($(this).hasClass('large')) {
			$(this).removeClass('large');
		} else {
			$(this).addClass('large');
		}
		$('.blocks').masonry(masonryParams);
	});

	$('.block .tag').click(function() {
		var tag = $(this).data('tag');
		$blocks = $('section.page.selected .blocks .block.image');
		$tags = $('section.page.selected .blocks .block.text .tag');

		if($(this).hasClass('selected')) {
			$(this).removeClass('selected');
			$.each($blocks, function(i, block) {
				$(block).removeClass('hide');
			});
			$.each($tags, function(i, tag) {
				$(tag).data('style', '');
			});
		} else {
			$(this).addClass('selected');

			$.each($blocks, function(i, block) {
				if($(block).hasClass(tag)) {
					$(block).removeClass('hide');
				} else {
					$(block).addClass('hide');
				}
			});

			$.each($tags, function(i, tag) {
				if(!$(tag).hasClass('selected')) {
					$(tag).data('style', 'strike');
				}
			});
		}
		$('.blocks').masonry(masonryParams);
	});


	function loadContent(pageName) {
		// $page = $('section.page#' + pageName);
		// $allBlocks = $page.children('.blocks .block.image');
		// // $.each($allBlocks, function(i, block) {
		// // 	$(block).removeClass('hide');	
		// // });
		// $('.blocks').masonry('layout');
	}
});