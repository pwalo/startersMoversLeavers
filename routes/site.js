const express = require('express');
const router = express.Router();

// Bring in Models
let Company = require('../models/company');
let Site = require('../models/site');

// Add Route - Add Site
router.get('/add', function(req, res){
  Company.find({}, function(err, companys){
    res.render('site_add', {
      title:'Create New Site',
      companys:companys
    });
  });
});

// Add Route - Submit POST
router.post('/add', function(req, res){
    req.checkBody('site', 'Site is required').notEmpty();
    req.checkBody('code', 'Code is required').notEmpty();
    req.checkBody('company', 'Company is required').notEmpty();
  
    // Get Errors
    let errors = req.validationErrors();
  
    if(errors){
      res.render('site_add', {
        title:'Error on Form - Add Site',
        errors:errors
        
      }); 
    } else {
      let site = new Site();
      site.site = req.body.site;
      site.company = req.body.company;
      site.code = req.body.code;
      console.log('POST: New Site Created: '+site.site+' '+site.code);
  
      site.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'Site Created: \"'+site.site+'\"');
          res.redirect('/');
        }
      });
    }
  });

  // Add Route - Load Edit Individual Site Form
router.get('/edit/:id', function(req, res){
    Site.findById(req.params.id, function(err, site){
      Company.find({}, function(err, companys){
        res.render('site_edit', {
          title:'Update Site',
          site:site,
          companys:companys,
          //activeSite:activeSite
        });
      });
    });
  });

// Home Route
router.get('/edit', function(req, res){
  Company.find({}, function(err, companys){  
    Site.find({}, function(err, sites){
        if(err){
          console.log(err);
        } else {
          res.render('site_list_edit', {
            title:'Update Sites',
            sites: sites,
            companys:companys
          });
        }
      });
    });
  });

  // Add Route - Update Submit POST
router.post('/edit/:id', function(req, res){
    let site = {};
    site.site = req.body.site;
    site.code = req.body.code;
    site.company = req.body.company;
    console.log('POST: Site Updated: '+site.site+' '+site.code);
  
    let query = {_id:req.params.id}
  
    Site.updateOne(query, site, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Site Updated: \"'+site.site+'\"');
        res.redirect('/site/edit');
      }
    });
  });

  // Query List Route
router.get('/query', function(req, res){
  Site.find({}, function(err, sites){
    if(err){
      console.log(err);
    } else {
      res.render('site_list_query', {
        title:'Site Query',
        sites: sites
      });
    }
  });
});

// Query Item Route
router.get('/query/:id', function(req, res){
  Site.findById(req.params.id, function(err, site){
    res.render('site_query', {
      title:'Site Query',
      site:site
    });
  });
});

module.exports = router;
