// reference: https://www.youtube.com/watch?v=hb26tQPmPl4&t=4221s

var express = require('express');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var cookiepars = require('cookie-parser');
var bodypars = require('body-parser');