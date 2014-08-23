
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
//
//  And constructs editors for numeric and lists, both required, and both are passed as strings and readed by lisp
function createEditorForProperties (parentId, data) {
	var editors = data.split("||");
	var htmlCode = "";
	
	for (var i=0; i< editors.length; i++)
	{
		var propertyData = editors[i].split("|");
		var type = propertyData[1];
		
		// Numeric
		if (type == "number") { htmlCode += createNumericProperty(parentId, propertyData); } 
		// Lists or code description on lists
		else if (type == "list") { htmlCode += createSelectOptionProperty(parentId, propertyData); }
		// Warn not supported type
		else { console.log("Not supported property type " + type)};
	}

	return htmlCode;
}

function createNumericProperty(parentId, data) {
	return createLispEditor(parentId, data);
}

// #NOTE #TODO: Things like '(fitness-evaluators (fitness-evaluator-1 fitness-evaluator-2)) are going to be in a select html tag soon
function createSelectOptionProperty(parentId, data) {
	return createLispEditor(parentId, data);
}

function createLispEditor(parentId, data) {	
	var propertyName = data[0];
	var propertyValue = data[2];
	return 	"<div style=\"display: flex\">" + 
			"<p style=\"width: 110px\">" + propertyName + "<\p>" + 
			"<input style=\"max-width: 100px\"id=\"editor-" + parentId + "-" + propertyName + "\" value=\"" + propertyValue.toString() + "\"/></div>";
}
