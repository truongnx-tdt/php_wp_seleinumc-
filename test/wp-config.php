<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** Database username */
define( 'DB_USER', 'wordpress' );

/** Database password */
define( 'DB_PASSWORD', '123456' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'QmUKc^k126N+JRJKX$Yd4AZLx{eU}UF?ka50B^irM<` .9T0(x9B;JV^p?tc;!W^' );
define( 'SECURE_AUTH_KEY',  'IyK]tiR~%?~SSC9t*ZcgJY1dF|sKQy[ftQKv0pRY8.l}On2w@jMJr}TjKC4K52i!' );
define( 'LOGGED_IN_KEY',    ']dQ~P?O&V5 dsIsnH1v2#)f9-p*Ko:m@79~Quxn:EOwNp[on,Pw[<o=xAK@;=PZ%' );
define( 'NONCE_KEY',        '.R#/)w4~6#,Gpy=B84y>s9!>7k-1PSR@}M&K]nty@/7H7L~vlDD|R_y$JaB;Bi-Q' );
define( 'AUTH_SALT',        '(7aF3Fn!&e 24Ox&^bO}k#ea3cV(~hYbKyfEMQ_5b;X$wBqE?e?RO8xrs*[5dAkx' );
define( 'SECURE_AUTH_SALT', 'hs6X+7dDXHS*YG<yg3;0[W-[qT$1s{YAKIzxMt$o!`lm(ou+0R;,8eK{Iv`Z^nrB' );
define( 'LOGGED_IN_SALT',   'O-rfVU7g!of]UD~a{Ugt(rU5Zh?pe(y+|Y6Rs:X>%#>r?[yI*CO<H!MZ3vdJb</i' );
define( 'NONCE_SALT',       '|OM~fr#jA~i<Fcnd@WWa0+Z(tZyS+P{noJG%EN7xzVUz*c{O|-UsGMWCe-BsEt/B' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'tp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
