var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    session = require("cookie-session"),
    db = require('./models'),

   
 //YELP
     /*oauthSignature = require('oauth-signature'),  
     n = require('nonce')(),  
     request = require('request'),  
     qs = require('querystring'),  */
 /*_ = require('lodash');*/

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

app.get("/users/:user_id/chat", routeMiddleware.ensureLoggedIn, function (req,res){
  var yelp = require("yelp").createClient({
    consumer_key: process.env.CONSUMER_KEY, 
    consumer_secret: process.env.CONSUMER_SECRET,
    token: process.env.TOKEN,
    token_secret: process.env.TOKEN_SECRET
  });
  // Request API access: http://www.yelp.com/developers/getting_started/api_access
  // find first user by session (this is logged in user)
  db.User.findById(req.session.id,function (err1, user1){
    // find second user by params.user_id (this is user you want to chat with)
    db.User.findById(req.params.user_id, function (err2, user2){
      // make api call with first user's zipcode
      yelp.search({term: "coffee", location: user1.zipcode, limit: 2}, function (error1, data1) {
        // make api call with second user's zip code
        yelp.search({term: "coffee", location: user2.zipcode, limit: 2}, function (error2, data2) {          
          // render the chat page, pass in both the users and both of their api call response datas
          res.render("users/chat", {data1: data1, data2: data2, user1: user1, user2: user2});
         /*res.send(data); */ 
        });
      });
    });
  });
});
//pseudo code
//search user by session id
//make yelps search uer's .zipcode 
//return 

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
app.get("/posts", routeMiddleware.ensureLoggedIn, function (req,res){
  db.Post.find({}).populate("user").exec(function(err,posts){
    res.render("posts/index", {posts: posts.reverse()});
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
  db.Post.findById(req.params.id).deepPopulate("comments.author user").exec(function(err,outerPost){
      res.render("posts/show",{post:outerPost});
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
  db.Post.findById(req.params.post_id).populate("user comment").exec(function(err,comments){
    res.render("posts/show",{comments:comments}); 
  });
});
//CREATE COMMENT
 app.post("/posts/:post_id/comments",routeMiddleware.ensureLoggedIn, function(req,res){
  var newComment = new db.Comment(req.body.comment);//just creating an instance it is not saved in db yet just into a memory 
  newComment.author = req.session.id;//you are having a newComment.author is the same as the session id, litterally your are assigning to new comment outrh to be whatever your name is under logi ins
  newComment.post = req.params.post_id;//you have a new post adn it it is and it is getting 
  newComment.save(function(err, comments){
     if(err){
       console.log(err);
       res.render("comments/index");
     }else{
       db.Post.findById(req.params.post_id, function(err,post){
         post.comments.push(comments);
         // console.log(comments);
         post.save();
         res.redirect("/posts/"+req.params.post_id);
       });
     }
   });
 });
// START SERVER
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is listening on port 3000");
});