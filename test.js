var https = require("https");
var fs = require("fs");
var unzip = require("unzip");
var ncp = require("ncp").ncp;
var rimraf = require("rimraf");
var path = require("path");
const simpleGit = require("simple-git");
var wpUrl = "https://wordpress.org/latest.zip";
const rp = require("request-promise");
const url = "https://api.wordpress.org/secret-key/1.1/salt/";
var siteUrl = path
  .dirname(__filename)
  .split(path.sep)
  .pop();
var config = require("./config-data");
var database = require("./database");
module.exports.dbName = siteUrl.replace(/-/g, "_");

https
  .get(wpUrl, function (response) {
    response.pipe(fs.createWriteStream(__dirname + "/wp.zip"));
  })
  .on("close", function () {
    console.log("Extracting Wordpress zip");
    fs.createReadStream(__dirname + "/wp.zip")
      .pipe(
        unzip.Extract({
          path: __dirname
        })
      )
      .on("close", function () {
        console.log("Moving files to current folder");
        ncp(__dirname + "/wordpress", __dirname, function (err) {
          if (err) {
            return console.error(err);
          }
          deletefiles();
          copytemplate();
        });
      });
  });

function deletefiles() {
  console.log("Deleting Wordpress zip and Wordpress folder");
  fs.unlinkSync(__dirname + "/wp.zip");
  rimraf.sync(__dirname + "/wordpress");
}

function copytemplate() {
  console.log("Creating Theme Folder");
  var dir = __dirname + "/wp-content/themes/brace-" + siteUrl + "-theme";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  console.log("Cloning theme to theme folder");
  simpleGit()
    .clone("replace_theme", dir)
    .exec(function () {
      deletethemes();
      writeToStyles(dir);
    });
}

function deletethemes() {
  console.log("Deleting Wordpress Themes");
  var dir = __dirname + "/wp-content/themes/",
    theme = "brace-" + siteUrl + "-theme";

  fs.readdir(dir, (err, files) => {
    files.forEach(file => {
      if (fs.lstatSync(path.resolve(dir, file)).isDirectory() && file != theme) {
        rimraf.sync(dir + file);
      }
    });
  });
}

function writeToStyles(dir) {
  console.log("Editing style.css header");
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
    console.log("Creating database");
    database.database();
    rewrite();
    deletepackages();
    console.log("Now make a sick website!!");
    console.log("Or don't");
    console.log("I don't care");
  });
}

function rewrite() {

  console.log("Creating wp-config");
  fs.copyFile("wp-config-sample.php", "wp-config.php", function (err) {
    if (err) throw err;
  });

  rp(url).then(function (html) {
    var rows = html.split("\n");
    fs.readFile(__dirname + "/wp-config.php", "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }
      console.log("Adding wordpress salts");
      for (let i = 0; i < 8; i++) {
        if (i == 0) {
          var result = data.replace(config.replace[i], rows[i]);
        } else {
          result = result.replace(config.replace[i], rows[i]);
        }
      }
      console.log("Adding database settings");
      for (let i = 0; i < 3; i++) {
        if (i == 0) {
          result = result.replace(
            config.standard[i],
            database.dbName
          );
        } else {
          result = result.replace(config.standard[i], config.rows[i]);
        }
      }

      fs.writeFile(__dirname + "/wp-config.php", result, "utf8", function (err) {
        if (err) return console.log(err);
      });
    });
  });
}

function deletepackages() {
  console.log("Deleting startup files");
  if (fs.existsSync(__dirname + "/package.json")) {
    fs.unlinkSync(__dirname + "/package.json");
  }
  if (fs.existsSync(__dirname + "/package-lock.json")) {
    fs.unlinkSync(__dirname + "/package-lock.json");
  }
  if (fs.existsSync(__dirname + "/config-data.js")) {
    fs.unlinkSync(__dirname + "/config-data.js");
  }
  if (fs.existsSync(__dirname + "/database.js")) {
    fs.unlinkSync(__dirname + "/database.js");
  }
  if (fs.existsSync(__dirname + "/npm-shrinkwrap.json")) {
    fs.unlinkSync(__dirname + "/npm-shrinkwrap.json");
  }
  if (fs.existsSync(__dirname + "/test.js")) {
    fs.unlinkSync(__dirname + "/test.js");
  }
  rimraf.sync(__dirname + "/node_modules");
}