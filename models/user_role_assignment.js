let mongoose = require('mongoose');

// User Role Assignment Schema
let userRoleAssignmentSchema = mongoose.Schema({
  user:{
    type: String,
    required: true
  },
  userRole:{
    type: String,
    required: true
  },
  company:{
    type: String
  },
  site:{
    type: String
  }
});

let UserRA = module.exports = mongoose.model('UserRA', userRoleAssignmentSchema);
