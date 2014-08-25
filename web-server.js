
var
http = require('http'),
path = require('path'),
fs = require('fs'),
net = require('net'),
url = require('url'),
querystring = require('querystring');

// Configuration
var lispImageTCPTimeout = 150;
http.globalAgent.maxSockets = 3;

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

function setFile(filePath, data) {
	fs.writeFile(filePath, data, function(err){
		if (err)
			throw err;
		else {
			console.log("Saved file " + filePath);
		};
	});
}

function createRandom(res, language, maxSize) {
	var socket = net.createConnection("20000", "127.0.0.1");
	var returnData = "default";
	
	socket
		.on('data', function(data) {
		  returnData = data;
		})
		.on('connect', function() {
		  socket.write("(make-instance 'tcp-message :name (quote message-web-interface-create-random) :content (list (quote " + language + ") " + maxSize.toString() + "))\n");
		}).on('end', function() {
		}).on('close', function(data) {
		});

	function log_console() {
	  console.log("Entered with " + returnData);
	  if (returnData != 'default')
	  {
		socket.destroy();
		res.end(returnData);
	  }
	  else
		console.log("Will have error " + returnData);
	}

	setTimeout(log_console,	lispImageTCPTimeout);
}

function getDefault(res, name, properties) {
	var socket = net.createConnection("20000", "127.0.0.1");
	var returnData = "default";
	
	socket
	.on('data', function(data) {
	  returnData = data;
	})
	.on('connect', function() {
	  socket.write("(make-instance 'tcp-message :name (quote message-web-interface-get-default) :content (list (quote " + name + ") (quote " + properties + ")))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });

	function log_console() {
	  socket.destroy();
	  res.end(returnData);
	}
	
	setTimeout(log_console,	lispImageTCPTimeout);
}

function createDefault(res, language) {
	var socket = net.createConnection("20000", "127.0.0.1");
	var returnData = "default";
	
	socket
	.on('data', function(data) {
	  returnData = data;
	})
	.on('connect', function() {
	  socket.write("(make-instance 'tcp-message :name (quote message-web-interface-create-default) :content (list (quote " + language + ")))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });

	function log_console() {
	  socket.destroy();
	  res.end(returnData);
	}
	
	setTimeout(log_console,	lispImageTCPTimeout);
}

function possibleLanguages(res) {
	var socket = net.createConnection("20000", "127.0.0.1");
	var returnData = "default";
	
	socket
	.on('data', function(data) {
	  returnData = data;
	})
	.on('connect', function() {
	  socket.write("(make-instance 'tcp-message :name (quote message-web-interface-get-languages))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });

	function log_console() {
	  socket.destroy();
	  res.end(returnData);
	}
	
	setTimeout(log_console,	lispImageTCPTimeout);
}

function mutateFunctions(res, language, objectData, maxSize) {
	var socket = net.createConnection("20000", "127.0.0.1");
	var returnData = "default";
	
	socket.on('data', function(data) {
		returnData = data;
	}).on('connect', function() {
	  socket.write("(make-instance 'tcp-message :name (quote message-web-interface-mutate) :content (list (quote " + language + ") (quote " + objectData + ") " + maxSize.toString() + "))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });
	
	function log_console() {
	  socket.destroy();
	  res.end(returnData);
	}

	setTimeout(log_console,	lispImageTCPTimeout);
};

function crossoverFunctions(res, language, objectDataA, objectDataB, maxSize) {
	var socket = net.createConnection("20000", "127.0.0.1");
	var returnData = "default";
	
	socket.on('data', function(data) {
		returnData = data;
	}).on('connect', function() {
		socket.write("(make-instance 'tcp-message :name (quote message-web-interface-crossover) :content (list (quote " + language + ") (quote " + objectDataA + ") (quote " + objectDataB + ") " + maxSize.toString() + "))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });

	function log_console() {
	  socket.destroy();
	  res.end(returnData);
	}

	setTimeout(log_console,	lispImageTCPTimeout);
};

function createTask(res, name, properties) {
	var socket = net.createConnection("20000", "127.0.0.1");
	var returnData = "default";
	
	socket.on('data', function(data) {
		returnData = data;
	}).on('connect', function() {
		socket.write("(make-instance 'tcp-message :name (quote message-web-interface-create-task-using) :content (list (quote " + name + ") (quote " + properties + ")))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });

	function log_console() {
	  socket.destroy();
	  res.end(returnData);
	}

	setTimeout(log_console,	lispImageTCPTimeout);
}

function deleteTask(res, name) {
	var socket = net.createConnection("20000", "127.0.0.1");
	var returnData = "default";
	
	socket.on('data', function(data) {
		returnData = data;
	}).on('connect', function() {
		socket.write("(make-instance 'tcp-message :name (quote message-web-interface-delete-task) :content (list (quote " + name + ")))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });

	function log_console() {
	  socket.destroy();
	  res.end(returnData);
	}

	setTimeout(log_console,	lispImageTCPTimeout);
}

function getPropertyValue(res, object, properties) {
	var socket = net.createConnection("20000", "127.0.0.1");
	var returnData = "default";
	
	socket.on('data', function(data) {
		returnData = data;
	}).on('connect', function() {
		socket.write("(make-instance 'tcp-message :name (quote message-web-interface-get-property-value) :content (list (quote " + object + ") (quote " + properties + ")))\n");
	}).on('end', function() {
	}).on('close', function(data) {
    });

	function log_console() {
	  socket.destroy();
	  res.end(returnData);
	}

	setTimeout(log_console,	lispImageTCPTimeout);
}

function gallerGetAll(res, maxSize) {
	var result = [];
	
	for (var i=0; i< 16; i++)
	{
		var fileName = path.basename(req.url) || 'gallery' + index.toString() + ".object",
			localFolder = __dirname + '/app/gallery',
			page404 = localFolder + "\\" + '404.html';
		getFile((localFolder + fileName), res, page404);
	}
};

function galleryGetElement(res, req, index) {
	var fileName = 'gallery' + index.toString() + ".object",
		localFolder = __dirname + '/app/gallery',
		page404 = localFolder + '\\404.html';
	getFile((localFolder + "/" + fileName), res, page404);
};

function gallerySetElement(req, index, language, objectDataA, objectDataB) {
	console.log(index);
	var fileName = 'gallery' + index.toString() + ".object",
		localFolder = __dirname + '/app/gallery';
	setFile(localFolder + "/" + fileName, language + " | " + objectDataA + " | " + objectDataB);
};

// Helper for HTTP requests
function requestHandler(req, res) {	
	var pathname = url.parse(req.url).pathname;
	
	if (pathname == "/messageLanguages")
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		possibleLanguages(res);
	}
	else if (pathname == "/messageGallerySetElement")
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		gallerySetElement(req, arguments.index, arguments.language, arguments.objectDataA, arguments.objectDataB);
	}
	else if (pathname == "/messageGalleryGetElement")
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		galleryGetElement(res, req, arguments.index);
	}
	else if (pathname == "/messageGalleryGetAll")
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		galleryGetAll(res, arguments.maxSize);
	}
	else if (pathname == "/messageGetDefault")
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		getDefault(res, arguments.name, arguments.properties);
	}
	else if (pathname == "/messageCreateDefault")
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		createDefault(res, arguments.language);
	}	
	else if (pathname == "/messageCreateTask")
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		createTask(res, arguments.name, arguments.properties);
	}
	else if (pathname == "/messageDeleteTask")
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		deleteTask(res, arguments.name);
	}
	else if (pathname == "/messageGetPropertyValue")
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		getPropertyValue(res, arguments.object, arguments.properties);
	}
	else if (pathname == "/messageCreateRandom")
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		createRandom(res, arguments.language, arguments.maxSize);
	}
	else if (pathname == "/messageMutate")
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		mutateFunctions(res, arguments.language, arguments.objectData, arguments.maxSize);
	}
	else if (pathname == "/messageCrossover")
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		crossoverFunctions(res, arguments.language, arguments.objectDataA, arguments.objectDataB, arguments.maxSize);
	}
	else if (pathname == "/messageCommand")
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		createImage(res, arguments.language, arguments.command);
	}
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
