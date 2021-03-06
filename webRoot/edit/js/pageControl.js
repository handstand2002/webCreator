function pageControl()
{
	this.layers = [];
}

pageControl.prototype.removeAllLayers = function()
{
	for (x in this.layers)
		this.layers[x].remove();
	
	this.layers = [];
}

pageControl.prototype.enterGroup = function(btn)
{
	while (this.layers.length-1 > btn.layerNum )
	{
		this.layers[(btn.layerNum+1)].remove();
		this.layers.splice(btn.layerNum+1, 1);
	}
	
	this.addLayerToPage(btn.layerInfo.children, btn.layerInfo.id);
}

pageControl.prototype.addLayerToPage = function(layerInfo, layerID)
{
	var layerNum = this.layers.length;
	
	var outerBox = document.createElement("div");
	this.layers.push(outerBox);
	outerBox.layerNum = layerNum;
	outerBox.layerID = layerID;
	document.body.appendChild(outerBox);
	outerBox.style.border = "1px solid black";
	outerBox.style.width = "100px";
	outerBox.style.height = "100%";
	outerBox.style.float = "left";
	
	var addForm = document.createElement("form");
	outerBox.appendChild(addForm);
	addForm.layerInfo = layerInfo;
	addForm.layerID = layerID;
	addForm.action = "javascript:;";
	addForm.setAttribute("onsubmit", "groupController.addGroup(this)");
	
	var newLayerNameInput = document.createElement("input");
	addForm.appendChild(newLayerNameInput);
	addForm.inputField = newLayerNameInput;
	newLayerNameInput.type = "text";
	newLayerNameInput.style.width = "80px";
	
	var newLayerSubmit = document.createElement("input");
	addForm.appendChild(newLayerSubmit);
	newLayerSubmit.type = "submit";
	newLayerSubmit.value = "Add!";
	
	var childrenDiv = document.createElement("div");
	outerBox.appendChild(childrenDiv);
	childrenDiv.style.width = "100%";
	childrenDiv.style.marginTop = "50px";
	
	for (x in layerInfo)
	{
		var btn = document.createElement("button");
		btn.appendChild(document.createTextNode(layerInfo[x]["title"]));
		btn.layerInfo = layerInfo[x];
		btn.id = "groupBtnId" + layerInfo[x]["id"];
		btn.layerNum = layerNum;
		childrenDiv.appendChild(btn);
		childrenDiv.appendChild(document.createElement("br"));
		btn.setAttribute("onclick", "pageController.enterGroup(this)")
	}
}

pageControl.prototype.initPage = function()
{
	while (document.body.childNodes.length > 0)
		document.body.removeChild(document.body.childNodes[0]);
	
//	groupController.setupPage();
	areaController.setupPage();
}