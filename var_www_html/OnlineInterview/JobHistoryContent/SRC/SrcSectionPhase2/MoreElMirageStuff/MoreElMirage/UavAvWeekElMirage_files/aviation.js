/*
 Aviation Week Scripting
 LeapFrog Interactive.
 evitiello, 2006-11-10
*/
 
// switch tabs off and on.
//
function switchTabs(source, tabID, tabsClassName) {
	// source: the source of the event
	// the ID of the tab page to show
	// the className associatied with all of the tab pages
	
	// handle the tabs themselves.

       
	var kids = source.parentNode.parentNode.childNodes;
	// first, turn everyone off.
	for (i=0; i< kids.length; i++) {
		kids[i].className='inactive';
	}
	// then turnon the good one.
	source.parentNode.className = 'current';
	
	// get all of the tab pages
	var pages = getElementsByClassName(document, "div", tabsClassName);
	// hide all tabs.

	for (i=0; i<pages.length; i++) {

	if (pages[i].id !="theNewsTabs" && pages[i].id !="tabsRt" && pages[i].id !="leftTabs" && pages[i].id !="tabs300" && pages[i].id !="tabs400"){
		
		pages[i].style.display="none";
	}
	}
	// show the good tab
	var activePage = document.getElementById(tabID);
	//var activePage = document.getElementById("newsTabBkgrd02");

	activePage.style.display="block";
	
	// stop the href.
	return false;
}

// Clear the value from a field
//
function clearValue(source, originalValue) {
	if (originalValue == source.value) {
		source.value = "";
		source.style.color="black";
	}
}

// Get Elements by Class Name
//
function getElementsByClassName(oElm, strTagName, strClassName){
    var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
    var arrReturnElements = new Array();
    strClassName = strClassName.replace(/\-/g, "\\-");
    var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
    var oElement;
    for(var i=0; i<arrElements.length; i++){
        oElement = arrElements[i];      
        if(oRegExp.test(oElement.className)){
            arrReturnElements.push(oElement);
        }   
    }
    return (arrReturnElements)
}
function swapTabs(tabid){
						
	if (tabid=='tabBkgrd30001'){
	
		document.getElementById("tabBkgrd30001").style.display="";
		document.getElementById("tabBkgrd30002").style.display="none";
	}	
	if (tabid=='tabBkgrd30002'){
			document.getElementById("tabBkgrd30002").style.display="";
			document.getElementById("tabBkgrd30001").style.display="none";
		}
							
}
function swapWadTabs(tabid){
						
	if (tabid=='tabBkgrd40001'){
	
		document.getElementById("tabBkgrd40001").style.display="";
		document.getElementById("tabBkgrd40002").style.display="none";
	}	
	if (tabid=='tabBkgrd40002'){
			document.getElementById("tabBkgrd40002").style.display="";
			document.getElementById("tabBkgrd40001").style.display="none";
		}
							
}


