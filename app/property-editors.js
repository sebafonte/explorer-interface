
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
function createEditorForProperties (parentId, data, propertiesData, disabledProperties) {
	var editors = data.split("||");
	var properties = propertiesData.split("_");
	var htmlCode = "";
	var disabled = disabledProperties.split("_");
	
	for (var i=0; i< editors.length; i++) {
		if (editors[i] != "") {
			var propertyData = editors[i].split("|");
			var type = propertyData[1];
			htmlCode += createLispEditor(parentId, propertyData, properties[i], disabled);
		}
	}
	
	return htmlCode;
}

/*
function createNumericProperty(parentId, data) {
	return createLispEditor(parentId, data);
}

function createSelectOptionProperty(parentId, data) {	
	return createLispEditor(parentId, data);
}
*/

function createLispEditor(parentId, data, propertyName, disabledProperties) {	
	var propertyNameReturned = data[0];
	var propertyId = replaceAll(" ", "-", propertyName.replace("(", "").replace(")", ""));
	var propertyValue = data[2];
	var disabled = disabledProperties.indexOf(propertyName) >= 0;
	var disabledText = "";
	
	// #HARDCODE on style part
	if (disabled) disabledText = "disabled";
	return 	"<div style=\"display: flex; height: 30px;\">" + 
			"<p style=\"width: 130px\">" + propertyNameReturned.toLowerCase() + "<\p>" + 
			"<input style=\"max-width: 180px\"id=\"editor-" + parentId + "-" + propertyId.toLowerCase() + "\" value=\"" + propertyValue + "\"/ " + disabledText + " required></div>";
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

function updateEditorsValue(parentId, data, properties) {
	var properties = properties.split("_");
	var values = data.split("|");
	
	for (var i=0; i< properties.length; i++) {
		if (properties[i] != "") {
			var propertyData = properties[i];
			var propertyId = replaceAll(" ", "-", propertyData.replace("(", "").replace(")", ""));		
			document.getElementById("editor-" + parentId + "-" + propertyId).value = values[i];
		}
	}
}

function lispEditorValue(parentId, propertyName) {
	var propertyId = replaceAll(" ", "-", propertyName.replace("(", "").replace(")", ""));
	var container = document.getElementById("editor-" + parentId + "-" + propertyId);
	return container.value;
}

function lispEditorSetValue(parentId, propertyName, value) {
	var propertyId = replaceAll(" ", "-", propertyName.replace("(", "").replace(")", ""));
	var container = document.getElementById("editor-" + parentId + "-" + propertyId);
	container.value = value;
}