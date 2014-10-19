<?php
	namespace VisualIDE;
	date_default_timezone_set('Asia/Singapore');
	require_once 'opauth.conf.php';
	require_once $_SERVER['DOCUMENT_ROOT'].'/libs/DB.php';
	/**
	 * Instantiate Opauth with the loaded config
	 */
	require_once $_SERVER['DOCUMENT_ROOT'].'/libs/Opauth/Opauth.php';
	require_once $_SERVER['DOCUMENT_ROOT'].'/libs/Opauth/OpauthStrategy.php';
	require_once $_SERVER['DOCUMENT_ROOT'].'/libs/Opauth/Strategy/Google/GoogleStrategy.php';
	$Opauth = new \GoogleStrategy( $config['Strategy']['Google'] , $config);
	if(isset($_SESSION['opauth'])) {
		//var_dump($_SESSION['opauth']);
		//header('Location: /', 301);
		//var_dump($_SESSION['opauth']);
		$auth = $_SESSION['opauth']['auth'];
		$results = DB::get()->google_user->where('id',$auth['uid'])->fetch();
		if($results === FALSE) {
			// user does not exist
			// add user
			$results = DB::get()->google_user->insert(
				array(
					'id'=>$auth['uid'],
					'name'=>$auth['info']['name'],
					'email'=>$auth['info']['email'],
					'image_url'=>$auth['info']['image']
				)
			);
		}
		$_SESSION['opauth'] = iterator_to_array($results);
		header('Location: /', 301);
		exit;
	} elseif(isset($_GET['code'])) {
		$Opauth->oauth2callback();
	} else {
		$Opauth->request();
	}
?>