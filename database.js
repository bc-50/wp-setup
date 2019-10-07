/* database();


module.exports.database = function () { */
var mysql = require('mysql');
/* var name = require('./test') */
var clust = mysql.createPoolCluster()

clust.add('main', {
  host: "localhost",
  user: "root",
  password: ""
});

var sql = 'CREATE DATABASE testdb\
 COLLATE latin1_swedish_ci';

clust.getConnection('main', (err, connection) => {
  connection.query(sql);
  connection.release();
});

clust.add('database', {
  host: "localhost",
  user: "root",
  password: "",
  database: "testdb"
});

clust.getConnection('database', (err, connection) => {
  connection.query('CREATE TABLE wp_comment (\
  comment_ID bigint(20) NOT NULL PRIMARY KEY,\
  comment_post_ID bigint(20),\
  comment_author tinytext,\
  comment_author_email varchar(100),\
  comment_author_url varchar(200),\
  comment_author_IP varchar(100),\
  comment_date datetime,\
  comment_date_gmt datetime,\
  comment_content text,\
  comment_karma int(11),\
  comment_approved varchar(20),\
  comment_agent varchar(255),\
  comment_type varchar(20),\
  comment_parent bigint(20),\
  user_id bigint(20))\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE INDEX comment_post_ID\
  ON wp_comment (comment_post_ID);');
  connection.query('CREATE INDEX comment_approved_date_gmt\
  ON wp_comment (comment_approved,comment_date_gmt);');
  connection.query('CREATE INDEX comment_date_gmt\
  ON wp_comment (comment_date_gmt);');
  connection.query('CREATE INDEX comment_parent\
  ON wp_comment (comment_parent);');
  connection.query('CREATE INDEX comment_author_email\
  ON wp_comment (comment_author_email);');

  connection.query('CREATE TABLE wp_commentmeta (\
  meta_id bigint(20) NOT NULL PRIMARY KEY,\
  comment_id bigint(20),\
  meta_key varchar(255),\
  meta_value longtext)\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE INDEX comment_id\
  ON wp_commentmeta (comment_ID);');
  connection.query('CREATE INDEX meta_key\
  ON wp_commentmeta (meta_key);');

  connection.query('CREATE TABLE wp_links (\
  link_id bigint(20) NOT NULL PRIMARY KEY,\
  link_url varchar(255),\
  link_name varchar(255),\
  link_image varchar(255),\
  link_target varchar(25),\
  link_description varchar(255),\
  link_visible varchar(20),\
  link_owner bigint(20),\
  link_rating int(11),\
  link_updated datetime,\
  link_rel varchar(255),\
  link_notes mediumtext,\
  link_rss varchar(255))\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE INDEX link_visible\
  ON wp_links (link_visible);');

  connection.query('CREATE TABLE wp_options(\
  option_id bigint(20) NOT NULL PRIMARY KEY,\
  option_name varchar(191),\
  option_value longtext,\
  autoload varchar(20))\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE UNIQUE INDEX option_name\
  ON wp_options (option_name);');

  connection.query('CREATE TABLE wp_postmeta (\
  meta_id bigint(20) NOT NULL PRIMARY KEY,\
  post_id bigint(20),\
  meta_key varchar(255),\
  meta_value longtext)\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE INDEX post_id\
  ON wp_postmeta (post_id);');
  connection.query('CREATE INDEX meta_key\
  ON wp_postmeta (meta_key);');

  connection.query('CREATE TABLE wp_posts (\
  ID bigint(20) NOT NULL PRIMARY KEY,\
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
  connection.query('CREATE INDEX post_name\
  ON wp_posts (post_name);');
  connection.query('CREATE INDEX type_status_date\
  ON wp_posts (post_type,post_status,post_date,ID);');
  connection.query('CREATE INDEX post_parent\
  ON wp_posts (post_parent);');
  connection.query('CREATE INDEX post_author\
  ON wp_posts (post_author);');

  connection.query('CREATE TABLE wp_termmeta (\
  meta_id bigint(20) NOT NULL PRIMARY KEY,\
  term_id bigint (20),\
  meta_key varchar(255),\
  meta_value longtext)\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE INDEX term_id\
  ON wp_termmeta (term_id);');
  connection.query('CREATE INDEX meta_key\
  ON wp_termmeta (meta_key);');
  
  connection.query('CREATE TABLE wp_terms (\
  term_id bigint(20) NOT NULL PRIMARY KEY,\
  name varchar(200),\
  slug varchar(200),\
  term_group bigint(10))\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE INDEX slug\
  ON wp_terms (slug);');
  connection.query('CREATE INDEX name\
  ON wp_terms (name);');

  connection.query('CREATE TABLE wp_term_relationships (\
  object_id bigint(20) NOT NULL,\
  term_taxonomy_id bigint(20) NOT NULL,\
  term_order int(11),\
  CONSTRAINT PRIMARY PRIMARY KEY (object_id,term_taxonomy_id))\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE INDEX term_taxonomy_id\
  ON wp_term_relationships (term_taxonomy_id);');

  connection.query('CREATE TABLE wp_term_taxonomy (\
  term_taxonomy_id bigint(20) NOT NULL PRIMARY KEY,\
  term_id bigint(20),\
  taxonomy varchar(32),\
  description longtext,\
  parent bigint (20),\
  count bigint (20))\
  COLLATE utf8mb4_unicode_ci');
  connection.query('CREATE UNIQUE INDEX term_taxonomy_id\
  ON wp_term_taxonomy (term_id,taxonomy);');
  connection.query('CREATE INDEX taxonomy\
  ON wp_term_taxonomy (taxonomy);');

  connection.query('CREATE TABLE wp_users (\
    ID bigint(20) NOT NULL PRIMARY KEY,\
    user_login varchar(60),\
    user_pass varchar(255),\
    user_nicename varchar(50),\
    user_email varchar(100),\
    user_url varchar(100),\
    user_registered datetime,\
    user_activation_key varchar(255),\
    user_status int(11),\
    display_name varchar(250))\
    COLLATE utf8mb4_unicode_ci');
    connection.query('CREATE INDEX user_login_key\
    ON wp_users (user_login);');
    connection.query('CREATE INDEX user_nicename\
    ON wp_users (user_nicename);');
    connection.query('CREATE INDEX user_email\
    ON wp_users (user_email);');

  connection.release();
});
/* } */

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Result: " + result);
//   });
// });