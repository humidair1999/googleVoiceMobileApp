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
            
        },
        // Extend collection with ability to store attributes and trigger events on
        //  attributes changing
        _data: {},
        data: function(prop, value) {
            if (prop) {
                if (value !== undefined) {
                    this._data[prop] = value;

                    this.trigger("change:" + prop, value);
                }
                else {
                    return this._data[prop]
                }
            }
            else {
                return this._data;
            }
        },
        parse: function(response) {
            this.data("metadata", response.metadata);

            return response.messages;
        }
    });

});