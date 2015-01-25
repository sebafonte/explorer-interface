 
function LabelsEffectObject () {
	this.objects = {};
} 

LabelsEffectObject.prototype.render = function (context) {
	for (var object in objects) {
		object.render(context);
	}
}