require.config({
    // initialize the application by requiring the main.js file as a dependency
    deps: ["init"],

    // paths are shortcuts to make require and define calls shorter
    paths: {
        // app folders
        libs: "libs",
        collections: "app/collections",
        models: "app/models",
        routers: "app/routers",
        templates: "app/templates",
        views: "app/views",
        helpers: "app/helpers",

        // third-party libraries
        jquery: "libs/jquery-1.9.1.min",
        backbone: "libs/backbone-min",
        underscore: "libs/underscore-min",
        text: "libs/text"
    },

    // cache-busting for development environment
    urlArgs: "bust=" + (new Date()).getTime(),

    // legacy libraries that depend upon a particular loading order
    shim: {
        jquery: {
            deps: ["require"],
            exports: "$"
        },
        underscore: {
            deps: ["jquery"],
            exports: "_"
        },
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        }
    }
});
