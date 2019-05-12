var express = require("express");
var config = require('config');
var bodyParser = require("body-parser");
const db = require('./apps/database/database');
const app = express();


db.connect("mongodb://127.0.0.1:27017/InfoFB")
    .then(async (msg) => {
        console.log(msg);
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.set("views", __dirname + "/apps/views");
        app.set("view engine", "ejs");

        app.use("/static", express.static(__dirname + "/public"));

        var controllers = require(__dirname + "/apps/controllers");

        app.use(controllers);

        var host = config.get("server.host");
        var port = process.env.PORT || config.get("server.port");

        app.listen(port, host, function () {
            console.log("Running on port ", port);
        })

    })
    .catch(err => {
        console.log('ERROR DATABASE', err);
    });

