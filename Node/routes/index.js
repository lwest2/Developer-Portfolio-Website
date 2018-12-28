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
  }
}, {
  collection: 'users'
});

var User = mongoose.model('User', UserSchema);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    Title: 'DevLiamW - Homepage'

  });
});

/* GET blog page. */
router.get('/blog', function(req, res, next) {
  res.render('blog', {
    Title: 'DevLiamW - Blog'

  });
});

router.get('/blogpost', function(req, res, next) {
  res.render('blogpost', {
    Title: 'DevLiamW - Blog Post'
  });
});

/* GET portfolio page. */
router.get('/portfolio', function(req, res, next) {
  res.render('portfolio', {
    Title: 'DevLiamW - Portfolio'

  });
});

router.get('/portfolioitem', function(req, res, next) {
  res.render('portfolioitem', {
    Title: 'DevLiamW - Portfolio Item'

  });
});

router.get('/signin', function(req, res, next) {
  res.render('signin', {
    Title: 'DevLiamW - Sign In'

  });
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
        password: hash
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
    Title: 'DevLiamW - admin'
  });
});

module.exports = router;