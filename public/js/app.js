
// eslint-disable-next-line
(function() {

  console.log('app');
  // eslint-disable-next-line
  document.addEventListener('click', e => {
    const link = e.target;
    if (link.tagName === 'A') {
      const method = link.getAttribute('method');
      const href   = link.getAttribute('href');
      const body   = link.getAttribute('data-body');
      if (method && href) {
        e.preventDefault();
        link.onload = link.onload || (() => location.reload());
        const xhr = new XMLHttpRequest();
        xhr.onload = link.onload;
        xhr.open(method, href);
        xhr.send(body);
      }
    }
  });
})();
