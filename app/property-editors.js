

function hxOptionHtmlValues(values) {
	var htmlCode = "";
	var values = data.split(" ");
	
	for (var i=0; i< values.length; i++) {	
		htmlCode += "<option value=\"" + values[i] + "\">" + values[i] + "</option>";
	}
	return htmlCode;
}