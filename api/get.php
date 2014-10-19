<?php
	/**
	 * REQUIREMENTS
	 * 	User is logged in
	 * 
	 * INPUT
	 * 	None
	 * 
	 * OUTPUT
	 * 	FAILURE
	 * 	returns an error code (see below)
	 * 
	 * 	SUCCESS
	 * 	array of saved_programs such that
	 * 	each item is of the following structure:
	 * 	{
	 * 		program_name:	<name of the program>
	 * 		lmodified:		<datetime signature of last modification>
	 * 	}
	 * 
	 * DESCRIPTION
	 * 	Retrieves all programs of the logged in user.
	 */
	namespace VisualIDE;
	
	// return values
	define('NO_PROGRAMS_AT_ALL', -1);
	
	
	/**
	 * 	Code
	 */
	if(!isset($_SESSION['opauth']['id'])) {
		echo 'User needs to be logged in';
		exit;
	}
	$results = DB::get()->saved_programs->select('program_name,lmodified')->where('google_user_id',$_SESSION['opauth']['id']);
	$returnValue = array();
	while($result = $results->fetch()) {
		array_push($returnValue, $result);
	}
	if(count($returnValue) == 0) {
		echo json_encode(NO_PROGRAMS_AT_ALL);
		exit;
	}
	echo json_encode(iterator_to_array($returnValue));
	/**
	 * 	EOF
	 */
?>