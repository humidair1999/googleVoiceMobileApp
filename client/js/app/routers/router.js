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
            
        },
        logIn: function() {
            var authenticateUser = function() {
                return $.ajax({
                    url: "http://localhost:3000/login",
                    type: "POST",
                    beforeSend: function () {
                        
                    }
                }).done(function (data) {
                    GVMA.user.token = data;
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    
                }).always(function () {
                    
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
                        
                    }
                }).done(function (data) {
                    GVMA.user.rnrse = data;
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    
                }).always(function () {
                    
                });
            };

            authenticateUser().then(retrieveRnrseToken)
                .done(function () {
                    GVMA.app.router.navigate("inbox/1", {trigger: true});
                })
                .fail(function () {
                    
                })
                .always(function () {
                    
                });
        },
        cachedInboxView: null,
        showInbox: function (page) {
            GVMA.app.threads = page ? new Threads() : GVMA.app.threads;

            if (this.cachedInboxView) {
                this.cachedInboxView.remove();
            }

            this.cachedInboxView = new InboxView({
                collection: GVMA.app.threads
            });

            $("#messages").html(this.cachedInboxView.render().el);

            if (page) {
                GVMA.app.threads.data("currentPage", page);

                this.cachedInboxView.fetchInbox(page);
            }
        },
        cachedThreadItemView: null,
        showMessage: function (id) {
            var thread = GVMA.app.threads.get(id);

            if (this.cachedThreadItemView) {
                this.cachedThreadItemView.remove();
            }

            this.cachedThreadItemView = new ThreadItemView({
                model: thread
            });

            $("#messages").html(this.cachedThreadItemView.render().el);
        }

    });
});
