
function buildParameterList (arguments) {
	var result = "?";
	var flag = false;
	
	for (var key in arguments) { 
		if (flag) result += "&";
		flag = true;
		result += key;
		result += "=";
		result +=  encodeURIComponent(arguments[key]);
	} 
	
	return result;
}

