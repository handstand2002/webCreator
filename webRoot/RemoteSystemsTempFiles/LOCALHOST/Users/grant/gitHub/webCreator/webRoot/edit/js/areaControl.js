function areaControl()
{
	this.addAreaForm = null;
	this.addAreaInput = null;
	this.currentAreaSelect = null;
	this.groupPane = null;
	this.rootGroup = null;
	
	this.groupDivById = null;
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
	
	this.resetGroupList();
	
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
	
	var saveAreaBtn = document.createElement("button");
	saveAreaBtn.setAttribute("onclick", "areaController.saveAreaGroups()");
	saveAreaBtn.appendChild(document.createTextNode("Save Area"));
	firstPane.appendChild(document.createElement("BR"));
	firstPane.appendChild(saveAreaBtn);
	
	this.fetchAreas();
	
//	codeAreaController.setupPage("testGroup", 1);
}

areaControl.prototype.resetGroupList = function()
{
	while (this.groupPane.childNodes.length > 0)
		this.groupPane.removeChild(this.groupPane.childNodes[0]);
	
	this.rootGroup = this.createGroupForTable("ROOT", 0, 0);
	
	this.groupPane.appendChild(this.rootGroup);
	
	this.groupDivById = {0: this.rootGroup};
}

areaControl.prototype.groupShow = function(spanBtn)
{
	while (spanBtn.childNodes.length > 0)
		spanBtn.removeChild(spanBtn.childNodes[0]);
	
	spanBtn.parentDiv.childArea.style.display = "block";
	spanBtn.parentDiv.state = 1;
	spanBtn.appendChild(document.createTextNode("[-]"))
}

areaControl.prototype.groupHide = function(spanBtn)
{
	// Remove the +/- button
	while (spanBtn.childNodes.length > 0)
		spanBtn.removeChild(spanBtn.childNodes[0]);
	
	spanBtn.parentDiv.childArea.style.display = "none";
	spanBtn.parentDiv.state = 0;
	spanBtn.appendChild(document.createTextNode("[+]"))
}

areaControl.prototype.toggleGroupShow = function(spanBtn)
{
	if (spanBtn.parentDiv.state == 0)
	{
		this.groupShow(spanBtn);
	}
	else
	{
		this.groupHide(spanBtn);
	}
}

areaControl.prototype.createGroupForTable = function(name, id)
{
	var div = document.createElement("div");
	div.groupID = id;
	div.groupTitle = name;
	
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
	div.expandBtn = expandBtn;
	
	div.appendChild(expandBtn);
	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.parentDiv = div;
	checkbox.setAttribute("onchange", "areaController.onCheckboxChange(this.parentDiv)");
	
	div.checkbox = checkbox;
	div.appendChild(checkbox);
	var groupBtn = document.createElement("a");
	if (id != 0)
	{
		groupBtn.href = "javascript:;";
		groupBtn.setAttribute("onclick", "areaController.onGroupClick(this)");
	}
	groupBtn.parentDiv = div;
	groupBtn.appendChild(document.createTextNode( name ))
	div.appendChild(groupBtn);
	
	var childArea = document.createElement("span");
	childArea.style.display = "none";
	div.childArea = childArea;
	div.appendChild(childArea);
	div.parentDiv = null;
	
	return div;
}

areaControl.prototype.onCheckboxChange = function(div)
{
	// Go through children, checking appropriately
	for (x in div.childArea.childNodes)
		this.checkChildrenBasedOnParent(div.childArea.childNodes[x]);
	
	// Go through parents, checking appropriately
	this.checkParentBasedOnChild(div);
}

areaControl.prototype.checkParentBasedOnChild = function(childDiv)
{
	if (childDiv.parentDiv == null)
		return;
	
	childDiv.parentDiv.checkbox.checked = false;
	childDiv.parentDiv.checkbox.indeterminate = false;
	
	if (childDiv.checkbox.checked || childDiv.checkbox.indeterminate)
	{
		var allChecked = true;
		// Check if all the other children are checked
		for (x in childDiv.parentDiv.childArea.childNodes)
		{
			if (typeof(childDiv.parentDiv.childArea.childNodes[x]) != 'object')
				continue;
			
			if (!childDiv.parentDiv.childArea.childNodes[x].checkbox.checked)
			{
				allChecked = false;
				break;
			}
		}
		if (allChecked)
			childDiv.parentDiv.checkbox.checked = true;
		else
			childDiv.parentDiv.checkbox.indeterminate = true;
	}
	else
	{
		var noneChecked = true;
		// Check to see if all other children are unchecked
		for (x in childDiv.parentDiv.childArea.childNodes)
		{
			if (typeof(childDiv.parentDiv.childArea.childNodes[x].checkbox) != 'undefined' && childDiv.parentDiv.childArea.childNodes[x].checkbox.checked)
			{
				noneChecked = false;
				break;
			}
		}
		if (noneChecked)
			childDiv.parentDiv.checkbox.checked = false;
		else
			childDiv.parentDiv.checkbox.indeterminate = true;
	}
	
	this.checkParentBasedOnChild(childDiv.parentDiv);
}

areaControl.prototype.checkChildrenBasedOnParent = function(childDiv)
{
	if (childDiv.parentDiv == null)
		return;
	
	if (childDiv.parentDiv.checkbox.checked)
		childDiv.checkbox.checked = true;
	else
		childDiv.checkbox.checked = false;
	
	for (x in childDiv.childArea.childNodes)
	{
		this.checkChildrenBasedOnParent(childDiv.childArea.childNodes[x]);
	}
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
	this.groupDivById = {0: this.rootGroup};
	
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
	// uncheck all boxes
	for (k in this.groupDivById)
	{
		this.groupDivById[k].checkbox.checked = false;
		this.groupDivById[k].checkbox.indeterminate = false;
	}
	
	// Check appropriate boxes
	for (x in result)
	{
//		console.log(this.groupDivById[result[x]["groupid"]].checkbox);
		var checkbox = this.groupDivById[result[x]["groupid"]].checkbox;
		checkbox.checked = true;
		this.onCheckboxChange(checkbox.parentDiv);
		
		this.expandParents(checkbox.parentDiv);
	}
}

areaControl.prototype.expandParents = function(childDiv)
{
	if (childDiv.parentDiv == null)
		return;
	
	this.groupShow(childDiv.parentDiv.expandBtn);
}

areaControl.prototype.saveAreaGroups = function()
{
	var checkedIDs = [];
	for (x in this.groupDivById)
	{
		if (x != 0)
		{
			if (this.groupDivById[x].checkbox.checked)
				checkedIDs.push(x);
		}
	}
	
	var request = {};
	request.action = "saveAreaGroups";
	request.parameters = {};
	request.parameters.area = this.currentAreaSelect.value;
	request.parameters.groups = checkedIDs;
	request.callback = "";
	addAjaxRequest(request);
	
	request = {};
	request.action = "getAreaGroups";
	request.parameters = {};
	request.parameters.area = this.currentAreaSelect.value;
	request.callback = "areaController.setAreaGroups(result)";
	
	addAjaxRequest(request);
	sendAjaxRequest(true);
}

areaControl.prototype.onGroupClick = function(link)
{
	
	codeAreaController.setupPage(link.parentDiv.groupTitle, link.parentDiv.groupID);
	
}