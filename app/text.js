
var canvasSize = 128;
var characterTextures = {};
var squareVertexPositionBuffer;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var shaderProgram;
var gl;


// Initialization
function initGLText(canvasName, font) {
	var canvas = document.getElementById('textureCanvas');
	var ctx = canvas.getContext('2d');
	canvas.width = canvasSize;
	canvas.height = canvasSize;
	
	// #TODO: Fix, this line should not be necessary
	createTexture(ctx, " ", canvas, font, canvasName);
	for (var i=0; i< 256; i++) {
		createTexture(ctx, String.fromCharCode(i), canvas, font, canvasName);
	}
}

function createTexture(ctx, character, canvas, font, canvasName) {
	var gl = glContexts[canvasName];
	ctx.fillStyle = "#FFFFFF"; 
	ctx.fillRect(0, 0, canvasSize, canvasSize);
	ctx.fillStyle = "#000000"; 
	// #TODO: Remove 7 and 9 hardcodes for 64 pixels value, they should become 0 when finished
	ctx.font = canvasSize + 5 + "px " + font;
	ctx.fillText(character, 9, canvasSize - 15);
			
	if (characterTextures[canvasName] == null) { characterTextures[canvasName] = {}; }
	characterTextures[canvasName][character] = gl.createTexture();
    handleLoadedTexture(characterTextures[canvasName][character], canvas, canvasName);
}

function handleLoadedTexture(texture, textureCanvas, canvasName) {
	var gl = glContexts[canvasName];
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas); 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function setMatrixUniformsText(canvasName) {
	var shaderProgram = shaderPrograms[canvasName];
	var gl = glContexts[canvasName];
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

// Drawing
function drawText(text, baseX, baseY, size, canvasName) {
	var x = baseX;
	mat4.translate(mvMatrix, [baseX, baseY, 0.0]);
	setMatrixUniformsText(canvasName);
	for (var i=0; i< text.length; i++) {
		setMatrixUniformsText(canvasName);
		renderCharacter(text[i], x, baseY, size, canvasName);
		mat4.translate(mvMatrix, [size, 0.0, 0.0]);
	}	
}

function renderCharacter(character, x, y, size, canvasName) {
	var gl = glContexts[canvasName];
	var shaderProgram = shaderPrograms[canvasName];
	gl.bindTexture(gl.TEXTURE_2D, characterTextures[canvasName][character]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}