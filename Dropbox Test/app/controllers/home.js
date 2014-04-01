var db = require('orm').db,
  Article = db.models.article,
  dropbox = require('dropbox');

exports.index = function(req, res){
    res.render('home/index', {});
};
