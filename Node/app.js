var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var hbs = require('express-handlebars')
var logger = require('morgan');
var methods = require('./routes/index');
var indexRouter = methods.router;
var expressValidator = require('express-validator');
var expressSession = require('express-session');

var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutDir: __dirname + '/views/layouts/'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(expressValidator());
app.use(cookieParser());
app.use('/public', express.static('public'));
var session = expressSession({
  secret: 'liam',
  saveUninitialized: false,
  resave: false
});

console.log("Initializing express Middleware");
app.use(session);

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {
  app: app,
  session: session
}
//module.exports = app;