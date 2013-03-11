define([    "jquery",
            "underscore",
            "backbone",
            "views/inbox-view",
            "collections/threads"],
function (  $,
            _,
            Backbone,
            InboxView,
            Threads) {

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
            var threads = new Threads();

            var inboxView = new InboxView({
                collection: threads
            });

            $("#messages").html(inboxView.render().el);

            inboxView.fetchInbox(id);
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
