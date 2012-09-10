// **********************************************************
// CJBOX# Alpha version 0.3
// STARTED DATE 6-8-2012
// Charlie Tang
// **********************************************************
(function( $ ){
	$.fn.cjbox = function(o) {
// **********************************************************
// GLOBAL DEFAULT SETTING
// **********************************************************
		var temp_html = '', temp_targ = '';
		var oObject = $.extend({
		type			: '', //foces type: iframe, inline, ajax, modal, notice, tooltip, video, swf, image
		title			: '',
		link			: '',
		fadeSpeed		: 0,
		height			: '',
		width			: '',
		showBookmark	: false,
		showGetURL		: false,
		showCloseButton	: true,
		showNotice		: true,
		ParentScrolling	: false,
		// if Ajax then need a url target to handle the data
		ajaxTargetUrl	: ''
	  },o);
// **********************************************************
// HTML STRUCTURE
// **********************************************************
	head =	'<div id="cjbox-tmp"><div id="cjbox-ol"></div><div id="cjbox-wrap">';
	bar =	'<div id="cjbox-bar"><span class="title"></span>';
	bar +=	'<span class="rightbar">';
	if(oObject.showNotice){
		bar +=	'<span id="cjbox-notice"></span>';
	}
	if(oObject.showBookmark){
		bar +=	'<b class="btn btn_bm">b</b>';
	}
	if(oObject.showGetURL){
		bar +=	'<b class="btn btn_link">l</b>';
	}
	if(oObject.showCloseButton){
		bar +=	'<b class="btn btn_close">&times;</b>';
	}
	bar	+=	'</span></div>';
	body_wrap	=	'<div id="cjbox-outer"></div>';
	//iframe	=	'<iframe id="cjbox-inter" width="100%" height="100%" frameborder="0" scrolling="yes">iframe</iframe>';
	inline	=	'<div id="cjbox-inter"></div>';
	ajax	=	'<div id="cjbox-inter">Ajax</div>';
	tmp_err	=	'&times_&times';
	foot	=	'</div></div>';


// **********************************************************
// BROWSER DETECT
// **********************************************************
var is_stu_on = false;
function getInternetExplorerVersion()
// Returns the version of Windows Internet Explorer or a -1
// (indicating the use of another browser).
{
   var rv = -1; // Return value assumes failure.
   if (navigator.appName == 'Microsoft Internet Explorer')
   {
      var ua = navigator.userAgent;
      var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null)
         rv = parseFloat( RegExp.$1 );
   }
   return rv;
}
function checkIEVersion()
{
	var ver = getInternetExplorerVersion();
	if ( ver> -1 )
	{
		if ( ver >= 9.0 )
			is_stu_on = true;
		else if ( ver == 8.0 )
			is_stu_on = true;
		else if ( ver == 7.0 )
			is_stu_on = true;
		else if ( ver == 6.0 )
			is_stu_on = true;
		else
			is_stu_on = false;
	} else if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
			is_stu_on = true;
	}
}
checkIEVersion();
// **********************************************************
// BUTTON
// **********************************************************
//Open box
$(this).live('click', function(e){
	e.preventDefault();
	cleanBox();
//Append #cjbox-tmp once
	if (!document.getElementById('cjbox-tmp')) {
		$( head + bar + body_wrap + foot ).appendTo('body');
	}
//If enable then load
	if(oObject.showNotice){
		$('#cjbox-notice').show();
		processNotice('load','Loading...');
	} else {
		$('#cjbox-notice').hide();
	}
//Regular process
	title	= (oObject.title ? oObject.title : $(this).attr('title'));
	url		= (oObject.link ? oObject.link : $(this).attr('href'));
	$('#cjbox-bar .title').html( title );

	switch(oObject.type){
// With case = 'oObject.type', can force the a tag doing the action else by default, it checking the link auto#
	case 'iframe':
		if ( url.match('^https?:\/\/') ){
			processIframe(url);
			parentScrollingEnable('hidden');
		}else{
			processNotice('error','Cannot connect');
		}
	break;
	case 'inline':
		if ( url.charAt(0) == '#' ){
			$('#cjbox-outer').html(inline);
			var url_loc_m	= url.indexOf('#');
			var url_id		= url.substring(url_loc_m+1, url.length);
// v0.2 read variable function s
			if(url.match(/\?/g)){
				if( processInlineSetVal(url) ){
						processNotice('success','Done');
						noticeFadeOut(null,false);
				}else{
						processNotice('error','Error');
				}
			} else if( !document.getElementById(url_id) ){// have # but Id not found
				$('#cjbox-inter').html(tmp_err);
				$('#cjbox-inter').css({
					"font-size":"20px",
					"text-align":"center"
				});
				processNotice('error','ID not found');
			} else {
				$('#cjbox-inter').html( $(url).html() );
				processNotice('success','Done');
				noticeFadeOut(null,false);
			}
		}else{
			$('#cjbox-outer').html(inline);
			$('#cjbox-inter').html(tmp_err);
			$('#cjbox-inter').css({
				"font-size":"20px",
				"text-align":"center"
			});
			processNotice('error','URL incorrect'); // Checking if set type but the href is incorrect# Suggestion: can feedbackto me#
		}
	break;
	case 'ajax':
		if ( url.charAt(0) == '#' ){
			$('#cjbox-outer').html(inline);
// v0.2 read variable function s
			if(url.match(/\?/g)){
				processAjax(url);
			} else {
				$('#cjbox-inter').html( $(url).html() );
			}
		}else{
				$('#cjbox-inter').html(tmp_err);
				$('#cjbox-inter').css({
					"font-size":"20px",
					"text-align":"center"
				});
				processNotice('error','ID not found');
		}
	break;
	default:
//Auto Checking 
		if(typeof url !=='undefined' ){
			if (url.match('^https?:\/\/')){
				processIframe(url);
				parentScrollingEnable('hidden');
			}else if ( url.charAt(0) == '#' ){
					$('#cjbox-outer').html(inline);
					// v0.2 read variable function s
					if(url.match(/\?/g)){
						if( processInlineSetVal(url) ){
								processNotice('success','Done');
								noticeFadeOut(null,false);
						}else{
								processNotice('error','Error');
						}
					}else{
					
						$('#cjbox-inter').html( $(url).html() );
					}

			// no http:// & no #, then maybe is localhost files link
			}else if( url !='' ){
				//$('#cjbox-outer').html(inline);
				//$('#cjbox-inter').html('<p style="text-align:center;">Page not found.</p>');
			}else{
				//$('#cjbox-outer').html(inline);
				//$('#cjbox-inter').html('<p style="text-align:center;">Path not define.</p>');
			}
		}else{
			$('#cjbox-outer').html(inline);
			$('#cjbox-inter').html('<p style="text-align:center;">Path not define.</p>');
		}

	break;
	}

//Customize
	Dheight	=	( parseInt(oObject.height)	>101 ? parseInt(oObject.height)	: '80');
	Dwidth	=	( parseInt(oObject.width)	>101 ? parseInt(oObject.width)	: '90');
	if(is_stu_on){
		Dmargintop	=	'-'+Dheight/( parseInt(oObject.height)	>101 ? 2 : 4);
	}else{
		Dmargintop	=	'-'+Dheight/2;
	}
	Dmarginleft	=	'-'+Dwidth/2;
	Dunit	=	((parseInt(oObject.height)>101 || parseInt(oObject.width)>101) ? 'px' : '%');

if( Dheight || Dwidth ){
	//console.log(Dheight+Dwidth+Dmargintop+Dmarginleft+Dunit);
	$('#cjbox-wrap').css({
		"height"		:	Dheight+Dunit,
		"width"			:	Dwidth+Dunit,
		"margin-top"	:	Dmargintop+Dunit,
		"margin-left"	:	Dmarginleft+Dunit
	});
}
	$('#cjbox-tmp').fadeIn(oObject.fadeSpeed);
});
//Close box
$('#cjbox-ol, #cjbox-notice, .btn_close').live('click', function(){
	$('#cjbox-tmp').fadeOut(oObject.fadeSpeed);
	$(temp_targ).html(temp_html); // revert the original hidden form
	parentScrollingEnable('auto');
});
//Escape event
$(document).keydown(function(e){
	if( e.keyCode == 27 ){
		$('#cjbox-tmp').fadeOut(oObject.fadeSpeed);
		$(temp_targ).html(temp_html); // revert the original hidden form
	}
});
// **********************************************************
// Function
// **********************************************************
//Notice : Hide
function noticeFadeOut(time,status){
	if( time == null ){time = 2000;}
	var timer = window.setTimeout(function(){$('#cjbox-notice').hide()},time);
	if(status){
		clearTimeout(timer);
	}
}
//Clear the content
function cleanBox(){
	$('#cjbox-bar .title').html('');
	$('#cjbox-outer').html('');
}
//Enable Parent Scroll bar (need testing in IE)
function parentScrollingEnable(status){
	if(oObject.ParentScrolling){
		if(status == 'hidden'){
			$('body').css("overflow-y","hidden");
		}else if(status == 'auto'){
			$('body').css("overflow-y","auto");
		}
	}
}
//Process Iframe
function processIframe(url){

	var iframe = document.createElement("iframe");
		iframe.src = url;
	if (navigator.userAgent.indexOf("MSIE") > -1 && !window.opera){
		iframe.onreadystatechange = function(){
			if (iframe.readyState == "complete"){
				processNotice('success','Done');
				noticeFadeOut(null,false);
			} else {
				processNotice('error','Site not found');
			}
		};
	} else {
		iframe.onload = function(){
				processNotice('success','Done');
				noticeFadeOut(null,false);
		};
	}
	$('#cjbox-outer').html(iframe);
	$('#cjbox-outer iframe').attr('id','cjbox-inter');
	$('#cjbox-outer iframe').attr('height','100%');
	$('#cjbox-outer iframe').attr('width','100%');
	$('#cjbox-outer iframe').attr('frameborder','0');
	$('#cjbox-outer iframe').attr('scrolling','yes');
	$('#cjbox-inter').css('padding','0px');

}
//Process Ajax by send variable
function processAjax(url){
	var output = '';
	var url_loc_m	= url.indexOf('?');
	var url_loc_e	= url.length;
	var url_id		= url.substring(0,url_loc_m);
	var data_str	= url.substring(url_loc_m,url_loc_e);

	//console.log(oObject.ajaxTargetUrl + data_str);
	if(oObject.ajaxTargetUrl && data_str)
		$.ajax({
			type		: "GET",
			url			: oObject.ajaxTargetUrl + data_str,
			beforeSend: function() {
				processNotice('load','Loading...');
			},
			success		: function(data) {
				//console.log(data);
				$('#cjbox-inter').html( data );
				processNotice('success','Done');
				noticeFadeOut(null,false);
			},
			error		: function() {
				$('#cjbox-inter').html(tmp_err);
				$('#cjbox-inter').css({
					"font-size":"20px",
					"text-align":"center"
				});
				processNotice('error','Process path not found');
			}
		});

}
//Process Inline with variable link
function processInlineSetVal(url){
	var url_loc_m	= url.indexOf('?');
	var url_loc_e	= url.length;
	var url_id		= url.substring(0,url_loc_m);
	var data_str	= url.substring(url_loc_m,url_loc_e);
		data_str	= data_str.replace('?','&');
		data_arr	= data_str.split("&");
// s set html structure to temp variable
		temp_html = $(url_id).html();
		temp_targ = url_id;
		$('#cjbox-inter').html( $(url_id).html() );
		$(url_id).html('');
// e set html structure to temp variable
	for (var index in data_arr){
		var in_str	= data_arr[index];
		var point_m	= in_str.indexOf('=');
		var point_e	= in_str.length;
		var dat_inx	= in_str.substring(0,point_m);
		var dat_val	= in_str.substring(point_m+1,point_e);
		$('#get_'+dat_inx).val(dat_val);
	}
	return true;
}
//Handle error when process occur
function processNotice(errorType,mrgs){
	noticeSetting = $('#cjbox-notice');
	switch(errorType){
		case 'success':
			noticeSetting.css({
				"background":"#DFF0D8",
				//"border":"1px solid #D6E9C6",
				"color":"#468847"
			});
		break;
		case 'load':
		case 'warning':
			noticeSetting.css({
				"background":"#FCF8E3",
				//"border":"1px solid #FBEED5",
				"color":"#C09853"
			});
		break;
		case 'error':
			noticeSetting.css({
				"background":"#F2DEDE",
				//"border":"1px solid #EED3D7",
				"color":"#B94A48"
			});
		break;
		default:
			noticeSetting.css({
				"background":"#D9EDF7",
				//"border":"1px solid #BCE8F1",
				"color":"#3A87AD"
			});
		break;
	}
	$('#cjbox-notice').html('<p style="text-align:center;">'+mrgs+'</p>');
	$('#cjbox-notice').show();
}
// **********************************************************
};//End of cjbox()
})( jQuery );
