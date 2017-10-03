var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var request = require("request");
var fs = require('fs');
var writedir = "./json/";
var cors = require('cors')
var firebase = require("firebase");

router.use(function (req, res, next) {
    console.log("/" + req.method);
    next();
});

router.get("/", function (req, res) {
    res.sendFile(path + "index.html");
});

router.get("/json/:sheet",cors(),function (req,res) {
    res.sendFile(__dirname + '/json/'+req.params.sheet+'.json');
});
var config = {
    apiKey: "AIzaSyCecl2pYkNiex4HBnyn-2UH_-r3BipdtqU",
    authDomain: "turbo-iitkms.firebaseapp.com",
    databaseURL: "https://turbo-iitkms.firebaseio.com/",
    storageBucket: "gs://turbo-iitkms.appspot.com"
};
firebase.initializeApp(config);
var database = firebase.database();
function update(sheet) {
    request({
        uri: "https://spreadsheets.google.com/feeds/list/1mK2zvp6ouN5r7kh0StqkULr32l9MyO0suBpMJUL4QeM/" + sheet + "/public/values?alt=json",
        method: "GET",
        timeout: 20000,
        followRedirect: true,
        maxRedirects: 10
    }, function (error, response, body) {
        if(!body){console.log(error)}
        firebase.database().ref('data/' + sheet).set({
            content : body
        });
    });
}
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
router.post("/save/:sheet",cors(),function (req, res) {
    var writeto = writedir + "8.json";
    fs.writeFile(writeto, JSON.stringify(req.body));
    res.send(JSON.stringify(req.body));
});

router.post("/:sheet", function (req, res) {
    update(req.params.sheet);
    res.send('200');
});

app.use("/", router);

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
