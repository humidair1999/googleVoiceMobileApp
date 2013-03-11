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
            //console.log("threads");
        },
        parse: function(response) {
            return response.messages;
        }
    });

});