const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
const morgan = require('morgan');

// Configure .env
dotenv.config()

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

// Initiate express app
const app = express();

// Configure app middleware
app.use(cors());
app.use(bodyParser.json());
// Log http request
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'codemates', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if(!isProduction) {
  app.use(errorHandler());
}

//Configure Mongoose
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('debug', true);

// Models & routes
require('./models/Accounts');


// Configure passport
require('./config/passport');
app.use(require('./routes'));



//Error handlers & middlewares
if(!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// app.get('/', (req, res)=> { res.send('Hello Codemates api') })


app.listen(process.env.PORT, ()=> {
  console.log(`app is running on port ${process.env.PORT}`);
})