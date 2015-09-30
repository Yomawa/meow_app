var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    session = require("cookie-session"),
    db = require('./models');
    loginMiddleware = require("./middleware/loginHelper");
    routeMiddleware = require("./middleware/routeHelper");
    require('dotenv').load();

app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(loginMiddleware);
var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
methodOverride = require('method-override'),
db = require("./models"),
morgan = require("morgan");

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('tiny'));var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
methodOverride = require('method-override'),
db = require("./models"),
morgan = require("morgan");

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('tiny'));



//COOKIE SESSION
app.use(session({
  maxAge: 3600000,//time
  secret: 'supersecretro',//for communication session and cookie comunicate between each ohter via headers.
  name: "double chocochip"//for the browser
}));
// use loginMiddleware everywhere!
app.use(loginMiddleware);
/*********  ROUTES *********/

//ROOT for YELP
app.get("/users/search", routeMiddleware.ensureLoggedIn, function (req,res){
  // Request API access: http://www.yelp.com/developers/getting_started/api_access

var yelp = require("yelp").createClient({
  consumer_key: process.env.CONSUMER_KEY, 
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET
});

// See http://www.yelp.com/developers/documentation/v2/search_api
yelp.search({term: "coffee", location: "94110"}, function(error, data) {
  console.log(error);
  console.log(data);
});

// See http://www.yelp.com/developers/documentation/v2/business
yelp.business("yelp-san-francisco", function(error, data) {
  console.log(error);
  console.log(data);
  res.render("users/search",{data:data});
 });
});
//ROOT
app.get("/", routeMiddleware.ensureLoggedIn, function (req,res){
  console.log("Server works");
  res.redirect("/posts");
});
//INDEX
app.get("/users", function (req,res){
  db.User.find({},function (err, users){
    res.render("users/index", {users: users});
  });
});
//NEW - LOG IN
app.get("/login", routeMiddleware.preventLoginSignup, function (req,res){
  res.render("users/login");
});
//CREATE-LOG IN
app.post("/login", function (req,res){
  db.User.authenticate(req.body.user,
  function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("/posts");
    } else {
      // TODO - handle errors in ejs!
      res.render("users/login");
    }
  });
});
//NEW/SIGN UP
app.get("/signup", function (req,res){
  res.render("users/signup");
});
//CREATE a USER
app.post("/signup", function (req,res){
  var newUser = req.body.user;
  db.User.create(newUser, function (err, user){
    if(user) {
      req.login(user);
      res.redirect("/posts");
    } else {
      console.log(err);
      res.render("users/signup");
    }
  });
});
//LOGOUT
app.get("/logout", function (req, res){
  req.logout();
  res.redirect("/");
});
//NEW
/*app.get("/users/new", function(req, res){
  res.render("users/new");
});*/

//SHOW
app.get("/users/:id", routeMiddleware.ensureLoggedIn, function (req,res){
  db.User.findById(req.params.id, function(err, user){
    res.render("users/show",{user: user});
  });
});

//EDIT
app.get("/users/:id/edit",routeMiddleware.ensureLoggedIn, routeMiddleware.ensureCorrectUser, function (req, res){
  db.User.findById(req.params.id, function(err,user){
    /*if (err) throw err;*/
    res.render("users/edit", {user: user});
  });
});
//UPDATE
app.put("/users/:id",routeMiddleware.ensureLoggedIn, function (req,res){
  db.User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user){
    res.redirect("/users/"+user.id);//+user.id to stay on the same page
  });
});
//DELETE
app.delete("/users/:id", routeMiddleware.ensureLoggedIn, function (req,res){
  db.User.findByIdAndRemove(req.params.id, function(err, user){
    if (err) throw err;
      res.redirect("/users");
  });
});

// ******** POST ROUTES ********
//INDEX
app.get("/posts/", routeMiddleware.ensureLoggedIn, function (req,res){
  db.Post.find({}).populate("user").exec(function(err,posts){
    res.render("posts/index", {posts: posts});
  });
});
//NEW
app.get("/posts/new", function (req,res){
  res.render("posts/new");
});
//CREATE
app.post("/posts", routeMiddleware.ensureLoggedIn, function (req,res){
  var post = new db.Post(req.body.post);
  post.user = req.session.id;
  post.save(function(err, post){
    console.log(post);
    res.redirect("/posts");
  });
});
//SHOW
app.get("/posts/:id",routeMiddleware.ensureLoggedIn, function (req,res){
  db.Post.findById(req.params.id).populate("comments").populate("user", "username").populate("user","photo").exec(function(err,post){
    res.render("posts/show",{post:post});
  });
});
//EDIT
app.get("/posts/:id/edit", routeMiddleware.ensureLoggedIn, routeMiddleware.ensureCorrectPostUser, function (req,res){
  res.render("posts/edit");
});
//UPDATE
app.put("/posts/:id", function (req,res){
  res.redirect("/posts");
});
// DELETE
app.delete("/posts/:id", routeMiddleware.ensureLoggedIn, routeMiddleware.ensureCorrectPostUser, function (req,res){
  db.Post.findByIdAndRemove(req.params.id, function(err, post){
    res.redirect("/posts");
  });
});
// ******** COMMENTS ROUTES ********
//INDEX
app.get("/posts/:post_id/comments", function(req,res){
  db.Post.find({post:req.params.post_id}).populate("title").populate("user").populate("photo").exec(function(err,comments){
    res.render("comments/index",{comments:comments});
  });
});
//CREATE COMMENT
 app.post("/posts/:post_id/comments",routeMiddleware.ensureLoggedIn, function(req,res){
  db.Comment.create(req.body.comment, function(err, comments){
     if(err){
       console.log(err);
       res.render("comments/index");
     }else{
       db.Post.findById(req.params.post_id, function(err,post){
         post.comments.push(comments);
         console.log(comments);
         comments.post = post._id;
         comments.save();
         post.save();
         res.redirect("/posts/"+req.params.post_id);
       });
     }
   });
 });
// START SERVER
app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});