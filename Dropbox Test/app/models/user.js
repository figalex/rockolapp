// Users model

var db = require('orm').db;

var User = db.define('user', {
	name: String,
	email: String,
	token: String
}).hasMany('songs', db.models.song)
.hasMany('playlists', db.models.playlist);

db.drop(function(){
	User.sync(function(){

	});
});