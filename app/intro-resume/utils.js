
// STRING UTILS
function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

// TIME
var globalStartTime = 0.0;
var globalTime = 0.0, globalVa = 0.0, globalVb = 0.0, globalVc = 0.0, globalVd = 0.0;
var deltaTime = 0.1;

function resetTimer() {
	globalStartTime = Date.now();
}

function timerValue() {
	return (Date.now() - globalStartTime) / 1000.0;
}
