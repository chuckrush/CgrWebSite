var _surpressGlobalPopupContainer = false;

function showjQueryUIDialogOkBtnCallback(buttonToClick, dialogSelector, buttonTxt, isModal, width, height) {

    var buttonOpts = {};
    buttonOpts[buttonTxt] = function () {
        $("#" + buttonToClick).trigger('click');
    };

    buttonOpts['Cancel'] = function () {
        $(this).dialog("close");
    }

    $(dialogSelector).dialog({
        resizable: true,
        height: height,
        width: width,
        modal: isModal,
        open: function (type, data) {
            $(this).parent().appendTo("form");
        },
        buttons: buttonOpts

    });

    $(dialogSelector).dialog('open');

}

function showjQueryUIDialogContainer(dialogSelector, surpressGlobalPopupContainer, isModal, width, height) {
    if (surpressGlobalPopupContainer) { _surpressGlobalPopupContainer = true; }

    $(dialogSelector).dialog({
        height: height,
        width: width,
        modal: isModal,
        autoOpen: false,
        open: function (type, data) {
            $(this).parent().appendTo("form");
        },
        close: function (type, data) {
            if (surpressGlobalPopupContainer) { _surpressGlobalPopupContainer = false; }
        }
    });

    $(dialogSelector).dialog('open');

}

function showjQueryUISucessDialog(dialogSelector, buttonTxt, isModal, width, height) {
    var buttonOpts = {};
    buttonOpts[buttonTxt] = function () {
        $(this).dialog("close");
    };

    $(dialogSelector).dialog({
        resizable: true,
        height: height,
        width: width,
        modal: isModal,
        open: function (type, data) {
            $(this).parent().appendTo("form");
        },
        buttons: buttonOpts

    });

    $(dialogSelector).dialog('open');

}

function CloseDialog(dialogId) {

    $('#' + dialogId).dialog('close');
}

function SetUniqueRadioButton(nameregex, current) {
    nameregex = 'ContactFindGroup';
    for (i = 0; i < document.forms[0].elements.length; i++) {
        var elm = document.forms[0].elements[i];

        if (elm.type == 'radio') {
            if (elm.name.indexOf(nameregex) != -1) {
                elm.checked = false;
            }
        }
    }
    current.checked = true;

}

String.prototype.endsWith = function(str) 
{return (this.match(str+"$")==str)}

function PrinterFriendly()
{
    var url = window.location.href;
    if (url.indexOf("?") < 0)
        url = url + "?Printable=1";
    else
        url = url + "&Printable=1";
        
    var printer = window.open(url,'PinterWin','height=600,width=800,toolbar=yes,menubar=yes,location=no,status=no,scrollbars=yes');
    printer.focus();
    return true;
}
function SubmitSearch()
{
    document.getElementById("SearchCriteria").value = document.getElementById("SearchInput").value;
    document.getElementById("SearchForm").submit();
}
function openFriendWin()
{
    var tellFriend = window.open('','FriendWin','height=600,width=800,toolbars=no,location=no,statusbar=no,scrollbars=yes');
    tellFriend.document.write('<form id="FriendForm" name="FriendForm" action="http://www.rims.org/AMTemplate.cfm?template=EmailToFriend.cfm" method="POST" TARGET="FriendWin"><input type="hidden" name="ThisPage" value="' + window.location + '"></form>');
    tellFriend.document.close();
    var friendForm = tellFriend.document.getElementById("FriendForm");
    friendForm.submit();
}
/* 
Derived from a script by Alejandro Gervasio. 
Modified to work in FireFox by Stefan Mischook for Killersites.com

How it works: just apply the CSS class of 'column' to your pages' main columns.
*/
matchColumns=function(){ 
     var divs,contDivs,maxHeight,divHeight,d,newHeight; 
     // get all <div> elements in the document 
     divs=document.getElementsByTagName('div'); 
     contDivs=[]; 

     // initialize maximum height value 
     maxHeight=0; 

     // iterate over all <div> elements in the document 
     for(var i=0;i<divs.length;i++){ 
          // make collection with <div> elements with class attribute 'container' 
          if(/\bcolumn\b/.test(divs[i].className)){ 
                d=divs[i]; 
                contDivs[contDivs.length]=d; 
                // determine height for <div> element 
                if(d.offsetHeight)
                     divHeight=d.offsetHeight;
                else if(d.style.pixelHeight)
                     divHeight=d.style.pixelHeight;					 

                // calculate maximum height 
                maxHeight=Math.max(maxHeight,divHeight); 
          } 
     } 
     // assign maximum height value to all of container <div> elements 
     for(var i=0;i<contDivs.length;i++){ 
        d = contDivs[i];
        newHeight = maxHeight;
        if (d.style.borderTopWidth && d.style.borderTopWidth.endsWith('px'))
            newHeight = newHeight - d.style.borderTopWidth.substring(0,d.style.borderTopWidth.length - 2);			
        if (d.style.borderBottomWidth && d.style.borderBottomWidth.endsWith('px'))
            newHeight = newHeight - d.style.borderBottomWidth.substring(0,d.style.borderBottomWidth.length - 2);	
        contDivs[i].style.height=newHeight + "px"; 
     }
} 

