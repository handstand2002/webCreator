var requestQueue = [];
var requestAttempts = 0;

function addAjaxRequest(request)
{
	requestQueue.push(request);
}

function sendAjaxRequest(showSpinner)
{
	var requestInProgress = JSON.parse(JSON.stringify(requestQueue));
	requestQueue = [];
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4) {
			if ( xhttp.status == 200 )
			{
				var res = xhttp.responseText;
				
				try {
					res = JSON.parse(res)
					
					for (x in res)
					{
						if (typeof(res[x]["callback"]) != 'undefined' && typeof(res[x]["response"]) != 'undefined')
						{
							var result = res[x]["response"];
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
	
	form.appendChild(input);
	form.appendChild(subBtn);
	
	document.body.appendChild(form);
}

function setPagesList(ajaxResult)
{
	console.log("result:");
	console.log(ajaxResult);
}

function testAjaxRequest()
{
	var t = {};
	t.action = "getPages";
	t.parameters = {};
	t.callback = "setPagesList(result)";
	t.response = "hello, world";
	
	addAjaxRequest(t);
	sendAjaxRequest(true);
}