var express = require('express');
var router = express.Router();
var assert = require('assert');
var mongoose = require('mongoose');
var fs = require('fs');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({
  storage: storage
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

var BanlistSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  }
}, {
  collection: 'banlist'
});

var Banlist = mongoose.model('Banlist', BanlistSchema);

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
  sortdate: {
    type: String,
    format: "date-time",
    required: true,
    description: "YYYY-MM- DDThh:mm:ssZ in UTC time"
  },
  thumbnail: {
    contentType: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    // reference: https://medium.com/@alvenw/how-to-store-images-to-mongodb-with-node-js-fb3905c37e6d
  },
}, {
  collection: 'blogs'
});

var Blogs = mongoose.model('Blogs', BlogSchema);

var PortfolioSchema = new Schema({
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
  sortdate: {
    type: String,
    format: "date-time",
    required: true,
    description: "YYYY-MM- DDThh:mm:ssZ in UTC time"
  },
  thumbnail: {
    contentType: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    // reference: https://medium.com/@alvenw/how-to-store-images-to-mongodb-with-node-js-fb3905c37e6d
  },
}, {
  collection: 'portfolio'
});

var Portfolio = mongoose.model('Portfolio', PortfolioSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  Blogs.findOne().sort({
    sortdate: -1
  }).exec(function(err, doc) {
    if (err) {
      console.log(err);
    } else if (doc) {
      // render with blog
      // get correct path depending on routes
      var pathFinal = doc.thumbnail.path;
      var pathReplace = pathFinal.replace(/\\/g, '/');

      res.render('index', {
        Title: 'DevLiamW - Homepage',
        logOut: req.session.logOut,
        admin: req.session.admin,
        blogTitle: doc.title,
        blogContent: doc.content,
        blogDate: doc.date,
        blogThumbnail: pathReplace,
        id: doc._id
      });
    } else {
      // render without blog
      res.render('index', {
        Title: 'DevLiamW - Homepage',
        logOut: req.session.logOut,
        admin: req.session.admin,
        blogTitle: null,
        blogContent: null,
        blogDate: null,
        blogThumbnail: null,
        id: null
      });
    }
  });
});

/* GET blog page. */
router.get('/blog', function(req, res, next) {
  Blogs.find().sort({
    sortdate: -1
  }).exec(function(err, docs) {
    if (err) {
      console.log(err);
    } else if (docs) {
      // render with blog
      // get correct path depending on routes
      for (var i = 0; i < docs.length; i++) {
        var file = docs[i].thumbnail.path;
        file = file.replace(/\\/g, '/');
        docs[i].thumbnail.path = file;
      }

      res.render('blog', {
        Title: 'DevLiamW - Blog',
        logOut: req.session.logOut,
        admin: req.session.admin,
        blogsArray: docs
      });
    } else {
      // render without blog
      res.render('blog', {
        Title: 'DevLiamW - Blog',
        logOut: req.session.logOut,
        admin: req.session.admin,
        blogsArray: null
      });
    }
  });
});

router.get('/blogpost/:id', function(req, res, next) {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    Blogs.findById(req.params.id, function(err, blogpost) {
      if (err) {
        console.log("ERROR" + err);
      }
      var file = blogpost.thumbnail.path;
      file = file.replace(/\\/g, '/');
      file = file.replace('public', '/public');

      res.render('blogpost', {
        Title: 'DevLiamW - Blog Post',
        logOut: req.session.logOut,
        admin: req.session.admin,
        blogpostContent: blogpost.content,
        blogpostTitle: blogpost.title,
        blogpostDate: blogpost.date,
        blogpostThumbnail: file
      });
    });
  }
});

/* GET portfolio page. */
router.get('/portfolio', function(req, res, next) {

  Portfolio.find().sort({
    sortdate: -1
  }).exec(function(err, docs) {
    if (err) {
      console.log(err);
    } else if (docs) {
      // render with portfolio
      // get correct path depending on routes
      for (var i = 0; i < docs.length; i++) {
        var file = docs[i].thumbnail.path;
        file = file.replace(/\\/g, '/');
        docs[i].thumbnail.path = file;
      }

      console.log(docs);

      res.render('portfolio', {
        Title: 'DevLiamW - Portfolio',
        logOut: req.session.logOut,
        admin: req.session.admin,
        portfolioArray: docs
      });
    } else {
      // render without portfolio
      res.render('portfolio', {
        Title: 'DevLiamW - Portfolio',
        logOut: req.session.logOut,
        admin: req.session.admin,
        portfolioArray: null
      });
    }
  });
});


