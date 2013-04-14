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
        _data: {},
        initialize: function() {
            //console.log("threads created");
        },
        // Extend collection with ability to store attributes and trigger events on
        //  attributes changing
        data: function(prop, value) {
            if (value) {
                this._data[prop] = value;

                this.trigger("change:" + prop, value);
            }
            else {
                return this._data[prop]
            }
        },
        parse: function(response) {
            this.data("metadata", response.metadata);

            return response.messages;
        }
    });

});