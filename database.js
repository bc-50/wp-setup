/* database(); */

module.exports.database =
  function database() {
    var mysql = require("mysql");
    var con = mysql.createConnection({
      host: "localhost",
      user: "connection_user",
      password: "connection_password"
    });
    var dbName = require("./test").dbName;

    con.connect(function (err) {
      if (err) throw err;
    });

    create_database(dbName);

    function create_database(theName) {
      check_for_database(theName, function (rename, result) {
        if (result.length != 0) {
          rename = rename + "_" + Ranpostfix();
          create_database(rename);
        } else {
          module.exports.dbName = rename;
          var sql = "CREATE DATABASE " + rename + " COLLATE latin1_swedish_ci";
          con.query(sql, function (err, result) {
            if (err) throw err;
          }).on("end", function (err) {
            if (err) throw err;
            con.end();
          });
        }
      });
    }

    function check_for_database(name, callback) {
      var show = "SHOW DATABASES LIKE '" + name + "'";
      con.query(show, function (err, result) {
        if (err) throw err;
        return callback(name, result);
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