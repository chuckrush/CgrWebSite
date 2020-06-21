/*
 Aviation Week Scripting
 LeapFrog Interactive.
 evitiello, 2006-11-10
*/
 

function switchHomeTabs(source, tabID, tabsClassName) {
	// source: the source of the event
	// the ID of the tab page to show
	// the className associatied with all of the tab pages
	// handle the tabs themselves.

	var kids = source.parentNode.parentNode.parentNode.childNodes;

	var unorderedList = document.getElementById('popularTabList');

	var listItems = unorderedList.childNodes;

	for(i=0; i<listItems.length; i++) {
		var temp = listItems[i];
		if(temp.nodeName!=null && temp.nodeName.toLowerCase()=="li") {
			var sourceId = "" + source.parentNode.id;
			var currentId = "" + temp.id;
			if(sourceId==currentId) {
				if(sourceId.toLowerCase()=="tabright2") {
					source.parentNode.style.background="transparent url(/media/images/ranks/popular_off.png) no-repeat scroll left top";
				} else {
					source.parentNode.style.background="transparent url(/media/images/ranks/tab_on.png) no-repeat scroll left top";
				}
				source.style.color="#E25C36";
			} else {
				if(currentId.toLowerCase()=="tabright2") {
					temp.style.background="transparent url(/media/images/ranks/popular_on.png) no-repeat scroll left top";
				} else {
					temp.style.background="transparent url(/media/images/ranks/rank_tab_off.png) no-repeat scroll left top";
				}
				var children = temp.childNodes;
				for(var childIndex=0; childIndex<children.length; childIndex++) {
					if(children[childIndex].nodeName!=null && children[childIndex].nodeName.toLowerCase()=="a") {
						children[childIndex].style.color="#224E9C";
					}
				}
				//temp.style.color="#224E9C";
			}
		}

	}
	
	// get all of the tab pages
	var pages = getElementsByClassName(document, "div", tabsClassName);
	
	// hide all tabs.
	
	for (i=0; i<pages.length; i++) {
	if (pages[i].id !="rankTabs" ){
		
		pages[i].style.display="none";
	}
	}
	// show the good tab
	var activePage = document.getElementById(tabID);
	activePage.style.display="block";

	source.style="active";
	
	//To track the activity in the tab
	try{
		//dcsMultiTrack('WT.dl',tabID);
		dcsMultiTrack('DCSext.ptab',tabID,'WT.dl','ptab','DCS.dcsuri','/populartabs/');
	}
	catch (e) {
		e.printStackTrace();
    	}
	
	// stop the href.
	return false;
}



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
	//alert("Pages length ->"+pages.length);
	for (i=0; i<pages.length; i++) {
//alert("1------ loop - pages.id ->"+pages[i].id);
	if (pages[i].id !="theNewsTabs" && pages[i].id !="tabsRt" && pages[i].id !="leftTabs" && pages[i].id !="tabs300" && pages[i].id !="tabs400"){
		
		pages[i].style.display="none";
	}
	}
	// show the good tab
	var activePage = document.getElementById(tabID);
	//var activePage = document.getElementById("newsTabBkgrd02");
//alert("Active Page ->"+activePage.id);
	activePage.style.display="block";
	
	// stop the href.
	return false;
}

function switchTabsEvents(source, tabID, tabsClassName) {
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
	source.parentNode.className = 'currentEvents';
	
	// get all of the tab pages
	var pages = getElementsByClassName(document, "div", tabsClassName);
	// hide all tabs.
	//alert("Pages length ->"+pages.length);
	for (i=0; i<pages.length; i++) {
//alert("1------ loop - pages.id ->"+pages[i].id);
	if (pages[i].id !="theNewsTabs" && pages[i].id !="tabsRt" && pages[i].id !="leftTabs" && pages[i].id !="tabs300" && pages[i].id !="tabs400"){
		
		pages[i].style.display="none";
	}
	}
	// show the good tab
	var activePage = document.getElementById(tabID);
	//var activePage = document.getElementById("newsTabBkgrd02");
//alert("Active Page ->"+activePage.id);
	activePage.style.display="block";
	
	// stop the href.
	return false;
}
function switchTabsTopics(source, tabID, tabsClassName) {
	// source: the source of the event
	// the ID of the tab page to show
	// the className associatied with all of the tab pages
	// handle the tabs themselves.
//alert("calling js");
     	var kids = source.parentNode.parentNode.childNodes;
	// first, turn everyone off.
	for (i=0; i< kids.length; i++) {
		kids[i].className='inactive';
	}
	
	source.parentNode.className = 'currentTopics';
	
	
	var pages = getElementsByClassName(document, "div", tabsClassName);
	
	for (i=0; i<pages.length; i++) {
	if (pages[i].id !="theNewsTabs" && pages[i].id !="tabsRt" && pages[i].id !="leftTabs" && pages[i].id !="tabs300" && pages[i].id !="tabs400"){
		
		pages[i].style.display="none";
	}
	}
	// show the good tab
	var activePage = document.getElementById(tabID);
	
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