router.get('/portfolioitem/:id', function(req, res, next) {
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    Portfolio.findById(req.params.id, function(err, portfolioitem) {
      if (err) {
        console.log("ERROR" + err);
      }
      var file = portfolioitem.thumbnail.path;
      file = file.replace(/\\/g, '/');
      file = file.replace('public', '/public');

      res.render('portfolioitem', {
        Title: 'DevLiamW - Portfolio Item',
        logOut: req.session.logOut,
        admin: req.session.admin,
        portfolioitemContent: portfolioitem.content,
        portfolioitemTitle: portfolioitem.title,
        portfolioitemDate: portfolioitem.date,
        portfolioitemThumbnail: file
      });
    });
  }
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

  Banlist.findOne({
    email: req.body.emailSignup
  }, function(err, bannedUser) {
    if (bannedUser) {
      // if banned user matches send error
      var errorBan = {
        param: "emailSignup",
        msg: "User is banned",
        value: req.body.emailSignup
      };
      errors.push(errorBan);
    } else {
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
    }
  });
});
router.get('/admin', function(req, res, next) {
  if (!req.session.admin) {
    res.status(401).send();
  } else {
    Blogs.find({},
      function(err, blogpost) {
        if (err) {
          console.log(err);
        }

        Portfolio.find({}, function(err, portfolioitem) {
          if (err) {
            console.log(err);
          }
          res.render('admin', {
            Title: 'DevLiamW - admin',
            logOut: req.session.logOut,
            admin: req.session.admin,
            blogs: blogpost,
            portfolio: portfolioitem

          });
        });
      });
  }
});

// Admin Panel
// Manage Users
// Get Users
router.post('/admin/getusers', function(req, res, next) {
  User.find({}, function(err, docs) {
    if (err) {
      console.log(err);
    } else if (docs) {
      res.send(docs);
    } else {
      docs = null;
      res.send(docs);
    }
  });
});
// Remove Users
router.post('/admin/removeusers', function(req, res, next) {
  var arraySelected = JSON.parse(req.body.userlist); // array ?
  console.log("Array in server: " + arraySelected);
  for (var i = 0; i < arraySelected.length; i++) {
    console.log("USER TO DELETE: " + users[i]);
    User.findOne({
      email: arraySelected[i]
    }, function(err, docs) {
      if (err) {
        console.log(err);
      } else if (docs) {
        docs.remove(function(err) {
          if (err) {
            console.log(err);
          }
          res.send("Deleted users");
        });
      } else {
        res.send("Did not delete users");
      }
    });
  }
});
// ban Users
router.post('/admin/banusers', function(req, res, next) {
  var arraySelected = JSON.parse(req.body.userlist); // array ?
  console.log("Array in server: " + arraySelected);
  for (var i = 0; i < arraySelected.length; i++) {
    console.log("USER TO DELETE: " + users[i]);

    var banData = {
      email: users[i]
    }
    var ban = new Banlist(banData);

    ban.save(function(err) {
      if (err) {
        console.log(err);
      }
      res.send("Ban saved");
    })
  }
});

