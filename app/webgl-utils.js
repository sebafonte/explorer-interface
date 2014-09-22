// Global default vars
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var shaderProgram;
var gl;


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

var myVertexShaderSrc =         
	"attribute vec3 aVertexPosition; " +
	"uniform mat4 uMVMatrix; " + 
	"uniform mat4 uPMatrix; " + 
	"varying float xx, yy; " + 
	" " + 
	"void main(void) { " + 
	"	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 2.0); " + 
	"	xx = clamp(aVertexPosition.x,0.0,1.0); " + 
	"	yy = clamp(aVertexPosition.y,0.0,1.0); " + 
	"}";

var myFragmentShaderSrc =         
	"precision mediump float; " + 
	"varying vec4 vColor; " + 
	"varying float xx, yy; " + 
	"" + 
	"float divideprotected(in float a, in float b) { if (b != 0.0) return a / b; else return 0.0; } " + 
	"float sqr(in float a) { return pow(a, 2.0); } " + 
	"" + 
	"void main(void) { " + 
	"	float x = xx * 10.0, y = yy * 10.0; " + 
	"	float v = VALUE; " +
	"	gl_FragColor = vec4(v, v, v, 1.0); " + 
	"}";

function initShadersBW(entity) {
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

var noiseShaderFunction =
	"vec3 lerp(vec4 a, vec4 b, float s) { return vec3(a + (b - a) * s); } " + 
	"" + 
	"float noise(vec3 x) { " + 
	"   vec3 p = floor(x); " + 
	"   vec3 f = frac(x); " + 
	"   f = f*f*(3.0-2.0*f); " + 
	"   float n = p.x + p.y*57.0 + 113.0*p.z; " + 
	"   return lerp(lerp(lerp( hash(n+0.0), hash(n+1.0),f.x), lerp( hash(n+57.0), hash(n+58.0),f.x),f.y), lerp(lerp( hash(n+113.0), hash(n+114.0),f.x), lerp( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z); " + 
	"} " + 
	"" + 
	"vec3 vecnoise(vec3 x) { float v = noise(x); return vec3(v, v, v); }; ";

var diffuseShaderFunction =
	"vec3 vecdiffuse(vec3 a, vec3 b, vec3 c) { vec3(mix(a.x, b.x, c.x), mix(a.y, b.y, c.y), mix(a.z, b.z, c.z)); }; ";

// RGB
var myFragmentShaderRGBSrc =
	"precision mediump float; " + 
	"varying vec4 vColor; " + 
	"varying float xx; " + 
	"varying float yy; " + 
	"" + 
	"vec3 veccos(in vec3 a) { return vec3(cos(a.x), cos(a.y), cos(a.z)); } " + 
	"vec3 vecsin(in vec3 a) { return vec3(sin(a.x), sin(a.y), sin(a.z)); } " + 
	"vec3 vectan(in vec3 a) { return vec3(tan(a.x), tan(a.y), tan(a.z)); } " + 
	"vec3 vecabs(in vec3 a) { return vec3(abs(a.x), abs(a.y), abs(a.z)); } " + 
	"vec3 vecsqr(in vec3 a) { return vec3(a.x * a.x, a.y * a.y, a.z * a.z); } " + 
	"" + 
	"vec3 vecadd(in vec3 a, in vec3 b) { return vec3(a.x + b.x, a.y + b.y, a.z + b.z); } " + 
	"vec3 vecsubstract(in vec3 a, in vec3 b) { return vec3(a.x - b.x, a.y - b.y, a.z - b.z); } " + 
	"vec3 vecmultiply(in vec3 a, in vec3 b) { return vec3(a.x * b.x, a.y * b.y, a.z * b.z); } " + 
	"vec3 vecdiv(in vec3 a, in vec3 b) { return vec3(a.x / b.x, a.y / b.y, a.z / b.z); } " + 
	"vec3 createvector(in float a, in float b, in float c) { return vec3(a, b, c); } " + 
	"vec3 veccolormap(in vec3 a, in vec3 b, in vec3 c) { return createvector(a.x / 10.0, b.x / 10.0, c.x / 10.0); } " + 
	"" + 
	"void main(void) { " + 
	"	float x = xx * 10.0, y = yy * 10.0; " + 	
	"	vec3 v = VALUE; " +
	"	gl_FragColor = vec4(v.x, v.y, v.z, 1.0); " + 
	"}";
	
function initShadersRGB(entity) {
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, myVertexShaderSrc);
	gl.compileShader(vertexShader);

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, myFragmentShaderRGBSrc.replace("VALUE", entity.toLowerCase()));
	gl.compileShader(fragmentShader);

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders for " + entity);
	}

	gl.useProgram(shaderProgram);
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