// Runs the script when page loads 

window.onload=function(){ 

     if(document.getElementsByTagName){ 

          matchColumns();			 

     } 

} 

function clearForm(formIdent) 
{ 
    if (formIdent == '')
        formIdent = 'MasterPageForm';
        
    var form, elements, i, elm;
    form = document.getElementById ? document.getElementById(formIdent) : document.forms[formIdent];
    if (form == null)
        form = document.forms[0];

	if (document.getElementsByTagName)
	{
		elements = form.getElementsByTagName('input');
		for( i=0, elm; elm=elements.item(i++); )
		{
			if (elm.getAttribute('type') == "text")
				elm.value = '';
			else if (elm.getAttribute('type') == "checkbox")
			    elm.checked = false;
		}
		elements = form.getElementsByTagName('select');
		for( i=0, elm; elm=elements.item(i++); )
		{
			elm.options.selectedIndex=0;
		}
	}

	// Actually looking through more elements here
	// but the result is the same.
	else
	{
		elements = form.elements;
		for( i=0, elm; elm=elements[i++]; )
		{
			if (elm.getAttribute('type') == "text")
				elm.value = '';
			else if (elm.getAttribute('type') == "checkbox")
			    elm.checked = false;
		}
	}
	return false;
}

function rdoAddSubscribed_CheckedChanged(labeleGroupName, labelEmail, txtSubscriptionEmailID, lnkBtnChangeEmailID, labelSubscriptionMsg, lnkSave, lnkCancel, showSubscriptionMsg, reqvalidemailID, RegularExpressionValidator1ID) {
    var subscriptionMsgDisplay = document.getElementById(showSubscriptionMsg).style.display;
    document.getElementById(labeleGroupName).style.fontWeight = "bold";
    document.getElementById(txtSubscriptionEmailID).value = document.getElementById(labelEmail).innerHTML;
    if (subscriptionMsgDisplay == "block") {
        document.getElementById(labelEmail).style.display = "inline";
        document.getElementById(txtSubscriptionEmailID).style.display = "none";
        document.getElementById(lnkBtnChangeEmailID).style.display = "inline";
        document.getElementById(labelSubscriptionMsg).style.display = "none";
        document.getElementById(lnkSave).style.display = "none";
        document.getElementById(lnkCancel).style.display = "none";
    }
    var reqvalidemail = document.getElementById(reqvalidemailID);
    var RegularExpressionValidator1 = document.getElementById(RegularExpressionValidator1ID);
    if (reqvalidemail != null) {
        ValidatorEnable(reqvalidemail, true);
    }
    if (RegularExpressionValidator1 != null) {
        ValidatorEnable(RegularExpressionValidator1, true);
    }
}

function rdoNotSubscribed_CheckedChanged(labeleGroupName, rdoRealTime, rdoDailyDigest, rdoPDA, rdoNoEmails) {
    document.getElementById(labeleGroupName).style.fontWeight = "normal";
    document.getElementById(rdoRealTime).disabled = true;
    document.getElementById(rdoDailyDigest).disabled = true;
    document.getElementById(rdoPDA).disabled = true;
    document.getElementById(rdoNoEmails).disabled = true;
}


