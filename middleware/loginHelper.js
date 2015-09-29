var db = require("../models");

var loginHelpers = function (req, res, next) {//midelwre, we call next to go to server to next
  req.login = function (user) {
    req.session.id = user._id;//steping hands like in a bar
  };

  req.logout = function () {
    req.session.id = null;//claring session//clear hands the step
  };

  next();
};

module.exports = loginHelpers;