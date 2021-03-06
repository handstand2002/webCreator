<?php 
class functionController{
	
	function getGroupFunctions($groupID)
	{
		$link = $_ENV["dbConnection"];
		
		$query = "SELECT 
					functionInGroup.groupid, 
					functionInGroup.functionid,
					classFunction.text
				FROM 
					functionInGroup
				INNER JOIN classFunction
					ON classFunction.groupid = functionInGroup.groupid
				WHERE
					functionInGroup.groupid=?";
		$values = array($groupID);
		
		$res = $link->queryDB($query, $values);
		
		return $res;
	}
}
?>