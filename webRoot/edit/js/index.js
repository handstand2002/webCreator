var requestQueue = [];
var requestAttempts = 0;
var selectedGroup = null;
var allGroupsById = {};
var allGroupsByParent = {};

var layersHidden = [];
var activeLayer = 0;

var requestDiv = null;
var requestNum = 1;

var debugSpecific = {};
debugSpecific.ajaxRequest = false;

function addAjaxRequest(request)
{
	requestQueue.push(request);
}

function sendAjaxRequest(showSpinner)
{
	var requestInProgress = JSON.parse(JSON.stringify(requestQueue));
	if (debugSpecific.ajaxRequest)
	{
		console.log("Sending Requests:");
		console.log(requestInProgress);
	}
	requestQueue = [];
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4) {
			if ( xhttp.status == 200 )
			{
				var res = xhttp.responseText;
				
				try {
					res = JSON.parse(res)
					
					if (debugSpecific.ajaxRequest)
					{
						console.log("Received Requests:");
						console.log(res);
					}
					
					for (x in res)
					{
						if (typeof(res[x]["callback"]) != 'undefined' && typeof(res[x]["response"]) != 'undefined')
						{
							var result = res[x]["response"];
							var fullRequest = res[x];
							eval(res[x]["callback"]);
						}
					}
				}
				catch(err)
				{
					console.log("Wasn't able to parse result");
					console.log(err);
				}
				
//				
			}
			else if (xhttp.status >= 400 && requestAttempts++ < 50)
			{
				console.log("request failed, trying again");
				requestQueue = JSON.parse(JSON.stringify(requestInProgress)); 
				sendAjaxRequest(showSpinner);
			}
		}
	};
	
	xhttp.open("POST", "ajaxHelper.php", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("d=" + JSON.stringify(requestInProgress));
	
	if (requestDiv == null)
	{
		console.log ("creating div...");
		requestDiv = document.createElement("div");
		requestDiv.style.position = "fixed";
		requestDiv.style.right = "0%";
		requestDiv.style.bottom = "0%";
		requestDiv.style.height = "200px";
		requestDiv.style.width = "100px";
		requestDiv.style.overflow = "scroll";
		requestDiv.style.border = "1px solid black";
		
		document.body.appendChild(requestDiv);
	}
	
	var form = document.createElement("form");
	form.action = "ajaxHelper.php";
	form.target = "_BLANK";
	form.method = "POST";
	
	var input = document.createElement("input");
	input.type = "hidden";
	input.name = "d";
	input.value = JSON.stringify(requestInProgress);
	
	var subBtn = document.createElement("input");
	subBtn.type = "submit";
	subBtn.value = "Request " + (requestNum++);
	subBtn.title = "Action:\n";
	for (x in requestInProgress)
	{
		subBtn.title += "\n" + requestInProgress[x]["action"];
	}
	
	form.appendChild(input);
	form.appendChild(subBtn);
	
	requestDiv.insertBefore(form, requestDiv.childNodes[0]);
//	requestDiv.appendChild(form);
//	
//	document.body.appendChild(form);
}

function getPagesList()
{
	var t = {};
	t.action = "getPages";
	t.parameters = {};
	t.callback = "setPagesList(result)";
	t.response = "hello, world";
	
	addAjaxRequest(t);
	sendAjaxRequest(true);
}

function setPagesList(ajaxResult)
{
	var header = document.createElement("h4");
	var headerText = document.createTextNode("Pages");
	header.appendChild(headerText);
	
	var pageList = document.createElement("select");
	pageList.multiple = true;
	for (x in ajaxResult)
	{
		var option = document.createElement("option");
		option.text = ajaxResult[x];
		pageList.add(option);
	}
	
	document.body.appendChild(header);
	document.body.appendChild(document.createElement("br"));
	document.body.appendChild(pageList);
}

