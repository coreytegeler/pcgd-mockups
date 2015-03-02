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
		var scale = 2;
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
		var marginTop = $header.height()*scale;
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
				}, rand(600));
			});
		}, speed);

		if($('body').hasClass('locked')) {
			var editTop = $('#navigator').height();
			var editHeight = winH() - $('#navigator').height();
			$('#editor').css({
				'top':editTop,
				'height':editHeight
			});
		}
		
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
		$('.blocks').masonry(masonryParams);
		

		$.each($(this).parent('.text').children('.nav-link'), function(i, link) {
			$(link).attr('data-style', '');
		});

		$('body.locked #editor').css({
			'height':winH(),
			'top':0
		});
		

		$('body:not(.locked) #editor').css({
			'height':'auto',
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
		setTimeout(function() {
			$('#manifesto .text .title').addClass('show');
			$('#manifesto .nav-link').addClass('show');
		},500);
		// setTimeout(function() {
		// 	$.each($('#manifesto .nav-link'), function(i, navLink) {
		// 		setTimeout(function() {
					
		// 		},200 * i);
		// 	});
		// },500);




		setTimeout(function() {
			$.each($('#manifesto .copy .word'), function(i, word) {
				setTimeout(function() {
					$(word).addClass('show');
					// $('#cursor').insertAfter($(word));
				},rand(600));
				$('.tool').addClass('show');
			});	
		}, 600);
		
		$('.word').click(function(e) {
			if(!$('body').hasClass('zoom')) {
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
			}
		});

		$('#unselect').click(function(e) {
			$('.word.highlighted').removeClass('highlighted');
		});

		$('#fontSelect').change(function(e) {
			var font = e.target.value;
			$('.word.highlighted').attr('data-font', font);
		});

		$('.tool#editor #styling h3:data(style)').click(function(e) {
			var style = $(this).attr('data-style');
			$selected = $('.word.highlighted');
			if(style === $selected.attr('data-style')) {
				$selected.attr('data-style', '');
			} else {
				$selected.attr('data-style', style);
			}
			
		});
	}


	$('.tool .close').click(function() {
		$tool = $(this).parent().parent().parent();
		$tool.toggleClass('closed');
		if($tool.is('.closed')) {
			$(this).html('&#x261F;');
		} else {
			$(this).html('&#x261D;');
		}

		if($('body').is('.locked')) {
			if($('body').is('.zoom')) {
				var editHeight = winH() - $('#navigator').height();
				var editTop = $('#navigator').height();
			} else {
				var editHeight = winH();
				var editTop = 0;
			}	
			console.log(editTop);
			$('#editor').css({
				'top': editTop,
				'height':editHeight
			});
		}
	});

	$('.tool .lock').click(function() {
		var tool = $(this).parent().parent().parent();
		$('body').toggleClass('locked','');
		if($('body').is('.locked')) {

			var top = $(tool).position().top;
			var left = $(tool).position().left;

			$(tool).attr('data-top', top).attr('data-left', left);

			if($('body').is('.zoom')) {
				var editHeight = winH() - $('#navigator').height();
				var editTop = $('#navigator').height();
			} else {
				var editTop = 0;
				var editHeight = winH();
			}
			
			$('#editor').css({
				'top':editTop,
				'height':editHeight
			});
			$('.lock').html('&#x261C;');
		} else {
			var editTop = 0;
			var editHeight = 'auto';
			$('#editor').css({
				'top':editTop,
				'height':editHeight
			});
			$('.lock').html('&#x261E;');
		}
		
	});

	$('body:not(.locked) .tool').draggable({
		start: function() {
			$(this).addClass('dragging');
		},
		stop: function() {
			$(this).removeClass('dragging');
		}, 
		containment: 'window',
		scroll: false
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
		transitionDuration: 0
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

			$.each($tags, function(i, tag) {
				$(tag).attr('data-style', '');
			});

		} else {
			$tags.removeClass('selected');

			$.each($blocks, function(i, block) {
				if($(block).hasClass(tag)) {
					$(block).removeClass('hide');
				} else {
					$(block).addClass('hide');
				}
			});

			$(this).addClass('selected');
			$.each($tags, function(i, tag) {
				if($(tag).hasClass('selected')) {
					$(tag).attr('data-style', '');
				}	else {
					$(tag).attr('data-style', 'strike');

				}
			});
			
		}
		// setTimeout(function() {
			$('.blocks').masonry(masonryParams);
		// },100);
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