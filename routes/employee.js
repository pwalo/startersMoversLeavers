const express = require('express');
const router = express.Router();

// Bring in Employee Model
let Employee = require('../models/employee');

// Add Route - Add Employee
router.get('/add', function(req, res){
  res.render('employees_add', {
    title:'Create New Employee'
  });
});

// Add Route - Submit POST
router.post('/add', function(req, res){
    req.checkBody('firstName', 'First name is required').notEmpty();
    req.checkBody('lastName', 'Last name is required').notEmpty();
  
    // Get Errors
    let errors = req.validationErrors();
  
    if(errors){
      res.render('employees_add', {
        title:'Create New Employee',
        errors:errors
        
      }); 
    } else {
      let employee = new Employee();
      employee.firstName = req.body.firstName;
      employee.lastName = req.body.lastName;
      employee.employeeNR = req.body.employeeNR;
      console.log('POST: New Employee Created.  Name: '+employee.firstName+' '+employee.lastName);
  
      employee.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'Employee Created: \"'+employee.firstName+'\" \"'+employee.lastName+'\"');
          res.redirect('/employees/edit');
        }
      });
    }
  });

  // Add Route - Load Edit Individual Option Form
router.get('/edit/:id', function(req, res){
    Employee.findById(req.params.id, function(err, employee){
      res.render('employees_edit', {
        title:'Update Employee',
        employee:employee
      });
    });
  });

// Home Route
router.get('/edit', function(req, res){
    Employee.find({}, function(err, employees){
      if(err){
        console.log(err);
      } else {
        res.render('employees_list_edit', {
          title:'Update Employees',
          employees: employees
        });
      }
    });
  });

  // Add Route - Update Submit POST
router.post('/edit/:id', function(req, res){
    let employee = {};
    employee.firstName = req.body.firstName;
    employee.lastName = req.body.lastName;
    employee.employeeNR = req.body.employeeNR;
    console.log('POST: Employee Updated: '+employee.firstName+' '+employee.employeeNR);
  
    let query = {_id:req.params.id}
  
    Employee.updateOne(query, employee, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Employee Updated: \"'+employee.firstName+'\" \"'+employee.lastName+'\"');
        res.redirect('/employees/edit');
      }
    });
  });

module.exports = router;
