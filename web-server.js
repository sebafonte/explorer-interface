//step 1) require the modules we need
var
http = require('http'),
path = require('path'),
fs = require('fs'),
net = require('net'),
url = require('url'),
querystring = require('querystring');

var lispImageTCPTimeout = 100;
http.globalAgent.maxSockets = 3;

// SYB init

/*
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
	  //console.log('DONE');
	}).on('close', function(data) {
	  //console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
    });

	function log_console() {
	//console.log("RETURN DATA: " + returnData);
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
	  //console.log('DONE');
	}).on('close', function(data) {
	  //console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
    });

	function log_console() {
	  //console.log("RETURN DATA: " + returnData);
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
	  //console.log('DONE');
	}).on('close', function(data) {
	  //console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
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
	  //console.log('DONE');
	}).on('close', function(data) {
	  //console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
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
	  //console.log('DONE');
	}).on('close', function(data) {
	  //console.log('CLOSED: ' + socket.remoteAddress +' '+ socket.remotePort);
    });
	
	function log_console() {
	  socket.destroy();
	  res.end(returnData);
	}

	setTimeout(log_console,	lispImageTCPTimeout);
};

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
	if (url.parse(req.url).pathname == "/messageLanguages")	
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		possibleLanguages(res);
	}
	else if (url.parse(req.url).pathname == "/messageGallerySetElement")	
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		gallerySetElement(req, arguments.index, arguments.language, arguments.objectDataA, arguments.objectDataB);
	}
	else if (url.parse(req.url).pathname == "/messageGalleryGetElement")	
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		galleryGetElement(res, req, arguments.index);
	}
	else if (url.parse(req.url).pathname == "/messageGalleryGetAll")	
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		galleryGetAll(res, arguments.maxSize);
	}	
	else if (url.parse(req.url).pathname == "/messageCreateDefault")	
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		createDefault(res, arguments.language);
	}	
	else if (url.parse(req.url).pathname == "/messageCreateRandom")	
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		createRandom(res, arguments.language, arguments.maxSize);
	}	
	else if (url.parse(req.url).pathname == "/messageMutate")	
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		mutateFunctions(res, arguments.language, arguments.objectData, arguments.maxSize);
	}		
	else if (url.parse(req.url).pathname == "/messageCrossover")	
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		crossoverFunctions(res, arguments.language, arguments.objectDataA, arguments.objectDataB, arguments.maxSize);
	}
	else if (url.parse(req.url).pathname == "/messageCommand")		
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
