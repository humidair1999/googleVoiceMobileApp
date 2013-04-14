// module dependencies
var express = require("express"),
    http = require("http"),
    https = require("https"),
    querystring = require("querystring"),
    q = require("q"),
    elementtree = require("elementtree"),
    $ = require("cheerio"),
    // TODO: shouldn't need filesystem access
    fs = require('fs');

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
                var sid,
                    lsid,
                    auth;

                if (data.indexOf("SID") > -1 &&
                    data.indexOf("LSID") > -1 &&
                    data.indexOf("Auth") > -1) {
                    sid = data.split("SID=")[1].split("LSID=")[0];
                    lsid = data.split("LSID=")[1].split("Auth=")[0];
                    auth = data.split("Auth=")[1];

                    deferred.resolve(auth);
                }
                else {
                    deferred.reject(data);
                }
            });
        });

        req.on("error", function(error) {
            deferred.reject(error);
        });

        // write data to request body
        req.write(data);

        req.end();

        return deferred.promise;
    };

    authenticateViaGoogle().then(function(data) {
        res.send(data);

        res.end();
    }, function(error) {
        console.log("error: ", error);
    });
});

app.get("/rnrse", function(req, res) {
    var token = req.query.token;

    var retrieveRnrse = function(token) {
        var options = {
            hostname: "www.google.com",
            path: "/voice",
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

    retrieveRnrse(token).then(function(data) {
        var $htmlTree = $(data),
            $rnrseElement = $htmlTree.find("input[name=_rnr_se]"),
            rnrseToken = $rnrseElement.attr("value");

        res.send(rnrseToken);

        res.end();
    }, function(error) {
        console.log("error: ", error);
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
        var xmlTree = elementtree.parse(data),
            htmlTree = xmlTree.findtext("html"),
            jsonTree = xmlTree.findtext("json"),
            json = JSON.parse(jsonTree),
            $htmlTree = $(htmlTree),
            messageJson = {};

        // array of objects containing actual individual sms messages
        messageJson.messages = [];

        // metadata associated with overall sms inbox
        messageJson.metadata = {
            totalSize: json.totalSize,
            unread: json.unreadCounts.sms,
            resultsPerPage: json.resultsPerPage
        };

        $htmlTree.each(function() {
            var messageObj = {};

            if (this.hasClass("gc-message-sms")) {
                var id = this.attr("id");

                messageObj.id = id;

                messageObj.contact = {};

                var $metadata = this.find(".gc-message-tbl-metadata");

                var $contact = $metadata.find(".gc-message-name");

                messageObj.contact.name = $contact.children(".gc-message-name-link").text().trim();
                messageObj.contact.id = $contact.children(".gc-message-contact-id").text().trim();
                messageObj.contact.phone = $metadata.find(".gc-message-type").text().trim();

                messageObj.metadata = {};

                var $timeData = $metadata.children(".gc-message-time-row");

                messageObj.metadata.time = $timeData.children(".gc-message-time").text().trim();
                messageObj.metadata.relativeTime = $timeData.children(".gc-message-relative").text().trim();

                messageObj.messages = [];

                var $messageData = this.find(".gc-message-message-display");

                // remove "more" link div, since we're not using it
                $messageData.children(".gc-message-sms-more").remove();

                var $messageContainers = $messageData.children();

                var $messageRow = $messageContainers.first(".gc-message-sms-row");

                messageObj.messages.push({
                    from: $messageRow.children(".gc-message-sms-from").text().trim(),
                    text: $messageRow.children(".gc-message-sms-text").text().trim(),
                    time: $messageRow.children(".gc-message-sms-time").text().trim()
                });

                // remove first message div after its data has been retrieved
                $messageRow.remove();

                // reset messages after removing existing elements
                $messageContainers = $messageData.children();

                $messageContainers.each(function() {
                    if (this.hasClass("gc-message-sms-old")) {
                        this.children(".gc-message-sms-row").each(function() {
                            messageObj.messages.push({
                                from: this.children(".gc-message-sms-from").text().trim(),
                                text: this.children(".gc-message-sms-text").text().trim(),
                                time: this.children(".gc-message-sms-time").text().trim()
                            });
                        });

                        this.remove();
                    }
                });

                // reset messages after removing existing elements
                $messageContainers = $messageData.children();

                $messageContainers.each(function() {
                    if (this.hasClass("gc-message-sms-row")) {
                        messageObj.messages.push({
                            from: this.children(".gc-message-sms-from").text().trim(),
                            text: this.children(".gc-message-sms-text").text().trim(),
                            time: this.children(".gc-message-sms-time").text().trim()
                        });
                    
                        this.remove();
                    }
                });

                // push new constructed object onto JSON result
                messageJson.messages.push(messageObj);
            }
        });

        //console.log(messageJson);

        res.json(messageJson);

        res.end();
    });
});

app.listen(3000);