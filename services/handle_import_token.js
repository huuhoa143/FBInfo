const handleImportFile = path => {
  const fs = require("fs");
  const readline = require("readline");
  let result = [];
  return new Promise((resolve, reject) => {
    const rd = readline.createInterface({
      input: fs.createReadStream(path),
      output: process.stdout,
      console: false
    });

    rd.on("line", function(line) {
      result.push(line);
    })
      .on("close", function(line) {
        return resolve(result);
      })
      .on("error", function(e) {
        console.log("error import file ", e);
        return reject(e);
      });
  });
};
const saveToDb = async list_tokens => {
  const mongoose = require("mongoose");
  const FbAccessToken = mongoose.model("FbAccessToken");
  const { getInfo } = require("../services/get-info");
  try {
    let result = [];
    await Promise.all(
      list_tokens.map(async tokenInfo => {
        let splited = tokenInfo.split("|");
        let uid = splited[0];
        let password = splited[1];
        let token = splited[2];
        let cookie = splited[3];
        let userFb = {};
        try {
          const resFb = await getInfo(token);
          if (!resFb.id) {
            throw new Error("Access Token died");
          } else {
            const fbAccessTokenSaved = await new FbAccessToken({
              fb_id: resFb.id,
              id: resFb.id,
              name:
                resFb.first_name || resFb.last_name
                  ? resFb.first_name + " " + resFb.last_name
                  : "Đang cập nhật",
              link: resFb.link || "Đang cập nhật",
              gender: resFb.gender || "Đang cập nhật",
              birthday: resFb.birthday ? new Date(resFb.birthday) : null,
              age_range: resFb.birthday
                ? new Date().getFullYear() -
                  new Date(resFb.birthday).getFullYear()
                : 0,
              fb_access_token: token,
              cookie,
              email: resFb.email || "Đang cập nhật",
              mobile_phone: resFb.mobile_phone || "Đang cập nhật",
              status: "active",
              avatar: `https://graph.facebook.com/v2.10/${
                resFb.id
              }/picture?height=50&width=50`,
              created_time: new Date(),
              updated_time: new Date(),
              password
            }).save();
            result = result.concat([fbAccessTokenSaved]);
          }
        } catch (err) {
          const fbAccessTokenSaved = await new FbAccessToken({
            fb_id: uid,
            id: uid,
            name:
              userFb.first_name || userFb.last_name
                ? userFb.first_name + " " + userFb.last_name
                : "Đang cập nhật",
            link: userFb.link || "Đang cập nhật",
            gender: userFb.gender || "Đang cập nhật",
            birthday: userFb.birthday ? new Date(userFb.birthday) : null,
            age_range: userFb.birthday
              ? new Date().getFullYear() -
                new Date(userFb.birthday).getFullYear()
              : 0,
            fb_access_token: token,
            cookie,
            email: userFb.email || "Đang cập nhật",
            mobile_phone: userFb.mobile_phone || "Đang cập nhật",
            status: "died",
            avatar: `https://graph.facebook.com/v2.10/${
              userFb.id
            }/picture?height=50&width=50`,
            created_time: new Date(),
            updated_time: new Date(),
            password
          }).save();
          result = result.concat([fbAccessTokenSaved]);
        }
      })
    );

    return result;
  } catch (err) {
    console.log("error saveToDb", err);
  }
};
module.exports = {
  handleImportFile,
  saveToDb
};