// VRP
var myVertexShaderVRPSrc =
	"   attribute vec3 aVertexPosition; " + 
	"   uniform mat4 uPMatrix; " + 
	"   void main(void) { " + 
	"    	gl_PointSize = 2.0; " + 
	"       gl_Position = uPMatrix * vec4(aVertexPosition, 1.0); " + 
	"    }";
	
var myFragmentShaderVRPSrc =         
	"precision mediump float;" + 
	"	void main(void) { " + 
	"       gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); " + 
	"   } ";	
	
function initShadersVRP() {
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, myVertexShaderSrc);
	gl.compileShader(vertexShader);

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, myFragmentShaderVRPSrc);
	gl.compileShader(fragmentShader);

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders for " + entity);
	}

	gl.useProgram(shaderProgram)
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

// RGB animated
var myVertexShaderRGBAnimatedSrc = 
	"attribute vec3 aVertexPosition; " +
	"uniform mat4 uMVMatrix; " + 
	"uniform mat4 uPMatrix; " + 
	"varying float xx, yy; " + 
	" " + 
	"void main(void) { " + 
	"	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 2.0); " + 
	"	xx = clamp(aVertexPosition.x,0.0,1.0); " + 
	"	yy = clamp(aVertexPosition.y,0.0,1.0); " + 
	"}";

var myFragmentShaderRGBAnimateSrc =
	"precision mediump float; " + 
	"uniform float time; " + 
	"varying vec4 vColor; " + 
	"varying float xx; " + 
	"varying float yy; " + 
	"" + 
	"vec3 veccos(in vec3 a) { return vec3(cos(a.x), cos(a.y), cos(a.z)); } " + 
	"vec3 vecsin(in vec3 a) { return vec3(sin(a.x), sin(a.y), sin(a.z)); } " + 
	
	"vec3 vectan(in vec3 a) { return vec3(tan(a.x), tan(a.y), tan(a.z)); } " + 
	"vec3 vecabs(in vec3 a) { return vec3(abs(a.x), abs(a.y), abs(a.z)); } " + 
	"vec3 vecsqr(in vec3 a) { return vec3(a.x * a.x, a.y * a.y, a.z * a.z); } " + 
	"" + 
	"vec3 vecadd(in vec3 a, in vec3 b) { return vec3(a.x + b.x, a.y + b.y, a.z + b.z); } " + 
	"vec3 vecsubstract(in vec3 a, in vec3 b) { return vec3(a.x - b.x, a.y - b.y, a.z - b.z); } " + 
	"vec3 vecmultiply(in vec3 a, in vec3 b) { return vec3(a.x * b.x, a.y * b.y, a.z * b.z); } " + 
	"vec3 vecdiv(in vec3 a, in vec3 b) { return vec3(a.x / b.x, a.y / b.y, a.z / b.z); } " + 
	"vec3 createvector(in float a, in float b, in float c) { return vec3(a, b, c); } " + 
	"vec3 veccolormap(in vec3 a, in vec3 b, in vec3 c) { return createvector(a.x / 10.0, b.x / 10.0, c.x / 10.0); } " + 
	"" + 
	"void main(void) { " + 
	"	float x = xx * 10.0, y = yy * 10.0; " + 	
	"	vec3 v = VALUE; " +
	"	gl_FragColor = vec4(v.x, v.y, v.z, 1.0); " + 
	"}";
	
