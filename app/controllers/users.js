// User controller

var mongoose = require('mongoose'),
	User = mongoose.model('User');

exports.create = function(userInfo, next){
	newUser = new User(userInfo);
	console.log("NEW USER!!");
	next(null, newUser);
};

// exports.add = function(userData){
// 	Users.create(userData, function(err, user){
// 		if(err) throw new Error(err);
// 		console.log(user);
// 	});
// };