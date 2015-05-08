var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');
//var registerTermsRoutes = require('./routes/registerTerms');
var callback = require('./routes/callback');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// TODO: Remove global variable "SignedInUser" from Index.js and hook this up properly
// app.post('/registerTerms', registerTermsRoutes.registerTerms);
app.use('/callback', callback);

// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {
            status: err.status,
            details: err.stack
        }
    });
});

app.set('port', process.env.PORT || 3000);

// Run
http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});
