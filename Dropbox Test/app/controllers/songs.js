
var db = require('orm').db,
	Songs = db.models.song,
	Users = db.models.user,
	mp3Metada = require('musicmetadata'),
	fs = require('fs'),
	request = require('request');

exports.saveSong = function(songFile, user, dboxClient, callback){
	dboxClient.makeUrl(songFile.path, {download:true} , function(err, data){
		if(err) { callback(err); return;}
		console.log(data.url);
		var parser = mp3Metada(request(data.url), {duration:true});

		parser.on('metadata', function(result){
			console.log(result);
			console.log(user);

			Songs.create({
				title:result.title || 'Title',
				artist:result.artist || 'Artist',
				album:result.album || 'Album',
				length:result.duration || 0,
				url: data.url
			}, function(err, song){
				if(err) {callback(err); return;}
				Users.get(user.id, function(err, userForSong){
					if(err) {callback(err); return;}
					song.setUser(userForSong, function(err, songWithUser){
						if(err){callback(err); return;}
						callback(null, songWithUser);
					});
				});
			});

			// var newSong = new Songs({
			// 	title:result.title || 'Title',
			// 	artist:result.artist || 'Artist',
			// 	album:result.album || 'Album',
			// 	length:result.duration || 0,
			// 	url: data.url
			// });

			// Users.get(user.id, function(err, userForSong){
			// 	if(err) {callback(err); return;}
			// 	console.log(newSong);
			// 	console.log(newSong instanceof Songs);
			// 	newSong.setUser(userForSong, function(err, songWithUser){
			// 		if(err) {callback(err); return;}
			// 		var result = songWithUser || newSong;
			// 		callback(null, result);
			// 	});
			// });
		});
	});
};