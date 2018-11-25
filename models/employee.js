let mongoose = require('mongoose');

// Employee Schema
let employeeSchema = mongoose.Schema({
  firstName:{
    type: String,
    required: true
  },
  lastName:{
    type: String,
    required: true
  },
  employeeNR:{
    type: Number,
  }
});

let Employee = module.exports = mongoose.model('Employee', employeeSchema);
