// Song model
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var songSchema = new Schema({
	title:String,
	artist:String,
	album:String,
	length:Number,
	url:String,
	user:{
		type:Schema.ObjectId,
		ref:'User'
	}
});

mongoose.model('song', songSchema);


// var db = require('orm').db;

// var Song = db.define('song', {
// 	title: String,
// 	artist: String,
// 	album: String,
// 	length: Number,
// 	url: String,
// }).hasOne('user', db.models.user, {reverse: "songs"});

// db.drop(function(){
// 	Song.sync(function(){

// 	});
// });