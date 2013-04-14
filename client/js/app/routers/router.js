define([    "jquery",
            "underscore",
            "backbone",
            "views/inbox-view",
            "collections/threads",
            "views/thread-item-view"],
function (  $,
            _,
            Backbone,
            InboxView,
            Threads,
            ThreadItemView) {

    "use strict";

    return Backbone.Router.extend({
        routes: {
            "": "showHome",
            "login": "logIn",
            "inbox(/:page)": "showInbox",
            "messages/:id": "showMessage"
        },
        showHome: function () {
            console.log("home");
        },
        logIn: function() {
            var authenticateUser = function() {
                return $.ajax({
                    url: "http://localhost:3000/login",
                    type: "POST",
                    beforeSend: function () {
                        //console.log("before login");
                    }
                }).done(function (data) {
                    GVMA.user.token = data;
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }).always(function () {
                    //console.log("done login");
                });
            };

            var retrieveRnrseToken = function() {
                return $.ajax({
                    url: "http://localhost:3000/rnrse",
                    type: "GET",
                    data: {
                        token: GVMA.user.token
                    },
                    beforeSend: function () {
                        //console.log("before rnrse");
                    }
                }).done(function (data) {
                    GVMA.user.rnrse = data;
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }).always(function () {
                    //console.log("done rnrse");
                });
            };

            authenticateUser().then(retrieveRnrseToken)
                .done(function () {
                    console.log("user: ", GVMA.user);

                    //console.log("the process completed successfully");

                    GVMA.app.router.navigate("inbox/1", {trigger: true});
                })
                .fail(function () {
                    //console.log("one of the steps failed");
                })
                .always(function () {
                    //console.log("end of process");
                });
        },
        showInbox: function (page) {
            GVMA.threads = page ? new Threads() : GVMA.threads;

            console.log(GVMA.threads.data("currentPage"));

            var inboxView = new InboxView({
                collection: GVMA.threads
            });

            $("#messages").html(inboxView.render().el);

            if (page) {
                GVMA.threads.data("currentPage", page);

                inboxView.fetchInbox(page);
            }
            else {
                inboxView.renderCollection();
            }
        },
        showMessage: function (id) {
            var thread = GVMA.threads.get(id);

            console.log(thread);

            var threadItemView = new ThreadItemView({
                model: thread
            });

            $("#messages").html(threadItemView.render().el);
        }

    });
});
