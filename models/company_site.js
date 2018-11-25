let mongoose = require('mongoose');

// Company Site Schema
let companySiteSchema = mongoose.Schema({
  company:{  //lookup only
    type: String,
    required: true
  },
  siteName:{
    type: String,
    required: true
  },
  siteCode:{
    type: Number,
    required: true
  },
  streetAddress:{
    type: String,
    required: true
  },
  street2Address:{
    type: String,
    required: true
  },
  city:{
    type: String,
    required: true
  },
  region:{
    type: String,
    required: true
  },
  postcode:{
    type: String,
    required: true
  },
  country:{
    type: String,
    required: true
  },
  mainTel:{
    type: String,
    required: true
  }
});

let CompanySite = module.exports = mongoose.model('CompanySite', companySiteSchema);
