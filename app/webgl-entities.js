
// Init functions
var squareVertexPositionBuffer;

function initWebGLBW(canvas, entity, entityType) {
    var canvas = document.getElementById(canvas);
	initGL(canvas);
	initBuffersBW();
	initShadersBW(entity)	
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.disable(gl.DEPTH_TEST);
}

function initBuffersBW() {
	squareVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	vertices = [
		 1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0,
		 1.0, -1.0,  0.0,
		-1.0, -1.0,  0.0
	];	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	squareVertexPositionBuffer.itemSize = 3;
	squareVertexPositionBuffer.numItems = 4;
}

function drawEntityImageBW() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT);
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, [0.0, 0.0, -1.2]);
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}

// VRP
var citiesVertexPositionBuffer;

function initWebGLVRP(parentId) {
    var canvas = document.getElementById(parentId);
	initGL(canvas);
	initBuffersVRP(parentId);
	initShadersVRP();	
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.disable(gl.DEPTH_TEST);
}

function initBuffersVRP(parentId) {
	citiesVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, citiesVertexPositionBuffer);
	var value = lispEditorValue(parentId, "(fitness-evaluator cities-description)");
	var value = replaceAll("(", "(", value);
	var value = replaceAll(")", " 0.0", value);
	var value = value.split(" ");
	pointsBuffer = [
		 1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0,
		 1.0, -1.0,  0.0,
		-1.0, -1.0,  0.0
	];	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	citiesVertexPositionBuffer.itemSize = 3;
	citiesVertexPositionBuffer.numItems = 4;
}

function drawEntityVRP (pointsBuffer) { 
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT);
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, [0.0, 0.0, -1.2]);		
	gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionLoc, pointsBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.uniformMatrix4fv(shaderProgram.pMatrixLoc, 0, pMatrix);		
	gl.drawArrays(gl.POINTS, 0, pointsBuffer.numItems);	
}

// Future draw functions
function drawEntityRGB () { 
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, [0.0, 0.0, -1.2]);
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}

function drawEntityImageVecColor() {
	
}
 
function drawTextureEntity () { 
	
}

