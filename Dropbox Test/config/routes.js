module.exports = function(app){

	//home route
	var home = require('../app/controllers/home');
	app.get('/', home.index);

	var auth = require('../app/controllers/auth');
	app.get('/auth', auth.login);

	app.get('/app', auth.app);

	app.get('/song/:songName', auth.song);

};
