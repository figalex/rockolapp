// Playlist model

var db = require('orm').db;

var Playlist = db.define('playlist', {
	name: String
}).hasMany('songs', db.models.song);

db.drop(function(){
	Playlist.sync(function(){

	});
});