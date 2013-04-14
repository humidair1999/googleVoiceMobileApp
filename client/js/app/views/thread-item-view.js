define([    "jquery",
            "underscore",
            "backbone",
            "dot",
            "text!templates/thread-item-view.html"],
function (  $,
            _,
            Backbone,
            doT,
            threadItemViewTemplate) {

    "use strict";

    return Backbone.View.extend({
        template: doT.template(threadItemViewTemplate),
        initialize: function() {
            this.listenTo(this.model, "reset", this.render);
        },
        events: {
            "submit #sms-form": "sendSms"
        },
        render: function() {
            this.$el.html(this.template(this.model.attributes));
    
            return this;
        },
        sendSms: function(evt) {
            evt.preventDefault();
            
            console.log("lol");
        }
    });

});