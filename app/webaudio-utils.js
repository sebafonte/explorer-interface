// Check for audio context
if (! window.AudioContext) {
	if (! window.webkitAudioContext) 
		alert('no audiocontext found');
	window.AudioContext = window.webkitAudioContext;
}

var context = new AudioContext();

function createAnalyzer(smoothingTimeConstant, fftSize) {
	var analyser = context.createAnalyser();
	analyser.smoothingTimeConstant = smoothingTimeConstant;
	analyser.fftSize = fftSize;
	analyser.maxDecibels=-10;
	return analyser;
}

function loadSound(url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer) {
			playSound(buffer);
		}, onError);
	}
	request.send();
}

function playSound(buffer) {
	sourceNode.buffer = buffer;
	sourceNode.start(0);
}

function onError(e) {
	console.log(e);
}

function getAverageVolumeFromFrecuency(analyser) {
	var array = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(array);
	return getAverageVolume(array);
}

function getAverageVolume(array) {
	var values = 0, length = array.length;
	for (var i = 0; i < length; i++)
		values += array[i];
	return values / length;
}