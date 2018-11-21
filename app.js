// Main Functions
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/database');
const expressValidator = require('express-validator');
const session = require('express-session');


mongoose.connect(config.database, { useNewUrlParser: true });
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to mongoDB');
});

// Check for db Errors
db.on('error', function(err){
  console.log(err);
});

// Init App
const app = express();

// Bring in Models
let Option = require('./models/option');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg : msg,
        value : value
      };
    }
  }));

// Home Route
app.get('/', function(req, res){
    Option.find({}, function(err, options){
      if(err){
        console.log(err);
      } else {
        res.render('index', {
          title:'Start',
          options: options
        });
      }
    });
  });

// Route Files
let options = require('./routes/options');
app.use('/options', options);
let equipment = require('./routes/equipment');
app.use('/equipment', equipment);

//Start Server
app.listen(3000, function(){
    console.log('Server started on port 3000')
  });
  