## Image Crop

  - 基于 YUI 2.9.0 imageCropper
  - DOM 操作基于 KISSY 1.1.6
  
## Example
	<!-- crop area and preview area -->
	<div id="areaId" class="yui-skin-sam"></div>
	<div id="preId"></div>
	
	<script>
		crop = new KISSY.imgCrop( 'areaId', 'preId' );
		crop.crop( 'http://dummyimage.com/600x400/F4A726/fff.png', function(){
			console.log( 'crop initailized!' );
		});
	</script>
	
## Setup

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
	