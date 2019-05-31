
module.exports = async (req, res) => {
  const { accept = '' } = req.headers;
  if (!req.user && ~accept.indexOf('text/html'))
    res.redirect('/login');
  return req.user;
};
