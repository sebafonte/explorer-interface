//step 1) require the modules we need
var
http = require('http'),
path = require('path'),
fs = require('fs');

// DB init
//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');
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
        console.log(filePath);
		var a = "D:\\nodejs\\explorer-interfacer/app/dir" == filePath;
		console.log(a);
		
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
				setTimeout(
				  // wait 0.25 seconds and print the output
				  log_console,
				250);
		}
		else if(exists){
            //read the fiule, run the anonymous function
            fs.readFile(filePath,function(err,contents){
                if(!err){
                    //if there was no error
                    //send the contents with the default 200/ok header
                    res.end(contents);
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });
        } else {
            //if the requested file was not found
            //serve-up our custom 404 page
            fs.readFile(page404,function(err,contents){
                //if there was no error
                if(!err){
                    //send the contents with a 404/not found header 
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end(contents);
                } else {
                    //for our own troubleshooting
                    console.dir(err);
                };
            });
        };
    });
};
 
//a helper function to handle HTTP requests
function requestHandler(req, res) {
    var
    fileName = path.basename(req.url) || 'index.html',
    localFolder = __dirname + '/app/',
    page404 = localFolder + '404.html';
 
    //call our helper function
    //pass in the path to the file we want,
    //the response object, and the 404 page path
    //in case the requestd file is not found
    getFile((localFolder + fileName),res,page404);
};
 
//step 2) create the server
http.createServer(requestHandler)
 
//step 3) listen for an HTTP request on port 3000
.listen(3000);