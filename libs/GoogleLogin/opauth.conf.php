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
	'path' => '/google/login/',

/**
 * Callback URL: redirected to after authentication, successful or otherwise
 */
	'callback_url' => 'http://'.$_SERVER['SERVER_NAME'].(($_SERVER['SERVER_PORT']!=80)?(':'.$_SERVER['SERVER_PORT']):'').'/google/login/',
	'callback_transport' => 'POST',
/**
 * A random string used for signing of $auth response.
 * 
 * NOTE: PLEASE CHANGE THIS INTO SOME OTHER RANDOM STRING
 */
	'security_salt' => 'oAJD8e9whcOU933ojsdhf8fwuehHEFhsd8dfg9732ih11JFjiU3uhiuEW223hu34i289S',
	'security_iteration' => 300,
	'host' => 'http://'.$_SERVER['SERVER_NAME'],
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