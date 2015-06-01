 
// RGB animated
var postVertexShaderSrc = 
	"attribute vec3 aVertexPosition; " +
	"attribute vec2 aTextureCoord; " + 
	"uniform mat4 uMVMatrix; " + 
	"uniform mat4 uPMatrix; " + 
	"varying float xx, yy; " + 
	"void main(void) { " + 
	"	vec2 coord = aTextureCoord; " + 
	"	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 2.0); " + 
	"	xx = clamp(aVertexPosition.x,0.0,1.0); " + 
	"	yy = clamp(aVertexPosition.y,0.0,1.0); " + 
	"}";

var postFragmentShaderSrc =
	"precision mediump float; " + 
	"varying float xx; " + 
	"varying float yy; " + 
	"uniform float aa; " + 
	"uniform float va; " + 
	"uniform float vb; " + 
	"uniform float vc; " + 
	"uniform float vd; " + 	
	"uniform float time; " + 
	"uniform float faderValue; " + 	
	"void main(void) { " + 
	"	gl_FragColor = vec4(0.9, 0.5, 0.5, 1.0); " + 
	"}";
	
function BackgroundInterpolationObjectPost (entity, timeFrame, effects) {
	this.entity = entity;
	this.globalScale = 1.0;
	this.globalXRef = 1.0;
	this.globalYRef = 1.0;	
	this.effects = effects;
	this.frameSelector = new NextFrameSelector(timeFrame);
} 
	
BackgroundInterpolationObjectPost.prototype.initialize = function (gl) {
	this.mvMatrix = mat4.create();
	this.pMatrix = mat4.create();
	this.initBuffersRGB(gl);
	this.initShadersRGBAnimate(gl);
	this.initShadersRGBPost(gl);
	this.frameSelector.initializeInterpolation(this.entity.length);
}

BackgroundInterpolationObjectPost.prototype.render = function (gl) {
	var globalVa = timerValue();
	gl.useProgram(this.shaderProgram);
	
	// Update animation effects
	for (var effect in this.effects) {
		this.effects[effect].apply(this);
	}		

	this.frameSelector.updateInterpolationValues(this.entity.length);
	var location = gl.getUniformLocation(this.shaderProgram, "va");
    gl.uniform1f(location, globalVa);	
	location = gl.getUniformLocation(this.shaderProgram, "vb");
    gl.uniform1f(location, globalVb);	
	location = gl.getUniformLocation(this.shaderProgram, "vc");
    gl.uniform1f(location, globalVc);	
	location = gl.getUniformLocation(this.shaderProgram, "vd");
	gl.uniform1f(location, globalVd);
	location = gl.getUniformLocation(this.shaderProgram, "time");
    gl.uniform1f(location, timerValue());	
	location = gl.getUniformLocation(this.shaderProgram, "faderValue");
    gl.uniform1f(location, this.transparencyValue);	
	var valueAA = (timerValue() - this.frameSelector.lastUpdate) / this.frameSelector.timeFrame;
	location = gl.getUniformLocation(this.shaderProgram, "indexA");
	gl.uniform1f(location, this.frameSelector.indexA);	
	location = gl.getUniformLocation(this.shaderProgram, "indexB");
	gl.uniform1f(location, this.frameSelector.indexB);	
	location = gl.getUniformLocation(this.shaderProgram, "aa");
	var aa = valueAA < 1.0 ? valueAA : 1.0;
	gl.uniform1f(location, 1.0 - aa);	

	// create an empty texture
	var tex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);	

	var fb = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
	
	// Create a framebuffer and attach the texture	
	gl.disable(gl.DEPTH_TEST);
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	//mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, this.pMatrix);
	mat4.identity(this.mvMatrix);
	mat4.translate(this.mvMatrix, [0.0, 0.0, -1.2]);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
	gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
	gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.itemSize, gl.FLOAT, false, 0, 0);
	this.setMatrixUniforms(gl); 

/*	// Attach a frame buffer?
	var renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, 512, 512);
	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, renderbuffer); */
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.numItems);	

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.useProgram(this.postShaderProgram);	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.numItems);
}

BackgroundInterpolationObjectPost.prototype.initBuffersRGB = function (gl) {
	this.squareVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
	var vertices = [
		 1.0,  1.0,  0.0,
		-1.0,  1.0,  0.0,
		 1.0, -1.0,  0.0,
		-1.0, -1.0,  0.0
	];	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.itemSize = 3;
	this.numItems = 4;
}

BackgroundInterpolationObjectPost.prototype.initShadersRGBAnimate = function (gl) {
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, RGBBackgroundInterpolationVertexShaderSrc);
	gl.compileShader(vertexShader);

	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	var funcionesCode = "if (false) {} ";
	for (var i=0; i< this.entity.length; i++)
		funcionesCode += " else if (indexA == " + i + ".0) { vaa = " + this.entity[i].toLowerCase() + "; } ";
	funcionesCode += " if (false) {} ";
	for (var i=0; i< this.entity.length; i++)
		funcionesCode += " else if (indexB == " + i + ".0) { vbb = " + this.entity[i].toLowerCase() + "; } ";
	source = RGBBackgroundInterpolationFragmentShaderSrc.replace("FUNCIONES", funcionesCode);
	
	gl.shaderSource(fragmentShader, source);
	gl.compileShader(fragmentShader);

	this.shaderProgram = gl.createProgram();
	var shaderProgram = this.shaderProgram;
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders for " +  this.entity);
	}

	gl.useProgram(shaderProgram);
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

BackgroundInterpolationObjectPost.prototype.initShadersRGBPost = function (gl) {
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, postVertexShaderSrc);
	gl.compileShader(vertexShader);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	var source = postFragmentShaderSrc;
	gl.shaderSource(fragmentShader, source);
	gl.compileShader(fragmentShader);

	this.postShaderProgram = gl.createProgram();
	var shaderProgram = this.postShaderProgram;
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders for " +  this.entity);
	}

	gl.useProgram(shaderProgram);
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

BackgroundInterpolationObjectPost.prototype.setMatrixUniforms = function (gl) {
	gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
	gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
}


