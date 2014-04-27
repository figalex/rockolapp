// Songs controller

var mongoose = require('mongoose'),
    Song = mongoose.model('Song'),
    mp3Metada = require('musicmetadata'),
    fs = require('fs'),
    request = require('request');

exports.saveSong = function(songFile, user, dboxClient, callback){
    dboxClient.makeUrl(songFile.path, {download:true} , function(err, data){
        if(err) { callback(err); return;}
        //console.log(data.url);
        var parser = mp3Metada(request(data.url), {duration:true});

        parser.on('metadata', function(result){
            //console.log(result);
            //console.log(user);

            var newSong = new Song({
                title:result.title || 'Title',
                artist:result.artist || 'Artist',
                album:result.album || 'Album',
                length:result.duration || 0,
                url: data.url
            });

            newSong.user = user;
            newSong.save(function(err, songCreated){
                if(err){callback(err);return;}
                //console.log(songCreated);
                callback(null, songCreated);
            });
        });
    });
};

exports.saveSongs = function(songsArray, user, dboxClient, callback){

    var songsAdded = [];

    songsArray.forEach(function(song){
        saveSong(song, user, dboxClient, function(err, songCreated){
            if(err) throw new Error();

            songsAdded.push(songCreated);
        });
    });

    callback(null, songsAdded);
};

exports.get = function(songID, callback){

    Song.findById(songID, function(err, songRequested){
        if(err){ callback(err); return;}

        callback(null, songRequested);
    });
};
