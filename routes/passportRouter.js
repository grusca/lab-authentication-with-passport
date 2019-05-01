const express        = require("express");
const passport       = require('passport');  
const passportRouter = express.Router();
const ensureLogin    = require("connect-ensure-login");
             
// Require user model
const User = require('../models/user');

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// GET '/login'
passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", {"message": req.flash('error') } );
});


// GET '/signup'
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

// POST '/signup'
passportRouter.post('/signup', (req, res, next) => {
  const {username, password} = req.body;

  if (username === "" || password === "") {
    res.render("passport/signup", {message: "Indicate username and password"});
    return;
  }

  User.findOne({username})
    .then((user) => {
      if (user !== null) {
        res.render('passport/signup', {message: 'The username already exists'});
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPass = bcrypt.hashSync(password, salt);

      const newUser = new User ( {username, passport: hashedPass} );

      newUser.save( (err) => {
        if (err) res.render('passport/signup', {message: 'Something went wrong'});
        else res.redirect('/');
      });
    })
    .catch(error => next(error))

});



passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


module.exports = passportRouter;