var mysql = require('mysql');

var clust = mysql.createPoolCluster()

clust.add('main', {
  host: "localhost",
  user: "root",
  password: "it_begins"
});

var sql = "CREATE DATABASE testdb;";

clust.getConnection('main', (err, connection) => {
  connection.query(sql);
  connection.release();
});

clust.add('database', {
  host: "localhost",
  user: "root",
  password: "it_begins",
  database: "testdb"
});

clust.getConnection('database', (err, connection) => {
  connection.query("CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))");
  connection.release();
});

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Result: " + result);
//   });
// });