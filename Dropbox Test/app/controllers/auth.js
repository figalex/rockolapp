'use strict';

var Dropbox = require('dropbox'),
    songsTasks = require('./songs'),
    usersTasks = require('./users'),
    formidable = require('formidable'),
    fs = require('fs');

var client = new Dropbox.Client({
    key:'mqxinfiibo2kq4t',
    secret:'tcnknprauyc9ime'
});

var user = {},
    songs = [],
    auxCount = 0;

exports.login = function(req, res){
    client.authDriver(new Dropbox.AuthDriver.NodeServer({port:8191}));

    client.authenticate(function(error, authClient){
        if(error) throw new Error(error);
        console.log('CLIENT AUTHENTICATED');
        client = authClient;
        user.token = authClient._oauth._token;

        client.getAccountInfo(function(error, info){
            if(error) throw new Error(error);
            console.log('User info:');
            console.log(info);
            user.name = info.name;
            user.email = info.email;

            usersTasks.create(user, function(err, newUser){
                if(err) throw new Error();

                user = newUser;
            });
        });

        res.redirect('/scan');
    });
};

exports.scan = function(req, res){
    res.render('home/scan', {});
};


exports.app = function(req,res){

    client.search('/', 'Rockolapp', {limit:10 } ,function(err, results){
        if(err) throw new Error();

        var folderFound = false, mp3s = [];

        if(results.length >  0)
        {
            for(var i=0;i<results.length && !folderFound;i++)
            {
                folderFound = (results[i].isFolder && results[i].path == '/Rockolapp');
                console.log('RESULTADOS');
                console.log(results[i]);
            }
        }

        if(folderFound){
            client.readdir('/Rockolapp', function(err, entriesString, dirStatus, entriesStatus){
                if(err) throw new Error(err);

                if(entriesStatus.length > 0)
                {
                    console.log('FOLDER ENTRIES');
                    console.log(entriesStatus);
                    // songsTasks.saveSongs(entriesStatus, user, client, function(err, result){
                    //     songs = result;
                    // });


                    entriesStatus.forEach(function(entrie){
                        songsTasks.saveSong(entrie, user, client, function(err, result){
                            if(err) throw new Error(err);

                            var alreadyIn = false;
                            for(var e=0;e<songs.length;e++)
                            {
                                if(songs[e].title === result.title)
                                {
                                    alreadyIn = true;
                                }
                            }

                            if(!alreadyIn)
                            {
                                songs.push(result);
                            }


                            if(auxCount === entriesStatus.length-1)
                            {
                                auxCount = 0;
                                res.render('index', {
                                    user: user,
                                    songs: songs
                                });
                            }
                            else
                            {
                                auxCount++;
                            }
                        });
                    });
                }
                else
                {
                    console.log(' NO SONGS');
                    res.render('index', {
                        user: user,
                        songs: songs
                    });
                }
            });
        }
        else
        {
            client.mkdir('/Rockolapp', function(err, folderStat){
                if(err) throw new Error(err);

                console.log('Folder Rockolapp created');
                res.render('index', {
                    user: user,
                    songs: songs
                });
            });
        }
    });
};

exports.song = function(req, res){
    var songID = req.params.songName;
    console.log(songID);

    songsTasks.get(songID, function(err, songObj){
        if(err) throw new Error();

        res.send(songObj);
    });
};

exports.upload = function(req, res){
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){
        if(err) throw new Error(err);

        fs.readFile(files.file.path, function(err, data){
            if(err) throw new Error(err);

            client.writeFile('Rockolapp/'+files.file.name, data, function(err, stat){
                if(err) throw new Error(err);

                res.redirect('/app');
            });
        });
    });
};

