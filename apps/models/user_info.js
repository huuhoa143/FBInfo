var fs = require('fs'),
    es = require('event-stream')
const {promisify}= require("util");
const readFile = promisify(fs.readFile);
const { getInfoListUid, getInfoUid } = require("../services/get-uids");
const UIDInfo = require('../models/UIDInfo.models');

const { fail, success } = require('../../utils/response-utils');



async function ReadFile() {
    let listUID = [];
    let infoUID = "";
    var totalLines = 0;
    var s = fs
        .createReadStream('/home/huuhoa/WebstormProjects/BookStore/apps/models/test.txt')
        .pipe(es.split())
        .pipe(
            es
                .mapSync(function (line) {
                    totalLines ++;
                    s.pause();
                    var data = line.split("\n");
                    data.map(async tmp => {
                        tmp = tmp.split("\t");
                        listUID.push(tmp[1]);
                        let info = await getInfoUid(tmp[1], "EAAAAUaZA8jlABADPGSFW5tXEkuZB6ZBbl94qEVCjtH1xV4CJEliYnES6ZBRpyTFCAZA42XQNPsuaQA1xm1dCseaKzn8TxO5UXGiKFZAD54PtIhgo6ke6JTDjQEqNF53UuaDx1Vs9mHvwoSK2DsnNIqVytVanEEKYlH75IGgEscUgZDZD");
                        if (info.hasOwnProperty("gender")) {
                            let uidInfo = new UIDInfo({
                                data: info
                            });
                            uidInfo.save()
                                .then(res => {
                                    console.log("Update UID OK");
                                })
                                .catch(err => {
                                    console.log("Import Err");
                                })
                        }

                    });

                    s.resume();
                })
                .on('error', function (err) {
                    console.log('Error while reading file. ', err);
                })
                .on('end', function () {
                    console.log('Read entire file');

                })
        )


}

module.exports = {
    ReadFile: ReadFile,
};