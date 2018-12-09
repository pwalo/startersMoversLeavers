let mongoose = require('mongoose');

// User Schema
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
  password:{
    type: String
  },
  username:{
    type: String,
    unique: true
  },
  forcePwdChange:{
    type: Boolean,
  },
  superAdmin:{
    type: Boolean,
  }
});

let User = module.exports = mongoose.model('User', userSchema);
