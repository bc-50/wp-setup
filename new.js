const rp = require('request-promise');
var fs = require("fs-extra");
const url = 'https://api.wordpress.org/secret-key/1.1/salt/';
var config = require('./config-data');

rp(url)
  .then(function (html) {
    var rows = html.split('\n');
    fs.readFile(__dirname + "/wp-config-sample.php", "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }
      for (let i = 0; i < 8; i++) {
        if (i == 0) {
          var result = data.replace(config.replace[i], rows[i]);

        } else {
          result = result.replace(config.replace[i], rows[i]);
        }
      }

      for (let i = 0; i < 3; i++) {
        result = result.replace(config.standard[i], config.rows[i]);
      }

      fs.writeFile(__dirname + "/wp-config-sample.php", result, "utf8", function (
        err
      ) {
        if (err) return console.log(err);
      });

    });
  })
  .catch(function (err) {
    //handle error
  });


/*  fs.readFile(__dirname + "/wp-config-sample.php", "utf8", function (err, data) {
   if (err) {
     return console.log(err);
   }
   for (let i = 0; i < 3; i++) {
     if (i == 0) {
       var result = data.replace(config.replace[i], rows[i]);
     } else {
       result = result.replace(config.replace[i], rows[i]);
     }
   }

   fs.writeFile(__dirname + "/wp-config-sample.php", result, "utf8", function (
     err
   ) {
     if (err) return console.log(err);
   });

 }); */