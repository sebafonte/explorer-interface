
var BallsVertexConstantLightShaderSrc = 
    "attribute vec3 aVertexPosition; " +
    "attribute vec2 aTextureCoord; " +
	"attribute vec3 aVertexNormal; " +
    "uniform mat4 uMVMatrix; " +
    "uniform mat4 uPMatrix; " +
	"uniform mat3 uNMatrix; " + 
    "uniform vec3 uAmbientColor; " +
    "uniform vec3 uLightingDirection; " +
    "uniform vec3 uDirectionalColor; " +
    "varying vec2 vTextureCoord; " +
    "varying vec3 vLightWeighting; " +
    "void main(void) {" +
	"   gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); " +
    "   vTextureCoord = aTextureCoord; " +
	"	vLightWeighting = vec3(1.0, 1.0, 1.0); " + 
    "}";
	
function RotationBallsNoLight (childrenTable, radiusTable, distancesTable, valueFunction, texture) {
	this.root = {};
	this.children = {};
	
	this.vertexPositionBuffer;
	this.vertexTextureCoordBuffer;
	this.vertexIndexBuffer;

	this.childrenses = childrenTable;
	this.radiuses = radiusTable;
	this.distances = distancesTable;
	
	this.valueFunction = valueFunction;
	this.texture = texture;
}

RotationBallsNoLight.prototype = RotationBalls;

RotationBallsNoLight.prototype.initialize = function (gl) {
	this.mvMatrix = mat4.create();
	this.pMatrix = mat4.create();
	
	var value = this.calculateChildren(0, 0);
	var da = 360.0 / value;
	this.selfRotation = { x: 0, y: 0, z: 0.1 };	
	
	this.children[0] = new RotationBallsNode(this);		
	this.children[0].angle = {x: 0, y: 0, z: 0};
	this.children[0].initializeNode(0, 0);
	
	this.initializeLists(gl, 8, 8, 1.0);
	this.initShaders(gl, BallsVertexConstantLightShaderSrc);
}