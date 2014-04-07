var Dropbox = require('dropbox'),
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

			usersTasks.create(user, function(err, newUser){
				if(err) throw new Error();

				user = newUser;
			});
		});

		res.redirect('/scan');
	});
};

exports.scan = function(req, res){
	res.render('home/scan', {});
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
							songs.push(result);
						});
					});
				}
				else
				{
					console.log(' NO SONGS');
				}

				res.render('index', {
					user: user,
					songs: songs
				});
			});
		}
		else
		{
			client.mkdir('/Rockolapp', function(err, folderStat){
				if(err) throw new Error(err);

				console.log('Folder Rockolapp created');
				res.render('index', {
					user: user,
					songs: songs
				});
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
	var songID = req.params.songName;
	console.log(songID);

	songsTasks.get(songID, function(err, songObj){
		if(err) throw new Error();

		res.send(songObj);
	});
};

