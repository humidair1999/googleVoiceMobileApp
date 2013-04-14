define([    "jquery",
            "underscore",
            "backbone",
            "models/thread"],
function (  $,
            _,
            Backbone,
            Thread) {

    "use strict";

    return Backbone.Collection.extend({
        model: Thread,
        url: "http://localhost:3000/inbox",
        initialize: function() {
            this.options = {};

            console.log("threads created");
        },
        parse: function(response) {
            this.options.metadata = response.metadata;

            return response.messages;
        }
    });

});