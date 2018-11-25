const express = require('express');
const router = express.Router();

// Bring in Employee Role Model
let EmployeeRole = require('../models/employee_roles');

// Add Route - Add Role
router.get('/add', function(req, res){
  res.render('employeeRoles_add', {
    title:'Create New Employee Role'
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
      res.render('employeeRole_add', {
        title:'Error on New Employee Role Form',
        errors:errors
        
      }); 
    } else {
      let employeeRole = new EmployeeRole();
      employeeRole.role = req.body.role;
      employeeRole.description = req.body.description;
      employeeRole.company = req.body.company;
      console.log('POST: New Employee Role Created.  Name: '+employeeRole.role+' @ '+employeeRole.company);
  
      employeeRole.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'Employee Role Created: \"'+employeeRole.role+'\"');
          res.redirect('/employeeRoles/edit');
        }
      });
    }
  });

  // Add Route - Load Edit Individual Option Form
router.get('/edit/:id', function(req, res){
    EmployeeRole.findById(req.params.id, function(err, employeeRole){
      res.render('employeeRoles_edit', {
        title:'Update Employee Role',
        employeeRole:employeeRole
      });
    });
  });

// Home Route
router.get('/edit', function(req, res){
    EmployeeRole.find({}, function(err, employeeRoles){
      if(err){
        console.log(err);
      } else {
        res.render('employeeRoles_list_edit', {
          title:'Update Employee Roles',
          employeeRoles: employeeRoles
        });
      }
    });
  });

  // Add Route - Update Submit POST
router.post('/edit/:id', function(req, res){
    let employeeRole = {};
    employeeRole.role = req.body.role;
    employeeRole.description = req.body.description;
    employeeRole.company = req.body.company;
    console.log('POST: Employee Role Updated: '+employeeRole.role);
  
    let query = {_id:req.params.id}
  
    EmployeeRole.updateOne(query, employeeRole, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Employee Role Updated: \"'+employeeRole.role+'\"');
        res.redirect('/employeeRoles/edit');
      }
    });
  });

module.exports = router;
