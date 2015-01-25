function Intro() {
	this.fontStyles = {};
}


Intro.prototype.initialize = function (glContext, textCanvas) {
	// Scene sequencer
	this.sequencer = new SceneSequencer();
	
	// Font styles
	var fontStyle = new FontStyle("Verdana", 128);
	fontStyle.initialize(glContext, textCanvas);
	this.fontStyles["logo"] = fontStyle;

	// Scene 1
	var effectX = "";
	var effectY = "";
	var fontTexture = "";
	var fontBorderTexture = "";
	var effectsLogo = new Array();
	effectsLogo[0] = new Fader(1.0, 10.0, 11.0);
	var effectsComment = new Array();
	effectsComment[0] = new Fader(5.0, 10.0, 11.0);
	var scene = new SceneObject();
	scene.logo = new TextObject(fontStyle, effectX, effectY, fontTexture, fontBorderTexture, effectsLogo);
	scene.comment = new TextObject(fontStyle, effectX, effectY, fontTexture, fontBorderTexture, effectsComment);
	this.sequencer.addScene(scene);
}

Intro.prototype.render = function (glContext) {
	//var time = getTime();
	this.sequencer.render(glContext);
}
