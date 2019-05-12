const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const uidInfo = new Schema({
    data: {}
});

const UIDInfo = mongoose.model("UIDInfo", uidInfo);

module.exports = UIDInfo;