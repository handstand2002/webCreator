<?php 
class ajaxHelper
{
	Function runAction($action, $parameters)
	{
		$result = "";
		Switch ($action) {
			case "getPages":
				$result = "hello";
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