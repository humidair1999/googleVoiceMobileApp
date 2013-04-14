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
            // TODO: don't forget this call also retrieves overall inbox metadata

            return response.messages;
        }
    });

});