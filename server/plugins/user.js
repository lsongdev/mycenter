const Authorization = require('../models/authorization');

module.exports = () => {
  return async (req, res, next) => {
    let { token } = req.cookies;
    if (!token) token = req.headers['x-token'];
    const session = await Authorization.findOne({
      where: { token: token || '' }
    });
    if (!session) return next();
    req.user = await session.getUser();
    req.locals = req.locals || {};
    req.locals.$user = req.user;
    return next();
  };
};
