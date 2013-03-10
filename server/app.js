// module dependencies
var express = require("express"),
    http = require("http"),
    https = require("https"),
    querystring = require("querystring"),
    q = require("q"),
    elementtree = require("elementtree");

var app = express();

app.all("/*", function(req, res, next) {
    // set some header data to allow cors requests
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    next();
});

// routes
app.post("/login", function(req, res) {
    var authenticateViaGoogle = function() {
        // TODO: don't hard-code google login info
        var data = querystring.stringify({
            Email: "joshuakmarsh@gmail.com",
            Passwd: "",
            service: "grandcentral",
            // TODO: use official name of app
            source: "test"
        }),
        options = {
            hostname: "www.google.com",
            path: "/accounts/ClientLogin",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": data.length
            }
        },
        deferred = q.defer();

        var req = https.request(options, function(res) {
            var data = "";

            // TODO: set response encoding globally
            res.setEncoding("utf8");

            res.on("data", function (chunk) {
                return data += chunk;
            });

            res.on("end", function() {
                var sid = data.split("SID=")[1].split("LSID=")[0],
                    lsid = data.split("LSID=")[1].split("Auth=")[0],
                    auth = data.split("Auth=")[1];

                deferred.resolve(auth);
            });
        });

        req.on("error", function(e) {
            deferred.reject();
        });

        // write data to request body
        req.write(data);

        req.end();

        return deferred.promise;
    };

    authenticateViaGoogle().then(function(data) {
        res.send(data);

        res.end();
    });
});

app.get("/inbox", function(req, res) {
    var token = req.query.token,
        page = req.query.page;

    var retrieveInbox = function(token) {
        var options = {
            hostname: "www.google.com",
            path: "/voice/inbox/recent/sms?page=p" + page,
            method: "GET",
            headers: {
                "Authorization": "GoogleLogin auth=" + token
            }
        },
        deferred = q.defer();

        var req = https.request(options, function(res) {
            var data = "";

            res.setEncoding("utf8");

            res.on("data", function (chunk) {
                return data += chunk;
            });

            res.on("end", function() {
                deferred.resolve(data);
            });
        });

        req.on("error", function(e) {
            deferred.reject();
        });

        req.end();

        return deferred.promise;
    };

    retrieveInbox(token).then(function(data) {
        var xmlTree = elementtree.parse(data);

        //console.log(xmlTree.findtext("json"));

        res.json(xmlTree.findtext("html"));

        res.end();
    });
});

app.get("/messages", function(req, res) {
    var token = req.query.token,
        id = req.query.id;

    var retrieveInbox = function(token) {
        var options = {
            hostname: "www.google.com",
            path: "/voice/inbox/recent/sms/" + id,
            method: "GET",
            headers: {
                "Authorization": "GoogleLogin auth=" + token
            }
        },
        deferred = q.defer();

        var req = https.request(options, function(res) {
            var data = "";

            res.setEncoding("utf8");

            res.on("data", function (chunk) {
                return data += chunk;
            });

            res.on("end", function() {
                deferred.resolve(data);
            });
        });

        req.on("error", function(e) {
            deferred.reject();
        });

        req.end();

        return deferred.promise;
    };

    retrieveInbox(token).then(function(data) {
        console.log(data);

        var xmlTree = elementtree.parse(data);

        console.log(xmlTree.findtext("html"));

        res.json(xmlTree.findtext("html"));

        res.end();
    });
});

app.listen(3000);