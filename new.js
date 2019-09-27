const rp = require('request-promise');
const url = 'https://api.wordpress.org/secret-key/1.1/salt/';

rp(url)
  .then(function (html) {
    //success!
    console.log(html);
  })
  .catch(function (err) {
    //handle error
  });