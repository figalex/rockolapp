var Dropbox = require('dropbox'),
	db = require('orm').db,
	User = db.models.user,
	songsTasks = require('./songs'),
	usersTasks = require('./users');

var client = new Dropbox.Client({
	key:'mqxinfiibo2kq4t',
	secret:'tcnknprauyc9ime'
});

var user = {},
	songs = [];

exports.login = function(req, res){
	client.authDriver(new Dropbox.AuthDriver.NodeServer({port:8191}));

	client.authenticate(function(error, authClient){
		if(error) throw new Error(error);
		console.log('CLIENT AUTHENTICATED');
		console.log(authClient);
		client = authClient;
		user.token = authClient._oauth._token;

		client.getAccountInfo(function(error, info){
			if(error) throw new Error(error);
			console.log('User info:');
			console.log(info);
			user.name = info.name;
			user.email = info.email;

			User.create(user, function(err, newUsr){
				if(err) throw new Error(err);
				user = newUsr;
			});
		});

		res.redirect('/app');
	});
};

exports.app = function(req,res){

	client.search('/', 'Rockolapp', {limit:10 } ,function(err, results){
		if(err) throw new Error();

		var folderFound = false, mp3s = [];
		
		if(results.length >  0)
		{
			for(var i=0;i<results.length && !folderFound;i++)
			{
				folderFound = (results[i].isFolder && results[i].path == '/Rockolapp');
				console.log(results[i]);
			}
		}
		console.log('Folder found: ');
		console.log(folderFound);
		if(folderFound){
			client.readdir('/Rockolapp', function(err, entriesString, dirStatus, entriesStatus){
				if(err) throw new Error(err);

				if(entriesStatus.length > 0)
				{

					entriesStatus.forEach(function(entrie){
						songsTasks.saveSong(entrie, user, client, function(err, result){
							if(err) throw new Error(err);
							song.push(result);
						});
					});
				}
				else
				{
					console.log(' NO SONGS');
				}
			});
		}
		else
		{
			client.mkdir('/Rockolapp', function(err, folderStat){
				if(err) throw new Error(err);

				console.log('Folder Rockolapp created');
			});
		}
	});


	// client.getAccountInfo(function(error, info){
	// 	if(error) throw new Error(error);
	// 	console.log('User info:');
	// 	console.log(info);
	// 	userName = info.name;
	// 	client.readdir("/Rockolapp", function(error, entries){
	// 		if(error) {
	// 			console.log(error);
	// 			throw new Error(error);
	// 		}
	// 		console.log('Entries');
	// 		console.log(entries);
	// 		songs = entries;
	// 		res.render('index', {
	// 			user: userName,
	// 			songs: entries
	// 		});
	// 	});
	// });
};

exports.song = function(req, res){
	var songName = req.params.songName;
	console.log(songName);

	client.makeUrl(songName, {download:true} , function(err, data){
		if(err) throw new Error(err);

		var parser = mp3Metada(request(data.url).pipe(fs.createReadStream(songName)), {duration:true});

		parser.on('metadata', function(result){
			console.log(result);
		});

		res.send({status:200, data:data.url});
	});
};

