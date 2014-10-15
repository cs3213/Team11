<?php
	namespace VisualIDE;
	require_once $_SERVER['DOCUMENT_ROOT'].'/libs/NotORM.php';
	require_once $_SERVER['DOCUMENT_ROOT'].'/config.php';
	
	class DB {
		private static $db;
		public static function get() {
			if(!isset(static::$db)) { new DB(); }
			return static::$db;
		}
		private function __construct() {
			$dbconfig = Config::get(Config::GET_NOTORM);
			static::$db = new \NotORM(new \PDO($dbconfig['engine'].':dbname='.$dbconfig['schema']
				.';host='.$dbconfig['host'], $dbconfig['user'], $dbconfig['password']));
		}
	}
?>