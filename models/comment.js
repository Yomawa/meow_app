var mongoose = require("mongoose");
var commentSchema = new mongoose.Schema({
     //comment comes from one post and one user that's why is not an array
                    commentContent: String,
                    date: Date,
                    post:{
                         type: mongoose.Schema.Types.ObjectId,
                         ref: "Post"
                         },
                    author:{
                              type: mongoose.Schema.Types.ObjectId,
                              ref: "User"
                              },
                  });
var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
