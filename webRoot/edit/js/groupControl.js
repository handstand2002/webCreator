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
	request.callback = "groupController.setGroupsList(result)";
	
	addAjaxRequest(request);
	sendAjaxRequest(true);
}

groupControl.prototype.setGroupsList = function(result)
{
	this.layers.push(result);
	
	pageController.createLayerDiv(this.layers.length)
	pageController.fillLayerDiv(result, this.layers.length);
	
//	this.createLayerDiv()
}


groupControl.prototype.addGroupForLayer = function(button)
{
	console.log(button.inputField.value);
}

groupControl.prototype.selectGroup = function(groupBtn)
{
	console.log(groupBtn.groupProperties);
	
	// Remove all the layers higher than the one clicked on
	pageController.removeLayersHigherThan(groupBtn.groupProperties.layerNum);
	
	// fetch children of button clicked, and populate new layer
	this.fetchChildren(groupBtn.groupProperties.id);
}