function initShadersRGBAnimate(entity) {
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, myVertexShaderRGBAnimatedSrc);
	gl.compileShader(vertexShader);

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, myFragmentShaderRGBAnimateSrc.replace("VALUE", entity.toLowerCase()));
	gl.compileShader(fragmentShader);

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders for " + entity);
	}

	gl.useProgram(shaderProgram);
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

// Animated interpolation
var myFragmentShaderRGBAnimateInterpolateSrc =
	"precision mediump float; " + 
	"uniform float time; " + 
	"varying vec4 vColor; " + 
	"varying float xx; " + 
	"varying float yy; " + 
	"" + 
	"vec3 veccos(in vec3 a) { return vec3(cos(a.x), cos(a.y), cos(a.z)); } " + 
	"vec3 vecsin(in vec3 a) { return vec3(sin(a.x), sin(a.y), sin(a.z)); } " + 
	
	"vec3 vectan(in vec3 a) { return vec3(tan(a.x), tan(a.y), tan(a.z)); } " + 
	"vec3 vecabs(in vec3 a) { return vec3(abs(a.x), abs(a.y), abs(a.z)); } " + 
	"vec3 vecsqr(in vec3 a) { return vec3(a.x * a.x, a.y * a.y, a.z * a.z); } " + 
	"" + 
	"vec3 vecadd(in vec3 a, in vec3 b) { return vec3(a.x + b.x, a.y + b.y, a.z + b.z); } " + 
	"vec3 vecsubstract(in vec3 a, in vec3 b) { return vec3(a.x - b.x, a.y - b.y, a.z - b.z); } " + 
	"vec3 vecmultiply(in vec3 a, in vec3 b) { return vec3(a.x * b.x, a.y * b.y, a.z * b.z); } " + 
	"vec3 vecdiv(in vec3 a, in vec3 b) { return vec3(a.x / b.x, a.y / b.y, a.z / b.z); } " + 
	"vec3 createvector(in float a, in float b, in float c) { return vec3(a, b, c); } " + 
	"vec3 veccolormap(in vec3 a, in vec3 b, in vec3 c) { return createvector(a.x / 10.0, b.x / 10.0, c.x / 10.0); } " + 
	"FUNCTIONS" + 
	+ 
	"void main(void) { " + 
	" 	float a = mod(time, 10.0); " + 
	" 	float index = div(time, 10.0); " + 
	"	vec3 va, vb; " + 
	"	VALUE " +	
	"	gl_FragColor = vec4(va.x * a + vb.x * (1.0 - a), va.y * a + vb.y * (1.0 - a), va.z * a + vb.z * (1.0 - a), 1.0); " + 
	"}";
	
function initShadersRGBInterpolatedAnimate(entity) {
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, myVertexShaderRGBAnimatedSrc);
	gl.compileShader(vertexShader);

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	
	var code = "if (false) {} ", functions = "";
	for (var i=0; i< entity.values.size; i++) {
		functions += "vec3 f" + i + " (in float ) {	float x = xx * 10.0, y = yy * 10.0; return " + entity.values[i]; + "} ";
		code += "else if (index < " + i + ".0) { va = f" + i + "(); vb = f" + (i + 1) + "(); }"
	}
	
	var withFunctions = myFragmentShaderRGBAnimateInterpolateSrc.replace("FUNCTIONS", functions.toLowerCase())
	var withIfs = withFunctions.replace("VALUE", code.toLowerCase())
	gl.shaderSource(fragmentShader, withIfs);
	gl.compileShader(fragmentShader);

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders for " + entity);
	}

	gl.useProgram(shaderProgram);
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}
		
