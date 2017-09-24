var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var request = require("request");
var fs = require('fs');
var writedir = "./json/";
var cors = require('cors')

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

function update(sheet) {
    var writeto = writedir + sheet + ".json";
    request({
        uri: "https://spreadsheets.google.com/feeds/list/1mK2zvp6ouN5r7kh0StqkULr32l9MyO0suBpMJUL4QeM/" + sheet + "/public/values?alt=json",
        method: "GET",
        timeout: 20000,
        followRedirect: true,
        maxRedirects: 10
    }, function (error, response, body) {
        if(!body){console.log(error)}
            fs.writeFile(writeto, body);
    });
}
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
router.post("/save/:sheet",cors(),function (req, res) {
    var writeto = writedir + "8.json";
    fs.writeFile(writeto, req.body);
    res.send('200');
    console.log('req.body');
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
