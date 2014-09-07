//step 1) require the modules we need
var
http = require('http'),
path = require('path'),
fs = require('fs'),
net = require('net'),
url = require('url'),
querystring = require('querystring');

// Configuration
http.globalAgent.maxSockets = 20;

/*
// SYB init
// DB init
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
*/

// Command execution function
function run_cmd(cmd, args, cb) {
	var spawn = require('child_process').spawn
	var child = spawn(cmd, args);
	var me = this;
	child.stdout.on('data', function(me, data) {
		cb(me, data);
	});
}

function messageCommand (command, arguments) {
	function run_cmd(cmd, args, cb, end) {
		var spawn = require('child_process').spawn,
			child = spawn(cmd, args),
			me = this;
		child.stdout.on('data', function (buffer) { cb(me, buffer) });
		child.stdout.on('end', end);
	}

	var foo = new run_cmd(
		command, arguments.split(" ").toArray(),
		function (me, buffer) { me.stdout += buffer.toString() },
		function () { console.log(foo.stdout) }
	);
	
	function log_console() {
	  res.end(foo.stdout);
	}
	
	setTimeout(log_console,	lispImageTCPTimeout);
}

function renderContentsFromFile(filePath, res, page404, returnCallback){
    fs.exists(filePath,function(exists) {
		if (exists){
            fs.readFile(filePath,function(err,contents){
				if(!err){
					returnCallback(contents);
                } else {
                    console.dir(err);
                };
            });
        } 
		else {
            fs.readFile(page404, function(err,contents){
                if (!err) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(contents);
                } else {
                    console.dir(err);
                };
            });
        };
    });
}

function getFile(filePath, res, page404){
    fs.exists(filePath,function(exists) {
		if (exists){
            fs.readFile(filePath,function(err,contents){
                if(!err){
                    res.end(contents);
                } else {
                    console.dir(err);
                };
            });
        } 
		else {
            fs.readFile(page404, function(err,contents){
                if (!err) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(contents);
                } else {
                    console.dir(err);
                };
            });
        };
    });
}

function setFile(filePath, data, res) {
	fs.writeFile(filePath, data, function(err){
		if (err)
			throw err;
		else {
			res.end(data);
			console.log("Saved file " + filePath);
		};
	});
}

function createRandom(res, language, maxSize) {
	var socket = net.createConnection("20000", "127.0.0.1");
	
	socket
		.on('data', function(data) {
			socket.destroy();
			res.end(data);
		})
		.on('connect', function() {
		  socket.write("(make-instance 'tcp-message :name (quote message-web-interface-create-random) :content (list (quote " + language + ") " + maxSize + "))\n");
		}).on('end', function() {
		}).on('close', function(data) {
		});
}

