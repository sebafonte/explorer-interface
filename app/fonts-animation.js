
// Font object container
function FontStyle(fontName, canvasSize) {
	this.font = fontName;  	
	this.characterTextures = {};
	this.canvasSize = canvasSize;
}

FontStyle.prototype.initialize = function (glContext, htmlCanvas) {	
	var canvas = document.getElementById(htmlCanvas);
	var ctx = canvas.getContext('2d');
	canvas.width = this.canvasSize;
	canvas.height = this.canvasSize;
	
	// #TODO: Fix, this line should not be necessary
	this.createTexture(ctx, " ", canvas, this.font, glContext);
	for (var i=0; i< 256; i++) {
		this.createTexture(ctx, String.fromCharCode(i), canvas, this.font, glContext);
	}
}

FontStyle.prototype.createTexture = function (ctx, character, canvas, font, glContext) {
	ctx.fillStyle = "#FFFFFF"; 
	ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
	ctx.fillStyle = "#000000"; 
	// #TODO: Remove 7 and 9 hardcodes for 64 pixels value, they should become 0 when finished
	ctx.font = this.canvasSize + 5 + "px " + font;
	ctx.fillText(character, 9, this.canvasSize - 15);
			
	if (this.characterTextures == null) { this.characterTextures = {}; }
	this.characterTextures[character] = glContext.createTexture();
    handleLoadedTexture(this.characterTextures[character], canvas, glContext);
}
	