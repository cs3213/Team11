<?php
	namespace VisualIDE;
	if(!isset($_SESSION['opauth']['id'])) {
		echo 'User needs to be logged in';
		exit;
	}
	$results = DB::get()->saved_programs->where('google_user_id',$_SESSION['opauth']['id']);
	$returnValue = array();
	while($result = $results->fetch()) {
		array_push($returnValue, $result);
	}
	if(count($returnValue) == 0) {
		echo json_encode('');
		exit;
	}
	echo json_encode(iterator_to_array($returnValue));
?>