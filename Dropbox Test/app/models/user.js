// Users model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new Schema({
	name:{
		type:String,
		required:true
	},
	email: String,
	token: String,
});

mongoose.model('User', userSchema);



// var db = require('orm').db;

// var User = db.define('user', {
// 	name: String,
// 	email: String,
// 	token: String
// });

// db.drop(function(){
// 	User.sync(function(){

// 	});
// });