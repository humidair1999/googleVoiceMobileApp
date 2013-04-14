define([    "jquery",
            "underscore",
            "backbone",
            "dot",
            "text!templates/inbox-view.html",
            "views/inbox-item-view"],
function (  $,
            _,
            Backbone,
            doT,
            inboxViewTemplate,
            InboxItemView) {

    "use strict";

    return Backbone.View.extend({
        template: doT.template(inboxViewTemplate),
        initialize: function() {
            this.listenTo(this.collection, "reset", this.renderCollection);
        },
        events: {
            "click #refresh-inbox": "refreshInbox"
        },
        inboxItemViews: [],
        render: function() {
            this.$el.html(this.template(this.collection.options));
    
            return this;
        },
        renderCollection: function() {
            var that = this;

            // remove all existing inbox summary views
            _.each(that.inboxItemViews, function(inboxItemView) {
                inboxItemView.remove();
            });
 
            // create and append each new inbox summary view
            this.collection.each(function(inboxItem, index) {
                that.inboxItemViews[index] = new InboxItemView({
                    model: inboxItem
                });

                $("#message-summaries").append(that.inboxItemViews[index].render().el);
            });
        },
        fetchInbox: function(page) {
            var that = this;

            return this.collection.fetch({
                type: "GET",
                dataType: "json",
                data: {
                    page: page,
                    token: GVMA.user.token
                },
                beforeSend: function () {
                    console.log("begin retrieving inbox");
                }
            }).done(function(collection, response, options) {
                // console.log(collection);
                // console.log(response);
                // console.log(options);

                console.log(that.collection.length);
            }).fail(function(collection, xhr, options) {
                // console.log(collection);
                // console.log(xhr);
                // console.log(options);
            }).always(function() {
                //console.log("always");;
            });
        },
        refreshInbox: function(evt) {
            evt.preventDefault();

            this.fetchInbox(this.collection.options.currentPage);
        }
    });

});