
module.exports = req =>
  req.headers['x-requested-with'] === 'XMLHttpRequest';
