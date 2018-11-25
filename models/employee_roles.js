let mongoose = require('mongoose');

// Employee Roles Schema
let employeeRoleSchema = mongoose.Schema({
  role:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  company:{ // lookup only
    type: String,
    required: true
  },
  site:{ // lookup only
    type: String,
    required: true
  }
});

let EmployeeRole = module.exports = mongoose.model('EmployeeRole', employeeRoleSchema);
