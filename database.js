/* database(); */

module.exports.database =
  function database() {
    var mysql = require("mysql");
    var con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "it_begins"
    });
    var dbName = require("./test").dbName;

    con.connect(function (err) {
      if (err) throw err;
    });

    function get_info(name, callback) {
      var show = "SHOW DATABASES LIKE '" + name + "'";
      con.query(show, function (err, result) {
        if (err) throw err;
        return callback(name, result);
      });
    }

    var doesExist;
    doAgain(dbName);

    function doAgain(theName) {
      get_info(theName, function (rename, result) {
        doesExist = result;
        if (doesExist.length != 0) {
          rename = rename + "_" + Ranpostfix;
          doAgain(rename);
        } else {
          module.exports.dbName = rename;
          var sql = "CREATE DATABASE " + rename + " COLLATE latin1_swedish_ci";
          con.query(sql, function (err, result) {
            if (err) throw err;
          }).on("end", function (err) {
            con.end()
          });
        }
      });
    }


  };

function Ranpostfix() {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < 3; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}