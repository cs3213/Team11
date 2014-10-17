<?php
date_default_timezone_set('Asia/Singapore');
require_once 'opauth.conf.php';

/**
 * Instantiate Opauth with the loaded config
 */
require_once $_SERVER['DOCUMENT_ROOT'].'/libs/Opauth/Opauth.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/libs/Opauth/OpauthStrategy.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/libs/Opauth/Strategy/Google/GoogleStrategy.php';
$Opauth = new GoogleStrategy( $config['Strategy']['Google'] , $config);
var_dump($_SESSION);
exit;
if(isset($_SESSION['opauth'])) {
	//var_dump($_SESSION['opauth']);
	header('Location: /', 301);
	exit;
} elseif(isset($_GET['code'])) {
	$Opauth->oauth2callback();
} else {
	$Opauth->request();
}
?>