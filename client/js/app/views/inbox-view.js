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
            var that = this;

            _.bindAll(this, "beforeRender", "render", "afterRender");

            this.render = _.wrap(this.render, function(render) {
                  that.beforeRender();

                  render();

                  that.afterRender();

                  return that;
            }); 

            this.listenTo(this.collection, "reset", this.render);
        },
        events: {
            "click #refresh-inbox": "refreshInbox",
            "submit #page-form": "goToPage",
        },
        render: function() {
            var resultsPerPage = null,
                totalSize = null,
                totalPages = null;

            try {
                resultsPerPage = this.collection.data("metadata").resultsPerPage;
                totalSize = this.collection.data("metadata").totalSize;

                totalPages = (totalSize / resultsPerPage);
            }
            catch(error) {
                console.log("collection does not yet possess metadata");
            }

            if (this.collection.data("currentPage") > 1) {
                this.collection.data("hasNewerThreads", true);
            }
            else {
                this.collection.data("hasNewerThreads", false);
            }

            if (this.collection.data("currentPage") < totalPages) {
                this.collection.data("hasOlderThreads", true);
            }
            else {
                this.collection.data("hasOlderThreads", false);
            }

            this.$el.html(this.template(this.collection.data()));
    
            return this;
        },
        beforeRender: function() {
            
        },
        afterRender: function() {
            this.renderCollection();
        },
        cachedInboxItemViews: [],
        renderCollection: function() {
            var that = this;

            // remove all existing inbox summary views
            _.each(that.cachedInboxItemViews, function(cachedInboxItemView) {
                cachedInboxItemView.remove();
            });
 
            // create and append each new inbox summary view
            this.collection.each(function(inboxItem, index) {
                that.cachedInboxItemViews[index] = new InboxItemView({
                    model: inboxItem
                });

                that.$el.find("#message-summaries").append(that.cachedInboxItemViews[index].render().el);
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
                    that.$el.find("#loading-inbox").css("display", "block");
                }
            }).done(function(collection, response, options) {
                
            }).fail(function(collection, xhr, options) {
                
            }).always(function() {
                that.$el.find("#loading-inbox").css("display", "none");
            });
        },
        refreshInbox: function(evt) {
            evt.preventDefault();

            this.fetchInbox(this.collection.data("currentPage"));
        },
        goToPage: function(evt) {
            var pageNumber = this.$el.find("#page-number-input").val();

            evt.preventDefault();

            GVMA.app.router.navigate("inbox/" + pageNumber, {trigger: true});
        }
    });

});