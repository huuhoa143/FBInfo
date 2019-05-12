exports.unauthorized = () => {
    return {
        success: false,
        code: 401,
        reason: 'Unauthorized'
    };
};

exports.fail = (reason) => {
    return {
        success: false,
        code: 404,
        reason: reason || 'Error'
    };
};

exports.success = (data) => {
    return {
        success: true,
        code: 200,
        data
    };
};
