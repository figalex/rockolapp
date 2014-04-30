'use strict';

var Dropbox = require('dropbox'),
    songsTasks = require('./songs'),
    usersTasks = require('./users'),
    formidable = require('formidable'),
    fs = require('fs');

var client = new Dropbox.Client({
    key: 'mqxinfiibo2kq4t',
    secret: 'tcnknprauyc9ime'
});

var user = {},
    songs = [],
    auxCount = 0;

exports.login = function(req, res) {
    debugger;
    var server = new Dropbox.AuthDriver.NodeServer({
        port: 8191
    });
    client.authDriver(server);

    client.authenticate(function(error, authClient) {
        if (error) throw new Error(error);
        console.log('CLIENT AUTHENTICATED');
        debugger;
        client = authClient;
        user.token = authClient.credentials().token;
        user.dropboxUID = authClient.credentials().uid;

        client.getAccountInfo(function(error, info) {
            if (error) throw new Error(error);
            console.log('User info:');
            console.log(info);
            debugger;
            user.name = info.name;
            user.email = info.email;

            usersTasks.lookUp({email:user.email}, function(err, userFound) {
                if (err) throw new Error();

                debugger;
                if (!userFound) {
                    usersTasks.create(user, function(err, newUser) {
                        if (err) throw new Error();

                        user = newUser;
                    });
                } else {
                    user = userFound.info;
                    songs = userFound.songs;
                }
            });
        });
        server.closeServer();
        res.redirect('/scan');
    });
};


exports.scan = function(req, res) {
    res.render('home/scan', {});
};


exports.app = function(req, res) {
    if (songs.length < 1) {

        client.search('/', 'Rockolapp', {limit: 10}, function(err, results) {
            debugger;
            if (err) {
                res.redirect('/');
                return;
            }

            var folderFound = false,
                mp3s = [];

            if (results.length > 0) {
                for (var i = 0; i < results.length && !folderFound; i++) {
                    folderFound = (results[i].isFolder && results[i].path == '/Rockolapp');
                }
            }

            if (folderFound) {
                client.readdir('/Rockolapp', function(err, entriesString, dirStatus, entriesStatus) {
                    if (err) throw new Error(err);

                    if (entriesStatus.length > 0) {

                        entriesStatus.forEach(function(entrie) {
                            songsTasks.saveSong(entrie, user, client, function(err, result) {
                                if (err) throw new Error(err);
                                songs.push(result);

                                if (songs.length == entriesStatus.length) {
                                    res.render('index', {
                                        user: user,
                                        songs: songs
                                    });
                                }
                            });
                        });
                    } else {
                        console.log(' NO SONGS');
                        res.render('index', {
                            user: user,
                            songs: songs
                        });
                    }
                });
            } else {
                client.mkdir('/Rockolapp', function(err, folderStat) {
                    if (err) throw new Error(err);

                    console.log('Folder Rockolapp created');

                    res.render('index', {
                        user: user,
                        songs: songs
                    });
                });
            }
        });
    } else {
        res.render('index', {
            user: user,
            songs: songs
        });
    }
};

exports.song = function(req, res){
    var songID = req.params.songName;
    console.log(songID);

    songsTasks.get(songID, function(err, songObj) {
        if (err) throw new Error();

        res.send(songObj);
    });
};

exports.upload = function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        if (err) throw new Error(err);

        fs.readFile(files.file.path, function(err, data) {
            if (err) throw new Error(err);

            client.writeFile('Rockolapp/' + files.file.name, data, function(err, stat) {
                if (err) throw new Error(err);

                songsTasks.saveSong(stat, user, client, function(err, result) {
                    if (err) throw new Error(err);
                    songs.push(result);
                    res.redirect('/app');
                });
            });
        });
    });
};

exports.enter = function(req, res){
    debugger;
    var userEmail = req.params.email;

    usersTasks.lookUp({email:userEmail}, function(err, userFound) {
        if (err) throw new Error();

        if (!userFound) {
            res.redirect('/');
        } else {

            var dboxCredentials = client.credentials();
            dboxCredentials.token = user.token;
            dboxCredentials.uid = user.dropboxUID;

            client = new Dropbox.Client(dboxCredentials);

            client.authenticate({interactive:false}, function(error){
                if(error){
                    res.redirect('/');
                }

                if(client.isAuthenticated()){
                    user = userFound.info;
                    songs = userFound.songs;
                    res.redirect('/app');
                }
            });
        }
    });
};

exports.logOut = function(req,res){
    songs = [];
    user = {};
    res.redirect('/');
}
