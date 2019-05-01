'use strict';

const createError    = require('http-errors');
const express        = require('express');
const path           = require('path');
const cookieParser   = require('cookie-parser');
const logger         = require('morgan');
const mongoose       = require('mongoose');
const config         = require('./config/config');
const router         = require('./routes/index');

// Session and Passport modules
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./config/passport-config");  // passport module setup and initial load
const passportStrategySetup = require('./config/passport-local-strategy');

mongoose
  .connect(`mongodb://localhost/${config.DB_NAME}`, { useNewUrlParser: true })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: config.SESSION_KEY,
  resave: false,
  saveUninitialized: false
}));

// PASSPORT LINES MUST BE BELOW SESSION
passport.use(passportStrategySetup);      // Auth Setup - user authentication during login
app.use(passport.initialize());           // Creates Passport's methods and properties on `req` for use in routes
app.use(passport.session());              // Sets Passport to manage user session

app.use('/', router);                     // Router
app.use(flash());                         // Allows routes to use FLASH MESSAGES


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler - set locals, only providing error in development
app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
