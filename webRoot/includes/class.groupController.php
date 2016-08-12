<?php 
include_once __DIR__."/class.dbConnection.php";
class groupController {
	
	private $numResults;
	
	function __construct()
	{
// 		var_dump($_ENV["dbConnection"]);
		$this->numResults = 0;
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
		$link = $_ENV["dbConnection"];
		if ($parentid == 0)
			$parentid = null;
		
		/* SEE IF THERE IS AN EXISTING GROUP WITH THAT NAME, UNDER THE SAME PARENT */
		$query = "select id from classGroup where title=? and ";
		$values = array($title);
		if ($parentid == null)
			$query .= "parentid is null";
		else
		{
			$query .= "parentid=?";
			$values[] = $parentid;
		}
		
		$res = $link->queryDB($query, $values);
		
		/* IF THERE IS EXISTING GROUP UNDER SAME PARENT, RETURN FALSE */
		if (!empty($res))
			return false;
		
		/* INSERT GROUP INTO TABLE */
		$query = "insert into classGroup (parentid, ispage, title) values (?, ?, ?)";
		$values = array($parentid, false, $title);
		
		$link->queryDB($query, $values);
		
		/* GET THE ID OF THE GROUP JUST INSERTED */
		$query = "select id from classGroup where title=? and ";
		$values = array($title);
		if ($parentid == null)
			$query .= "parentid is null";
		else
		{
			$query .= "parentid=?";
			$values[] = $parentid;
		}
		
		$res = $link->queryDB($query, $values);
		
		return $res[0]["id"];
	}
	
	Function getGroups($parentid = null)
	{
		if ($this->numResults > 100)	// no more than 100 recursions...
			return;
		
		$this->numResults++;
		
		if ($parentid == null)
			$parentid = 0;
		$link = $_ENV["dbConnection"];
		
		$values = array();
		$query = "select id, parentid, ispage, title from classGroup where ";
		
		if ($parentid == 0)
		{
			$query .= "parentid is null";
		}
		else
		{
			$query .= "parentid=?";
			$values[] = $parentid;
		}
		
		$result = $link->queryDB($query, $values);
		
		foreach($result as $key=>$children)
		{
			$result[$key]["children"] = $this->getGroups($children["id"]);
		}
		
		
		return $result;
	}
	
	Function getGroupParents($layerID)
	{
		$link = $_ENV["dbConnection"];
		
		$values = array();
		$query = "select id, parentid from classGroup where id=?";
		$values = array($layerID);
		
		$result = $link->queryDB($query, $values);
		
		if (!empty($result[0]) && $result[0]["parentid"] != null)
			$result[0]["parent"] = $this->getGroupParents($result[0]["parentid"]);
		
		if (empty($result[0]["parentid"]))
			$result[0]["parentid"] = 0;
		
		return $result[0];
	}
	
	
} // End of groupController class
?>