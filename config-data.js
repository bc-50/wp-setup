var main = require('./test');
module.exports.replace = [
  'define( \'AUTH_KEY\',         \'put your unique phrase here\' )\;',
  'define( \'SECURE_AUTH_KEY\',  \'put your unique phrase here\' )\;',
  'define( \'LOGGED_IN_KEY\',    \'put your unique phrase here\' )\;',
  'define( \'NONCE_KEY\',        \'put your unique phrase here\' )\;',
  'define( \'AUTH_SALT\',        \'put your unique phrase here\' )\;',
  'define( \'SECURE_AUTH_SALT\', \'put your unique phrase here\' )\;',
  'define( \'LOGGED_IN_SALT\',   \'put your unique phrase here\' )\;',
  'define( \'NONCE_SALT\',       \'put your unique phrase here\' )\;'
];

module.exports.standard = [
  'database_name_here',
  'username_here',
  'password_here',
];

module.exports.rows = [
  main.useURL,
  'root',
  'it_begins',
];