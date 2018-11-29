let mongoose = require('mongoose');

// Company Schema
let companySchema = mongoose.Schema({
  company:{
    type: String,
    required: true,
    unique: true
  },
  code:{
    type: Number,
    required: true,
    unique: true
  }
});

let Company = module.exports = mongoose.model('Company', companySchema);
