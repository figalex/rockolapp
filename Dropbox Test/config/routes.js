module.exports = function(app){

	//home route
	var home = require('../app/controllers/home');
	app.get('/', home.index);


	var auth = require('../app/controllers/auth');

	app.get('/auth', auth.login);

	//View that will be displayed when the app is sacanning the dropbox folder
	app.get('/scan', auth.scan);

	app.get('/app', auth.app);

	app.get('/song/:songName', auth.song);

    app.post('/upload', auth.upload);

};
