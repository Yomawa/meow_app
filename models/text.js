var mongoose = require("mongoose");
//var deepPopulate = require('mongoose-deep-populate')(mongoose);

var textSchema = new mongoose.Schema({
                    message: String,
                     author: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "User"//mongoose.model("User", UserSchema);this is were we get User from
                    },
                     recipient: {//only one user
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "User"//mongoose.model("User", UserSchema);this is were we get User from
                    },
                    time : { type : Date, default: Date.now },
                    author_name: String,
                    photo: String
                    });
                   
var Text = mongoose.model("Text", textSchema);//this creats collection and collection name,models are mongoose specificly//uses scheema//this weill we used in ref: it is very importnat

module.exports = Text;