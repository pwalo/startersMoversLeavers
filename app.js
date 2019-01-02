// Main Functions
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/database');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
// const flash = require('connect-flash');


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

// Allow use of date only from timestamp in views
app.locals.moment = require('moment');

// Bring in Models
let Option = require('./models/option');

// Load Pug View Engine
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
//app.configure(function() {
//  app.use(express.cookieParser('keyboard cat'));
//  app.use(express.session({ cookie: { maxAge: 60000 }}));
//  app.use(flash());
//});
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

// Passport Config
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Check user is logged in 
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.user ? true : false;
    if (res.locals.isAuthenticated) {
      res.locals.superAdmin = req.user.superAdmin ? true : false;
    };
  next();
});

// Home Route
app.get('/', function(req, res){
    Option.find({}, function(err, options){
      if(err){
        console.log(err);
      } else {
        res.render('index', {
          title:'Employee Credential and Equipment Manager',
          options: options
        });
      }
    });
  });

// Route Files
let options = require('./routes/options');
let equipment = require('./routes/equipment');
let users = require('./routes/users');
let userRoles = require('./routes/userRoles');
let company = require('./routes/company');
let employee = require('./routes/employee');
let employeeRoles = require('./routes/employeeRoles');
let site = require('./routes/site');
app.use('/options', options);
app.use('/equipment', equipment);
app.use('/users', users);
app.use('/userRoles', userRoles);
app.use('/company', company);
app.use('/employees', employee);
app.use('/employeeRoles', employeeRoles);
app.use('/site', site);

//Start Server
app.listen(3000, function(){
    console.log('Server started on port 3000')
    console.log('waiting for user input....')
  });
  