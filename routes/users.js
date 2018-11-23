const express = require('express');
const router = express.Router();

// Bring in User Model
let User = require('../models/user');

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

// Home Route
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

module.exports = router;
