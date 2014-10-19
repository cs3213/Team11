<?php
	namespace VisualIDE;
	$data = json_decode(file_get_contents('php://input'));
	if(!isset($_SESSION['opauth']['id'])) {
		echo 'User needs to be logged in';
		exit;
	} elseif(!isset($data->content) || !isset($data->name)) {
		echo 'No data detected';
		exit;
	}
	
	
?>