function getParentGroupsList()
{
	var request = {};
	request.action = "getGroups";
	request.parameters = {};
	request.parameters.parentid = null;
	request.callback = "setGroupsList(result)";
	
	addAjaxRequest(request);
	sendAjaxRequest(true);
}

function getGroupsList(parentid)
{
	var request = {};
	request.action = "getGroups";
	request.parameters = {};
	request.parameters.parentid = parentid;
	request.callback = "setGroupsList(result)";
	
	addAjaxRequest(request);
	sendAjaxRequest(true);
}

function setGroupsList(ajaxResult)
{
	console.log("Setting groups list with data:");
	console.log(ajaxResult);
	
	var parentid = null;
	if (typeof(ajaxResult) != 'undefined' && typeof(ajaxResult[0]) != 'undefined')
		parentid = ajaxResult[0]["parentid"];
	
	if (parentid == null)
		parentid = 0;
	
	var layerNum = 0;
	if (parentid > 0)
		layerNum = (allGroupsById[parentid]["layerNum"] + 1);
	
	var groupDiv = document.getElementById("groupDiv"+layerNum);
	if (groupDiv != null)
	{
		while (groupDiv.children.length > 0)	// Kill all the children
			groupDiv.removeChild(groupDiv.children[0]);
		groupDiv.remove();
	}
	groupDiv = document.createElement("div");
	groupDiv.id = "groupDiv" + layerNum;
	document.body.appendChild(groupDiv);
	
	var header = document.createElement("h4");
	var headerText = document.createTextNode("Groups");
	header.appendChild(headerText);
	
	var table = document.createElement("table");
	// Set the layer num, based on parents
	
	groupDiv.className = "groupDivLayerNum" + layerNum;
	
	for (x in ajaxResult)
	{
		ajaxResult[x]["layerNum"] = layerNum;
		
		// Store groups, indexed by id number, parentid num
		allGroupsById[ajaxResult[x]["id"]] = ajaxResult[x];
		if (ajaxResult[x]["parentid"] == null)
		{
			if (typeof(allGroupsByParent[0]) == 'undefined')
				allGroupsByParent[0] = [];
			allGroupsByParent[0].push(ajaxResult[x]);
		}
		else
		{
			if (typeof(allGroupsByParent[ajaxResult[x]["parentid"]]) == 'undefined')
				allGroupsByParent[ajaxResult[x]["parentid"]] = [];
			allGroupsByParent[ajaxResult[x]["parentid"]].push(ajaxResult[x]);
		}
		
		var groupName = ajaxResult[x]["title"];
		
		var row = table.insertRow(-1);
		var cell = row.insertCell(0);
		var btn = document.createElement("button");
		btn.setAttribute("onclick", "groupSelect(" + ajaxResult[x]["id"] + ")" );
		btn.id = "groupBtnId" + ajaxResult[x]["id"];
		
		var cellText = document.createTextNode(groupName);
		btn.appendChild(cellText);
		
		cell.appendChild(btn);
		
	}
	groupDiv.appendChild(header);
	
	
	// Create the form that will accept new group names
//	var newGroupInput = document.createElement("input");
//	newGroupInput.type = "text";
//	newGroupInput.id = "newGroupInput";
//	
//	var newGroupInputSubmit = document.createElement("button");
//	newGroupInputSubmit.setAttribute("onclick", "addGroup(document.getElementById('newGroupInput').value)");
//	
//	var submitBtn = document.createTextNode("Add");
//	newGroupInputSubmit.appendChild(submitBtn);
	
	
}

