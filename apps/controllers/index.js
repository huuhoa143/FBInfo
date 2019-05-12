const express = require("express");
const user_info = require("../models/user_info");
const { fail, success } = require('../../utils/response-utils');

var router = express.Router();


router.get("/", function (req, res) {
    var user_infos = user_info.ReadFile();

    // res.send("Running OK");
    res.json(success(user_infos));

});


module.exports = router;