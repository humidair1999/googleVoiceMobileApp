define([    "jquery",
            "underscore",
            "backbone"],
function (  $,
            _,
            Backbone) {

    "use strict";

    return Backbone.Router.extend({
        routes: {
            "": "showHome",
            "login": "logIn",
            "inbox/:id": "showInbox",
            "messages/:id": "showMessage"
        },
        showHome: function () {
            console.log("home");
        },
        logIn: function() {
            $.ajax({
                url: "http://localhost:3000/login",
                type: "POST",
                beforeSend: function () {
                    console.log("before");
                }
            }).done(function (data) {
                console.log(data);

                user.token = data;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }).always(function () {
                console.log("done");
            });
        },
        showInbox: function (id) {
            console.log(id);

            $.ajax({
                url: "http://localhost:3000/inbox",
                type: "GET",
                dataType: "json",
                data: {
                    page: id,
                    token: user.token
                },
                beforeSend: function () {
                    console.log("before");
                }
            }).done(function (data) {
                console.log(data);

                // var messages = data.messages,
                //     messageHtml = "";

                // console.log(messages);

                // $.each(messages, function(index, value) {
                //     console.log(index);
                //     console.log(value);

                //     messageHtml += value.messageText +
                //         "<a href=\"#messages/" + value.id + "\">" +
                //         "read thread" +
                //         "</a>" +
                //         "<br />";
                // });

                // $("#messages").html(id + "<br /><br />" + messageHtml);

                $("#messages").html(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }).always(function() {
                //console.log("wtf");
            });
        },
        showMessage: function (id) {
            console.log(id);

            $.ajax({
                url: "http://localhost:3000/messages",
                type: "GET",
                dataType: "json",
                data: {
                    id: id,
                    token: user.token
                },
                beforeSend: function () {
                    console.log("before");
                }
            }).done(function (data) {
                console.log(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }).always(function() {
                //console.log("wtf");
            });
        }

    });
});
