// Scene
function Scene () {
	this.objects = {};
}

Scene.prototype.render = function (context) {
	for (var object in objects) {
		object.render(context);
	}
}

// Scene object (abstract)
function SceneObject () {
	
}