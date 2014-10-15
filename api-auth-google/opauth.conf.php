<?php
/**
 * Opauth basic configuration file to quickly get you started
 * ==========================================================
 * To use: rename to opauth.conf.php and tweak as you like
 * If you require advanced configuration options, refer to opauth.conf.php.advanced
 */

$config = array(
/**
 * Path where Opauth is accessed.
 *  - Begins and ends with /
 *  - eg. if Opauth is reached via http://example.org/auth/, path is '/auth/'
 *  - if Opauth is reached via http://auth.example.org/, path is '/'
 */
	'path' => '/api-auth-google/',

/**
 * Callback URL: redirected to after authentication, successful or otherwise
 */
	'callback_url' => 'http://localhost:3213/api-auth-google/token.php',
	'callback_transport' => '',
/**
 * A random string used for signing of $auth response.
 * 
 * NOTE: PLEASE CHANGE THIS INTO SOME OTHER RANDOM STRING
 */
	'security_salt' => 'oAJD8e9whcOUHEFojsdhf8fwuehHEFhsd8dfg9732ihDSJFjiU3uhiuEWFu3hu34i289S',
	'host' => 'localhost',
/**
 * Strategy
 * Refer to individual strategy's documentation on configuration requirements.
 * 
 * eg.
 * 'Strategy' => array(
 * 
 *   'Facebook' => array(
 *      'app_id' => 'APP ID',
 *      'app_secret' => 'APP_SECRET'
 *    ),
 * 
 * )
 *
 */
	'Strategy' => array(
		// Define strategies and their respective configs here
		'Google' => array(
			'client_id' => '440134525270-nmnf3g5ld0ghcp78ht9vsp8msudgbov8.apps.googleusercontent.com',
			'client_secret' => 'v_69MPQXEVxGCCV2ftmVkReX',
			'strategy_url_name' => 'Google',
			'strategy_name' => 'Google',
		)
	)
);