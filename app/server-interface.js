
function createFunctionGeneric(canvasId, arguments, message) {
	$.ajax({
			type : 'GET',
			url : message,
			data : arguments,
			dataType : "text",
			success : function(data) {
				var result = data.split("|");
				entitiesDictionary[canvasId] = result;
				if (result[0]=="default") 
					defaultError();
				else
					initWebGL(canvasId, result[1]);
			},
			error : function(data) {
				console.log('Call failed');
		}
	});
}