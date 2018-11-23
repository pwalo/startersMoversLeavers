const express = require('express');
const router = express.Router();

// Bring in Equipment Model
let Equipment = require('../models/equipment');

// Add Route - Add Equipment
router.get('/add', function(req, res){
  res.render('equipment_add', {
    title:'Create New Equipment'
  });
});

// Add Route - Submit POST
router.post('/add', function(req, res){
    req.checkBody('type', 'Type is required').notEmpty();
    req.checkBody('make', 'Make is required').notEmpty();
    req.checkBody('model', 'Model is required').notEmpty();    
  
    // Get Errors
    let errors = req.validationErrors();
  
    if(errors){
      res.render('equipment_add', {
        title:'Create New Equipment',
        errors:errors
        
      }); 
    } else {
      let equipment = new Equipment();
      equipment.type = req.body.type;
      equipment.make = req.body.make;
      equipment.model = req.body.model;
      equipment.active = true;
      equipment.cost = req.body.cost;
      equipment.grade = req.body.grade;
      equipment.notes = req.body.notes;
      equipment.added = new Date();
      equipment.addedBy = 'Pwalo';
      console.log('POST: New Equipment Created: '+equipment.make+' '+equipment.model);
  
      equipment.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success', 'Equipment Created: \"'+equipment.name+'\"');
          res.redirect('/');
        }
      });
    }
  });

  // Add Route - Load Edit Individual Equipment Form
router.get('/edit/:id', function(req, res){
    Equipment.findById(req.params.id, function(err, equipment){
      res.render('equipment_edit', {
        title:'Update Equipment',
        equipment:equipment
      });
    });
  });

// Home Route
router.get('/edit', function(req, res){
    Equipment.find({}, function(err, equipments){
      if(err){
        console.log(err);
      } else {
        res.render('equipment_list_edit', {
          title:'Update Equipment',
          equipments: equipments
        });
      }
    });
  });

  // Add Route - Update Submit POST
router.post('/edit/:id', function(req, res){
    let equipment = {};
    equipment.type = req.body.type;
    equipment.make = req.body.make;
    equipment.model = req.body.model;
    equipment.cost = req.body.cost;
    equipment.grade = req.body.grade;
    equipment.active = req.body.active;
    equipment.notes = req.body.notes;
    equipment.changed = new Date();
    equipment.changedBy = 'Pwalo';
    console.log('POST: Equipment Updated: '+equipment.make+' '+equipment.model);
  
    let query = {_id:req.params.id}
  
    Equipment.updateOne(query, equipment, function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Equipment Updated: \"'+equipment.name+'\"');
        res.redirect('/equipment/edit');
      }
    });
  });

  // Query List Route
router.get('/query', function(req, res){
  Equipment.find({}, function(err, equipments){
    if(err){
      console.log(err);
    } else {
      res.render('equipment_list_query', {
        title:'Equipment Query',
        equipments: equipments
      });
    }
  });
});

// Query Item Route
router.get('/query/:id', function(req, res){
  Equipment.findById(req.params.id, function(err, equipment){
    res.render('equipment_query', {
      title:'Equipment Query',
      equipment:equipment
    });
  });
});

module.exports = router;
