function groupControl()
{
	this.groupTree = [];
	this.idList = {};
}

groupControl.prototype.setupPage = function()
{
	this.fetchGroups();
}

groupControl.prototype.fetchGroups = function()
{	
	var request = {};
	request.action = "getGroups";
	request.parameters = {};
	request.callback = "groupController.setGroupsList(result)";
	
	addAjaxRequest(request);
	sendAjaxRequest(true);
}

groupControl.prototype.setGroupsList = function(result)
{
	pageController.removeAllLayers();
	
	this.groupTree = result;
	pageController.addLayerToPage(this.groupTree, 0);
}

groupControl.prototype.addGroup = function(form)
{
	var request = {};
	request.action = "addGroup";
	request.parameters = {};
	request.parameters.name = form.inputField.value;
	request.parameters.parentid = form.layerID;
	request.callback = "";
	addAjaxRequest(request);
	
	request = {};
	request.action = "getGroups";
	request.parameters = {};
	request.callback = "groupController.setGroupsList(result)";
	addAjaxRequest(request);
	
	request = {}
	request.action = "getGroupParents";
	request.parameters = {};
	request.parameters.layerID = form.layerID;
	request.callback = "groupController.addGroupCallback(result)";
	addAjaxRequest(request);
	
	sendAjaxRequest(true);
}

groupControl.prototype.addGroupCallback = function(result)
{
	for (x in result)
	{
		if (result[x] != 0)
		{
			document.getElementById("groupBtnId"+result[x]).click();
		}
	}
}