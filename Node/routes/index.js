var express = require('express');
var router = express.Router();
var assert = require('assert');
var mongoose = require('mongoose');
//password encryption
var bcrypt = require('bcryptjs');
// Ux1gby6fno28IRcd

const uri = "mongodb://pstLiam:Ux1gby6fno28IRcd@cluster0-shard-00-00-7vtg3.mongodb.net:27017,cluster0-shard-00-01-7vtg3.mongodb.net:27017,cluster0-shard-00-02-7vtg3.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";
mongoose.connect(uri, {
  useNewUrlParser: true
}, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected");
  }
});
var Schema = mongoose.Schema;
var mongoose = mongoose.connection;
// reference: https://www.youtube.com/watch?v=h4A0-53Olm4&index=18&list=PL55RiY5tL51oGJorjEgl6NVeDbx_fO5jR

var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true
  },
  loggedIn: {
    type: Boolean
  },
  admin: {
    type: Boolean
  }
}, {
  collection: 'users'
});

var User = mongoose.model('User', UserSchema);

var MessageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  recipitent: {
    type: String,
    required: true
  },
  date: {
    type: String,
    format: "date-time",
    required: true,
    description: "YYYY-MM- DDThh:mm:ssZ in UTC time"
  },
}, {
  collection: 'messages'
});

var Messages = mongoose.model('Messages', MessageSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    Title: 'DevLiamW - Homepage',
    logOut: req.session.logOut,
    admin: req.session.admin
  });
});

/* GET blog page. */
router.get('/blog', function(req, res, next) {
  res.render('blog', {
    Title: 'DevLiamW - Blog',
    logOut: req.session.logOut,
    admin: req.session.admin

  });
});

router.get('/blogpost', function(req, res, next) {
  res.render('blogpost', {
    Title: 'DevLiamW - Blog Post',
    logOut: req.session.logOut,
    admin: req.session.admin
  });
});

/* GET portfolio page. */
router.get('/portfolio', function(req, res, next) {
  res.render('portfolio', {
    Title: 'DevLiamW - Portfolio',
    logOut: req.session.logOut,
    admin: req.session.admin

  });
});

router.get('/portfolioitem', function(req, res, next) {
  res.render('portfolioitem', {
    Title: 'DevLiamW - Portfolio Item',
    logOut: req.session.logOut,
    admin: req.session.admin
  });
});

router.post('/signout', function(req, res, next) {
  req.session.logOut = false;
  console.log("USER VALUES" + req.session.userValues);
  var userData = req.session.userValues;
  // change loggedin to false for user of session
  User.findOne({
    email: userData.email
  }, function(err, user) {
    if (user) {
      // if user exists
      if (user.loggedIn) {
        user.loggedIn = false;
        user.save(function(err) {
          if (err) {
            console.log("error saving userdata");
          }
        })
      } else {
        console.log("User is not loggedIn");
      }
    } else {
      console.log("Error finding user");
    }

    req.session.destroy();
    res.redirect('/');
  });
});

router.get('/signin', function(req, res, next) {
  res.render('signin', {
    Title: 'DevLiamW - Sign In',
    successSignin: req.session.sucessSignin,
    errorSignin: req.session.errorSignin,
    errorLoggedin: req.session.errorLoggedin,
    logOut: req.session.logOut,
    admin: req.session.admin,
    users: req.session.users
  });
});

