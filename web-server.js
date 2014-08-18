//step 1) require the modules we need
var
http = require('http'),
path = require('path'),
fs = require('fs'),
net = require('net'),
url = require('url'),
querystring = require('querystring');

var lispImageTCPTimeout = 100;

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

//helper function handles file verification
function getFile(filePath,res,page404){
    //does the requested file exist?
    fs.exists(filePath,function(exists){
        //if it does...
        console.log("PATH: " + filePath);
		
		if  ("D:\\nodejs\\explorer-interface/app/dir" == filePath)
		{
				function run_cmd(cmd, args, cb, end) {
					var spawn = require('child_process').spawn,
						child = spawn(cmd, args),
						me = this;
					child.stdout.on('data', function (buffer) { cb(me, buffer) });
					child.stdout.on('end', end);
				}

				var foo = new run_cmd(
					'netstat.exe', ['-an'],
					function (me, buffer) { me.stdout += buffer.toString() },
					function () { console.log(foo.stdout) }
				);
				
				function log_console() {
				  console.log(foo.stdout);
				  res.end(foo.stdout);
				}
				
				setTimeout(log_console,	lispImageTCPTimeout);
		}
		else if (exists){
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

// Helper for HTTP requests
function requestHandler(req, res) {	
	if (url.parse(req.url).pathname == "/messageLanguages")	
	{
		var arguments = querystring.parse(url.parse(req.url).query);
		possibleLanguages(res);
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
