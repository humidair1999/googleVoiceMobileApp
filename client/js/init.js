require([   "jquery",
            "underscore",
            "backbone",
            "routers/router"],
function (  $,
            _,
            Backbone,
            Router) {

    "use strict";

    $(document).ready(function() {
        GVMA.user = {};
        GVMA.app = {};

        GVMA.app.router = new Router();

        Backbone.history.start();
    });

});