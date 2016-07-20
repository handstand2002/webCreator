<?php 
/* file: dbConnection.php
 * 
 * Brief: class file for the connection to the DB
 * 			contains the functions for connecting to, and querying the DB.
 */
include_once __DIR__."/class.mysqliExt.php";

class dbConnection
{
	
	/********************* Variable Declarations *******************/
	private $link;
	
	private $dbServername = "localhost";
	private $dbUsername = "root";
	private $dbPassword = "retn0m$";
	private $dbName = "webCreator";
	
	/****************** End Variable Declarations *******************/
	
	
	/********************** Private Functions ************************/
	/* db_connection
	 * 
	 * Brief: constructor: creates the $link resource in order to query the DB.
	 */
	function __construct()
	{
		$this->link = $this->connectDB();
	}
	
	/* private connectDB
	 * 
	 * Brief: connects to DB and returns resource ID for the link
	 * 
	 * Input: none
	 * 
	 * output: none
	 * 
	 * return: resource ID for doing queries
	 */
	private function connectDB()
	{
		$link = new db($this->dbServername, $this->dbUsername, $this->dbPassword, $this->dbName);
		
		if (!empty($_GET["manual"]) && $_GET["manual"] == true)
			echo "Connected to database: ".$this->dbName."<br />";
		
		return $link;
	}
	
	/******************** End Private Functions *********************/
	
	/******************** Start Public Functions ********************/
	
	/* public getQueryResults
	 * 
	 * Brief: retrieves the query specified and puts into an array
	 * 			with all the items in the array
	 * 
	 * Input:	$query - text for the query. arguments to be replaced with ?
	 * 						e.g. select * from items where id=?;
	 * 			$args - array of arguments to replace ? in query statement
	 * 
	 * Output: none
	 * 
	 * Return: array of results
	 */
	public function queryDB($query, $args = null)
	{
		// Change the formatting from MSSQL to MySql
		$pattern = '@top [0-9]+@i';
		$matches = array();
		preg_match($pattern, $query, $matches);
		
		if (!empty($matches))
		{
			$query = str_replace($matches[0], "", $query);	// kill the 'top x' part of the query
			$pattern = '@[0-9]+@i';
			$numMatches = array();
			preg_match($pattern, $matches[0], $numMatches);	// find the number part
			$query .= " limit ".$numMatches[0];				// add back in 'limit x' at the end of the statement
		}

		$debug = false;
		if ($debug) echo "Query: $query<br />\n";
		
		$output = array();
		if ($this->link != null)
		{

			$stmt = $this->link->prepare($query);
			
			$typeList = "";
			if (!empty($args))
			{
				foreach($args as $argKey=>$argVal)
				{
					$type = 'b';	// blob
					if (gettype($argVal) == "boolean" || gettype($argVal) == "integer")
						$type = 'i';
					else if (gettype($argVal) == "double")
						$type = 'd';
					else if (gettype($argVal) == "string")
						$type = 's';
					$stmt->mbind_param($type, $args[$argKey]);
// 					echo "Bound arg: '$argVal' with type '$type'<br />\n";
					$typeList .= $type;
				}
			}
// 			if ($debug) echo "Values: <pre>".print_r($args, true)."</pre>\n";
			if ($debug) echo "Values: <pre>".var_export($args, true)."</pre>\n";
			if ($debug) echo "Types: $typeList<br />\n";
			$stmt->execute();
			
			$result = $stmt->get_result();
			if ($debug) echo "STMT obj<pre>".print_r($stmt, true)."</pre>";
			while (!empty($result) && $row = $result->fetch_array(MYSQLI_ASSOC))
			{
				$output[] = $row;
			}
			
		}
		return $output;
	}
	
	public function getDBNames()
	{
		$query = "select name from master..sysdatabases";
		$result = $this->queryDB($query);
		return $result;
	}
	
	
} /// End Class
?>