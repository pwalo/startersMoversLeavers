let mongoose = require('mongoose');

// Option Schema
let userSchema = mongoose.Schema({
  firstName:{
    type: String,
    required: true
  },
  lastName:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
});

let User = module.exports = mongoose.model('User', userSchema);