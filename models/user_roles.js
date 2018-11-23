let mongoose = require('mongoose');

// User Roles Schema
let userRoleSchema = mongoose.Schema({
  role:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  company:{
    type: String,
    required: true
  },
});

let UserRole = module.exports = mongoose.model('UserRole', userRoleSchema);