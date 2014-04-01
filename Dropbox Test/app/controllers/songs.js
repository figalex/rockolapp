
var db = require('orm').db,
	Songs = db.models.song,
	mp3Metada = require('musicmetadata'),
	fs = require('fs'),
	request = require('request');

exports.saveSong = function(songFile, user, dboxClient){
	console.log(user);
	dboxClient.makeUrl(songFile.path, {download:true} , function(err, data){
		if(err) throw new Error(err);
		console.log(data.url);
		var parser = mp3Metada(request(data.url), {duration:true});

		parser.on('metadata', function(result){
			console.log(result);
			console.log(user);
			Songs.create(
			{
				title:result.title || 'Title',
				artist:result.artist || 'Artist',
				album:result.album || 'Album',
				length:result.duration || 0,
				user: user
			}, function(err, song){
				if(err) throw new Error(err);
				console.log(song);
				return song;
			});
		});
	});
};