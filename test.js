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
var siteUrl = path
  .dirname(__filename)
  .split(path.sep)
  .pop();

const bar1 = new _cliProgress.SingleBar({
  format: "Site Template Progress |" + "{bar}" + "| {percentage}%",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true
});
bar1.start(300, 0, {
  speed: 500
});
https
  .get(wpUrl, function (response) {
    response.pipe(fs.createWriteStream(__dirname + "/wp.zip"));
  })
  .on("close", function () {
    /* console.log(" Wordpress Zip Downloaded"); */
    bar1.update(50);
    fs.createReadStream(__dirname + "/wp.zip")
      .pipe(
        unzip.Extract({
          path: __dirname
        })
      )
      .on("close", function () {
        /* console.log(" Files Extracted"); */
        bar1.update(100);
        ncp(__dirname + "/wordpress", __dirname, function (err) {
          if (err) {
            return console.error(err);
          }
          /* console.log("Content pulled from Wordpress Folder"); */
          bar1.update(150);
          deletefiles();
          copytemplate();
        });
      });
  });

function deletefiles() {
  fs.unlinkSync(__dirname + "/wp.zip");
  rimraf.sync(__dirname + "/wordpress");
  /* console.log(" Zip and Folder Deleted"); */
  bar1.update(200);
}

function copytemplate() {
  var dir = __dirname + "/wp-content/themes/brace-" + siteUrl + "-theme";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  simpleGit()
    .clone("https://github.com/bc-50/theme-folder", dir)
    .exec(function () {
      bar1.update(250);
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

    /* console.log(" Style Sheet Updated"); */
    bar1.update(300);
    bar1.stop();
    deletepackages();
    config();
  });
}

function config() {
  fs.readFile(__dirname + "/wp-config-sample.php", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/database_name_here/g, "siteUrl");

    fs.writeFile(__dirname + "/wp-config-sample.php", result, "utf8", function (
      err
    ) {
      if (err) return console.log(err);
    });
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