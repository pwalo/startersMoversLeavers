const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');
let UserRole = require('../models/user_roles');
let Company = require('../models/company');
let Site = require('../models/site');

// GET Manually Add New User (Form)
router.get('/add', function(req, res){
  res.render('users_add', {
    title:'Create New App User'
  });
});

// POST Manually add New User (Form Submission)
router.post('/add', function(req, res){
    
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const username = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;
  const forcePwdChange = true;
  
  req.checkBody('firstName', 'First name is required').notEmpty();
  req.checkBody('lastName', 'Last name is required').notEmpty();
  req.checkBody('email', 'Email Address is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('users_add', {
      title:'Create New App User',
      errors:errors
    }); 
  } else {
    let newUser = new User({
    firstName:firstName,
    lastName:lastName,
    email:email,
    username:username,
    password:password,
    forcePwdChange:forcePwdChange
    });
    
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'User Created: \"'+newUser.email+'\"');
            res.redirect('/users/edit');
            console.log('POST: New User Created.  Name: '+newUser.firstName+' '+newUser.lastName);
            console.log('POST: with email: '+newUser.email);
          }
        });
      });
    });
  }
});

// GET Edit Individual User Form
router.get('/edit/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    res.render('users_edit', {
      title:'Update User',
      user:user
    });
  });
});

// GET List of Users
router.get('/edit', function(req, res){
    User.find({}, function(err, users){
      if(err){
        console.log(err);
      } else {
        res.render('users_list_edit', {
          title:'Update Users',
          users: users
        });
      }
    });
  });

// POST edit user (form submission)
router.post('/edit/:id', function(req, res){
    let user = {};
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    console.log('POST: User Updated: '+user.email);
  
    let query = {_id:req.params.id}
  
    User.updateOne(query, user, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'User Updated: \"'+user.email+'\"');
        res.redirect('/users/edit');
      }
    });
  });

// GET - User Registration Form
router.get('/register', function(req, res){
  res.render('users_register', {
    title: 'New User Registration'
  })
});

// POST - User Registration (Form Submission)
router.post('/register', function(req, res){

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const username = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('firstName', 'First name is required').notEmpty();
  req.checkBody('lastName', 'Last name is required').notEmpty();
  req.checkBody('email', 'Email Address is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('users_register', {
      title:'Error on Registration ',
      errors:errors      
    }); 
  } else {
    let newUser = new User({
    firstName:firstName,
    lastName:lastName,
    email:email,
    username:username,
    password:password
    });
    
    
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'Registration Done, pls log in');
            res.redirect('/users/login');
            console.log('POST: New User Created.  Name: '+newUser.firstName+' '+newUser.lastName);
            console.log('POST: with username: '+newUser.username);
          }
        });
      });
    });
  }
});

// Login Form
router.get('/login', function(req, res){
  res.render('users_login', {
    title: 'Login'
  });
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
  console.log('Logged In');
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});


// Users and Roles List
router.get('/roles', function(req, res){
  User.find({}, function(err, users){
    UserRole.find({}, function(err, userRoles){
      Site.find({}, function(err, sites){
        if(err){
          console.log(err);
        } else {
          res.render('users_and_roles_list_edit', {
            title:'Just a pointless list used during development phase',
            users: users,
            userRoles: userRoles,
            sites: sites
          });
        }
      });
    });      
  });
});

// Assign Roles to Users Form
router.get('/roles/assignment', function(req, res){
  User.find({}, function(err, users){
    UserRole.find({}, function(err2, userRoles){
      Company.find({}, function(err2, companys){    
        if(err){
          console.log(err);
        } else {
          res.render('user_role_assignment', {
            title:'Update Users',
            users: users,
            userRoles: userRoles,
            companys: companys
          });
        }
      });
    });
  });
});

module.exports = router;
