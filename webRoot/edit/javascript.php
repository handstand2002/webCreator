<DOCTYPE html>
<HTML>
<head>
<script src="../includes/codemirror-5.17.0/lib/codemirror.js"></script>
<link rel="stylesheet" href="../includes/codemirror-5.17.0/lib/codemirror.css">
<script src="../includes/codemirror-5.17.0/mode/javascript/javascript.js"></script>
<script>
var codeMirrorDiv = document.createElement("div");
codeMirrorDiv.style.border = "1px solid black";
codeMirrorDiv.style.height = "200px";
codeMirrorDiv.style.width = "100%";

// var codeMirrorDiv = document.createElement("textarea");
// codeMirrorDiv.style.border = "1px solid black";
// codeMirrorDiv.style.height = "200px";
// codeMirrorDiv.style.width = "300px";


document.body.appendChild(codeMirrorDiv);
var myCodeMirror = CodeMirror(codeMirrorDiv, {
	lineNumbers: true,
	indentWithTabs: true,
	value: "Hello, world!\n",
	mode:  "javascript"
	});
// var myCodeMirror = CodeMirror.fromTextArea(codeMirrorDiv, {
// 	lineNumbers: true
//   });
</script>
</head>
<body>

</body>
</HTML>