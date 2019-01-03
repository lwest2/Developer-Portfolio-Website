var express = require('express');
var router = express.Router();
var assert = require('assert');
var mongoose = require('mongoose');
var fs = require('fs');
var multer = require('multer');
var upload = multer({
  dest: 'uploads/'
});
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
  recipient: {
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

var BlogSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  thumbnail: {
    data: Buffer,
    contentType: String
    // reference: https://medium.com/@alvenw/how-to-store-images-to-mongodb-with-node-js-fb3905c37e6d
  },
}, {
  collection: 'blogs'
});

var Blogs = mongoose.model('Blogs', BlogSchema);
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
    admin: req.session.admin
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
      };

      var data = new User(userData);
      // reference: https://stackoverflow.com/questions/48581681/node-app-crashes-when-receiving-a-duplicate-email-address-e11000-duplicate-key-e
      data.save();
    }

    res.redirect('/signup');
  });
});

router.get('/admin', function(req, res, next) {
  if (!req.session.admin) {
    res.status(401).send();
  } else {
    Blogs.find({},
      function(err, docs) {
        if (err) {
          console.log(err);
        }
        res.render('admin', {
          Title: 'DevLiamW - admin',
          logOut: req.session.logOut,
          admin: req.session.admin,
          blogs: docs
        });
      });
  }
});

// Admin Panel
// Manage Blogs
// Add Blog
router.post('/admin/addblog', upload.single('addblog_thumbnail'), function(req, res, next) {
  var blogData = {
    title: req.body.addblog_title,
    content: req.body.addblog_content,
    date: req.body.addblog_date,
    thumbnail: null
  };

  var blog = new Blogs(blogData);

  blog.thumbnail.data = fs.readFileSync(req.file.path);
  blog.thumbnail.contentType = 'image/png';

  blog.save(function(err) {
    if (err) {
      console.log("err: " + err)
    }
    res.redirect('/admin');
  });
});
// Get Blog
router.post('/admin/getblog', function(req, res, next) {

  Blogs.findOne({
      title: req.body.blogtitle
    },
    function(err, docs) {
      if (err) {
        console.log(err);
      } else if (docs) {
        var data = {
          title: docs.title,
          content: docs.content,
          date: docs.date
        };
        res.send(data);
      } else {
        console.log("No blogs found!");
      }
    });
});

// Edit Blog
router.post('/admin/editblog', function(req, res, next) {

});
// Delete Blog
router.post('/admin/deleteblog', function(req, res, next) {

});
// Show Blog

// Manage Portfolio
// Add Item
router.post('/admin/additem', function(req, res, next) {

});
// Edit Item
router.post('/admin/edititem', function(req, res, next) {

});
// Delete Item
router.post('/admin/deleteitem', function(req, res, next) {

});
//Show Item

var sockets = {};
var users = {};
var userswithuniqueID = {};

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
        // check if already in list

        if (socket.handshake.session.userValues.email in users) {
          console.log("email is already in users list");
        } else {
          socket.userID = socket.handshake.session.userValues.email;
          console.log("Should equal to user email: " + socket.userID);
          users[socket.userID] = socket;
          console.log("socket: " + socket);
        }
        updateUserList();
      }

    });

    function updateUserList() {
      io.sockets.emit('updateUsers', Object.keys(users));
    }

    socket.on('input', function(data) {
      // when client inputs data
      var msg = data.message;
      var recipient;
      var author;

      // if admin sends msg, msg recipient is equal to selectedUser
      // else recipient is admin
      if (socket.handshake.session.userValues.admin) {
        var selectedUser = data.selectedUser;
        recipient = selectedUser
        author = socket.userID;
      } else {
        recipient = "liamwest1@hotmail.com";
        author = socket.userID;
      }

      var msgData = {
        message: msg,
        author: author,
        recipient: recipient,
        date: new Date()
      };

      var dataToSend = new Messages(msgData);
      dataToSend.save();

      // search array of sockets for selected user


      // for every user in users (email)
      if (socket.userID == "liamwest1@hotmail.com") {
        for (var key in users) {
          console.log("key " + key + "has value " + users[key]);
          var compareKey = "liamwest1@hotmail.com";
          if (key == compareKey) {
            var receiver = users[key].id;
            io.to(receiver).emit('new message', msgData);
            console.log("Key was liamwest1@hotmail.com and is sending to it");
          }
          if (key == selectedUser) {
            var receiver2 = users[key].id;
            io.to(receiver2).emit('new message', msgData);
            console.log("Key was selectedUser and is sending to it");
          }
        }
      } else {
        for (var key2 in users) {
          console.log("key " + key + "has value " + users[key2]);
          var compareKey = "liamwest1@hotmail.com";
          if (key2 == compareKey) {
            var receiver3 = users[key2].id;
            io.to(receiver3).emit('new message', msgData);
            console.log("Key was liamwest1@hotmail.com and is sending to it");
          }
          if (key2 == socket.userID) {
            var receiver4 = users[key2].id;
            io.to(receiver4).emit('new message', msgData);
            console.log("Key was selectedUser and is sending to it");
          }
        }
      }


    });

    socket.on('display', function(data) {
      // still needs implementing.
      // Problem:
      //  Gather all data relating to 1 conversation. (In order of time)
      //  Admin / User will be different (if statement required?)
      // Send message array back to client (client could be user or admin)
      if (socket.handshake.session.logOut) {
        var selectedUser = data.selectedUser;
        // if socket ID is liamwest1@hotmail.com
        // find Messages where
        // recipient: selectedUser && author: "liamwest1@hotmail.com"
        // or
        // recipient: "liamwest1@hotmail.com" && author: selectedUser

        // else (socketID is diff user)
        // find Messages where
        // recipient: "liamwest1@hotmail.com" && author: socketID
        // or
        // recipient: socketID && author: "liamwest1@hotmail.com"
        console.log("userID is: " + socket.userID)
        if (socket.userID == "liamwest1@hotmail.com") {
          console.log("Finding messages");
          Messages.find({
            $or: [{
                recipient: selectedUser,
                author: socket.userID // liamwest1@hotmail.com
              },
              {
                recipient: socket.userID, // liamwest1@hotmail
                author: selectedUser
              }
            ]
          }).sort({
            date: -1
          }).exec(function(err, docs) {
            if (err) {
              console.log(err);
            }

            // emit to socket (load messages)
            users[socket.userID].emit('load messages', {
              messages: docs
            });
          });
        } else {
          console.log("Finding messages");
          Messages.find({
            $or: [{
                recipient: "liamwest1@hotmail.com",
                author: socket.userID // whoever sent the message
              },
              {
                recipient: socket.userID, // liamwest1@hotmail
                author: "liamwest1@hotmail.com"
              }
            ]
          }).sort({
            date: -1
          }).exec(function(err, docs) {
            if (err) {
              console.log(err);
            }

            console.log("userID: " + users[socket.userID]);
            // emit to socket (load messages)
            users[socket.userID].emit('load messages', {
              messages: docs
            });
          });
        }
      }
    });

    socket.on('disconnect', function(data) {
      if (!socket.userID) return;
      delete users[socket.userID];
      updateUserList();
    });
  });
}

module.exports = {
  sockets: sockets,
  router: router
}

// module.exports = router;