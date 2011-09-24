<!DOCTYPE html>
<html><head><meta http-equiv="Content-Type" content="text/html; charset=GBK">
<meta charset="gbk">
<title>a simple image cropper</title>

<!-- KISSY 1.1.6 -->
<script language="javascript" type="text/javascript" src="http://a.tbcdn.cn/??s/kissy/1.1.6/kissy-min.js"></script>

<!-- YUI imageCropper dependences -->
<!-- Skin CSS file -->
<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.9.0/build/assets/skins/sam/resize.css">
<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.9.0/build/assets/skins/sam/imagecropper.css">
<!-- Utility Dependencies -->
<script src="http://yui.yahooapis.com/2.9.0/build/yahoo-dom-event/yahoo-dom-event.js"></script> 
<script src="http://yui.yahooapis.com/2.9.0/build/dragdrop/dragdrop-min.js"></script> 
<script src="http://yui.yahooapis.com/2.9.0/build/element/element-min.js"></script> 
<!-- Source file for the Resize Utility -->
<script src="http://yui.yahooapis.com/2.9.0/build/resize/resize-min.js"></script>
<!-- Source file for the ImageCropper Control -->
<script src="http://yui.yahooapis.com/2.9.0/build/imagecropper/imagecropper-min.js"></script>


<script language="javascript" type="text/javascript" src="../image-crop.js"></script>
<body>
<style type="text/css" media="screen">
	#areaId {
		width: 400px;
		height: 400px;
		overflow: hidden;
		border: 2px red solid;
	}
	#preId {
		width: 200px;
		height: 200px;
		overflow: hidden;
		border: 2px solid red;
	}
</style>
<input type="text" name="name" value="enter the img url you want to crop" id="urlVal" />
<input type="button" name="name" value="crop" id="trigger" />
<div id="areaId" class="yui-skin-sam"></div>
<div id="preId"></div>

<script language="javascript" type="text/javascript">
	crop = new KISSY.imgCrop( 'areaId', 'preId' );
	inptUrl = KISSY.one( '#urlVal' );
	inptTrg = KISSY.one( '#trigger' );
	inptTrg.on( 'click', function(){
		var val = inptUrl.val();
		if( val ){
			crop.crop( val );
		}
	});
</script>

</body>
</html>

