  var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var mongoose = require('mongoose');

mongoose.set('debug', true);

var userSchema = new mongoose.Schema ({
                      photo: String,
                      username: String,
                      zipcode: {type: Number, required: true},
                      catname: String,
                      age: Number,
                      favtoys: String,
                      morecat: String,
                      moreowner:String,
                      email: {
                        type: String,
                        required: true,
                        lowercase: true,
                        unique: true
                        },
                      password: {type: String, required: true},
                      posts: [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Post"
                      }],
                      comments: [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Comment"
                      }]
                    });

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    return bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      return next();
    });
  });
});

userSchema.statics.authenticate = function (formData, callback) {
  this.findOne({
      email: formData.email
    },
    function (err, user) {
      console.log(user);
      if (user === null){
        callback("Invalid username or password",null);
      }
      else {
        user.checkPassword(formData.password, callback);
      }

    });
};

userSchema.methods.checkPassword = function(password, callback) {
  var user = this;
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (isMatch) {
      callback(null, user);
    } else {
      callback(err, null);
    }
  });
};
var User = mongoose.model("User", userSchema);
module.exports = User;