$(document).ready(function(){
	try
	{
		$("ul.dropdown li").dropdown();
	}
	catch (err)
	{
		//catch and supress the error
	}
});

$ .fn.dropdown = function() {

	$(this).hover(function(){
		$(this).addClass("hover");
		$('> .dir',this).addClass("open");
		$('ul:first',this).css('visibility', 'visible');
	},function(){
		$(this).removeClass("hover");
		$('.open',this).removeClass("open");
		$('ul:first',this).css('visibility', 'hidden');
	});

}