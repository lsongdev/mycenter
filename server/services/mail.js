const smtp = require('smtp2');

module.exports = () => {
  return (Subject, To, content) => {
    return new Promise((resolve, reject) => {
      smtp.send({
        headers: { From: 'my@lsong.org', To, Subject },
        body: { _: content }
      }, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  };
};
