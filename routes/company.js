const express = require('express');
const router = express.Router();

// Bring in Company Model
let Company = require('../models/company');

// Add Route - Add Company
router.get('/add', function(req, res){
  res.render('company_add', {
    title:'Create New Company'
  });
});

// Add Route - Submit POST
router.post('/add', function(req, res){
    req.checkBody('company', 'Company is required').notEmpty();
    req.checkBody('code', 'Code is required').notEmpty();
  
    // Get Errors
    let errors = req.validationErrors();
  
    if(errors){
      res.render('company_add', {
        title:'Error on Form - Add Company',
        errors:errors
        
      }); 
    } else {
      let company = new Company();
      company.company = req.body.company;
      company.code = req.body.code;
      console.log('POST: New Company Created: '+company.company+' '+company.code);
  
      company.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'Company Created: \"'+company.name+'\"');
          res.redirect('/');
        }
      });
    }
  });


// Home Route
router.get('/edit', function(req, res){
    Company.find({}, function(err, companys){
      if(err){
        console.log(err);
      } else {
        res.render('company_list_edit', {
          title:'Update Companies',
          companys: companys
        });
      }
    });
  });

  // Add Route - Load Edit Individual Equipment Form
  router.get('/edit/:id', function(req, res){
    Company.findById(req.params.id, function(err, company){
      res.render('company_edit', {
        title:'Update Company',
        company:company
      });
    });
  });

  // Add Route - Update Submit POST
router.post('/edit/:id', function(req, res){
    let company = {};
    company.type = req.body.type;
    company.make = req.body.make;
    console.log('POST: Company Updated: '+company.company+' '+company.model);
  
    let query = {_id:req.params.id}
  
    Company.updateOne(query, company, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Company Updated: \"'+company.company+'\"');
        res.redirect('/copmany/edit');
      }
    });
  });

  // Query List Route
router.get('/query', function(req, res){
  Company.find({}, function(err, companys){
    if(err){
      console.log(err);
    } else {
      res.render('company_list_query', {
        title:'Company Query',
        companys: companys
      });
    }
  });
});

// Query Item Route
router.get('/query/:id', function(req, res){
  Company.findById(req.params.id, function(err, company){
    res.render('company_query', {
      title:'Company Query',
      company:company
    });
  });
});

module.exports = router;