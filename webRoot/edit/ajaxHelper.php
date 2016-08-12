<?php 

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once __DIR__."/../includes/class.groupController.php";
include_once __DIR__."/../includes/class.areaController.php";

class ajaxHelper
{
	Function runAction($action, $parameters)
	{
		$result = "";
		
		$functions = get_class_methods(__CLASS__);
		
		if (in_array($action, $functions) && $action != __FUNCTION__)
		{
			eval("\$result = \$this->$action(\$parameters);");
		}
		
		
		return $result;
	}
	
	/********************* START OF ACTION FUNCTIONS *********************/
/******** GROUP FUNCTIONS ********/
	private function getGroupParents($parameters)
	{
		$groupController = new groupController;
		$result = array();
		$recursedPath = $groupController->getGroupParents($parameters->layerID);
		while (!empty($recursedPath))
		{
			if (!empty($recursedPath["id"]))
					$result[] = $recursedPath["id"];
			if (!empty($recursedPath["parent"]))
					$recursedPath = $recursedPath["parent"];
			else
			{
				$result[] = 0;
				$recursedPath = null;
			}

		}
		return array_reverse($result);
	}
	
	private function getGroups($parameters = null)
	{
		$groupController = new groupController;
		return $groupController->getGroups();
	}
	
	private function addGroup($parameters)
	{
		$groupController = new groupController;
		$groupController->addGroup( $parameters->name, $parameters->parentid );
	}

/******** AREA FUNCTIONS ********/
	private function getAreas($parameters = null)
	{
		$areaController = new areaController;
		return $areaController->getAreas();
	}
	
	private function addArea($parameters)
	{
		$areaController = new areaController;
		$areaController->addArea($parameters->name);
	}
	
	private function getAreaGroups($parameters)
	{
		$areaController = new areaController;
		return $areaController->getAreaGroups($parameters->area);
	}
	
	
} // End of ajaxHelper class

$helper = new ajaxHelper();

$actionQueue = json_decode($_POST["d"]);

foreach($actionQueue as $actionKey=>$action)
{
	$response = $helper->runAction($action->action, $action->parameters);
	$actionQueue[$actionKey]->response = $response;
}

// echo "<pre>".print_r($actionQueue, true)."</pre>";

echo json_encode($actionQueue);
?>