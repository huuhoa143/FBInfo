const { checkToken } = require("../services/get-info");
const mongoose = require("mongoose");
const FbAccessToken = require("../models/fb_access_token");

const getToken = async () => {
  const listTokens = await FbAccessToken.find({ status: "active" });
  const indexRand = Math.floor(Math.random() * listTokens.length + 1);
  const token = listTokens[indexRand - 1];
  let accessTokenDecrypt = "";
  if (token && token.fb_access_token) {
    accessTokenDecrypt = token.fb_access_token;
  } else {
    return false;
  }
  const check = await checkToken(accessTokenDecrypt);
  if (check.error) {
    await FbAccessToken.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(token._id) },
      {
        $set: { status: "died" }
      },
      {
        returnNewDocument: true,
        new: true,
        upsert: false
      }
    );
    return getToken();
  }
  return accessTokenDecrypt;
};
module.exports = {
  getToken
};
