/**
  Browser Checker - isIE()
*/
function isIE() {
	if (navigator.appName.indexOf("Microsoft Internet Explorer") != -1) { return true; }
	else { return false; }
}

/**
  Basic Toggle Div - toggle()
  
  @requires
  isIE()
  
  @arguments
  id - the id of the DOM object you wish to toggle
*/
function toggle(id) {
	var e = document.getElementById(id);
	var d = "block";
	if (!isIE()) {
		if (e.insertRow) { d = "table"; }
		else if (e.insertCell) { d = "table-row"; }
	}
	if (e.style.display == "none" || e.style.display == "") { e.style.display = d; }
	else { e.style.display = "none"; }
	return;
}

/**
  Clears input fields of default values. - clearField()
  Usage Example: <input type="text" name="name_from" value="Name" onfocus="clearField(this,'Name')" onblur="fillField(this,'Name')" />
  
  @requires
  none
  
  @arguments
  field - the DOM object whose value you wish to clear (will almost always be the self-reference of this)
  text - the default text of the field
*/
function clearField(field, text) {
	if (field.value == text) { field.value = ""; }
	return;
}

/**
  Fills input fields with default value if blank.
  
  @requires
  isblank()
  
  @arguments
  field - the DOM object whose value you wish to fill (will almost always be the self-reference of this)
  text - the default text of the field
*/
function fillField(field, text) {
	if (isblank(field.value)) { field.value = text; }
	return;
}

// Finds if a string is blank (nothing but spaces)
function isblank(x) {
	var blank = true;
	for (i = 0; i < x.length; i    ) {
		if (x.charAt(i) != ' ') { blank = false; }
	}
	return blank;
}

// Finds if a form value is empty
function isempty(x) {
	if (x == "" || isblank(x)) { return true; }
	else { return false; }
}

// Finds if a select box has not been changed
function unchanged(x) {
	if (x.selectedIndex == 0) { return true; }
	else { return false; }
}


/* 
	Clean Form Validation was written from scratch by Marc Grabanski
// http://marcgrabanski.com/code/clean-form-validation
/* Under the Creative Commons Licence http://creativecommons.org/licenses/by/3.0/
	Share or Remix it but please Attribute the authors. */

var cleanValidator = {
	init: function (settings) {
		this.settings = settings;
		this.form = document.getElementById(this.settings["formId"]);
		formInputs = this.form.getElementsByTagName("input");
		
		// change color of inputs on focus
		for(i=0;i<formInputs.length;i++)
		{
			if(formInputs[i].getAttribute("type") != "submit") {
				input = formInputs[i];
				input.style.background = settings["inputColors"][0];
				input.onblur = function () {
					this.style.background = settings["inputColors"][0];
				}
				input.onfocus = function () {
					this.style.background = settings["inputColors"][1];
				}
			}
		};
		this.form.onsubmit = function () {
			error = cleanValidator.validate();
			if(error.length < 1) {
				return true;
			} else {
				cleanValidator.printError(error);
				return false;
			}
		};
	},
	validate: function () {
		error = '';
		validationTypes = new Array("isRequired", "isEmail", "isNumeric");
		for(n=0; n<validationTypes.length; n++) {
			var x = this.settings[validationTypes[n]];
			if(x != null) {
				for(i=0; i<x.length; i++) 
				{
					inputField = document.getElementById(x[i]);
					switch (validationTypes[n]) {
						case "isRequired" :
						valid = !isRequired(inputField.value);
						errorMsg = "is a required field.";
						break;
						case "isEmail" :
						valid = isEmail(inputField.value);
						errorMsg = "is an invalid email address.";
						break;
						case "isNumeric" :
						valid = isNumeric(inputField.value);
						errorMsg = "can only be a number.";
						break;
					}
					if(!valid) {
						error += x[i]+" "+errorMsg+"\n";
						inputField.style.background = this.settings["errorColors"][0];
						inputField.style.border = "1px solid "+this.settings["errorColors"][1];
					} else {
						inputField.style.background = this.settings["inputColors"][0];
						inputField.style.border = '1px solid';
					}
				}
			}
		}
		return error;
	},
	printError: function (error) {
    var objElement = document.getElementById("form_error");
    objElement.style.display = "inline";
	}
};

// returns true if the string is not empty
function isRequired(str){
	return (str == null) || (str.length == 0);
}
// returns true if the string is a valid email
function isEmail(str){
	if(isRequired(str)) return false;
	var re = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i
	return re.test(str);
}
// returns true if the string only contains characters 0-9 and is not null
function isNumeric(str){
	if(isRequired(str)) return false;
	var re = /[\D]/g
	if (re.test(str)) return false;
	return true;
}