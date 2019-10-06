var mysql = require('mysql');
var name = require('./test')
var clust = mysql.createPoolCluster()

clust.add('main', {
  host: "localhost",
  user: "root",
  password: ""
});

var sql = 'CREATE DATABASE ' + name.dbName + '\
 COLLATE latin1_swedish_ci';

clust.getConnection('main', (err, connection) => {
  connection.query(sql);
  connection.release();
});

clust.add('database', {
  host: "localhost",
  user: "root",
  password: "",
  database: name.dbName
});

clust.getConnection('database', (err, connection) => {
  connection.query('CREATE TABLE wp_comment (\
  comment_ID bigint(20),\
  comment_post_ID bigint(20),\
  comment_author tinytext,\
  comment_author_email varchar(100),\
  comment_author_url varchar(200),\
  comment_author_IP varchar(100),\
  comment_date datetime,\
  comment_data_gmt datetime,\
  comment_content text,\
  comment_karma int(11),\
  comment_approved varchar(20),\
  comment_agent varchar(255),\
  comment_type varchar(20),\
  comment_parent bigint(20),\
  user_id bigint(20))\
  COLLATE utf8mb4_unicode_ci');

  connection.query('CREATE TABLE wp_commentmeta (\
  meta_id bigint(20),\
  comment_id bigint(20),\
  meta_key varchar(255),\
  meta_value longtext )\
  COLLATE utf8mb4_unicode_ci');

  connection.query('CREATE TABLE wp_links (\
  link_id bigint(20),\
  link_url varchar(255),\
  link_name varchar(255),\
  link_image varchar(255),\
  link_target varchar(25),\
  link_description varchar(255),\
  link_visible varchar(255),\
  link_owner bigint(20),\
  link_rating int(11),\
  link_updated datetime,\
  link_rel varchar(255),\
  link_notes mediumtext,\
  link_rss varchar(255))\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE TABLE wp_users (\
  ID bigint(20),\
  user_login varchar(60),\
  user_pass varchar(255),\
  user_nickname varchar(50),\
  user_email varchar(100),\
  user_url varchar(100),\
  user_registered datetime,\
  user_activation_key varchar(255),\
  user_status int(11),\
  display_name varchar(250))\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE TABLE wp_posts (\
  ID bigint(20),\
  post_author bigint(20),\
  post_date datetime,\
  post_date_gmt datetime,\
  post_content longtext,\
  post_title text,\
  post_excerpt text,\
  post_status varchar(20),\
  comment_status varchar(20),\
  ping_status varchar(20),\
  post_password varchar(20),\
  post_name varchar(200),\
  to_ping text,\
  pinged text,\
  post_modified datetime,\
  post_modified_gmt datetime,\
  post_content_filtered longtext,\
  post_parent bigint(20),\
  guid varchar(255),\
  menu_order int(11),\
  post_type varchar(20),\
  post_mime_type varchar(100),\
  comment_count bigint(20))\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE TABLE wp_postmeta (\
  meta_id bigint(20),\
  post_id bigint(20),\
  meta_key varchar(255),\
  meta_value longtext)\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE TABLE wp_termmeta (\
  meta_id bigint(20),\
  term_id bigint (20),\
  meta_key varchar(255),\
  meta_value longtext)\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE TABLE wp_terms (\
  term_id bigint(20),\
  name varchar(200),\
  slug varchar(200),\
  term_group bigint(10))\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE TABLE wp_term_taxonomy (\
  term_taxonomy_id bigint(20),\
  term_id bigint(20),\
  taxonomy varchar(32),\
  description longtext,\
  parent bigint (20),\
  count bigint (20))\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE TABLE wp_term_relationships (\
  term_taxonomy_id bigint(20),\
  term_order int(11))\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE TABLE wp_options(\
  option_id bigint(20),\
  option_name varchar(191)\
  option_value longtext,\
  autoload varchar(20))\
  COLLATE utf8mb4_unicode_ci');
  connection.query('');
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