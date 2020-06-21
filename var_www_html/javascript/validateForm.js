function validateForm() {
    var error_message = "";
	// Check listening location name
	var location_name = document.forms["cgrMapEntryForm"]["ListeningLocationLabel"].value;
	if (location_name.length > 32) {
		error_message = error_message.concat("Value entered for listening location name exceeds max length of 32 characters");
	}

	// Check latitude
	var lat_degrees = document.forms["cgrMapEntryForm"]["LatitudeDegrees"].value;
	if ( isNaN(lat_degrees) || (lat_degrees > 90.0) || (lat_degrees < -90.0) || (lat_degrees.length == "0") ) {
		error_message = error_message.concat("Value entered for latitude, (" + lat_degrees + "), is not valid" + "\r\n");
	}
	// Check longitude
	var lon_degrees = document.forms["cgrMapEntryForm"]["LongitudeDegrees"].value;
    if (isNaN(lon_degrees) || (lon_degrees > 180.0) || (lon_degrees < -180.0) || (lon_degrees.length == "0") ) {
		error_message = error_message.concat("Value entered for longitude, (" + lon_degrees + "), is not valid" + "\r\n");
	}

	// Let user know if there was a problem
	if (error_message === "") {
		return true;
	}
	else {
		alert(error_message);
		return false;
	}
}
