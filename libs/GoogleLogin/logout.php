<?php
	session_regenerate_id();
	$_SESSION = array();
	session_unset();
	session_destroy();
	header('Location: /',301);
	exit;
?>