function setLayerGroups(groupArray)
{
	var layerNum = groupArray[0]["layerNum"];
	
	var groupDiv = document.getElementById("groupDivLayer"+layerNum);
	if (groupDiv != null)
	{
		while (groupDiv.children.length > 0)	// Kill all the children
			groupDiv.removeChild(groupDiv.children[0]);
	}
	else
	{
		groupDiv = document.createElement("div");
		groupDiv.id = "groupDivLayer" + layerNum;
	}
	
	var header = document.createElement("h4");
	header.appendChild(document.createTextNode("Groups"));
	
	var table = document.createElement("table");
	for (x in groupArray)
	{
		var row = table.insertRow(-1);
		var cell = row.insertCell(0);
		var btn = document.createElement("button");
		btn.setAttribute("onclick", "groupSelect(" + groupArray[x]["id"] + ")" );
		btn.id = "groupBtnId" + ajaxResult[x]["id"];
		
		btn.appendChild( document.createTextNode(groupName) );
		cell.appendChild(btn);
	}
}

function groupHighlight(id)
{
	var btn = document.getElementById("groupBtnId"+id);
	if (btn != null)
	{
		btn.style.color = "blue";
		btn.style.fontWeight = "bold";
	}
}

function treeShowOthersInLayer(id)
{
	var groupToKeep = allGroupsById[id];
	var allGroupsInLayer = null;
	var parentid = 0;
	if (groupToKeep["parentid"] != null)
		parentid = groupToKeep["parentid"];
	
	for (x in layersHidden)
	{
		if (layersHidden[x] == parentid)
		{
			// Remove the index from the array
			layersHidden.splice(x, 1);
			break;
		}
			
	}
	
	allGroupsInLayer = allGroupsByParent[parentid];
	
	for (x in allGroupsInLayer)
	{
		var thisGroup = allGroupsInLayer[x];
		
		var showGroup = document.getElementById("groupBtnId" + thisGroup["id"]);
		if (showGroup != null)
		{
			showGroup.disabled = false;
			showGroup.style.opacity = 1;
		}
	}
}

function toggleHideLayer(id)
{
	parentid = allGroupsById[id]["parentid"];
	if (parentid == null)
		parentid = 0;
	var alreadyHidden = false;
	for (x in layersHidden)
	{
		if (layersHidden[x] == parentid)
		{
			alreadyHidden = true;
			break;
		}
	}
	
	if (alreadyHidden)
		treeShowOthersInLayer(id);
	else
		treeHideOthersInLayer(id);
}

function treeHideOthersInLayer(id)
{
	var groupToKeep = allGroupsById[id];
	var allGroupsInLayer = null;
	if (groupToKeep["parentid"] == null)
	{
		layersHidden.push(0);
		allGroupsInLayer = allGroupsByParent[0];
	}
	else
	{
		layersHidden.push(groupToKeep["parentid"]);
		allGroupsInLayer = allGroupsByParent[groupToKeep["parentid"]];
	}
		
	
	for (x in allGroupsInLayer)
	{
		var thisGroup = allGroupsInLayer[x];
		if (thisGroup["id"] != groupToKeep["id"])
		{
			var killGroup = document.getElementById("groupBtnId" + thisGroup["id"]);
			if (killGroup != null)
			{
				killGroup.disabled = true;
				killGroup.style.opacity = .2;
			}
		}
	}
}

function groupUnhighlight(id)
{
	var btn = document.getElementById("groupBtnId"+id);
	if (btn != null)
	{
		btn.style.color = "initial";
		btn.style.fontWeight = "normal";
	}
}

function groupSelect(id)
{
	getGroupsList(id);
	if (selectedGroup != null)
		groupUnhighlight(selectedGroup["id"]);
	
	selectedGroup = allGroupsById[id];
	
	groupHighlight(id);
	
//	treeHideOthersInLayer(id);
	toggleHideLayer(id);
}

function addGroup(name, parentid)
{
	if (parentid == 0)
		parentid = null;
	
	var request = {};
	request.action = "addGroup";
	request.parameters = {};
	request.parameters.name = name;
	request.callback = "";
	
	addAjaxRequest(request);
	
	
	request = {};
	request.action = "getGroups";
	request.parameters = {};
	request.parameters.parentid = parentid; 
	request.callback = "setGroupsList(result)"; 
	
	addAjaxRequest(request);
	
	sendAjaxRequest(true);
}
