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
            _.bindAll(this, "beforeRender", "render", "afterRender");

            var _this = this;

            this.render = _.wrap(this.render, function(render) {
                  _this.beforeRender();
                  render();
                  _this.afterRender();
                  return _this;
            }); 

            this.listenTo(this.collection, "reset", this.render);

            //this.listenTo(this.collection, "change:metadata", this.render);
        },
        events: {
            "click #refresh-inbox": "refreshInbox"
        },
        render: function() {
            var resultsPerPage,
                totalSize,
                totalPages;

            try {
                resultPerPage = this.collection.data("metadata").resultsPerPage;
            }
            catch(error) {
                resultsPerPage = 10;
            }

            try {
                totalSize = this.collection.data("metadata").totalSize;
            }
            catch(error) {
                totalSize = 100;
            }

            totalPages = (totalSize / resultsPerPage);

            console.log(totalPages);

            if (this.collection.data("currentPage") > 1) {
                //this.collection.data("hasNewerThreads", true);
            }

            if (this.collection.data("currentPage") * resultsPerPage < 30) {
                //this.collection.data("hasOlderThreads", true);
            }

            this.$el.html(this.template(this.collection.data("currentPage")));
    
            return this;
        },
        beforeRender: function() {
            console.log("before render");
        },
        afterRender: function() {
            console.log("after render");

            this.renderCollection();
        },
        cachedInboxItemViews: [],
        renderCollection: function() {
            var that = this;

            console.log("RENDERING COLLECTION");

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
                    console.log("begin retrieving inbox");
                }
            }).done(function(collection, response, options) {
                // console.log(collection);
                // console.log(response);
                // console.log(options);
            }).fail(function(collection, xhr, options) {
                // console.log(collection);
                // console.log(xhr);
                // console.log(options);
            }).always(function() {
                //console.log("always");;
            });
        },
        refreshInbox: function(evt) {
            var that = this;

            evt.preventDefault();

            this.fetchInbox(this.collection.data("currentPage"));
        }
    });

});