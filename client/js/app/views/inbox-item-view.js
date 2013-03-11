define([    "jquery",
            "underscore",
            "backbone",
            "dot",
            "text!templates/inbox-item-view.html"],
function (  $,
            _,
            Backbone,
            doT,
            inboxItemViewTemplate) {

    "use strict";

    // TODO: when you click an individual thread preview, go to new url route pointing
    //  at that thread's ID, and then query a globally-available message collection in
    //  order to retrieve entire thread?

    return Backbone.View.extend({
        template: doT.template(inboxItemViewTemplate),
        initialize: function() {
            //this.listenTo(this.collection, "change", this.renderCollection);
        },
        render: function() {
            var threadLength = this.model.get("messages").length,
                previewThread = [];

            if (threadLength > 5) {
                $.each(this.model.get("messages"), function(index, value) {
                    if (index >= threadLength - 5) {
                        previewThread.push(value);
                    }
                });
            }

            if (previewThread.length > 0) {
                this.model.set({
                    "messagePreviews": previewThread
                });
            }
            else {
                this.model.set({
                    "messagePreviews": this.model.get("messages")
                });
            }

            console.log(this.model);

            this.$el.html(this.template(this.model.attributes));
    
            return this;
        }
    });

});