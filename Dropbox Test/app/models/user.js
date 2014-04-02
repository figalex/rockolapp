// Users model

var db = require('orm').db;

var User = db.define('user', {
	name: String,
	email: String,
	token: String
});

// db.drop(function(){
// 	User.sync(function(){

// 	});
// });