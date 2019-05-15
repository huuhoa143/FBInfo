const apiSender = require("./api-sender");

module.exports.getInfo = access_token => {
  const route = `https://graph.facebook.com/me?access_token=${access_token}`;
  return apiSender.getFb(route).catch(err => {
    console.log("err", err);
    throw new Error(err);
  });
};
module.exports.checkToken = access_token => {
  const route = `https://graph.facebook.com/me?fields=name,location,locale,friends.limit(5000),groups.limit(5000),accounts.limit(5000)&access_token=${access_token}`;
  const routeEncode = encodeURI(route);
  return apiSender.getFb(routeEncode);
};
