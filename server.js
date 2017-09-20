var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var request = require("request");
var fs = require('fs');
var writedir = "./json/";

router.use(function (req, res, next) {
    console.log("/" + req.method);
    next();
});

router.get("/", function (req, res) {
    res.sendFile(path + "index.html");
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

router.post("/:sheet", function (req, res) {
    update(req.params.sheet);
    res.send('200');
});
app.use("/", router);

app.listen(3000, function () {
    console.log("Live at Port 3000");
});
