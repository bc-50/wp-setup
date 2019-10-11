/* database(); */

module.exports.database =
  function database() {
    var mysql = require("mysql");
    var name = require("./test");
    var clust = mysql.createPoolCluster();
    var d = new Date('0000', '00', '00', '00', '00', '00');
    clust.add("main", {
      host: "localhost",
      user: "root",
      password: "it_begins"
    });

    /*  var sql = "CREATE DATABASE moving_test\ */
    var sql = "CREATE DATABASE " + name.dbName + "\
 COLLATE latin1_swedish_ci";

    clust.getConnection("main", (err, connection) => {
      connection.query(sql);
      connection.release();
    });

    clust.add("database", {
      host: "localhost",
      user: "root",
      password: "it_begins",
      database: name.dbName
      /* database: "moving_test" */
    });

    clust.getConnection("database", (err, connection) => {

      connection.query("SET SESSION sql_mode = '';");

      /* Comments Table */
      connection.query(
        "CREATE TABLE wp_comments (\
  comment_ID bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,\
  comment_post_ID bigint(20) UNSIGNED NOT NULL DEFAULT 0,\
  comment_author tinytext NOT NULL,\
  comment_author_email varchar(100) NOT NULL DEFAULT '',\
  comment_author_url varchar(200) NOT NULL DEFAULT '',\
  comment_author_IP varchar(100) NOT NULL DEFAULT '',\
  comment_date datetime NOT NULL DEFAULT '0000-00-00 00:00:00',\
  comment_date_gmt datetime NOT NULL DEFAULT '0000-00-00 00:00:00',\
  comment_content text NOT NULL,\
  comment_karma int(11) NOT NULL DEFAULT 0,\
  comment_approved varchar(20) NOT NULL DEFAULT '1',\
  comment_agent varchar(255) NOT NULL DEFAULT '',\
  comment_type varchar(20) NOT NULL DEFAULT '',\
  comment_parent bigint(20) UNSIGNED NOT NULL DEFAULT 0,\
  user_id bigint(20) UNSIGNED NOT NULL DEFAULT 0,\
  FOREIGN KEY (comment_post_ID) REFERENCES wp_posts(PostID))\
  COLLATE utf8mb4_unicode_ci"
      );
      /* Comment Indexes */
      connection.query(
        "CREATE INDEX comment_post_ID\
  ON wp_comments (comment_post_ID);"
      );
      connection.query(
        "CREATE INDEX comment_approved_date_gmt\
  ON wp_comments (comment_approved,comment_date_gmt);"
      );
      connection.query(
        "CREATE INDEX comment_date_gmt\
  ON wp_comments (comment_date_gmt);"
      );
      connection.query(
        "CREATE INDEX comment_parent\
  ON wp_comments (comment_parent);"
      );
      connection.query(
        "CREATE INDEX comment_author_email\
  ON wp_comments (comment_author_email);"
      );
      /* Comment Rows */
      /* connection.query(
      "INSERT INTO wp_comments (option_name,option_value)\
  VALUES ('home','http://localhost/wp-setup/');"
    ); */

      /* Comment Meta Table */
      connection.query(
        "CREATE TABLE wp_commentmeta (\
  meta_id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,\
  comment_id bigint(20) UNSIGNED NOT NULL DEFAULT 0,\
  meta_key varchar(255),\
  meta_value longtext)\
  COLLATE utf8mb4_unicode_ci"
      );
      connection.query(
        "CREATE INDEX comment_id\
  ON wp_commentmeta (comment_ID);"
      );
      connection.query("CREATE INDEX meta_key\
  ON wp_commentmeta (meta_key);");

      connection.query(
        "CREATE TABLE wp_links (\
  link_id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,\
  link_url varchar(255) NOT NULL DEFAULT '',\
  link_name varchar(255) NOT NULL DEFAULT '',\
  link_image varchar(255) NOT NULL DEFAULT '',\
  link_target varchar(25) NOT NULL DEFAULT '',\
  link_description varchar(255) NOT NULL DEFAULT '',\
  link_visible varchar(20) NOT NULL DEFAULT 'Y',\
  link_owner bigint(20) UNSIGNED NOT NULL DEFAULT 1,\
  link_rating int(11) NOT NULL DEFAULT 0,\
  link_updated datetime NOT NULL DEFAULT '0000-00-00 00:00:00',\
  link_rel varchar(255) NOT NULL DEFAULT '',\
  link_notes mediumtext NOT NULL,\
  link_rss varchar(255) NOT NULL DEFAULT '')\
  COLLATE utf8mb4_unicode_ci"
      );
      connection.query("CREATE INDEX link_visible\
  ON wp_links (link_visible);");

      connection.query(
        "CREATE TABLE wp_options(\
  option_id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,\
  option_name varchar(191) NOT NULL DEFAULT '',\
  option_value longtext NOT NULL,\
  autoload varchar(20) NOT NULL DEFAULT 'yes')\
  COLLATE utf8mb4_unicode_ci"
      );
      connection.query(
        "CREATE UNIQUE INDEX option_name\
  ON wp_options (option_name);"
      );
      connection.query(
        "INSERT INTO wp_options (option_name,option_value)\
  VALUES ('siteurl','http://localhost/" + name.dbName.replace('_', '-') + "/');"
      );
      connection.query(
        "INSERT INTO wp_options (option_name,option_value)\
  VALUES ('home','http://localhost/" + name.dbName.replace('_', '-') + "/');"
      );


      connection.query(
        "CREATE TABLE wp_postmeta (\
  meta_id bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
  post_id bigint(20),\
  meta_key varchar(255),\
  meta_value longtext)\
  COLLATE utf8mb4_unicode_ci"
      );
      connection.query("CREATE INDEX post_id\
  ON wp_postmeta (post_id);");
      connection.query("CREATE INDEX meta_key\
  ON wp_postmeta (meta_key);");

      connection.query(
        "CREATE TABLE wp_posts (\
  ID bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
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
  COLLATE utf8mb4_unicode_ci"
      );
      connection.query("CREATE INDEX post_name\
  ON wp_posts (post_name);");
      connection.query(
        "CREATE INDEX type_status_date\
  ON wp_posts (post_type,post_status,post_date,ID);"
      );
      connection.query("CREATE INDEX post_parent\
  ON wp_posts (post_parent);");
      connection.query("CREATE INDEX post_author\
  ON wp_posts (post_author);");

      connection.query(
        "CREATE TABLE wp_termmeta (\
  meta_id bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
  term_id bigint (20),\
  meta_key varchar(255),\
  meta_value longtext)\
  COLLATE utf8mb4_unicode_ci"
      );
      connection.query("CREATE INDEX term_id\
  ON wp_termmeta (term_id);");
      connection.query("CREATE INDEX meta_key\
  ON wp_termmeta (meta_key);");

      connection.query(
        "CREATE TABLE wp_terms (\
  term_id bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
  name varchar(200),\
  slug varchar(200),\
  term_group bigint(10))\
  COLLATE utf8mb4_unicode_ci"
      );
      connection.query("CREATE INDEX slug\
  ON wp_terms (slug);");
      connection.query("CREATE INDEX name\
  ON wp_terms (name);");

      connection.query(
        "CREATE TABLE wp_term_relationships (\
  object_id bigint(20) NOT NULL,\
  term_taxonomy_id bigint(20) NOT NULL,\
  term_order int(11),\
  PRIMARY KEY (object_id,term_taxonomy_id))\
  COLLATE utf8mb4_unicode_ci"
      );
      connection.query(
        "CREATE INDEX term_taxonomy_id\
      ON wp_term_relationships (term_taxonomy_id);"
      );

      connection.query(
        "CREATE TABLE wp_term_taxonomy (\
  term_taxonomy_id bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
  term_id bigint(20),\
  taxonomy varchar(32),\
  description longtext,\
  parent bigint (20),\
  count bigint (20))\
  COLLATE utf8mb4_unicode_ci"
      );
      connection.query(
        "CREATE UNIQUE INDEX term_taxonomy_id\
  ON wp_term_taxonomy (term_id,taxonomy);"
      );
      connection.query("CREATE INDEX taxonomy\
  ON wp_term_taxonomy (taxonomy);");


      connection.query("CREATE TABLE wp_usermeta (\
  umeta_id bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
  user_id bigint(20),\
  meta_key varchar(255),\
  meta_value longtext)\
  COLLATE utf8mb4_unicode_ci");
      connection.query(
        "CREATE INDEX user_id\
    ON wp_usermeta (user_id);");
      connection.query("CREATE INDEX meta_key\
    ON wp_usermeta (meta_key(191));");

      connection.query(
        "CREATE TABLE wp_users (\
    ID bigint(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,\
    user_login varchar(60),\
    user_pass varchar(255),\
    user_nicename varchar(50),\
    user_email varchar(100),\
    user_url varchar(100),\
    user_registered datetime,\
    user_activation_key varchar(255),\
    user_status int(11),\
    display_name varchar(250))\
    COLLATE utf8mb4_unicode_ci"
      );
      connection.query(
        "CREATE INDEX user_login_key\
    ON wp_users (user_login);"
      );
      connection.query(
        "CREATE INDEX user_nicename\
    ON wp_users (user_nicename);"
      );
      connection.query("CREATE INDEX user_email\
    ON wp_users (user_email);");

      connection.query(
        "INSERT INTO wp_users (user_login,user_pass,user_nicename,user_email,user_registered,user_status,display_name)\
      VALUES ('kevmin','testpass','kevmin','kevaughn.cadette@brace.co.uk',CURRENT_TIMESTAMP,0,'kevmin');"
      );

      connection.query("SET SESSION sql_mode = 'IGNORE_SPACE,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER';");


      connection.release();
    });
  };

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Result: " + result);
//   });
// });