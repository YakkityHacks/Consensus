var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var api = require('./routes/api');
var index = require('./routes/index');
var questionRoute = require('./routes/question');
var questionModel = require('./models/question');

var mongoose   = require('mongoose');

db = mongoose.createConnection('mongodb://dfreya:dfreya@apollo.modulusmongo.net:27017/mI4mirev',
  function(err) {
            if (err)
                console.log(err);
            });

mongoose.set('debug', true);

var app = express();

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/questions', questionRoute);

console.log('before questionModel');
{ type: 'jungle' }
// questionModel.find({}, function(err, docs) {
//   console.log('inside questionModel');
//     if (!err){ 
//         console.log(docs);
//         process.exit();
//     } else {throw err;}
// });


questionModel.count({ answer: '520766' }, function (err, count) {
  if (err)
    throw(err);
  console.log('there are %d questions', count);
});

console.log('after questionModel');


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
