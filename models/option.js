let mongoose = require('mongoose');

// Option Schema
let optionSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  url:{
    type: String,
    required: true
  }
});

let Option = module.exports = mongoose.model('Option', optionSchema);