function CheckBoxListSetAll(control, state) {
    var checkBoxList = document.getElementById(control);
    var checkBoxListItems = checkBoxList.getElementsByTagName("input");
    for (var i = 0; i < checkBoxListItems.length; i++) {
        checkBoxListItems[i].checked = state;
    }
    return false;
}

function ShowHideHelpPanel(panelID, from) {
    var panel = document.getElementById(panelID);
    if (panel.style.display == 'none') {
        panel.style.left = (from.offsetLeft + from.offsetWidth) + "px";
        panel.style.display = 'block';
    }
    else
        panel.style.display = 'none';
    return false;
}

/* jQuery Mega Menu v1.02
* Last updated: June 29th, 2009. This notice must stay intact for usage 
* Author: JavaScript Kit at http://www.javascriptkit.com/
* Visit http://www.javascriptkit.com/script/script2/jScale/ for full source code
*/

//jQuery.noConflict();

var jkmegamenu = {

    effectduration: 300, //duration of animation, in milliseconds
    delaytimer: 200, //delay after mouseout before menu should be hidden, in milliseconds

    //No need to edit beyond here
    megamenulabels: [],
    megamenus: [], //array to contain each block menu instances
    zIndexVal: 1000, //starting z-index value for drop down menu
    $shimobj: null,

    addshim: function ($) {
        $(document.body).append('<IFRAME id="outlineiframeshim" src="' + (location.protocol == "https:" ? 'blank.htm' : 'about:blank') + '" style="display:none; left:0; top:0; z-index:999; position:absolute; filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)" frameBorder="0" scrolling="no"></IFRAME>')
        this.$shimobj = $("#outlineiframeshim")
    },

    alignmenu: function ($, e, megamenu_pos) {
        var megamenu = this.megamenus[megamenu_pos]
        var $anchor = megamenu.$anchorobj
        var $menu = megamenu.$menuobj
        var menuleft = ($(window).width() - (megamenu.offsetx - $(document).scrollLeft()) > megamenu.actualwidth) ? megamenu.offsetx : megamenu.offsetx - megamenu.actualwidth + megamenu.anchorwidth //get x coord of menu
        //var menutop=($(window).height()-(megamenu.offsety-$(document).scrollTop()+megamenu.anchorheight)>megamenu.actualheight)? megamenu.offsety+megamenu.anchorheight : megamenu.offsety-megamenu.actualheight
        var menutop = megamenu.offsety + megamenu.anchorheight  //get y coord of menu
        $menu.css({ left: menuleft + "px", top: menutop + "px" })
        this.$shimobj.css({ width: megamenu.actualwidth + "px", height: megamenu.actualheight + "px", left: menuleft + "px", top: menutop + "px", display: "block" })
    },

    showmenu: function (e, megamenu_pos) {
        var megamenu = this.megamenus[megamenu_pos]
        var $menu = megamenu.$menuobj
        var $menuinner = megamenu.$menuinner
        if ($menu.css("display") == "none") {
            this.alignmenu(jQuery, e, megamenu_pos)
            $menu.css("z-index", ++this.zIndexVal)
            $menu.show(this.effectduration, function () {
                $menuinner.css('visibility', 'visible')
            })
        }
        else if ($menu.css("display") == "block" && e.type == "click") { //if menu is hidden and this is a "click" event (versus "mouseout")
            this.hidemenu(e, megamenu_pos)
        }
        return false
    },

    hidemenu: function (e, megamenu_pos) {
        var megamenu = this.megamenus[megamenu_pos]
        var $menu = megamenu.$menuobj
        var $menuinner = megamenu.$menuinner
        $menuinner.css('visibility', 'hidden')
        this.$shimobj.css({ display: "none", left: 0, top: 0 })
        $menu.hide(this.effectduration)
    },

    definemenu: function (anchorid, menuid, revealtype) {
        this.megamenulabels.push([anchorid, menuid, revealtype])
    },

    render: function ($) {
        for (var i = 0, labels = this.megamenulabels[i]; i < this.megamenulabels.length; i++, labels = this.megamenulabels[i]) {
            if ($('#' + labels[0]).length != 1 || $('#' + labels[1]).length != 1) //if one of the two elements are NOT defined, exist
                return
            this.megamenus.push({ $anchorobj: $("#" + labels[0]), $menuobj: $("#" + labels[1]), $menuinner: $("#" + labels[1]).children('ul:first-child'), revealtype: labels[2], hidetimer: null })
            var megamenu = this.megamenus[i]
            megamenu.$anchorobj.add(megamenu.$menuobj).attr("_megamenupos", i + "pos") //remember index of this drop down menu
            megamenu.actualwidth = megamenu.$menuobj.outerWidth()
            megamenu.actualheight = megamenu.$menuobj.outerHeight()
            megamenu.offsetx = megamenu.$anchorobj.offset().left
            megamenu.offsety = megamenu.$anchorobj.offset().top
            megamenu.anchorwidth = megamenu.$anchorobj.outerWidth()
            megamenu.anchorheight = megamenu.$anchorobj.outerHeight()
            $(document.body).append(megamenu.$menuobj) //move drop down menu to end of document
            megamenu.$menuobj.css("z-index", ++this.zIndexVal).hide()
            megamenu.$menuinner.css("visibility", "hidden")
            megamenu.$anchorobj.bind(megamenu.revealtype == "click" ? "click" : "mouseenter", function (e) {
                var menuinfo = jkmegamenu.megamenus[parseInt(this.getAttribute("_megamenupos"))]
                clearTimeout(menuinfo.hidetimer) //cancel hide menu timer
                return jkmegamenu.showmenu(e, parseInt(this.getAttribute("_megamenupos")))
            })
            megamenu.$anchorobj.bind("mouseleave", function (e) {
                var menuinfo = jkmegamenu.megamenus[parseInt(this.getAttribute("_megamenupos"))]
                if (e.relatedTarget != menuinfo.$menuobj.get(0) && $(e.relatedTarget).parents("#" + menuinfo.$menuobj.get(0).id).length == 0) { //check that mouse hasn't moved into menu object
                    menuinfo.hidetimer = setTimeout(function () { //add delay before hiding menu
                        jkmegamenu.hidemenu(e, parseInt(menuinfo.$menuobj.get(0).getAttribute("_megamenupos")))
                    }, jkmegamenu.delaytimer)
                }
            })
            megamenu.$menuobj.bind("mouseenter", function (e) {
                var menuinfo = jkmegamenu.megamenus[parseInt(this.getAttribute("_megamenupos"))]
                clearTimeout(menuinfo.hidetimer) //cancel hide menu timer
            })
            megamenu.$menuobj.bind("click mouseleave", function (e) {
                var menuinfo = jkmegamenu.megamenus[parseInt(this.getAttribute("_megamenupos"))]
                menuinfo.hidetimer = setTimeout(function () { //add delay before hiding menu
                    jkmegamenu.hidemenu(e, parseInt(menuinfo.$menuobj.get(0).getAttribute("_megamenupos")))
                }, jkmegamenu.delaytimer)
            })
        } //end for loop
        if (/Safari/i.test(navigator.userAgent)) { //if Safari
            $(window).bind("resize load", function () {
                for (var i = 0; i < jkmegamenu.megamenus.length; i++) {
                    var megamenu = jkmegamenu.megamenus[i]
                    var $anchorisimg = (megamenu.$anchorobj.children().length == 1 && megamenu.$anchorobj.children().eq(0).is('img')) ? megamenu.$anchorobj.children().eq(0) : null
                    if ($anchorisimg) { //if anchor is an image link, get offsets and dimensions of image itself, instead of parent A
                        megamenu.offsetx = $anchorisimg.offset().left
                        megamenu.offsety = $anchorisimg.offset().top
                        megamenu.anchorwidth = $anchorisimg.width()
                        megamenu.anchorheight = $anchorisimg.height()
                    }
                }
            })
        }
        else {
            $(window).bind("resize", function () {
                for (var i = 0; i < jkmegamenu.megamenus.length; i++) {
                    var megamenu = jkmegamenu.megamenus[i]
                    megamenu.offsetx = megamenu.$anchorobj.offset().left
                    megamenu.offsety = megamenu.$anchorobj.offset().top
                }
            })
        }
        jkmegamenu.addshim($)
    }

}

jQuery(document).ready(function ($) {
    jkmegamenu.render($)
})