
function hxOptionHtmlValues(values) {
	var htmlCode = "";
	var values = data.split(" ");
	
	for (var i=0; i< values.length; i++) {	
		htmlCode += "<option value=\"" + values[i] + "\">" + values[i] + "</option>";
	}
	
	return htmlCode;
}

//	This will parse and accept arguments in the form:
//		((property value) (property.property value) ...)
//  And constructs editors for numeric and lists, both required, and both are passed as strings and readed by lisp
//
function createEditorForProperties (parentId, data, propertiesData) {
	var editors = data.split("||");
	var htmlCode = "";
	var properties = propertiesData.split("_");
	
	for (var i=0; i< editors.length; i++) {
		if (editors[i] != "") {
			var propertyData = editors[i].split("|");
			var type = propertyData[1];
		
			/*
			// Numeric
			if ((type == "number") || (type == "integer") || (type == "float")) { htmlCode += createNumericProperty(parentId, propertyData); } 
			// Lists or code description on lists
			else if (type == "list-structure") { htmlCode += createSelectOptionProperty(parentId, propertyData); }
			// Warn not supported type
			else { console.log("Not supported property type " + type)}; */
			
			htmlCode += createLispEditor(parentId, propertyData, properties[i]);
		}
	}
	
	return htmlCode;
}

function createNumericProperty(parentId, data) {
	return createLispEditor(parentId, data);
}

// #NOTE #TODO:
function createSelectOptionProperty(parentId, data) {
	return createLispEditor(parentId, data);
}

function createLispEditor(parentId, data, propertyName) {
	var propertyNameReturned = data[0];
	var propertyId = replaceAll(" ", "-", propertyName.replace("(", "").replace(")", ""));
	var propertyValue = data[2];
	// #HARDCODE
	return 	"<div style=\"display: flex\">" + 
			"<p style=\"width: 130px\">" + propertyNameReturned.toLowerCase() + "<\p>" + 
			"<input style=\"max-width: 180px\"id=\"editor-" + parentId + "-" + propertyId.toLowerCase() + "\" value=\"" + propertyValue + "\"/ required></div>";
}

function propertiesFromEditors(parentId, data) {
	var properties = data.split("_");
	var result = "";
	
	for (var i=0; i< properties.length; i++) {
		if (properties[i] != "") {
			var propertyData = properties[i];
			var propertyId = replaceAll(" ", "-", propertyData.replace("(", "").replace(")", ""));		
			result += "(" + propertyData + " \"" + lispEditorValue(parentId, propertyId.toLowerCase(), i) + "\")";
		}
	}
	
	return result;
}

function lispEditorValue(parentId, propertyName) {
	var propertyId = replaceAll(" ", "-", propertyName.replace("(", "").replace(")", ""));
	var container = document.getElementById("editor-" + parentId + "-" + propertyId);
	return container.value;
}