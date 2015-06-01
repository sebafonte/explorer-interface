
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
	//ctx.font = this.canvasSize + 5 + "px " + font;
	//ctx.fillText(character, 9, this.canvasSize - 15);

	ctx.font = this.canvasSize + 5 + "px " + font;
	ctx.fillText(character, 9, this.canvasSize);
		
	if (this.characterTextures == null) { this.characterTextures = {}; }
	this.characterTextures[character] = glContext.createTexture();
    handleLoadedTexture(this.characterTextures[character], canvas, glContext);
}

// Font object container
function FontStyle2(fontName, canvasSize) {
	this.font = fontName;  	
	this.characterTextures = {};
	this.canvasSize = canvasSize;
}

FontStyle2.prototype.initialize = function (glContext, htmlCanvas) {	
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

FontStyle2.prototype.createTexture = function (ctx, character, canvas, font, glContext) {
	ctx.fillStyle = "#FFFFFF"; 
	ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
	ctx.fillStyle = "#000000"; 
	
	ctx.font = 96 + "px " + font + " bold";
	ctx.fillText(character, 44, 80);
	
	//ctx.fillRect(0, 0, this.canvasSize, 2);
	//ctx.fillRect(0, 0, 2, this.canvasSize);
	//ctx.fillRect(0, 0, this.canvasSize, 1);
	
	ctx.lineWidth = 4;
	ctx.strokeStyle = 'black';
	ctx.strokeText(character, 44, 80);
	//ctx.strokeText(character, 0, this.canvasSize /* 90 */);
	
	if (this.characterTextures == null) { this.characterTextures = {}; }
	this.characterTextures[character] = glContext.createTexture();
    handleLoadedTexture(this.characterTextures[character], canvas, glContext);
}


// Font object container
function FontStyle3(list, canvasSize) {
	this.list = list; 
	this.characterTextures = {};
	this.canvasSize = canvasSize;
}

FontStyle3.prototype.initialize = function (glContext, htmlCanvas) {	
	var canvas = document.getElementById(htmlCanvas);
	var ctx = canvas.getContext('2d');
	canvas.width = this.canvasSize;
	canvas.height = this.canvasSize;

	for (var element in this.list) {
		this.createTextureFromCanvas(ctx, this.list[element], canvas, glContext);
	}
}

FontStyle3.prototype.createTextureFromCanvas = function (ctx, element, canvas, glContext) {
	var elementParts = element.split("-");	
	ctx.fillStyle = "#FFFFFF"; 
	ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);	
	var img = document.getElementById(element);
	ctx.drawImage(img, 0, 0);
	
	if (this.characterTextures == null) { this.characterTextures = {}; }
	this.characterTextures[element == "pvm-letter-espacio" ? " " : elementParts[2]] = glContext.createTexture();
    handleLoadedTexture(this.characterTextures[element == "pvm-letter-espacio" ? " " : elementParts[2]], canvas, glContext);
}