var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    Title: 'DevLiamW - Homepage'

  });
});

router.get('/index.html', function(req, res, next) {
  res.render('index', {
    Title: 'DevLiamW - Homepage'

  });
});

/* GET blog page. */
router.get('/blog.html', function(req, res, next) {
  res.render('blog', {
    Title: 'DevLiamW - Blog'

  });
});

router.get('/blogpost.html', function(req, res, next) {
  res.render('portfolio', {
    Title: 'DevLiamW - Blog Post'
  });
});

/* GET portfolio page. */
router.get('/portfolio.html', function(req, res, next) {
  res.render('portfolio', {
    Title: 'DevLiamW - Portfolio'

  });
});

router.get('/portfolioitem.html', function(req, res, next) {
  res.render('portfolio', {
    Title: 'DevLiamW - Portfolio Item'

  });
});

router.get('/signin.html', function(req, res, next) {
  res.render('signin', {
    Title: 'DevLiamW - Sign In'

  });
});

router.get('/signup.html', function(req, res, next) {
  res.render('signup', {
    Title: 'DevLiamW - Sign Up'

  });
});

router.get('/admin.html', function(req, res, next) {
  res.render('admin', {
    Title: 'DevLiamW - admin'
  });
});

module.exports = router;