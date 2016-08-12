function areaControl()
{
	this.addAreaForm = null;
	this.addAreaInput = null;
	this.currentAreaSelect = null;
	this.groupPane = null;
	this.rootGroup = null;
	
	this.groupDivById = {};
}

areaControl.prototype.setupPage = function()
{
	var firstPane = document.createElement("div");
	firstPane.style.float = "left";
	firstPane.style.width = "150px";
	firstPane.style.border = "1px solid black";
	firstPane.style.height = "100%";
	firstPane.style.overflowY = "scroll";
	document.body.appendChild(firstPane);
	
	var secondPane = document.createElement("div");
	secondPane.style.float = "left";
	secondPane.style.width = "250px";
	secondPane.style.border = "1px solid black";
	secondPane.style.height = "100%";
	secondPane.style.overflowY = "scroll";
	document.body.appendChild(secondPane);
	this.groupPane = secondPane;
	
	this.rootGroup = this.createGroupForTable("ROOT", 0, 0);
	this.groupPane.appendChild(this.rootGroup);
	
	var newAreaForm = document.createElement("form");
	newAreaForm.action = "javascript:;";
	newAreaForm.setAttribute("onsubmit", "areaController.addArea()");
	this.addAreaForm = newAreaForm;
	firstPane.appendChild(newAreaForm);
	
	var newAreaInput = document.createElement("input");
	newAreaInput.type = "text";
	this.addAreaInput = newAreaInput;
	newAreaForm.appendChild(newAreaInput);
	
	var newAreaSubmit = document.createElement("input");
	newAreaSubmit.type = "submit";
	newAreaSubmit.value = "Create";
	newAreaForm.appendChild(newAreaSubmit);
	
	firstPane.appendChild(document.createElement("br"));
	firstPane.appendChild(document.createElement("br"));
	
	firstPane.appendChild(document.createTextNode("Current Areas"));
	firstPane.appendChild(document.createElement("br"));
	
	var currentAreaSelect = document.createElement("select");
	this.currentAreaSelect = currentAreaSelect;
	firstPane.appendChild(currentAreaSelect);
	currentAreaSelect.multiple = true;
	currentAreaSelect.style.width = "100px";
	currentAreaSelect.style.height = "100px";
	currentAreaSelect.setAttribute("onchange", "areaController.selectArea()");
	
	var noOption = document.createElement("option");
	noOption.text = "None";
	
	currentAreaSelect.add(noOption);
	
	this.fetchAreas();
}

areaControl.prototype.toggleGroupShow = function(spanBtn)
{
	while (spanBtn.childNodes.length > 0)
		spanBtn.removeChild(spanBtn.childNodes[0]);
	
	if (spanBtn.parentDiv.state == 0)
	{
		spanBtn.parentDiv.childArea.style.display = "block";
		spanBtn.parentDiv.state = 1;
		spanBtn.appendChild(document.createTextNode("[-]"))
	}
	else
	{
		spanBtn.parentDiv.childArea.style.display = "none";
		spanBtn.parentDiv.state = 0;
		spanBtn.appendChild(document.createTextNode("[+]"))
	}
}

areaControl.prototype.createGroupForTable = function(name, id)
{
	var div = document.createElement("div");
	
	var expandBtn = document.createElement("a");
	expandBtn.appendChild(document.createTextNode( "[+]" ));
	expandBtn.parentDiv = div;
	expandBtn.parentDiv.state = 0;
	expandBtn.style.fontFamily = "'Lucida Console', Monaco, monospace";
	expandBtn.style.fontSize = ".7em";
	expandBtn.style.textDecoration = "none";
	expandBtn.style.color = "black";
	expandBtn.href = "javascript:;";
	expandBtn.setAttribute("onclick", "areaController.toggleGroupShow(this)");
	
	div.appendChild(expandBtn);
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.indeterminate = true;
	div.checkbox = checkbox;
	div.appendChild(checkbox);
	div.appendChild(document.createTextNode( name ));
	
	var childArea = document.createElement("span");
	childArea.style.display = "none";
	div.childArea = childArea;
	div.appendChild(childArea);
	div.parentDiv = null;
	
	return div;
}

areaControl.prototype.addArea = function()
{
	var request = {};
	request.action = "addArea";
	request.parameters = {};
	request.parameters.name = this.addAreaInput.value;
	request.callback = "";
	addAjaxRequest(request);
	
	var request = {};
	request.action = "getAreas";
	request.parameters = {};
	request.callback = "areaController.setAreasList(result)";
	addAjaxRequest(request);
	
	sendAjaxRequest(true);
	
	this.addAreaInput.value = "";		// Wipe out the value of the input
}

areaControl.prototype.fetchAreas = function()
{	
	this.groupDivById = {};
	
	var request = {};
	request.action = "getAreas";
	request.parameters = {};
	request.callback = "areaController.setAreasList(result)";
	addAjaxRequest(request);
	
	request = {};
	request.action = "getGroups";
	request.parameters = {};
	request.callback = "areaController.setGroupsList(result)";
	addAjaxRequest(request);
	
	sendAjaxRequest(true);
}

areaControl.prototype.setGroupsList = function(result, parentDiv)
{
	if (typeof(parentDiv) == 'undefined')
		parentDiv = this.rootGroup;
	
//	console.log(result);
	for (x in result)
	{
		var newDiv = this.createGroupForTable(result[x]["title"], result[x]["id"])
		newDiv.style.marginLeft = "20px";
		newDiv.parentDiv = parentDiv;
		parentDiv.childArea.appendChild(newDiv);
		this.groupDivById[result[x]["id"]] = newDiv;
		
		
		this.setGroupsList(result[x]["children"], newDiv);
	}
}

areaControl.prototype.setAreasList = function(result)
{
	if (typeof(result) != 'object' || result.length == 0)
		return;
		
	while (this.currentAreaSelect.options.length > 0)
		this.currentAreaSelect.remove(0);
	
	for (x in result)
	{
		var option = document.createElement("option");
		option.text = result[x]["title"];
		option.value = result[x]["areaid"];
		this.currentAreaSelect.add(option);
	}
}

areaControl.prototype.selectArea = function()
{
	var request = {};
	request.action = "getAreaGroups";
	request.parameters = {};
	request.parameters.area = this.currentAreaSelect.value;
	request.callback = "areaController.setAreaGroups(result)";
	
	addAjaxRequest(request);
	sendAjaxRequest(true);
}

areaControl.prototype.setAreaGroups = function(result)
{
	console.log(result);
	for (x in result)
	{
//		console.log(this.groupDivById[result[x]["groupid"]].checkbox);
		var checkbox = this.groupDivById[result[x]["groupid"]].checkbox; 
		if (checkbox.indeterminate)
			checkbox.indeterminate = false;
		checkbox.checked = true;
	}
	
}