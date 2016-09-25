function codeAreaControl()
{
	this.groupTitle = null;
	this.functionList = null;
	this.functionListDiv = null;
	this.functionPane = null;
	this.codeMirror = null;
	this.codeMirrorDiv = null;
	this.codeArea = null;
	
	
	this.currentFunction = {};
	this.currentFunction.name = "";
	this.currentFunction.id = 0;
	this.currentFunction.groupName = "";
	this.currentFunction.groupID = 0;
}

codeAreaControl.prototype.setupPage = function(groupName, groupID)
{
	this.currentFunction.groupName = groupName;
	this.currentFunction.groupID = groupID;
	
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
	
	var exitLink = document.createElement("a");
	exitLink.appendChild(document.createTextNode("X"));
	exitLink.style.backgroundColor = "black";
	exitLink.style.color = "white";
	exitLink.style.textDecoration = "none";
	exitLink.style.marginRight = "4px";
	exitLink.href = "javascript:;";
	exitLink.setAttribute("onclick", "codeAreaController.exitCodeArea()");
	this.groupTitle.appendChild(exitLink);
	this.groupTitle.appendChild(document.createTextNode(groupName));
	this.functionPane.appendChild(this.groupTitle);
	
	this.functionListDiv = document.createElement("div");
	this.functionListDiv.style.width = "100%";
	this.functionPane.appendChild(this.functionListDiv);
	
	this.codeMirrorDiv = document.createElement("div");
	this.codeMirrorDiv.style.width = "890px";
	this.codeMirrorDiv.style.height = "100%";
	this.codeMirrorDiv.style.float = "right";
	this.codeArea.appendChild(this.codeMirrorDiv);
	
	document.body.appendChild(this.codeArea);
	
	this.codeMirror = CodeMirror(this.codeMirrorDiv, {
		lineNumbers: true,
		indentWithTabs: true,
		value: "\n\n",
		mode:  "javascript"
		});
	
	this.refreshFunctionList(groupID);
}

codeAreaControl.prototype.refreshFunctionList = function(groupID)
{
	var request = {};
	request.action = "getGroupFunctions";
	request.parameters = {};
	request.parameters.groupID = groupID;
	request.callback = "codeAreaController.setFunctionList(result)";
	
	addAjaxRequest(request);
	sendAjaxRequest(true);
}

codeAreaControl.prototype.exitCodeArea = function()
{
	this.groupTitle.parentNode.removeChild(this.groupTitle);
	this.functionList.parentNode.removeChild(this.functionList);
	this.functionListDiv.parentNode.removeChild(this.functionListDiv);
	this.functionPane.parentNode.removeChild(this.functionPane);
	this.codeMirrorDiv.parentNode.removeChild(this.codeMirrorDiv);
	this.codeArea.parentNode.removeChild(this.codeArea);
	
	this.groupTitle = null;
	this.functionList = null;
	this.functionListDiv = null;
	this.functionPane = null;
	this.codeMirror = null;
	this.codeMirrorDiv = null;
	this.codeArea = null;
}

codeAreaControl.prototype.setFunctionList = function(results)
{
	console.log(results);
	this.functionList = document.createElement("ul");
	this.functionList.style.paddingLeft = "20px";
	this.functionListDiv.appendChild(this.functionList);
	
	for (x in results)
	{
		var functionName = "null";
		// find the function name
		if (results[x]["text"].substring(0, 8).toUpperCase() == "FUNCTION")
		{
			var temp = results[x]["text"].substring(9).trim();
			functionName = temp.substring(0, temp.indexOf("(")).trim();
		}
		
		var btn = document.createElement("li");
		var btnLink = document.createElement("a");
		btnLink.href = "javascript:;";
		btnLink.setAttribute("onclick", "codeAreaController.openFunction(this)");
		btnLink.prop = {};
		btnLink.prop.functionName = functionName;
		btnLink.prop.functionText = results[x]["text"];
		btnLink.prop.functionid = results[x]["functionid"];
		btnLink.prop.groupid = results[x]["groupid"];
		
		var btnText = document.createTextNode(functionName);
		btnLink.appendChild(btnText);
		btn.appendChild(btnLink);
		this.functionList.appendChild(btn);
	}
	
	var newBtn = document.createElement("li");
	var newBtnLink = document.createElement("a");
	newBtnLink.href = "javascript:;";
	var newBtnText = document.createTextNode("New...")
	
	newBtnLink.appendChild(newBtnText);
	newBtn.appendChild(newBtnLink);
	this.functionList.appendChild(newBtn);
}

codeAreaControl.prototype.openFunction = function(link)
{
	var functionName = link.prop.functionName;
	var functionText = link.prop.functionText;
	var functionid = link.prop.functionid;
	this.currentFunction.name = functionName;
	this.currentFunction.id = functionid;
	
	this.codeMirror.setValue(functionText);
}