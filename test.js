var fs = require("fs-extra");
var https = require("https");
var path = require("path");
var unzip = require("unzip");
var copydir = require("copy-dir");
var ncp = require("ncp").ncp;
var rimraf = require("rimraf");
const _cliProgress = require("cli-progress");
const simpleGit = require("simple-git");
var wpUrl = "https://wordpress.org/latest.zip";
const rp = require('request-promise');
const url = 'https://api.wordpress.org/secret-key/1.1/salt/';
var siteUrl = path
  .dirname(__filename)
  .split(path.sep)
  .pop();
var config = require('./config-data');
module.exports.dbName = siteUrl.replace("-", "_");


https
  .get(wpUrl, function (response) {
    response.pipe(fs.createWriteStream(__dirname + "/wp.zip"));
  })
  .on("close", function () {
    console.log(" Wordpress Zip Downloaded");
    fs.createReadStream(__dirname + "/wp.zip")
      .pipe(
        unzip.Extract({
          path: __dirname
        })
      )
      .on("close", function () {
        console.log(" Files Extracted");
        ncp(__dirname + "/wordpress", __dirname, function (err) {
          if (err) {
            return console.error(err);
          }
          console.log(" Content pulled from Wordpress Folder");
          deletefiles();
          copytemplate();
        });
      });
  });

function deletefiles() {
  fs.unlinkSync(__dirname + "/wp.zip");
  rimraf.sync(__dirname + "/wordpress");
  console.log(" Zip and Folder Deleted");
}

function copytemplate() {
  var dir = __dirname + "/wp-content/themes/brace-" + siteUrl + "-theme";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  simpleGit()
    .clone("https://github.com/bc-50/theme-folder", dir)
    .exec(function () {
      console.log('Theme Folder Retrived');
      writeToStyles(dir);
    });
}

function writeToStyles(dir) {
  var temp =
    `/*
    Theme Name: Brace Custom Theme
    Author: Brace Creative Agency
    Description: Custom theme
    */
    @import url("../brace-` +
    siteUrl +
    `-theme/styles/main.min.css");`;
  fs.writeFile(dir + "/style.css", temp, function (err) {
    if (err) {
      return console.log(err);
    }

    console.log(" Style Sheet Updated");
    rewrite();
    deletepackages();
  });
}

function rewrite() {

  fs.copyFile('wp-config-sample.php', 'wp-config.php', function (err) {
    if (err) throw err;
    console.log('wp-config.php was created');
  });

  rp(url)
    .then(function (html) {
      var rows = html.split('\n');
      fs.readFile(__dirname + "/wp-config.php", "utf8", function (err, data) {
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
          if (i == 0) {
            result = result.replace(config.standard[i], siteUrl.replace("-", "_"));

          } else {
            result = result.replace(config.standard[i], config.rows[i]);
          }
        }

        fs.writeFile(__dirname + "/wp-config.php", result, "utf8", function (
          err
        ) {
          if (err) return console.log(err);
        });

      });
    })
    .catch(function (err) {
      //handle error
    });

}

function deletepackages() {
  if (fs.existsSync(__dirname + "/package.json")) {
    fs.unlinkSync(__dirname + "/package.json");
  }
  if (fs.existsSync(__dirname + "/package-lock.json")) {
    fs.unlinkSync(__dirname + "/package-lock.json");
  }

  fs.unlinkSync(__dirname + "/test.js");
  rimraf.sync(__dirname + "/node_modules");
}