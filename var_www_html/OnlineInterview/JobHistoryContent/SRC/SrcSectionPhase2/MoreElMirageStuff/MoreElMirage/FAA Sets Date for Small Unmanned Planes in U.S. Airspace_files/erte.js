// Extended RTE 1.2 for SharePoint
// Created By Boris Gomiunik 
// Please visit my Blog to find more tricks for SharePoint: http://boris.gomiunik.net
// More info about ERTE on http://boris.gomiunik.net/erte
// Project posted on CodePlex -- http://www.codeplex.com/erte

///Settings:
//imagePath - enter the RTE Toolbar button icon if location is different than the one below
var imagePath="/_catalogs/masterpage/erte.gif"

//Localization arrays. To localize, copy the line below and change the LCID.
var erte1033 = new Array("Please input details","Alt Text","This will be displayed in RSS feeds","Embed Code","Paste your Embed code here","Insert","Close"); //english
var erte1060 = new Array("Vnesite parametre","Besedilo","Besedilo bo izpisano v RSS-viru","Embed koda","Prilepite Embed kodo v polje","Vstavi","Zapri"); //english
var erte1036 = new Array("Parametres de configuration","Texte de remplacement","Ce texte sera affiche dans le flux RSS a la place de l'objet insere.","Code Embed","Coller le code HTML de l'object ici.","Inserer","Fermer"); //French - thanks to Slash71

/*-------------No need to edit below this line------------------*/

//set the language. If there is no localization array available, use english as default
if (window['erte'+L_Menu_LCID]) {
	erte_lang = window['erte'+L_Menu_LCID];
} 
else {
	erte_lang = window['erte1033']  
}

//this is the function that generates the "Insert Flash" dialog.
function embedFlash(gb_whichElement) {
  while (gb_whichElement.id.indexOf('_toolbar') == -1) {
  	gb_whichElement = gb_whichElement.parentNode;
  }
  fieldID = gb_whichElement.id;
  fieldID = fieldID.substring(0,fieldID.indexOf('_toolbar'));
  RTE_SaveSelection(fieldID);
  var generator=window.open('','question','height=300,width=300,scrollbar=no,menu=no,toolbar=no,status=no,location=no');
  generator.document.write('<html><head><title>'+erte_lang[0]+'</title>' + 
  '<script type="text/javascript">function insertFlash() { \n' + 
  'var finalString = "<span class=erte_embed id=" \n' + 
  'var embedCode = document.getElementById("embed").innerText; \n' + 
  'if(embedCode.indexOf("<object") != -1) { \n' + 
  '	embedCode = embedCode.substring(embedCode.indexOf("<embed")); \n' + 
  '	embedCode = embedCode.substring(0, embedCode.indexOf("</embed>")+8); \n' + 
  '} \n' + 
  'finalString += escape(embedCode) \n' + 
  'finalString += ">" \n' + 
  'finalString += document.getElementById("alt").value\n' + 
  'finalString += "</span>"\n' +
  'window.opener.document.getElementById("' + fieldID + '_iframe").focus();' + 
  'window.opener.RTE_GetSelection(document.getElementById("field").value).pasteHTML(finalString)\n' + 
  'window.close()\n;' +
  '}'+"<\/script>" +
  '</head><body style="margin:10px; font-family: verdana; font-size: 10px;">' + 
  '<strong>'+erte_lang[1]+':</strong> <input id="alt" type="text" style="border: 1px black solid; width: 200px; font-family: verdana; font-size: 10px;"/><br/><span style="color: gray">('+erte_lang[2]+')</span>' + 
  '<br/> <br/><strong>'+erte_lang[3]+':</strong><br/>' + 
  '<textarea id="embed" style="width: 250px; height: 100px; border: 1px black solid; font-family: verdana; font-size: 10px;"></textarea>' + 
  '<br/><span style="color: gray">('+erte_lang[4]+')</span><br/>' +
  '<input type="hidden" id="field" value="'+fieldID+'"' + 
  '<br/> <br/><button style="font-family: verdana; font-size: 10px;" onclick="insertFlash()">'+erte_lang[5]+'</button>' +
  '&nbsp;&nbsp;<button style="font-family: verdana; font-size: 10px;" onclick="window.close()">'+erte_lang[6]+'</button>' + 
  '</body></html>');
  generator.document.close();
}

function embedVideos() 
{
/* --- This part here adds the button --- */
	objekty = document.getElementsByTagName('table');
	for (i=0;i<objekty.length;i++) {
		if (objekty[i].className == 'ms-rtetoolbarmenu ms-long' && objekty[i].childNodes[0].childNodes.length == 2) {
			var newCell = objekty[i].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].insertCell();
			newCell.setAttribute('unselectable', 'on');
			newCell.setAttribute('class', 'ms-rtetoolbarmenu');
			newCell.innerHTML = '<a href="javascript:" unselectable="on" onclick="embedFlash(this); return false"><img unselectable="on" border="0" src="' + imagePath + '"/></a>'
		}
	}

/* --- This part will render the display --- */
	objekty2 = document.getElementsByTagName('span');
	for (i=0;i<objekty2.length;i++) {
		if (objekty2[i].className == 'erte_embed') {
			objekty2[i].innerHTML = unescape(objekty2[i].id)
		}
	}
}

if (window['_spBodyOnLoadFunctionNames']) {
	_spBodyOnLoadFunctionNames.push("embedVideos");
}
else { embedVideos() }