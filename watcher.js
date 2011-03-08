/*
	This is hacked together at the moment, to see if it works.
*/

var fs = require('fs'),
    less = require('less');


var css_file;
var css_lines;
var files  = {}; //{'fname': #line}
var to_css = {}; //{'fname': css}

var start = function(css_src){
	css_file = css_src;
	
	//find the external styles
	fs.readFile(css_file, 'utf8', function (err, data) {
		if (err) throw err;
		
		css_lines = data.split("\n");
		
		for (var i=0; i < css_lines.length; i++) {
			line = css_lines[i];
			if(line.indexOf('@style-compile') > 0){
				fn = line.match(/@style-compile ([^ ]*\.less)/)[1]
				files[fn] = i
				addLess(fn);
			}
		};
		
		console.log('Warning, any changes to', css_file, 'will be overwritten')
		
	});

}

/*
	Create a less file (if needed) - and start watching it
*/
var addLess = function(file){
	
	fs.stat(file, function(err, stats){
		if(err){
			var content = "// " + file + " - created by style-compile (github.com/benfoxall/style-compile)\n"
			content    += "// see lesscss.org for syntax\n\n"
			
			fs.writeFile(file, content, function (err) {
				if (err) throw err;
				console.log('Created', file)
				watch(file)
			});
		} else {
			watch(file)
			parse(file)
		}
		
	})
	
}

/*
	Watch a file for changes
*/
var watch = function(file){
	fs.watchFile(file, {interval: 500}, function (curr, prev) {
		//todo - these don't seem to compare nicely
		if (prev.mtime != curr.mtime){
			console.log('Modified', file);
			parse(file,write);
		}
	});
	console.log("Watching", file)
}

/*
	Read the source file into to_css
*/
var parse = function(file, complete){

	fs.readFile(file, 'utf8', function (err, data) {
		if (err) throw err;
		
		less.render(data, function (err, css) {
			if (err) {
				console.log(err);
			} else {
				to_css[file] = css;
				if(complete)
					complete();
			}
		});
	})
	
}

/*
	rewrite the css file with 'less goodness'
*/
var write = function(){
	
	contents = [];
	
	
	for (var i=0; i < css_lines.length; i++) {
		line = css_lines[i];
		
		contents.push(line);
		
		if(line.indexOf('@style-compile') > 0){
			fn = line.match(/@style-compile ([^ ]*\.less)/)[1]
			
			
			if(i+1 < css_lines.length && css_lines[i+1].indexOf('/*---begin:') >= 0){
				//increment i till we get to to END
				for (; i < css_lines.length; i++) {
					if(css_lines[i].indexOf('/*---end:') >= 0){
						break;
					}
				}
			}
			
			contents.push('/*---begin:'+fn+'---*/')
			contents.push(to_css[fn]);
			contents.push('/*---end:'+fn+'---*/')
		}
		
	};
	
	fs.writeFile(css_file, contents.join("\n"), function (err) {
	  if (err) throw err;
	  console.log('Updated ', css_file);
	});
}




exports.start = start;