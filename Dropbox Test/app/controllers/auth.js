var Dropbox = require('dropbox');

var client = new Dropbox.Client({
	key:'mqxinfiibo2kq4t',
	secret:'tcnknprauyc9ime'
});

var userName,
	songs = [];

exports.login = function(req, res){
	client.authDriver(new Dropbox.AuthDriver.NodeServer({port:8191}));

	client.authenticate(function(error, authClient){
		if(error) throw new Error(error);
		console.log('CLIENT AUTHENTICATED')
		console.log(authClient);
		client = authClient;
		client.getAccountInfo(function(error, info){
			if(error) throw new Error(err);
			console.log('User info:');
			console.log(info);
			userName = info.name;
			client.readdir("/", function(error, entries){
				if(error) throw new Error(error);
				console.log('Entries');
				console.log(entries);
				songs = entries;
				res.render('home/songs', {
					user: userName,
					song: entries[0]
				});
			});
		});
	});

	
};

exports.oauth_callback = function(req, res){
	res.redirect('home/songs');
};

