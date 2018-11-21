const express = require('express');
const router = express.Router();

// Bring in Option Model
let Option = require('../models/option');

// Add Route - Add Option
router.get('/add', function(req, res){
  res.render('options_add', {
    title:'Create Option'
  });
});

// Add Route - Submit POST
router.post('/add', function(req, res){
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('url', 'URL is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();
  
    // Get Errors
    let errors = req.validationErrors();
  
    if(errors){
      res.render('options_add', {
        title:'Create Option',
        errors:errors
        
      }); 
    } else {
      let option = new Option();
      option.name = req.body.name;
      option.url = req.body.url;
      option.description = req.body.description;
      console.log('POST: New Option Created.  Name: '+option.name);
      console.log('POST: with url: '+option.url);
  
      option.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'Option Created: \"'+option.name+'\"');
          res.redirect('/');
        }
      });
    }
  });

  // Add Route - Load Edit Individual Option Form
router.get('/edit/:id', function(req, res){
    Option.findById(req.params.id, function(err, option){
      res.render('options_edit', {
        title:'Update Option',
        option:option
      });
    });
  });

// Home Route
router.get('/edit', function(req, res){
    Option.find({}, function(err, options){
      if(err){
        console.log(err);
      } else {
        res.render('options_list_edit', {
          title:'Update Options',
          options: options
        });
      }
    });
  });

  // Add Route - Update Submit POST
router.post('/edit/:id', function(req, res){
    let option = {};
    option.name = req.body.name;
    option.url = req.body.url;
    option.description = req.body.description;
    console.log('POST: Option Updated.  Name: '+option.name);
  
    let query = {_id:req.params.id}
  
    Option.updateOne(query, option, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Option Updated: \"'+option.name+'\"');
        res.redirect('/edit');
      }
    });
  });

module.exports = router;