router.post('/signin', function(req, res, next) {
  // check if email is in DB

  User.findOne({
    email: req.body.emailSignin
  }, function(err, user) {
    console.log("USER" + user);
    if (user) {
      // if user exists login
      // check password
      if (bcrypt.compareSync(req.body.passwordSignin, user.password)) {
        if (!user.loggedIn) {
          req.session.sucessSignin = true;
          req.session.errorSignin = false;
          req.session.errorLoggedin = false;
          user.loggedIn = true;
          req.session.logOut = true;

          // use to test if admin
          req.session.admin = user.admin;
          req.session.userValues = user;

          user.save(function(err) {
            if (err) {
              console.log("user update error");
            }
          });
          console.log("USER NOW LOGGED IN");
        } else {
          req.session.errorLoggedin = true;
          req.session.successSignin = false;
        }
      } else {
        req.session.successSignin = false;
        req.session.errorSignin = true;
        req.session.errorLoggedin = false;
        console.log("PASSWORD DOES NOT MATCH");
      }

    } else {
      req.session.successSignin = false;
      req.session.errorSignin = true;
      req.session.errorLoggedin = false;
      console.log("COULD NOT FIND EMAIL");
    }

    res.redirect('/signin');
  });
  // check password matches
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {
    Title: 'DevLiamW - Sign Up',
    success: req.session.success,
    errors: req.session.errors,
  });
  req.session.errors = null;
});

router.post('/signup', function(req, res, next) {

  // Checking validation
  req.check('emailSignup').isEmail().withMessage('Invalid E-mail address').equals(req.body.confEmailSignup).withMessage('E-mails do not match');

  req.check('passwordSignup').isLength({
    min: 8
  }).withMessage('Invalid password').equals(req.body.confPasswordSignup).withMessage('Passwords do not match.');

  var errors = req.validationErrors();

  User.findOne({
    email: req.body.emailSignup
  }, function(err, user) {
    console.log("USER: " + user);
    if (user) {
      var error = {
        param: "emailSignup",
        msg: "Email already exists",
        value: req.body.emailSignup
      };
      if (!errors) {
        errors = [];
      }
      errors.push(error);
    }

    console.log("ERRORS AFTER: " + errors);

    if (errors) {
      // if errors
      req.session.errors = errors;
      req.session.success = false;
    } else {
      // if success & no errors
      // add to db
      req.session.success = true;
      // Add to database

      // hash passwordSignup

      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(req.body.passwordSignup, salt);

      var userData = {
        email: req.body.emailSignup,
        password: hash,
        loggedIn: false,
        admin: false
      }

      var data = new User(userData);
      // reference: https://stackoverflow.com/questions/48581681/node-app-crashes-when-receiving-a-duplicate-email-address-e11000-duplicate-key-e
      data.save();
    }

    res.redirect('/signup');
  });
});

router.get('/admin', function(req, res, next) {
  res.render('admin', {
    Title: 'DevLiamW - admin',
    logOut: req.session.logOut,
    admin: req.session.admin
  });
});

var sockets = {};
var users = []; // List of users to display to admin

sockets.init = function(server) {
  console.log("Starting socket");
  var io = require('socket.io').listen(server);

  var sharedsession = require("express-socket.io-session");
  var methodssess = require('../app');
  var expressSessionMiddleware = methodssess.session;
  // reference: https://www.youtube.com/watch?v=8Y6mWhcdSUM
  io.use(sharedsession(expressSessionMiddleware, {
    autoSave: true
  }));

  io.sockets.on('connection', function(socket) {
    // client connected

    socket.on('new user', function() {
      // add new user Id

      // if loggedIn
      if (socket.handshake.session.logOut) {
        // check if already in array

        if (!users.includes(socket.handshake.session.userValues.email) && !socket.handshake.session.userValues.admin) {
          users.push(socket.handshake.session.userValues.email);
          socket.handshake.session.users = users;

        }

        // Test data
        users.push("Test 1");
        users.push("Test 2");
        socket.handshake.session.users = users;
      }
    });

    socket.on('input', function(data) {
      // when client inputs data

    });

    socket.on('display', function(data) {
      // if client is equal to admin
      if (socket.handshake.session.userValues.admin) {
        var selectedUser = data.selectedUser;

        // Sort and find all messages on DB relating to selectedUser (email)

        // Display in handlebars the messages
      }
    });

  });
}

module.exports = {
  sockets: sockets,
  router: router
}

// module.exports = router;