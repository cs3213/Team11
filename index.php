<?php
	namespace VisualIDE;
	date_default_timezone_set('Asia/Singapore');
	session_start();
	require_once 'libs/Slim.php';
	require_once 'config.php';
	
	\Slim\Slim::registerAutoLoader();
	$visualIDE = new \Slim\Slim(\VisualIDE\Config::get(Config::GET_SLIM));
	$visualIDE->setName('VisualIDE');
	Config::set(Config::SET_SLIM_ROUTES, $visualIDE);
	$visualIDE->run();
?>