<?php 
/* file: dbConnection.php
 * 
 * Brief: class file for the connection to the DB
 * 			contains the functions for connecting to, and querying the DB.
 */


class dbConnection
{
	
	/********************* Variable Declarations *******************/
	private $link;
	
	private $serverName = 'localhost';
	private $connectionInfo = array(
			'Database' => 'webCreator',
			'UID' => 'sa',
			'PWD' => 'retn0m$',
	);
	
	/****************** End Variable Declarations *******************/
	
	
	/********************** Private Functions ************************/
	/* db_connection
	 * 
	 * Brief: constructor: creates the $link resource in order to query the DB.
	 */
	function dbConnection($databaseName = null)
	{
		if (!empty($databaseName))
			$this->connectionInfo['Database'] = $databaseName;
		
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
		$link = sqlsrv_connect($this->serverName, $this->connectionInfo);
		
		if (!empty($_GET["manual"]) && $_GET["manual"] == true)
			echo "Connected to database: ".$this->connectionInfo['Database']."<br />";
		
		return $link;
	}
	
	/* private queryDB
	 * 
	 * Brief: queries the DB and returns resource ID
	 * 
	 * Input: $query - query text
	 * 			$args - arguments to replace ? in the query
	 * 
	 * Output: none
	 * 
	 * return: resource ID in order to retrieve information
	 */
	private function getResource($query, $args)
	{
		if (!empty($args))
			$result = sqlsrv_query($this->link, $query, $args);
		else
			$result = sqlsrv_query($this->link, $query);
		
		if (!empty($_GET["manual"]))
		{
			$errors = sqlsrv_errors();
			if (!empty($errors))
				echo "<b>Errors</b><pre>".print_r($errors, true)."</pre>";
		}
		
		return $result;
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
		if (!empty($_GET["manual"]))
		{
			$manualQuery = $query;
// 			echo "Manual Query: $manualQuery<br />";
			if (!empty($args))
			{
				foreach($args as $arg)
					$manualQuery = preg_replace('/\?/', "'".$arg."'", $manualQuery, 1);
				
			}
			echo "<b style='color:green'>Manual Query on DB: '".$this->connectionInfo['Database']."'</b>: $manualQuery<br />";
		}
		
		if (empty($args))
			$args = array();
		
		// Fetch the resource
		$result = $this->getResource($query, $args);
		
		if (!empty($result))
		{
			$row = sqlsrv_fetch_array($result, 2);
			if (!empty($_GET["manual"]))
			{
				if (!empty($row))
				{
					echo "First Row: <table style='border: 1px solid black;'>";
					echo "<tr>";
					foreach($row as $key => $data)
						echo "<th style='border-bottom: 1px solid black;'>" . $key . "</th>";
					echo "</tr>";
					echo "<tr>";
					foreach($row as $key => $data)
						echo "<td>" . print_r($data, true) . "</td>";
					echo "</tr>";
					echo "</table>";
				}
				else
					echo "Empty Return<br />";
			}
		}
		
		$resultArray = array();
		$i = 0;
		while (!empty($row))
		{
			$resultArray[] = $row;
			
			$row = sqlsrv_fetch_array($result, 2);
		}
		
		return $resultArray;
	}
	
	
} /// End Class
?>