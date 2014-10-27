
var rgbRenderer = {

}

function createFunctionGeneric(arguments, message) {
	var xmlHttp = null;
	//var params = JSON.stringify({ maxSize: 30, language: "pete" });
	xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", message + "?" + arguments, false);
    xmlHttp.send(null);
    if (xmlHttp.status === 200) return xmlHttp.responseText;
	return null;
}

function RandomFrameSelector() {
	this.timeFrame = 3.0;
	this.indexA = 0;
	this.indexB = 0;
	
	this.nextFrame = function (n) {
		return Math.floor(Math.random() * n);
	}
	
	this.initializeInterpolation = function (n) {
		this.indexA = Math.floor(Math.random() * n);
		this.indexA = this.indexB;
		this.indexB = this.nextFrame(n);		
		this.lastUpdate = timerValue();
	}
	
	this.updateInterpolationValues = function (n) {	
		var value = timerValue();
		if ((value - this.lastUpdate) > this.timeFrame) {
			this.indexA = this.indexB;
			this.indexB = this.nextFrame(n);		
			this.lastUpdate = value;
		}
	}
}

function NextFrameSelector() {
	this.timeFrame = 3.0;
	this.indexA = 0;
	this.indexB = 0;
	
	this.nextFrame = function (n) {
		return Math.floor(this.indexB+1);
	}
	
	this.initializeInterpolation = function (n) {
		this.indexA = 0;
		if (this.indexA >= n) this.indexA = 0;
		this.indexB = this.nextFrame(n);
		if (this.indexB >= n) this.indexB = 0;		
		this.lastUpdate = timerValue();
	}
	
	this.updateInterpolationValues = function (n) {	
		var value = timerValue();
		if ((value - this.lastUpdate) > this.timeFrame) {
			this.indexA = this.indexB;
			if (this.indexA >= n) this.indexA = 0;
			this.indexB = this.nextFrame(n);
			if (this.indexB >= n) this.indexB = 0;
			this.lastUpdate = value;
		}
	}
}

// Facade
function Renderer () {
	this.generator = new OneLevelGeneratorRgb();
	this.frameSelector = new NextFrameSelector();
	
	this.drawEntityImageRGBInterpolatedAnimateB = function () {
		var valueAA = (timerValue() - this.frameSelector.lastUpdate) / this.frameSelector.timeFrame;
		var location = gl.getUniformLocation(shaderProgram, "indexA");
		gl.uniform1f(location, this.frameSelector.indexA);	
		location = gl.getUniformLocation(shaderProgram, "indexB");
		gl.uniform1f(location, this.frameSelector.indexB);	
		location = gl.getUniformLocation(shaderProgram, "aa");
		var aa = valueAA < 1.0 ? valueAA : 1.0;
		gl.uniform1f(location, 1.0 - aa);	
		drawEntityImageRGBAnimateSound();
	}

	this.render = function () {
		var entitiesArray = [];
		for (var i=0; i< this.generator.prototype.arrayEntities.length; i++)
			entitiesArray.push([ this.generator.prototype.arrayEntities[i].cExpression, this.generator.prototype.arrayEntities[i].type]);
		initWebGLRGBInterpolatedAnimate("result", entitiesArray);
		this.drawEntityImageRGBInterpolatedAnimateB();
	};
	
	this.updateFrame = function () {
		this.frameSelector.updateInterpolationValues(this.generator.prototype.arrayEntities.length);
	}
}
		
// Abstact
function Generator() {	
	// Generation
	this.entities = {};
	this.count = [20];
	this.language = "rgb-color-images-vector";
	this.type = "entity-rgb-animate";
	this.maxSize = 50;
	// Render
	this.arrayEntities = [];
	
	this.getRgbObjectsFromGallery = function (n) {
		var array = [];
		for (var i=0; i< n; i++)
			array.push(new RGBEntity(createFunctionGeneric("language=" + this.language, "/getWithCriteria")));
		return array;
    };
	
	this.getRgbObjectFromGallery = function () {
		return createFunctionGeneric(new RGBEntity("language=" + this.language, "/getWithCriteria"));
    };
	
	this.mutate = function (entity) {
		var result = createFunctionGeneric("language=" + entity.language.trim() + "&maxSize=30&objectData=" + encodeURIComponent(entity.lispExpression.trim()), "/messageMutate");
		var splited = result.split("|");
		var resultEntity = new RGBEntity(result);
		resultEntity.language = entity.language;
		resultEntity.type = entity.type;
		resultEntity.lispExpression = splited[0];
		resultEntity.cExpression = splited[1];
		return resultEntity;
    };
}

// Utilities
/*
var forwardGeneratorRgbRenderer = {
	initialize: function () {
		this.entities["entity" + 0] = this.getRgbObjectsFromGallery(1);
		for (var i=1; i< this.count; i++)
			this.entities["entity" + i] = this.mutate(this.entities["entity" + (i - 1)]);
		this.arrayEntities = this.entities;
	}
}

var randomGeneratorRgbRenderer = {
	initialize: function () {
		this.entities["entity" + 0] = this.getRgbObjectsFromGallery(1);
		for (var i=1; i< this.count; i++)
			this.entities["entity" + i] = this.mutate(this.entities["entity" + (i - 1)]);
		this.arrayEntities = this.entities;
    }
} */

function RGBEntity (description) {	
	var values = description.split("|");
	this.language = values[0];
	this.type = values[3];
	this.lispExpression = values[1];
	this.cExpression = values[2];
}

function OneLevelGeneratorRgb () {
    this.prototype = new Generator();
	this.levels = {0: 5, 1: 6};
	this.entities = {};
	
	this.initialize = function (o) {
		var seeds = this.prototype.getRgbObjectsFromGallery(this.levels[0]);;
		
		for (var i=0; i< this.levels[0]; i++) {
			this.entities["entity" + i + " - " + 0] = seeds[i];
			for (var j=1; j< this.levels[1]; j++) {
				this.entities["entity" + i + " - " + j] = this.prototype.mutate(this.entities["entity" + i + " - " + 0]);
				this.prototype.arrayEntities.push(this.entities["entity" + i + " - " + j]);
			}
		}
    }
}


var introTime = 0.0;
var backgroundRenderer;
var frameRateSet = 20;
var interval;

function runIntro(canvasId) {
	backGroundRenderer = new Renderer();
	backGroundRenderer.generator.language = "rgb-color-images-vector";
	backGroundRenderer.generator.maxSize = 35;
	goFullScreen(canvasId);
	backGroundRenderer.generator.initialize();
	backGroundRenderer.frameSelector.initializeInterpolation();
	startIntroLoop(function () { endIntro() });
}

function goFullScreen(canvasId) {
	//var canvas = document.getElementById(canvasId);
	//canvas.webkitRequestFullScreen();
	
	var elem = document.getElementById(canvasId);
	if (elem.requestFullscreen) {
	  elem.requestFullscreen();
	} else if (elem.msRequestFullscreen) {
	  elem.msRequestFullscreen();
	} else if (elem.mozRequestFullScreen) {
	  elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) {
	  elem.webkitRequestFullscreen();
	}
}

function startIntroLoop(endFunction) {
	updateFrame();
	interval = setInterval(function () { updateFrame(); }, 1000 / frameRateSet);
}


function updateFrame() {
	backGroundRenderer.updateFrame();
	backGroundRenderer.render();
	// #TODO: Draw text	
	if (false) endIntro();
}

function endIntro() {
	clearInterval(interval);
	// #TODO: Exit fullscreen
}





