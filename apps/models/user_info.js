var fs = require('fs'),
    es = require('event-stream')
const {promisify}= require("util");
const readFile = promisify(fs.readFile);
const { getInfoListUid, getInfoUid } = require("../services/get-uids");
const UIDInfo = require('../models/UIDInfo.models');

const { fail, success } = require('../../utils/response-utils');
const folder = '/home/huuhoa/Documents/vnphones_output';


function CheckDir() {
    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            console.log(file);
        });
    });
}

async function ReadFile() {
    let infoUID = "";
    var totalLines = 0;
    let listUID = [];
    let arr = [];
    let count = 0;


    var s = fs
        .createReadStream('/home/huuhoa/WebstormProjects/BookStore/apps/models/test.txt')
        .pipe(es.split())
        .pipe(
            es
                .mapSync(function (line) {

                    s.pause();
                    totalLines++;

                    var data = line.split("\n");
                    Promise.all(data.map(async tmp => {
                        tmp = tmp.split("\t");
                        listUID.push(tmp[1]);
                        // if (count <= 700) {
                        //     count ++;
                        //     listUID.push(tmp[1]);
                        // } else {
                        //     let info = await getInfoListUid(listUID, "EAAAAUaZA8jlABADPGSFW5tXEkuZB6ZBbl94qEVCjtH1xV4CJEliYnES6ZBRpyTFCAZA42XQNPsuaQA1xm1dCseaKzn8TxO5UXGiKFZAD54PtIhgo6ke6JTDjQEqNF53UuaDx1Vs9mHvwoSK2DsnNIqVytVanEEKYlH75IGgEscUgZDZD");
                        //     listUID = [];
                        //     listUID.push(tmp[1]);
                        //     count = 0;
                        //     console.log(info)
                        // }
                        // console.log("UID: ", tmp[1]);
                        // let info = await getInfoUid(tmp[1], "EAAAAUaZA8jlABADPGSFW5tXEkuZB6ZBbl94qEVCjtH1xV4CJEliYnES6ZBRpyTFCAZA42XQNPsuaQA1xm1dCseaKzn8TxO5UXGiKFZAD54PtIhgo6ke6JTDjQEqNF53UuaDx1Vs9mHvwoSK2DsnNIqVytVanEEKYlH75IGgEscUgZDZD");
                        // if (info.hasOwnProperty("gender")) {
                        //
                        //     let uidInfo = new UIDInfo({
                        //         data: info
                        //     });
                        //     uidInfo.save()
                        //         .then(res => {
                        //             count++;
                        //             console.log("Update UID: " + tmp[1] + " Line: " + count);
                        //         })
                        //         .catch(err => {
                        //             console.log("Import Err");
                        //         })
                        // }

                    }));

                    s.resume();
                })
                .on('error', function (err) {
                    console.log('Error while reading file. ', err);
                })
                .on('end',async function () {
                    console.log('Read entire file');
                    let flag = 0;
                    let split700UID = [];
                    for (let i = 0; i < listUID.length; i++) {
                        let arr = [];
                        if (i % 200 === 0) {
                            arr = listUID.slice(flag, i + 1);
                            flag = i + 1;
                            split700UID.push(arr);
                        }
                    }
                    if (listUID.length + 1 !== flag) {
                        split700UID.push(listUID.slice(flag, listUID.length));
                    }

                    let arrInfo = [];
                    for (let i = 0; i < split700UID.length; i++) {
                        console.log(i, split700UID[i].length);
                        let info = await getInfoListUid(split700UID[i], "EAAAAUaZA8jlABADPGSFW5tXEkuZB6ZBbl94qEVCjtH1xV4CJEliYnES6ZBRpyTFCAZA42XQNPsuaQA1xm1dCseaKzn8TxO5UXGiKFZAD54PtIhgo6ke6JTDjQEqNF53UuaDx1Vs9mHvwoSK2DsnNIqVytVanEEKYlH75IGgEscUgZDZD");

                        // info = JSON.stringify(info);
                        // let arrInfo = [];
                        // // Convert kết quả trả về từ object sang array
                        // Object.keys(info).map( (key, index) => {
                        //     let _info = {...info[key], id: key, fb_id: key};
                        //     arrInfo = arrInfo.concat([_info]);
                        // });
                        console.log(i, info);
                        for (var property in info) {
                            if (info.hasOwnProperty(property)) {
                                let abc = info[property];
                                let abcd = JSON.stringify(abc) + "\n";
                                arrInfo.push(abcd);

                                // console.log(property, info[property]);
                                // // Do things here
                                // await fs.writeFileSync("abc.json", abcd, err => {
                                //     if (err) throw err;
                                //     console.log("Write file success");
                                // });
                            }
                        }
                        // arrInfo.map( infoUId => {
                        //     let abc = JSON.stringify(infoUId);
                        //     fs.appendFile("abc.json", abc, err => {
                        //         if (err) throw err;
                        //         console.log("Write file success");
                        //     });
                        // });

                        // arrInfo.push(info);
                    }
                    // console.log(arrInfo);
                    Promise.all(arrInfo.map(async info => {
                        // File muốn write vào
                        await fs.appendFile("abc.json", info, err => {
                            if (err) throw err;
                            console.log("Write file success");
                        });
                    }));

                })
        )

}

module.exports = {
    ReadFile: ReadFile,
    CheckDir: CheckDir
};