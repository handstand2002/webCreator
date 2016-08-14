<?php 
include_once __DIR__."/class.dbConnection.php";

class areaController {
	function addArea($title)
	{
		$link = $_ENV["dbConnection"];
		
		$query = "select areaid from area where title=?";
		$values = array($title);
		$res = $link->queryDB($query, $values);
		
		if (!empty($res))
			return false;
		
		$query = "insert into area (title) values (?)";
		$values = array($title);
		$link->queryDB($query, $values);
		
		$query = "select areaid from area where title=?";
		$values = array($title);
		$res = $link->queryDB($query, $values);
		
		return $res[0]["areaid"];
	}
	
	function getAreas()
	{
		$link = $_ENV["dbConnection"];
		
		$query = "select areaid, title from area";
		$values = array();
		
		$res = $link->queryDB($query, $values);
		
		return $res;
	}
	
	function getAreaGroups($areaid)
	{
		$link = $_ENV["dbConnection"];
		
		$query = "select areaid, groupid from groupInArea where areaid=?";
		$values = array($areaid);
		
		
		$res = $link->queryDB($query, $values);
		
		return $res;
	}
	
	function saveAreaGroups($areaid, $groupArray)
	{
		$link = $_ENV["dbConnection"];
		
		$query = "delete from groupInArea where areaid=?";
		$values = array($areaid);
		$link->queryDB($query, $values);
		
		if (count($groupArray) > 0)
		{
			$query = "insert into groupInArea (areaid, groupid) values ";
			$values = array();
			$first = true;
			foreach($groupArray as $id)
			{
				if (!$first)
					$query .= ", ";
				$query .= "(?, ?)";
				$values[] = $areaid;
				$values[] = $id;
				$first = false;
			}
			
			$link->queryDB($query, $values);
			
		}
	}
	
}
?>

