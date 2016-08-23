<!DOCTYPE html>
<html>
<head>
<script type="text/javascript" src="js/index.js"></script>
<script type="text/javascript" src="js/pageControl.js"></script>
<script type="text/javascript" src="js/groupControl.js"></script>
<script type="text/javascript" src="js/areaControl.js"></script>
<script type="text/javascript" src="js/codeAreaControl.js"></script>

<script src="../includes/codemirror-5.17.0/lib/codemirror.js"></script>
<link rel="stylesheet" href="../includes/codemirror-5.17.0/lib/codemirror.css">
<script src="../includes/codemirror-5.17.0/mode/javascript/javascript.js"></script>

<link rel="stylesheet" type="text/css" href="css/index.css">

</head>
<body>




<script>
pageController = new pageControl();
groupController = new groupControl();
areaController = new areaControl();
codeAreaController = new codeAreaControl();

pageController.initPage()
</script>

</body>
</html>