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
            var that = this,
                smsText = $("#sms-textarea").val();

            evt.preventDefault();

            return $.ajax({
                url: "http://localhost:3000/sms",
                type: "POST",
                data: {
                    phoneNumber: that.model.get("contact").phone,
                    text: smsText,
                    _rnr_se: GVMA.user.rnrse,
                    token: GVMA.user.token
                },
                beforeSend: function() {
                    console.log("begin sending text");
                }
            });
        }
    });

});