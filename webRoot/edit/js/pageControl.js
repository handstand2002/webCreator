function pageControl()
{
	this.layerDivsByLayerNum = {};
	this.layerDivsByParentId = {};
}

pageControl.prototype.createLayerDiv = function(layerNum)
{
	var div = document.createElement("div");
	div.id = "layerDiv" + layerNum;
	div.style.position = "fixed";
	div.style.left = (101*Object.keys(this.layerDivsByLayerNum).length) + "px";
	div.style.height = "100%";
	div.style.overflowY = "scroll";
	div.style.width = "100px";
	div.style.border = "1px solid black";
	
	// Create the text input for user to create groups
	var addGroupInput = document.createElement("input");
	addGroupInput.type = "text";
	
	// Create the button to allow for creating groups
	var addGroupBtn = document.createElement("button");
	addGroupBtn.appendChild(document.createTextNode("Add"));
	addGroupBtn.inputField = addGroupInput;	// Link the input to the button
	addGroupBtn.setAttribute("onclick", "groupController.addGroupForLayer(this)");
	
	// Create the div that houses all the layer buttons
	var subDiv = document.createElement("div");
	subDiv.style.width = "100%";
		
	// put the input and the button in the div
	div.appendChild(addGroupInput);
	div.appendChild(addGroupBtn);
	div.appendChild(document.createElement("br"));
	div.appendChild(document.createElement("br"));
	div.appendChild(subDiv);
	
	// put the div in the body
	document.body.appendChild(div);

	// Set the properties of the Div
	div.layerProperties = {};
	div.layerProperties.layerNum = layerNum;
	div.layerProperties.buttonDiv = subDiv;
	
	// Index the layerDiv
	this.layerDivsByLayerNum[layerNum] = div;
}

pageControl.prototype.removeLayersHigherThan = function(layerNum)
{
	var i = layerNum+1;
	while (typeof(this.layerDivsByLayerNum[i]) != 'undefined')
	{
		// Remove from the page
		this.layerDivsByLayerNum[i].parentNode.removeChild(this.layerDivsByLayerNum[i]);
		delete this.layerDivsByLayerNum[i];
	}
	
	// layerNum is 1 based, and array is 0 based, so layerNum is already on the next index, which should be removed.
	// Remove all indexes after layerNum
	while (typeof(groupController.layers[layerNum]) != 'undefined')
		groupController.layers.splice(layerNum, 1);
}

pageControl.prototype.fillLayerDiv = function(result, layerNum)
{
	console.log("Demand to fill layer: " + layerNum)
	var div = this.layerDivsByLayerNum[layerNum];
	
	// set parentid for the layer
	div.layerProperties.parentId = result[0]["parentid"];
	if (div.layerProperties.parentId == null)
		div.layerProperties.parentId = 0;
	
	for (x in result)
	{
		var newBtn = document.createElement("Button");
		newBtn.appendChild(document.createTextNode(result[x]["title"]));
		result[x]["layerNum"] = layerNum;
		newBtn.groupProperties = result[x];
		newBtn.setAttribute("onclick", "groupController.selectGroup(this)");
		
		div.layerProperties.buttonDiv.appendChild(newBtn);
		div.layerProperties.buttonDiv.appendChild(document.createElement("br"));
	}
 
}

pageControl.prototype.initPage = function()
{
	groupController.fetchChildren(0);
	
}