  
function SceneSequencer () {
	this.scenes = [];
} 

// #TEMP CODE
SceneSequencer.prototype.render = function (context) {
	var sceneNumber = 0;
	this.scenes[sceneNumber].render(context);
}

SceneSequencer.prototype.addScene = function (scene) {
	this.scenes[this.scenes.length] = scene;
}