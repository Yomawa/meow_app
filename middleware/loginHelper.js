var db = require("../models");

var loginHelpers = function (req, res, next) {//midelwre, we call next to go to server to next
  req.login = function (user) {
    req.session.id = user._id;//steping hands like in a bar
  };

  req.logout = function () {
    req.session.id = null;//claring session//clear hands the step
  };

  if (!req.session.id) {
    res.locals.currentUser = undefined;
    next();
  }
  else {
    db.User.findById(req.session.id, function(err,user){
      res.locals.currentUser = user;
      next();
  });
  }
};

module.exports = loginHelpers;