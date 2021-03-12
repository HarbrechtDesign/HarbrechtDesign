function thisHeight(){
    return $(this).height();
}
var cardHeight = 0;
$(".card").each(function() {
	var thisHMax = Math.max.apply(Math, $(this).map(thisHeight));
	$(this).height(thisHMax);
	cardHeight += thisHMax;
});
$('#projects').css('max-height',cardHeight);

// easter egg - browser close btn
$('.header-btn.red').click(function(){
	$(this).parents('.card').hide();
})