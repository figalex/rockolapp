// User controller

var mongoose = require('mongoose'),
	ObjectId = require('mongoose').Types.ObjectId,
	User = mongoose.model('user'),
	Song = mongoose.model('song');

exports.create = function(userInfo, next){
	debugger;
	newUser = new User(userInfo);
	console.log("NEW USER!!");

	newUser.save(function(err, userCreated){
		if(err){ next(err);return;}

		next(null, userCreated);
	});
};

exports.lookUp = function(userObj, next){

	if('token' in userObj)
	{
		delete userObj.token;
	}

	var user = {
		info:{},
		songs:[]
	};

	User.findOne(userObj, function(err, userFound){
		if(err) {next(new Error(err));return;}
		debugger;
		if(userFound){
			user.info = userFound._doc;

			Song.find({user:user.info._id}, '_id title url', function(err, songs){
				if(err) {next(new Error(err));return;}

				user.songs = songs;

				next(null, user);
			});
		}
		else{
			next(null,null);
		}

	});
};