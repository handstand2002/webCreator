<?php 
include_once __DIR__."/class.dbConnection.php";
class groupController {
	
	function __construct()
	{
// 		var_dump($_ENV["dbConnection"]);
	}
	
	Function getPages()
	{
		$link = $_ENV["dbConnection"];
		
		$query = "select * from classGroup where ispage=True";
		$values = array();
		$res = $link->queryDB($query, $values);
	}
	
	Function addPage( $title )
	{
		$link = $_ENV["dbConnection"];
		
		// Insert the row
		$query = "insert into classGroup (parentid, ispage, title) values (?, ?, ?)";
		$values = array(-1, true, $title);
		$link->queryDB($query, $values);
	}
	
	Function addGroup( $title )
	{
		$link = $_ENV["dbConnection"];
		$query = "insert into classGroup (parentid, ispage, title) values (?, ?, ?)";
		$values = array(null, false, $title);
		
		$link->queryDB($query, $values);
	}
	
	Function getGroups()
	{
		$link = $_ENV["dbConnection"];
		
		$query = "select parentid, ispage, title from classGroup";
		$values = array();
		
		$result = $link->queryDB($query, $values);
		
		return $result;
	}
	
} // End of groupController class
?>