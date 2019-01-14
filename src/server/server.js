var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

//const static_folder = fs.realpathSync(__dirname+'../../../public');
const static_folder = fs.realpathSync(__dirname+'../../../build');
console.log(static_folder);
app.use(express.static(static_folder));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.addListener("GET", (e)=> console.log(e));

/* app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/../build/index.html" );
   }) */
   
var server = app.listen(3001, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server listening at http://%s:%s", host, port)
})