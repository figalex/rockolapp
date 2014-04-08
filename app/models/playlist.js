// Playlist model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var playlistSchema = new Schema({
	name:String,
	songs:[{
		type:Schema.ObjectId,
		ref:'Song'
	}]
});

mongoose.model('Playlist', playlistSchema);


// var db = require('orm').db;

// var Playlist = db.define('playlist', {
// 	name: String
// }).hasMany('songs', db.models.song)
// .hasOne('user', db.models.user, {reverse: 'playlists'});

// db.drop(function(){
// 	Playlist.sync(function(){

// 	});
// });