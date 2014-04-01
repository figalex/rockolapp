// Song model

var db = require('orm').db;

var Song = db.define('song', {
	title: String,
	artist: String,
	album: String,
	length: Number,
	url: String,
}).hasOne('user', db.models.user);

db.drop(function(){
	Song.sync(function(){

	});
});