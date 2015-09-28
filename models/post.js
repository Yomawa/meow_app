var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
                    title: String,
                    postContent: String,
                    date: Date,
                    url: String,
                    //votes: Number,
                    user: {//only one user
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "User"//mongoose.model("User", UserSchema);this is were we get User from
                    },
                    comments: [{//it is an array i have a lot of comments
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Comment"
                      }]
                  });


var Post = mongoose.model("Post", postSchema);//this creats collection and collection name,models are mongoose specificly//uses scheema//this weill we used in ref: it is very importnat

module.exports = Post;