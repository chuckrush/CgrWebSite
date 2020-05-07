// CSS Browser Selector   v0.6
// Documentation:         http://rafael.adm.br/css_browser_selector
// License:               http://creativecommons.org/licenses/by/2.5/
// Author:                Rafael Lima (http://rafael.adm.br)
// Contributors:          http://rafael.adm.br/css_browser_selector#contributors
function css_browser_selector() {
	var ua = navigator.userAgent.toLowerCase();
	var h = document.getElementsByTagName('html')[0];
	var c = h.className;

	if(ua.indexOf('msie') != -1 && !(ua.indexOf('opera') != -1) && (ua.indexOf('webtv') == -1) ) h.className='ie'+' ie'+ua.charAt(ua.indexOf('msie')+5)+' '+c;
	else if(ua.indexOf('gecko/') != -1) h.className=('gecko '+c);
	else if(ua.indexOf('opera') != -1) h.className=('opera '+c);
	else if(ua.indexOf('konqueror') != -1) h.className=('konqueror '+c);
	else if(ua.indexOf('applewebkit/') != - 1) h.className=('safari '+c);
	else if(ua.indexOf('mozilla/') != -1) h.className=('gecko '+c);
}
css_browser_selector();