function getDefault(res, name, properties) {
	var socket = net.createConnection("20000", "127.0.0.1");
	
	socket
	.on('data', function(data) {
	  socket.destroy();
	  res.end(data);
	})
	.on('connect', function() {
	  socket.write("(make-instance 'tcp-message :name (quote message-web-interface-get-default) :content (list (quote " + name + ") (quote " + properties + ")))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });
}

function createDefault(res, language) {
	var socket = net.createConnection("20000", "127.0.0.1");
	
	socket
	.on('data', function(data) {
	  socket.destroy();
	  res.end(data);
	})
	.on('connect', function() {
	  socket.write("(make-instance 'tcp-message :name (quote message-web-interface-create-default) :content (list (quote " + language + ")))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });
}

function possibleLanguages(res) {
	var socket = net.createConnection("20000", "127.0.0.1");
	
	socket
	.on('data', function(data) {
	  socket.destroy();
	  res.end(data);
	})
	.on('connect', function() {
	  socket.write("(make-instance 'tcp-message :name (quote message-web-interface-get-languages))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });
}

function mutateFunctions(res, language, objectData, maxSize) {
	var socket = net.createConnection("20000", "127.0.0.1");
	
	socket.on('data', function(data) {
	  socket.destroy();
	  res.end(data);	
	}).on('connect', function() {
	  socket.write("(make-instance 'tcp-message :name (quote message-web-interface-mutate) :content (list (quote " + language + ") (quote " + objectData + ") " + maxSize + "))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });
};

function datePrint() {
	return Date.now();
}
 
function crossoverFunctions(res, language, objectDataA, objectDataB, maxSize) {
	var socket = net.createConnection("20000", "127.0.0.1");
	
	socket.on('data', function(data) {
		socket.destroy();
		res.end(data);
	}).on('connect', function() {
		socket.write("(make-instance 'tcp-message :name (quote message-web-interface-crossover) :content (list (quote " + language + ") (quote " + objectDataA + ") (quote " + objectDataB + ") " + maxSize + "))\n");
	}).on('error', function(error) {
	}).on('end', function() {
	}).on('close', function(data) {
	});
};

function createTask(res, name, properties) {
	var socket = net.createConnection("20000", "127.0.0.1");
	
	socket.on('data', function(data) {
	  socket.destroy();
	  res.end(data);

	}).on('connect', function() {
		socket.write("(make-instance 'tcp-message :name (quote message-web-interface-create-task-using) :content (list (quote " + name + ") (quote " + properties + ")))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });
}

function deleteTask(res, name) {
	var socket = net.createConnection("20000", "127.0.0.1");
	
	socket.on('data', function(data) {
	  socket.destroy();
	  res.end(data);
	}).on('connect', function() {
		socket.write("(make-instance 'tcp-message :name (quote message-web-interface-delete-task) :content (list (quote " + name + ")))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });
}

function getPropertyValue(res, object, properties) {
	var socket = net.createConnection("20000", "127.0.0.1");
	
	socket.on('data', function(data) {
	  socket.destroy();
	  res.end(data);
	  }).on('connect', function() {
		socket.write("(make-instance 'tcp-message :name (quote message-web-interface-get-property-value) :content (list (quote " + object + ") (quote " + properties + ")))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });
}

function galleryGetAll(res, maxSize) {
	var result = [];
	
	for (var i=0; i< 16; i++) {
		var fileName = path.basename(req.url) || 'gallery' + index + ".object",
			localFolder = __dirname + '/app/gallery',
			page404 = localFolder + "\\" + '404.html';
		getFile((localFolder + fileName), res, page404);
	}
};

function galleryGetElement(res, req, index) {
	var fileName = 'gallery' + index + ".object",
		localFolder = __dirname + '/app/gallery',
		page404 = localFolder + '\\404.html';
	getFile((localFolder + "/" + fileName), res, page404);
};

function gallerySetElement(res, index, language, objectDataA, objectDataB) {
	var fileName = 'gallery' + index + ".object",
		localFolder = __dirname + '/app/gallery';
	setFile(localFolder + "/" + fileName, language + " | " + objectDataA + " | " + objectDataB, res);
};

function likeObject(res, language, a, b, c) {
	console.log("Like object: " + language + a + " - " + b + " - " + c);	
}

function dislikeObject(res, language, a, b, c) {
	console.log("Dislike object: " + language + a + " - " + b + " - " + c);	
}

function viewObject(res, language, a, b, c) {
	var localFolder = __dirname + '/app',
		page404 = localFolder + '404.html';

	renderContentsFromFile(localFolder + "/" + "view.html", res, page404,
		function(contents) {
			var result = contents.toString().replace("#A#", a);
			result = result.replace("#B#", b);
			result = result.replace("#C#", c);
			result = result.replace("#LANGUAGE#", language);
			res.end(result);
		});
}

function sendObject(res, language, a, b, c) {
	console.log("Send object: " + language + a + " - " + b + " - " + c);
}

// Helper for HTTP requests
function requestHandler(req, res) {	
	var pathname = url.parse(req.url).pathname;
	var arguments = querystring.parse(url.parse(req.url).query);
	
	// #TEMP: incoming inspector
	console.log(datePrint().toString() + " " + req.connection.remoteAddress + ": " + pathname + "{" + arguments.toString() + "}");
	
	if (pathname == "/messageLanguages")		
		possibleLanguages(res);
	else if (pathname == "/messageGallerySetElement")	
		gallerySetElement(res, arguments.index, arguments.language, arguments.objectDataA, arguments.objectDataB);
	else if (pathname == "/messageGalleryGetElement")	
		galleryGetElement(res, req, arguments.index);
	else if (pathname == "/messageGalleryGetAll")	
		galleryGetAll(res, arguments.maxSize);
	else if (pathname == "/messageGetDefault")	
		getDefault(res, arguments.name, arguments.properties);	
	else if (pathname == "/messageCreateDefault")	
		createDefault(res, arguments.language);
	else if (pathname == "/messageCreateTask")
		createTask(res, arguments.name, arguments.properties);
	else if (pathname == "/messageDeleteTask")
		deleteTask(res, arguments.name);
	else if (pathname == "/messageGetPropertyValue")
		getPropertyValue(res, arguments.object, arguments.properties);
	else if (pathname == "/messageCreateRandom")	
		createRandom(res, arguments.language, arguments.maxSize);
	else if (pathname == "/messageMutate")	
		mutateFunctions(res, arguments.language, arguments.objectData, arguments.maxSize);
	else if (pathname == "/messageLike")
		likeObject(res, arguments.language, arguments.a, arguments.b, arguments.c);
	else if (pathname == "/messageDislike")
		dislikeObject(res, arguments.language, arguments.a, arguments.b, arguments.c);
	else if (pathname == "/messageView")
		viewObject(res, arguments.language, arguments.a, arguments.b, arguments.c);
	else if (pathname == "/messageSend")
		sendObject(res, arguments.language, arguments.a, arguments.b, arguments.c);
	else if (pathname == "/messageCrossover")	
		crossoverFunctions(res, arguments.language, arguments.objectDataA, arguments.objectDataB, arguments.maxSize);
	else if (pathname == "/messageCommand")		
		createImage(res, arguments.language, arguments.command);
	else
	{
		var fileName = path.basename(req.url) || 'index.html',
			localFolder = __dirname + '/app/',
			page404 = localFolder + '404.html';
		getFile((localFolder + fileName), res, page404);
	}
};

http.createServer(requestHandler)
.listen(3000);