function copyImageDataToHTML5Canvas(canvasID) {
	var c = document.getElementById(canvasID);
	var ctx = c.getContext("2d");
	var imgData=ctx.createImageData(c.width, c.height);
	var pixels = new Uint8Array(c.width * c.height * 4); // 320x240 RGBA image
	gl.readPixels(0, 0, c.width, c.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

	imgData.data = pixels;

	for (var i=0;i<imgData.data.length;i+=4)
	{
	  imgData.data[i+0]=pixels[i];
	  imgData.data[i+1]=pixels[i+1];
	  imgData.data[i+2]=255;//pixels[i+2];
	  imgData.data[i+3]=255;pixels[i+3];
	}
		
	ctx.putImageData(imgData,0,0);
}

// RGB vector sound
var myVertexShaderRGBAnimatedSoundSrc = 
	"attribute vec3 aVertexPosition; " +
	"uniform mat4 uMVMatrix; " + 
	"uniform mat4 uPMatrix; " + 
	"varying float xx, yy; " + 
	" " + 
	"void main(void) { " + 
	"	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 2.0); " + 
	"	xx = clamp(aVertexPosition.x,0.0,1.0); " + 
	"	yy = clamp(aVertexPosition.y,0.0,1.0); " + 
	"}";

var myFragmentShaderRGBAnimateSoundSrc =
	"precision mediump float; " + 
	"uniform float va; " + 
	"uniform float vb; " + 
	"uniform float vc; " + 
	"uniform float vd; " + 
	"varying vec4 vColor; " + 
	"varying float xx; " + 
	"varying float yy; " + 
	"" + 
	"vec3 veccos(in vec3 a) { return vec3(cos(a.x), cos(a.y), cos(a.z)); } " + 
	"vec3 vecsin(in vec3 a) { return vec3(sin(a.x), sin(a.y), sin(a.z)); } " + 
	
	"vec3 vectan(in vec3 a) { return vec3(tan(a.x), tan(a.y), tan(a.z)); } " + 
	"vec3 vecabs(in vec3 a) { return vec3(abs(a.x), abs(a.y), abs(a.z)); } " + 
	"vec3 vecsqr(in vec3 a) { return vec3(a.x * a.x, a.y * a.y, a.z * a.z); } " + 
	"" + 
	"vec3 vecadd(in vec3 a, in vec3 b) { return vec3(a.x + b.x, a.y + b.y, a.z + b.z); } " + 
	"vec3 vecsubstract(in vec3 a, in vec3 b) { return vec3(a.x - b.x, a.y - b.y, a.z - b.z); } " + 
	"vec3 vecmultiply(in vec3 a, in vec3 b) { return vec3(a.x * b.x, a.y * b.y, a.z * b.z); } " + 
	"vec3 vecdiv(in vec3 a, in vec3 b) { return vec3(a.x / b.x, a.y / b.y, a.z / b.z); } " + 
	"vec3 createvector(in float a, in float b, in float c) { return vec3(a, b, c); } " + 
	"vec3 veccolormap(in vec3 a, in vec3 b, in vec3 c) { return createvector(a.x / 10.0, b.x / 10.0, c.x / 10.0); } " + 
	"" + 
	"void main(void) { " + 
	"	float x = xx * 10.0, y = yy * 10.0; " + 	
	"	vec3 v = VALUE; " +
	"	gl_FragColor = vec4(v.x, v.y, v.z, 1.0); " + 
	"}";
	
function initShadersRGBAnimateSound(entity) {
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, myVertexShaderRGBAnimatedSrc);
	gl.compileShader(vertexShader);

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, myFragmentShaderRGBAnimateSoundSrc.replace("VALUE", entity.toLowerCase()));
	gl.compileShader(fragmentShader);

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders for " + entity);
	}

	gl.useProgram(shaderProgram);
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}