var express = require('express');
var fs = require("fs");
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var dataread = require('./dataread');

try{
    console.log("Connecting to database...");
    mongoose.connect('mongodb://localhost/labirynt',{ useNewUrlParser: true });
    console.log("SUCCESS.");
} catch (err)
{
    console.log(err);
}

var app = express();

//const static_folder = fs.realpathSync(__dirname+'../../../public');
const static_folder = fs.realpathSync(__dirname+'../../../build');
console.log("> "+static_folder);
app.use(express.static(static_folder));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'shhsecret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
dataread.config(passport);

app.addListener("GET", (e)=> console.log(e));
app.use("/", require("./router"));
/* app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/../build/index.html" );
   }) */
   
app.addListener("POST", (e)=> console.log(e));
   
var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server listening at http://%s:%s", host, port)
})