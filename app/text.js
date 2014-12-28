
var canvasSize = 64;
var characterTextures = {};
var squareVertexPositionBuffer;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var shaderProgram;
var gl;
var textLines = 20, textColumns = 20;


// Initialization
function initGL() {
	gl = canvas.getContext("experimental-webgl");
}

function initGLText() {
	var canvas = document.getElementById('textureCanvas');
	var ctx = canvas.getContext('2d');
	canvas.width = canvasSize;
	canvas.height = canvasSize;
	
	// #TODO: Fix, this line should not be necessary
	createTexture(ctx, " ", canvas);
	for (var i=0; i< 256; i++) {
		createTexture(ctx, String.fromCharCode(i), canvas);
	}
}

function createTexture(ctx, character, canvas) {
	ctx.fillStyle = "#FFFFFF"; 
	ctx.fillRect(0, 0, canvasSize, canvasSize);
	ctx.fillStyle = "#00FF00"; 
	ctx.fillRect(1, 1, canvasSize - 2, canvasSize - 2);
	ctx.fillStyle = "#000000"; 
	// #TODO: Remove 7 and 9 hardcodes for 64 pixels value, they should become 0 when finished
	ctx.fillText(character, 9, canvasSize - 7);
	ctx.font = canvasSize + "px Verdana";
	characterTextures[character] = gl.createTexture();
    handleLoadedTexture(characterTextures[character], canvas);
}

function handleLoadedTexture(texture, textureCanvas) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas); 
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function getPowerOfTwo(value, pow) {
	var pow = pow || 1;
	while(pow<value) { pow *= 2; }
	return pow;
}

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

// Drawing
function drawText(text, baseX, baseY, size) {
	var x = baseX;
	mat4.translate(mvMatrix, [baseX, baseY, 0.0]);
	setMatrixUniforms();
	for (var i=0; i< text.length; i++) {
		setMatrixUniforms();
		renderCharacter(text[i], x, baseY, size);
		mat4.translate(mvMatrix, [size, 0.0, 0.0]);
	}
}

function renderCharacter(character, x, y, size) {
	gl.bindTexture(gl.TEXTURE_2D, characterTextures[character]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}