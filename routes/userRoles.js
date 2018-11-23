const express = require('express');
const router = express.Router();

// Bring in User Role Model
let UserRole = require('../models/user_roles');

// Add Route - Add Role
router.get('/add', function(req, res){
  res.render('userRoles_add', {
    title:'Create New App User Role'
  });
});

// Add Route - Submit POST
router.post('/add', function(req, res){
    req.checkBody('role', 'Role is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
    req.checkBody('company', 'Company is required').notEmpty();
  
    // Get Errors
    let errors = req.validationErrors();
  
    if(errors){
      res.render('usersRole_add', {
        title:'Error on New User Role Form',
        errors:errors
        
      }); 
    } else {
      let userRole = new UserRole();
      userRole.role = req.body.role;
      userRole.description = req.body.description;
      userRole.company = req.body.email;
      console.log('POST: New User Role Created.  Name: '+userRole.role+' @ '+userRole.company);
  
      userRole.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'User Role Created: \"'+userRole.role+'\"');
          res.redirect('/userRoles/edit');
        }
      });
    }
  });

  // Add Route - Load Edit Individual Option Form
router.get('/edit/:id', function(req, res){
    UserRole.findById(req.params.id, function(err, userRole){
      res.render('user_roles_edit', {
        title:'Update User Role',
        userRole:userRole
      });
    });
  });

// Home Route
router.get('/edit', function(req, res){
    UserRole.find({}, function(err, userRoles){
      if(err){
        console.log(err);
      } else {
        res.render('userRoles_list_edit', {
          title:'Update User Roles',
          userRoles: userRoles
        });
      }
    });
  });

  // Add Route - Update Submit POST
router.post('/edit/:id', function(req, res){
    let user = {};
    userRole.role = req.body.role;
    userRole.description = req.body.description;
    userRole.company = req.body.company;
    console.log('POST: User Role Updated: '+userRole.role);
  
    let query = {_id:req.params.id}
  
    UserRole.updateOne(query, userRole, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'User Role Updated: \"'+userRole.role+'\"');
        res.redirect('/userRoles/edit');
      }
    });
  });

module.exports = router;
