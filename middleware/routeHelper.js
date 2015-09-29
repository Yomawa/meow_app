var db = require("../models");

var routeHelpers = {
  ensureLoggedIn: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();
    }
    else {
     res.redirect('/login');
    }
  },

  ensureCorrectPostUser: function(req, res, next) {
    db.Post.findById(req.params.id).populate('user').exec(function(err,post){
      if (post.user.id !== req.session.id) {
        res.redirect('/posts');
      }
      else {
       return next();
      }
    });
  },
  ensureCorrectUser: function(req, res, next) {
    db.User.findById(req.params.id, function(err,user){
      if (user.id !== req.session.id) {
        res.redirect('/');
      }
      else {
       return next();
      }
    });
  },

  preventLoginSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/posts');
    }
    else {
     return next();
    }
  }
};
module.exports = routeHelpers;