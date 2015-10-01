var mongoose = require("mongoose");
/*mongoose.connect("mongodb://localhost/meow_app");
*/
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/meow_app");


mongoose.set("debug",true);//in my terminal loogs out 
//morgen loges out server side loger 

module.exports.User = require("./user");
module.exports.Post = require("./post");//server the purpuse or conecting
module.exports.Comment = require("./comment");
