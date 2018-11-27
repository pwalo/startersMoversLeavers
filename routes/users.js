const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');
let UserRole = require('../models/user_roles');

// Add Route - Add User
router.get('/add', function(req, res){
  res.render('users_add', {
    title:'Create New App User'
  });
});

// Add Route - Submit POST
router.post('/add', function(req, res){
    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('lastName', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email Address is required').notEmpty();
  
    // Get Errors
    let errors = req.validationErrors();
  
    if(errors){
      res.render('users_add', {
        title:'Create New App User',
        errors:errors
        
        }); 
    } else {
      let user = new User();
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      console.log('POST: New User Created.  Name: '+user.firstName+' '+user.lastName);
      console.log('POST: with email: '+user.email);

      user.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'User Created: \"'+user.email+'\"');
          res.redirect('/users/edit');
        }
    });
  }
});

// Add Route - Load Edit Individual Option Form
router.get('/edit/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    res.render('users_edit', {
      title:'Update User',
      user:user
    });
  });
});

// User List Route
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

// Add Route - Update Submit POST
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

// Add Route - User Registration Form
router.get('/register', function(req, res){
  res.render('users_register', {
    title: 'New User Registration'
  })
});

// Add Route - User Registration Submission
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


// User Assigned Roles
router.get('/roles', function(req, res){
  User.find({}, function(err, users){
    UserRole.find({}, function(err2, userRoles){
      if(err){
        console.log(err);
        if(err2){
          console.log(err2);
        }

      } else {
        res.render('users_and_roles_list_edit', {
          title:'Update Users',
          users: users,
          userRoles: userRoles
        });
      }
    });
  });
});

module.exports = router;
