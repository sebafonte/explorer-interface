
// Sequencer
function TextSequencer () {
	this.parts = {};
	this.addPart = function (part) {};
}

this.render = function () {
	
};

// Text effects and properties
function TextEffect() {

}

function MovementEffect() {
}

function DisplacementEffect() {
	this.prototype = MovementEffect;
}

function FromOutsideEffect() {
	this.prototype = MovementEffect;
}

function Centered () {
	this.prototype = MovementEffect;
	this.execute = function () {};
}

function Fader () {
	var start, end;
}

// Part
function TextObject(font, text, shader, color, movement) {
	this.font = font;
	this.size = 25;
	this.color = color;
	this.shaderEffect = shader;
	this.movementEffect = movement;
	this.text = text;
}