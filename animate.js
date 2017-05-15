
var pageWidth = $(window).width();
var pageHeight = $(window).height();

$(document).ready(function(){
	$(".wrapper").css("width", pageWidth);
	$(".wrapper").css("height", pageHeight);



});

function bounceIn(x){

        if(x.hasClass('slide-down')) {
          x.addClass('slide-up', 1000, 'easeOutBounce');
          x.removeClass('slide-down');
        } else {
          x.removeClass('slide-up');
          x.addClass('slide-down', 1000, 'easeOutBounce');
        }
}
function bounceInlow(x){

        if(x.hasClass('slide-down2')) {
          x.addClass('slide-up', 1000, 'easeOutBounce');
          x.removeClass('slide-down2');
        } else {
          x.removeClass('slide-up');
          x.addClass('slide-down2', 1000, 'easeOutBounce');
        }
}

var descPane = $("#description");

$(document).ready(function(){
bounceIn($('#description'));
setTimeout(function(){
  bounceInlow($('.subpanel1'));
}, 300);
setTimeout(function(){
  bounceInlow($('.subpanel2'));
}, 600);
setTimeout(function(){
  bounceInlow($('.subpanel3'));
}, 900);
});
/*
$(document).ready(function() {

      if($('#description').hasClass('slide-down')) {
        $('#description').addClass('slide-up', 1000, 'easeOutBounce');
        $('#description').removeClass('slide-down');
      } else {
        $('#description').removeClass('slide-up');
        $('#description').addClass('slide-down', 1000, 'easeOutBounce');
      }

});
*/
