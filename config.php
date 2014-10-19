<?php
	namespace VisualIDE;
	require_once $_SERVER['DOCUMENT_ROOT'].'/libs/DB.php';
	require_once $_SERVER['DOCUMENT_ROOT'].'/libs/Slim.php';
	
	class Config {
		const ERROR = -1;
		const GET_SLIM = 0;
		const SET_SLIM_ROUTES = 1;
		const GET_SLIM_VIEW = 2;
		const GET_NOTORM = 3;
		
		const SLIM_APP_MODE = 'DEV';
		const SLIM_COOKIES_DOMAIN = 'cs3213.joeir.net';
		const SLIM_COOKIES_SECRET = 'dfb7a5da5b547d2ae057d4fb696e0873fcb5219f';
		const SLIM_DEBUG_MODE = TRUE;
		const SLIM_TEMPLATES_PATH = './';
		
		/**
		 * Gets configuration sets. Returns the configuration if
		 * successful, Config::ERROR otherwise.
		 * 
		 * $config.value	args()		get().return
		 * GET_SLIM			-			Slim configuration array
		 * GET_NOTORM		-			NotORM configuration array
		 * GET_SLIM_VIEW	\Slim\Slim	Slim Views configuration array
		 * 								(args() are optional, if args()
		 * 								are present, $retval['apps'] will be
		 * 								available.)
		 * @return mixed
		 */
		public static function get($config) {
			switch($config) {
				case static::GET_SLIM:
					return static::$slimConfiguration;
				case static::GET_NOTORM:
					return static::$notORMConfiguration;
				default:
					return static::ERROR;
			}
		}
		
		/**
		 * Sets configurations. Returns a positive integer corresponding
		 * to $config if function successful, Config::ERROR otherwise.
		 * 
		 * $config.value	set().arguments
		 * SET_SLIM_ROUTES	\Slim\Slim instance
		 * 
		 * @return integer
		 */
		public static function set($config) {
			switch($config) {
				case Config::SET_SLIM_ROUTES:
					if(func_num_args() == 2) {
						return static::setSlimRoutes(func_get_arg(1));
					} else {
						return Config::ERROR;
					}
				default:
					return Config::ERROR;
			}
		}
		
		/**
		 * Routes configuration
		 */
		private static function setSlimRoutes(\Slim\Slim $app) {
			/**
			 * Publicly accessible area
			 */
			$app->get('/', function() use ($app) {
				DB::get();
				$app->render('app.php');
			})->name('ACCESS_PUBLIC');
			
			/**
			 * Google Login page
			 */
			$app->get('/google/login', function() use ($app) {
				$app->redirect('/google/login/');
			})->name('ACCESS_GOOGLE_LOGIN_REDIRECT');
			$app->get('/google/login/', function() use ($app) {
				$app->render('libs/GoogleLogin/index.php');
			})->name('ACCESS_GOOGLE_LOGIN');
			
			/**
			 * Google Logout page
			 */
			$app->get('/logout', function() use ($app) {
				$app->redirect('/logout/');
			})->name('ACCESS_GOOGLE_LOGIN_REDIRECT');
			$app->get('/logout/', function() use ($app) {
				$app->render('/libs/GoogleLogin/logout.php');
			})->name('ACCESS_GOOGLE_LOGIN');
			
			/**
			 * API Endpoints
			 */
			$app->get('/api/save', function() use ($app) {
				require_once $_SERVER['DOCUMENT_ROOT'].'/libs/DB.php';
				$app->render('/api/save.php');
			})->name('ACCESS_SAVE_DATA');
			$app->get('/api/load', function() use ($app) {
				require_once $_SERVER['DOCUMENT_ROOT'].'/libs/DB.php';
				$app->render('/api/load.php');
			})->name('ACCESS_LOAD_DATA');
			$app->get('/api/get', function() use ($app) {
				require_once $_SERVER['DOCUMENT_ROOT'].'/libs/DB.php';
				$app->render('/api/get.php');
			})->name('ACCESS_GET_DATA');
			return Config::SET_SLIM_ROUTES;
		}
		
		/**
		 * Database configuration
		 */
		private static $notORMConfiguration = array(
			'engine' => 'mysql',
			'schema' => 'cs3213_schema',
			'host' => '127.0.0.1',
			'user' => 'cs3213_user',
			'password' => 'cs3213!!'
		);
		
		/**
		 * App configuration
		 */
		private static $slimConfiguration = array(
			/**
			 * The mcrypt cipher used for HTTP cookie encryption. See
			 * available ciphers at this link:
			 * http://php.net/manual/en/mcrypt.ciphers.php
			 */
			'cookies.cipher' => MCRYPT_RIJNDAEL_256,
			/**
			 * The mcrypt cipher mode used for HTTP cookie encryption.
			 * See available cipher modes at this link:
			 * http://php.net/manual/en/mcrypt.constants.php
			 */
			'cookies.cipher_mode' => MCRYPT_MODE_CBC,
			/**
			 * Determines the default HTTP cookie domain if none specified
			 * when invoking the Slim application’s setCookie() or
			 * setEncryptedCookie() methods.
			 */
			'cookies.domain' => Config::SLIM_COOKIES_DOMAIN,
			/**
			 * Determines if the Slim app should encrypt its HTTP cookies.
			 */
			'cookies.encrypt' => TRUE,
			/**
			 * Determines whether cookies should be accessible through
			 * client side scripts (false = accessible). You may override
			 * this setting when invoking the Slim application’s setCookie()
			 * or setEncryptedCookie() methods.
			 */
			'cookies.httponly' => TRUE,
			/**
			 * Determines the lifetime of HTTP cookies created by the Slim
			 * application. If this is an integer, it must be a valid UNIX
			 * timestamp at which the cookie expires. If this is a string,
			 * it is parsed by the strtotime() function to extrapolate a valid
			 * UNIX timestamp at which the cookie expires.
			 */
			'cookies.lifetime' => '20 minutes',
			/**
			 * Determines the default HTTP cookie path if none is specified when
			 * invoking the Slim application’s setCookie() or setEncryptedCookie()
			 * methods.
			 */
			'cookies.path' => '/',
			/**
			 * The secret key used for cookie encryption. You should change this
			 * setting if you use encrypted HTTP cookies in your Slim application.
			 */
			'cookies.secret_key' => Config::SLIM_COOKIES_SECRET,
			/**
			 * Determines whether or not cookies are delivered only via HTTPS.
			 * You may override this setting when invoking the Slim application’s
			 * setCookie() or setEncryptedCookie() methods.
			 */
			'cookies.secure' => TRUE,
			/**
			 * If debugging is enabled, Slim will use its built-in error handler to
			 * display diagnostic information for uncaught Exceptions. If debugging
			 * is disabled, Slim will instead invoke your custom error handler, passing
			 * it the otherwise uncaught Exception as its first and only argument.
			 */
			'debug' => Config::SLIM_DEBUG_MODE,
			/**
			 * By default, Slim returns an HTTP/1.1 response to the client. Use this
			 * setting if you need to return an HTTP/1.0 response. This is useful if
			 * you use PHPFog or an nginx server configuration where you communicate
			 * with backend proxies rather than directly with the HTTP client.
			 */
			'http.version' => '1.1',
			/**
			 * This enables or disables Slim’s logger. To change this setting after
			 * instantiation you need to access Slim’s logger directly and use its
			 * setEnabled() method.
			 */
			'log.enabled' => Config::SLIM_DEBUG_MODE,
			/**
			 * Slim has these log levels:
			 * \Slim\Log::EMERGENCY
			 * \Slim\Log::ALERT
			 * \Slim\Log::CRITICAL
			 * \Slim\Log::ERROR
			 * \Slim\Log::WARN
			 * \Slim\Log::NOTICE
			 * \Slim\Log::INFO
			 * \Slim\Log::DEBUG
			 * The log.level application setting determines which logged messages will
			 * be honored and which will be ignored. For example, if the log.level
			 * setting is \Slim\Log::INFO, debug messages will be ignored while info,
			 * warn, error, and fatal messages will be logged.
			 */
			'log.level' => \Slim\Log::DEBUG,
			/**
			 * This is an identifier for the application’s current mode of operation.
			 * The mode does not affect a Slim application’s internal functionality.
			 * Instead, the mode is only for you to optionally invoke your own code
			 * for a given mode with the configMode() application method.
			 * // Only invoked if mode is "rel"
			 * $app->configureMode('rel', function () use ($app) {
			 * 		$app->config(array(
			 * 			'log.enable' => true,
			 * 			'debug' => false
			 * 		));
			 * });
			 * // Only invoked if mode is "dev"
			 * $app->configureMode('dev', function () use ($app) {
			 * 		$app->config(array(
			 * 			'log.enable' => false,
			 * 			'debug' => true
			 * 		));
			 * });
			 */
			'mode' => Config::SLIM_APP_MODE,
			/**
			 * The relative or absolute path to the filesystem directory that contains
			 * your Slim application’s template files. This path is referenced by the
			 * Slim application’s View to fetch and render templates.
			 */
			'templates.path' => Config::SLIM_TEMPLATES_PATH,
		);
	}
?>