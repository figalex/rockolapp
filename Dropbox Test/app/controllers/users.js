var db = require('orm').db,
	Users = db.models.user;

exports.add = function(userData){
	Users.create(userData, function(err, user){
		if(err) throw new Error(err);
		console.log(user);
	});
};