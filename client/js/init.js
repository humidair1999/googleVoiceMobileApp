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
        new Router();

        Backbone.history.start();
    });

});