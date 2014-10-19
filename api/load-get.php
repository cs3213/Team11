<?php
	/**
	 * REQUIREMENTS
	 * 	User is logged in
	 * 
	 * INPUT
	 * 	The input consists of a single field, 'name' such
	 * 	that the structure looks like:
	 * 	{
	 * 		name:	<name of the program>
	 * 	}
	 * 
	 * OUTPUT
	 * 	FAILURE
	 * 	returns an error code NOT_FOUND (see below)
	 * 
	 * 	SUCCESS
	 * 	the row inside the table 'saved_programs' with the
	 * 	program name as specified in INPUT and with the column 'google_user_id'
	 * 	set to the current user's.
	 * 	each item is of the following structure:
	 * 	{
	 * 		program_name:	<name of the program>
	 * 		saved_data:		<text version of the program to load>
	 * 		lmodified:		<datetime signature of last modification>
	 * 	}
	 * 
	 * DESCRIPTION
	 * 	Retrieves the program with the specified name in INPUT
	 * 
	 * TEST
	 * 	Try /api/load-get?name=TestProgram
	 */

	namespace VisualIDE;
	
	// error codes
	define('NOT_FOUND', -1);
	
	/**
	 * 	Code
	 */
	$data = json_encode($_GET);
	$data = json_decode($data);
	if(!isset($_SESSION['opauth']['id'])) {
		echo 'User needs to be logged in';
		exit;
	} elseif(!isset($data->name)) {
		echo 'No data detected';
		exit;
	}
	$result = DB::get()->saved_programs->
		select('program_name','saved_data','lmodified')->
		where(array(
		'google_user_id' => $_SESSION['opauth']['id'],
		'program_name' => $data->name	
	))->fetch();
	if($result === FALSE) {
		echo json_encode(NOT_FOUND);
		exit;
	}
	echo json_encode(iterator_to_array($result));
	/**
	 * 	EOF
	 */
?>