
function createFunctionGeneric(arguments, message, success) {
	$.ajax({
			type : 'GET',
			url : message,
			data : arguments,
			dataType : "text",
			success : success,
			error : function(data) {
				console.log('Call failed');
		}
	});
}
