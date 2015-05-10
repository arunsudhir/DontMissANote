var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();
app.set('port', process.env.PORT || 80);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser());
app.use(cookieParser());
app.use(session({
    secret: '1234567890QWERTY',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

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

var routes = require('./routes/index');
var registerTermsRoutes = require('./routes/registerTerms');
var callback = require('./routes/callback');

app.use('/', routes);
app.post('/registerTerms', registerTermsRoutes.registerTerms);
app.use('/callback', callback);

app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Run
http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});
