// Global default vars
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var squareVertexPositionBuffer;
var shaderProgram;
var gl;
		
// Init functions
function initWebGL(canvas, entity) {
    var canvas = document.getElementById(canvas);
	initGL(canvas);
	initShaders(entity);
    initBuffers();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    drawEntity(entity, "entity-bw", canvas);
}

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} 
	catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL");
	}
}

function initBuffers() {
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

var myVertexShaderSrc =         
	"attribute vec3 aVertexPosition; " +
	"uniform mat4 uMVMatrix; " + 
	"uniform mat4 uPMatrix; " + 
	"varying float xx; " + 
	"varying float yy; " + 
	" " + 
	"void main(void) { " + 
	"	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 2.0); " + 
	"	xx = clamp(aVertexPosition.x,0.0,1.0); " + 
	"	yy = clamp(aVertexPosition.y,0.0,1.0); " + 
	"}";

var myFragmentShaderSrc =         
	"precision mediump float; " + 
	"varying vec4 vColor; " + 
	"varying float xx; " + 
	"varying float yy; " + 
	"" + 
	"float divideprotected(in float a, in float b) { if (b != 0.0) return a / b; else return 0.0; } " + 
	"float sqr(in float a) { return pow(a, 2.0); } " + 
	"" + 
	"void main(void) { " + 
	"	float x = xx * 10.0, y = yy * 10.0; " + 
	"	float v = VALUE; " +
	"	gl_FragColor = vec4(v, v, v, 1.0); " + 
	"}";

var myFragmentShaderRGBSrc =         
	"precision mediump float; " + 
	"varying vec4 vColor; " + 
	"varying float xx; " + 
	"varying float yy; " + 
	"" + 
	"float divideprotected(in float a, in float b) { if (b != 0.0) return a / b; else return 0.0; } " + 
	"float sqr(in float a) { return pow(a, 2.0); } " + 
	"" + 
	"float vecAbs(in float a) { return pow(a, 2.0); } " + 
	"float vecAbs(in vec3 a) { return 2.0; } " + 
	"" + 
	"void main(void) { " + 
	"	float x = xx * 10.0, y = yy * 10.0; " + 	
	"	float v = VALUE; " +
	"	gl_FragColor = vec4(v, v, v, 1.0); " + 
	"}";
/*
	vecColorMapA(
	vecCrop(
	vecAbs
	vecSin
	vecCos
	vecTan
	vecLog
	vecExp
	vecAdd
	vecMultiply
	vecDiv
	vecSubtract
*/

function initShaders(entity) {
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, myVertexShaderSrc);
	gl.compileShader(vertexShader);

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, myFragmentShaderSrc.replace("VALUE", entity.toLowerCase()));
	gl.compileShader(fragmentShader);

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders for " + entity);
	}

	gl.useProgram(shaderProgram);
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}