// Manage Blogs
// Add Blog
router.post('/admin/addblog', upload.single('addblog_thumbnail'), function(req, res, next) {
  var blogData = {
    title: req.body.addblog_title,
    content: req.body.addblog_content,
    date: req.body.addblog_date,
    thumbnail: req.file,
    sortdate: new Date()
  };

  blogData.thumbnail.path = req.file.path;
  blogData.thumbnail.contentType = req.file.mimetype;
  blogData.thumbnail.name = req.file.originalname;
  blogData.thumbnail.size = req.file.size;

  var blog = new Blogs(blogData);

  console.log("Path = " + req.file.path);

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
          date: docs.date,
          thumbnail: docs.thumbnail
        };
        res.send(data);
      } else {
        var data = null;
        res.send(data);
      }
    });
});
// Edit Blog
router.post('/admin/editblog', upload.single('editblog_thumbnail'), function(req, res, next) {
  Blogs.findOne({
      title: req.body.selectitem3
    },
    function(err, docs) {
      if (err) {
        console.log(err);
      } else if (docs) {

        docs.title = req.body.editblog_title;
        docs.content = req.body.editblog_content;
        docs.date = req.body.editblog_date;

        fs.unlinkSync(docs.thumbnail.path);
        docs.thumbnail.path = req.file.path;
        docs.thumbnail.contentType = req.file.mimetype;
        docs.thumbnail.name = req.file.originalname;
        docs.thumbnail.size = req.file.size;

        docs.save(function(err) {
          if (err) {
            console.log("err: " + err)
          }
          res.redirect('/admin');
        });
      } else {
        res.redirect('/admin');
      }
    });
});
// Delete Blog
router.post('/admin/deleteblog', function(req, res, next) {
  Blogs.findOne({
      title: req.body.blog
    },
    function(err, docs) {
      if (err) {
        console.log(err);
      } else if (docs) {
        fs.unlinkSync(docs.thumbnail.path);

        docs.remove(function(err) {
          if (err) {
            console.log("err: " + err)
          }
          console.log("Removed from DB");
          res.send('delete successful');
        });
      } else {
        console.log("Nothing to delete");
        res.send('delete unsuccessful');
      }
    });
});
// Show Blog

// Manage Portfolio
// Add Item
router.post('/admin/additem', upload.single('addportfolio_thumbnail'), function(req, res, next) {
  var blogData = {
    title: req.body.addportfolio_title,
    content: req.body.addportfolio_content,
    date: req.body.addportfolio_date,
    thumbnail: req.file,
    sortdate: new Date()
  };

  blogData.thumbnail.path = req.file.path;
  blogData.thumbnail.contentType = req.file.mimetype;
  blogData.thumbnail.name = req.file.originalname;
  blogData.thumbnail.size = req.file.size;

  var portfolio = new Portfolio(blogData);

  console.log("Path = " + req.file.path);

  portfolio.save(function(err) {
    if (err) {
      console.log("err: " + err)
    }
    res.redirect('/admin');
  });
});
// Get Item
router.post('/admin/getitem', function(req, res, next) {

  Portfolio.findOne({
      title: req.body.itemtitle
    },
    function(err, docs) {
      if (err) {
        console.log(err);
      } else if (docs) {
        var data = {
          title: docs.title,
          content: docs.content,
          date: docs.date,
          thumbnail: docs.thumbnail
        };
        res.send(data);
      } else {
        var data = null;
        res.send(data);
      }
    });
});
// Edit Item
router.post('/admin/edititem', upload.single('editportfolio_thumbnail'), function(req, res, next) {
  Portfolio.findOne({
      title: req.body.selectitem2
    },
    function(err, docs) {
      if (err) {
        console.log(err);
      } else if (docs) {

        docs.title = req.body.editportfolio_title;
        docs.content = req.body.editportfolio_content;
        docs.date = req.body.editportfolio_date;

        fs.unlinkSync(docs.thumbnail.path);
        docs.thumbnail.path = req.file.path;
        docs.thumbnail.contentType = req.file.mimetype;
        docs.thumbnail.name = req.file.originalname;
        docs.thumbnail.size = req.file.size;

        docs.save(function(err) {
          if (err) {
            console.log("err: " + err)
          }
          res.redirect('/admin');
        });
      } else {
        res.redirect('/admin');
      }
    });
});
// Delete Item
router.post('/admin/deleteitem', function(req, res, next) {
  Portfolio.findOne({
      title: req.body.item
    },
    function(err, docs) {
      if (err) {
        console.log(err);
      } else if (docs) {
        fs.unlinkSync(docs.thumbnail.path);

        docs.remove(function(err) {
          if (err) {
            console.log("err: " + err)
          }
          console.log("Removed from DB");
          res.send('delete successful');
        });
      } else {
        console.log("Nothing to delete");
        res.send('delete unsuccessful');
      }
    });
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
      dataToSend.save(function(err) {
        if (err) {
          console.log(err);
        }
      });

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