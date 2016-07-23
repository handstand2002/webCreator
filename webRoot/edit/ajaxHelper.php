<?php 
include_once __DIR__."/../includes/class.groupController.php";

class ajaxHelper
{
	Function runAction($action, $parameters)
	{
		$result = "";
		Switch ($action) {
			case "getPages":
				$result = array("hello", "another");
				break;
			case "getGroups":
				$groupController = new groupController;
				$result = $groupController->getGroups($parameters->parentid);
				break;
			case "addGroup":
				$groupController = new groupController;
				$groupController->addGroup( $parameters->name );
				break;
				
			
		}// End Switch
		
		return $result;
	}
	
} // End of ajaxHelper class

$helper = new ajaxHelper();

$actionQueue = json_decode($_POST["d"]);

foreach($actionQueue as $actionKey=>$action)
{
	$response = $helper->runAction($action->action, $action->parameters);
	$actionQueue[$actionKey]->response = $response;
}

echo json_encode($actionQueue);
?>