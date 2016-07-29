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
	
	Function addGroup( $title, $parentid = null)
	{
		if ($parentid == 0)
			$parentid = null;
		
		$link = $_ENV["dbConnection"];
		$query = "insert into classGroup (parentid, ispage, title) values (?, ?, ?)";
		$values = array($parentid, false, $title);
		
		$link->queryDB($query, $values);
	}
	
	Function getGroups($parentid)
	{
		$link = $_ENV["dbConnection"];
		
		$values = array();
		$query = "select id, parentid, ispage, title from classGroup where ";
		if ($parentid == NULL)
			$query .= "parentid IS NULL";
		else
		{
			$query .= "parentid=?";
			$values[] = $parentid;
		}
		
// 		echo "Query: $query<pre>".print_r($values, true)."</pre>";
		$result = $link->queryDB($query, $values);
		
		return $result;
	}
	
} // End of groupController class
?>