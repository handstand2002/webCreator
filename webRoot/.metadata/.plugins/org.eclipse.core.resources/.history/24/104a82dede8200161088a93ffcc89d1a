<?php 
class functionController{
	
	function getGroupFunctions($groupID)
	{
		$link = $_ENV["dbConnection"];
		
		$query = "select groupid, functionid from functionInGroup where groupid=?";
		$values = array($groupID);
		
		$res = $link->queryDB($query, $values);
		
		return $res;
	}
}
?>