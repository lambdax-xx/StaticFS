var express = require('express');
var fs = require('fs');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var ff = {
	'video': ['mp4', 'avi', 'mkv'],
	'image': ['jpg', 'jpeg', 'png'],
	'text': ['txt', 'js', 'html', 'css']
};

function ft(f) {
	for (var t in ff) {
		if (ff[t].indexOf(fext(f)) !== -1) {
			// console.log(f + "===>" + t);
			return t;
		}	
	}
}

function fext(f) {
	var index = f.lastIndexOf('.');
	return  index == -1 ? '' : f.substr(index + 1);
}

app.locals.ft = ft;

fs.readFile(__dirname + '/config.json', 'utf8', (err, config) => {
	if (err) throw err;

	config = JSON.parse(config);
	// console.log(config);

	var port = 8000;
	var roots = [];
	if (config.port) port = config.port;
	if (config.roots) roots = config.roots;

	for (var root of roots) {
		app.use('/staticFS', express.static(root));
	}

	function dirscan(root, files, callback) {
		var i = 0;
		var nfs = [];
		nfs.dir = files.dir;
		var next = () => {
			if (i >= files.length) {
				callback(nfs);
				return;
			}
			fs.stat(root + files.dir + files[i], (err, stats) => {
				if (err) 
					throw err;
				if (stats.isDirectory()) {
					fs.readdir(root + files.dir + files[i], (err, data) => {
						data.dir = files.dir + files[i] + '/';
						dirscan(root,  data, (ndata) => {
							nfs.push(ndata);
							i++;
							next();
						});
					});
				} else {
					if (ft(files[i])) {
						nfs.push(files[i]);
					}
					i++;
					next();
				}
			});
		};
		next();
	}

	app.get('/', (req, res) => {
		var i = 0;
		var allfiles = [];		
		var next = () => {
			if (i < roots.length) {
				var root = roots[i]; 
				i++;

				if (!(root.endsWith('\\') || root.endsWith('/')))
					root = root + '/';

				fs.readdir(root, (err, data) => {
					if (err) 
						throw err;

					data.dir = '';

					dirscan(root, data, (files) => {
						allfiles = allfiles.concat(files);
						next();
					});		
				});

			} else {
				allfiles.dir = '';
				res.render('index', {title:"StaticFS 1.1.0", fs: allfiles});
			}
		};

		next();
	});

	app.get('*', (req, res) => {	
			res.send('Sorry，I can not find your file!');
	});

	app.listen(port, res => {
		if (res)
			console.log(res);
		else
			console.log(`UAV Static Files Service is listening at port ${port}!`);
	});
});
