function groupControl()
{
	this.layers = [];
	
}

groupControl.prototype.fetchChildren = function(parentid)
{
	if (parentid == 0)
		parentid = null;
	
	// if we're overwriting a layer, remove it from the layers array
	if (parentid == null)
		this.layers.splice(0, 1);
	else
		this.layers.splice(parentid, 1);
	
	var request = {};
	request.action = "getGroups";
	request.parameters = {};
	request.parameters.parentid = parentid;
	request.callback = "groupController.setGroupsList(fullRequest)";
	
	addAjaxRequest(request);
	sendAjaxRequest(true);
}

groupControl.prototype.setGroupsList = function(fullRequest)
{
	var result = fullRequest["response"];
	console.log(result);
	
	this.layers.push(result);
	
	pageController.removeLayersHigherThan(this.layers.length);
	pageController.createLayerDiv(this.layers.length)
	pageController.fillLayerDiv(fullRequest, this.layers.length);
	
}


groupControl.prototype.addGroupForLayer = function(button)
{
	console.log("layerProperties Found on the 'Add' Button");
	console.log(button.containerLayerDiv.layerProperties);
	var parentid = button.containerLayerDiv.layerProperties.parentId;
	
	if (parentid == 0)
		parentid = null;
	
	// if we're overwriting a layer, remove it from the layers array
	this.layers.splice( (button.containerLayerDiv.layerProperties.layerNum-1), 1);
	
	var request = {};
	request.action = "addGroup";
	request.parameters = {};
	request.parameters.name = button.inputField.value;
	request.parameters.parentid = button.containerLayerDiv.layerProperties.parentId;
	request.callback = "";
	
	addAjaxRequest(request);
	
	request = {};
	request.action = "getGroups";
	request.parameters = {};
	request.parameters.parentid = parentid;
	request.callback = "groupController.setGroupsList(fullRequest)";
	
	addAjaxRequest(request);
	
	sendAjaxRequest(true);
}

groupControl.prototype.selectGroup = function(groupBtn)
{
	console.log(groupBtn.groupProperties);
	
	// Remove all the layers higher than the one clicked on
	pageController.removeLayersHigherThan(groupBtn.groupProperties.layerNum);
	
	// fetch children of button clicked, and populate new layer
	this.fetchChildren(groupBtn.groupProperties.id);
}