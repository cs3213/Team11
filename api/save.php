<?php
	/**
	 * REQUIREMENTS
	 * 	User is logged in
	 * 
	 * INPUT
	 * 	The input consists of two fields, 'name' such
	 * 	that the structure looks like:
	 * 	{
	 * 		name:		<name of the program>
	 * 		content: 	<serialized content of program>
	 * 	}
	 * 
	 * OUTPUT
	 * 	a code corresponding to the following:
	 * 	-2: program name already exists
	 * 	-1: generic error code (something went wrong but dunno what)
	 * 	1:	program has been updated (do not add it to front-end model because it already exists there)
	 * 	2:	program has been created (add it to front-end model)
	 * 
	 * DESCRIPTION
	 * 	Saves the program with the specified name in INPUT with the specified content
	 */

	namespace VisualIDE;
	
	// return values
	// success codes > 0
	// error codes < 0
	define('ALREADY_EXISTS', -2);
	define('ERROR', -1);
	define('UPDATED', 1);
	define('CREATED', 2);
	// script
	
	/**
	 * 	Code
	 */
	$data = json_decode(file_get_contents('php://input'));
	if(!isset($_SESSION['opauth']['id'])) {
		echo 'User needs to be logged in';
		exit;
	} elseif(!isset($data->content) || !isset($data->name)) {
		echo 'No data detected';
		exit;
	}
	// try to find the entry with name
	$result = DB::get()->saved_programs->where(array(
		'google_user_id' => $_SESSION['opauth']['id'],
		'program_name' => $data->name
	));
	if($result->fetch() !== FALSE) {
		// if have, update
		$updateResult = $result->update(array('saved_data' => $data->content));
		if($updateResult >= 0) {
			echo json_encode(UPDATED);
			exit;
		}
	} else {
		// if not, do an insert
		$result = DB::get()->saved_programs->insert(array(
			'google_user_id'=>$_SESSION['opauth']['id'],
			'program_name'=>$data->name,
			'saved_data'=>$data->content
		));
		if(isset($result['google_user_id']) && ($result['google_user_id'] == $_SESSION['opauth']['id'])) {
			echo json_encode(CREATED);
			exit;
		}
	}
	echo json_encode(ERROR);
	/**
	 * 	EOF
	 */
?>