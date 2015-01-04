// sequencer
function TextSequencer () {
	this.parts = {};
	
	this.render = function () {};
	this.addPart = function (part) {};
}

function PartShadderEffect() {
	this.framentShaderSource = ;
}

function MovementEffect() {

}

function DisplacementEffect() {

}

function FromOutsideEffect() {

}

// part
function TextPart() {
	this.font = ;
	this.size = ;
	this.color = ;
	this.shaderEffect = ;
	this.movementEffect = ;
	this.text = "";
}

// init
var sequencer = new TextSequencer();
sequencer.addPart(new TextPart(font, effect, color));
sequencer.addPart(new TextPart(font, effect, color));
sequencer.addPart(new TextPart(font, effect, color));

// loop
{
var time = getTime();
sequencer.draw(time);
}
