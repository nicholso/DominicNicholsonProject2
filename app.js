// import libraries
var express = require('express'),
    ejs     = require('ejs'),
    bodyParser = require('body-parser');

// import routes
var routes = require('./controller/index');
var user  = require('./controller/user');

// initialize express web application framework
// http://expressjs.com/
var app = express();

global.subtitle = 'Homepage';

// these two lines replace bodyParser()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// configure static directory
app.use(express.static('public'));

//configure view rendering engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// subtitle values access via the header template
app.set('subtitle', 'Homepage');

//configure routes
app.use('/', routes);
app.use('/user', user);

app.set('port', 8022);
app.listen(app.get('port'));
console.log("Express server listening on port", app.get('port'));