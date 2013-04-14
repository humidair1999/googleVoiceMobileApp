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
            this.listenTo(this.model, "change", this.render);
        },
        events: {
            "submit #sms-form": "sendSms",
            "click #refresh-thread": "refreshThread"
        },
        render: function() {
            this.$el.html(this.template(this.model.attributes));
    
            return this;
        },
        sendSms: function(evt) {
            var that = this,
                smsText = $("#sms-textarea").val(),
                smsPhone = that.model.get("contact").phone.replace(/[^0-9]/g, "");

            console.log(smsPhone);

            evt.preventDefault();

            return $.ajax({
                url: "http://localhost:3000/sms",
                type: "POST",
                data: {
                    phoneNumber: smsPhone,
                    text: smsText,
                    _rnr_se: GVMA.user.rnrse,
                    token: GVMA.user.token
                },
                beforeSend: function() {
                    console.log("begin sending text");
                }
            }).done(function(data) {
                var jsonResponse = {},
                    smsCompleteMessage = "";

                // service sends back JSON string on successful attempt, or entire HTML
                //  document on failed attempt; need to handle errors so we don't try to
                //  parse HTML as JSON
                try {
                    jsonResponse = JSON.parse(data);
                }
                catch(error) {
                    smsCompleteMessage = "an error occurred while sending your text";
                }

                if (jsonResponse.hasOwnProperty("ok")) {
                    if (jsonResponse.ok) {
                        smsCompleteMessage = "text successfully sent";
                    }
                    else {
                        smsCompleteMessage = "text could not be sent";
                    }
                }

                console.log(smsCompleteMessage);                
            });
        },
        refreshThread: function(evt) {
            var that = this;

            evt.preventDefault();

            return $.ajax({
                url: "http://localhost:3000/inbox",
                type: "GET",
                dataType: "json",
                data: {
                    page: 1,
                    token: GVMA.user.token
                },
                beforeSend: function () {
                    console.log("before refresh thread");
                }
            }).done(function(data, textStatus, jqXHR) {
                console.log(data);
                console.log(textStatus);
                console.log(jqXHR);

                console.log(that.model);

                for (var i = 0; i < data.messages.length; i++) {
                    if (data.messages[i].id === that.model.get("id")) {
                        console.log("FOUND IT");

                        that.model.set("messages", data.messages[i].messages);
                    }
                }
            }).fail(function(collection, xhr, options) {
                // console.log(collection);
                // console.log(xhr);
                // console.log(options);
            }).always(function() {
                console.log("finish refresh thread");;
            });
        }
    });

});