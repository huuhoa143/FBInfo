const apiSender = require('./api-sender');



const getInfoListUid = (uidlist, access_token, result, next, count) => {
    let route = `https://graph.facebook.com/?ids=${uidlist}&access_token=${access_token}`;
    return apiSender.getFb(route)
        .then(resFb => {
            if (resFb) {
                return Promise.resolve(resFb);
            } else {
                throw new Error('Lỗi hệ thống. Vui lòng thử lại');
            }
        })
        .catch(err => {
            throw new Error(err.message);
        })
};

const getInfoUid = (uid, access_token) => {
    const route = `https://graph.facebook.com/${uid}?access_token=${access_token}`;
    return apiSender.getFb(route)
        .then(resFb => {
            let _resFb = { ...resFb };
            // console.log('_resFb ==== ', _resFb)
            // if (_resFb.error) throw new Error('Không tìm thấy đối tượng');
            if (_resFb.privacy && !_resFb.category) {
                _resFb.type = 'group';
            } else if (_resFb.category) {
                _resFb.type = 'page';
            } else {
                _resFb.type = 'user';
            }
            return Promise.resolve(_resFb);
        })
        .catch(err => {
            throw new Error(err.message);

        })
};

module.exports.getInfoListUid = getInfoListUid;
module.exports.getInfoUid = getInfoUid;