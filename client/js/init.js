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

        new Router();

        Backbone.history.start();
    });

});