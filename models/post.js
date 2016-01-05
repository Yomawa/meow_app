var mongoose = require("mongoose");
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var postSchema = new mongoose.Schema({
                    title: String,
                    time : { type : Date, default: Date.now },
                    postContent: String,
                    like: Number,
                    /*date: {type:String, default: datePost},*/
                    url: String,
                    photo:String,
                    user: {//only one user
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "User"//mongoose.model("User", UserSchema);this is were we get User from
                    },
                    comments: [{//it is an array i have a lot of comments
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Comment"
                      }]
                  });

postSchema.plugin(deepPopulate);

var Post = mongoose.model("Post", postSchema);//this creats collection and collection name,models are mongoose specificly//uses scheema//this weill we used in ref: it is very importnat

module.exports = Post;