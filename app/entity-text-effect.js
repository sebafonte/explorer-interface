 
function TextEffectObject (text) {
	this.text = text;
	this.shaderProgram = null;
	this.characterTextures = {};
	this.mvMatrix = mat4.create();
	this.pMatrix = mat4.create();
	this.squareVertexPositionBuffer = null;
	this.font = new FontStyle();
} 

TextEffectObject.prototype.render = function (gl) {
	var textLines = 3, textColumns = 3;
	
	// Set blend mode for drawing text
	gl.enable(gl.BLEND);
	gl.blendEquation(gl.FUNC_ADD);
	gl.blendFunc(gl.ONE_MINUS_CONSTANT_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	// Prepare to draw text
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	mat4.identity(pMatrix);
	mat4.ortho(0, textLines, 0, textColumns, 0.1, 100.0, pMatrix);
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, [0.0, 0.0, -1.0]);
	
	globalVa = timerValue();
	var location = gl.getUniformLocation(shaderProgram, "va");
	gl.uniform1f(location, globalVa);	
	location = gl.getUniformLocation(shaderProgram, "vb");
	gl.uniform1f(location, globalVb);	
	location = gl.getUniformLocation(shaderProgram, "vc");
	gl.uniform1f(location, globalVc);	
	location = gl.getUniformLocation(shaderProgram, "vd");
	gl.uniform1f(location, globalVd);
	location = gl.getUniformLocation(shaderProgram, "time");
	gl.uniform1f(location, timerValue());
	location = gl.getUniformLocation(shaderProgram, "wiggleAmount");
	gl.uniform1f(location, 0.02);
	
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.activeTexture(gl.TEXTURE0);
	
	// Draw text
	drawText(this.text, 0.0, 2.0 + testa, 1.0);
}

TextEffectObject.prototype.initialize = function (context) {
	this.initializeFont();
}

TextEffectObject.prototype.initializeFont = function (context) {
	var canvas = document.getElementById('textureCanvas');
	var ctx = canvas.getContext('2d');
	canvas.width = canvasSize;
	canvas.height = canvasSize;
}

function handleLoadedTexture(texture, textureCanvas, gl) {
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