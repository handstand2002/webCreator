function codeAreaControl()
{
	this.codeMirror = null;
	this.codeArea = null;
	this.functionPane = null;
	this.groupTitle = null;
	this.functionListDiv = null;
	this.functionList = null;
}

codeAreaControl.prototype.setupPage = function(groupName, groupID)
{
	this.codeArea = document.createElement("div");
	this.codeArea.style.height = "100%";
	this.codeArea.style.width = "1100px";
	this.codeArea.style.border = "1px solid black";
	this.codeArea.style.position = "fixed";
	this.codeArea.style.left = "50%";
	this.codeArea.style.marginLeft = "-550px";
	this.codeArea.style.backgroundColor = "white";
	
	this.functionPane = document.createElement("div");
	this.functionPane.style.float = "left";
	this.functionPane.style.height = "100%";
	this.functionPane.style.width = "200px";
	this.functionPane.style.border = "1px solid gray";
	this.codeArea.appendChild(this.functionPane);
	
	this.groupTitle = document.createElement("div");
	this.groupTitle.style.width = "90%";
	this.groupTitle.style.height = "1.2em";
	this.groupTitle.style.border = "1px solid black";
	this.groupTitle.style.padding = "5px";
	this.groupTitle.appendChild(document.createTextNode(groupName));
	this.functionPane.appendChild(this.groupTitle);
	
	this.functionListDiv = document.createElement("div");
	this.functionListDiv.style.width = "100%";
	this.functionPane.appendChild(this.functionListDiv);
	
	document.body.appendChild(this.codeArea);
	
	this.setFunctionList(groupID);
}

codeAreaControl.prototype.refreshFunctionList = function(groupID)
{
	var request = {};
	request.action = "getGroupFunctions";
	request.parameters = {};
	request.parameters.groupID
	request.callback = "codeAreaController.setFunctionList(result)";
	
	addAjaxRequest(request);
	sendAjaxRequest(true);
}

codeAreaControl.prototype.setFunctionList = function(results)
{
	this.functionList = document.createElement("ul");
	this.functionList.style.paddingLeft = "20px";
	this.functionListDiv.appendChild(this.functionList);
	
	var newBtn = document.createElement("li");
	var newBtnLink = document.createElement("a");
	newBtnLink.href = "javascript:;";
	var newBtnText = document.createTextNode("New...")
	
	newBtnLink.appendChild(newBtnText);
	newBtn.appendChild(newBtnLink);
	this.functionList.appendChild(newBtn);
}