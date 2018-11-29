let mongoose = require('mongoose');

// Site Schema
let siteSchema = mongoose.Schema({
  site:{
    type: String,
    required: true
  },
  code:{
    type: Number,
    required: true
  },
  company:{
    type: String,
    required: true
  }
});

let Site = module.exports = mongoose.model('Site', siteSchema);
