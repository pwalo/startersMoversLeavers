let mongoose = require('mongoose');

// Equipment Schema
let equipmentSchema = mongoose.Schema({
  type:{
    type: String,
    required: true
  },
  make:{
    type: String,
    required: true
  },
  model:{
    type: String,
    required: true
  },
  active:{
    type: Boolean,
    required: true
  },
  notes:{
    type: String
  },
  added:{
    type: Date,
    required: true
  },
  addedBy:{
    type: String,
    required: true
  },
  changed:{
    type: Date
  },
  changedBy:{
    type: String
  }
});

let Equipment = module.exports = mongoose.model('Equipment', equipmentSchema);