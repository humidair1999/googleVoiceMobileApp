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

    return Backbone.View.extend({
        template: doT.template(inboxItemViewTemplate),
        initialize: function() {
            
        },
        render: function() {
            var that = this,
                threadLength = this.model.get("messages").length,
                shownPreviewCount = 5;

            $.each(this.model.get("messages"), function(index, value) {
                if (index >= threadLength - shownPreviewCount) {
                    that.model.get("messages")[index].isPreviewMessage = true;
                }
                else {
                    that.model.get("messages")[index].isPreviewMessage = false;
                }
            });

            this.$el.html(this.template(this.model.attributes));
    
            return this;
        }
    });

});