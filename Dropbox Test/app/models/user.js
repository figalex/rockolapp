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
	dropboxUID: String
});

mongoose.model('user', userSchema);