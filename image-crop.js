/**
 * 图片裁剪
 *
 * 基于 YUI imageCropper 和 KISSY 的图片裁剪组件
 *
 * @author neekey <ni184775761@gmail.com>
 */
KISSY.add( 'imgCrop', function( K ){

K.namespace( 'imgCrop' );

/**
 * 构造函数
 *
 * @param {String} areaConID 裁剪区域容器id
 * @param {String} preConID 预览区域ID 
 */
K.imgCrop = function( areaConID, preConID ){
	this.areaCon = K.one( '#' + areaConID );
	this.preCon = K.one( '#' + preConID );
	this.areaImg = this.areaCon.one( 'img' );
	this.preimg = this.preCon.one( 'img' );
	this.preImgWrap = K.one( K.DOM.create('<div>') );
	this.preImgWrap.css({
		width: '100%',
		height: '100%',
		position: 'relative',
		overflow: 'hidden'
	});
	
	if( !this.areaImg ) {
		this.areaImg = K.one( K.DOM.create('<img>') );
		this.areaCon.append( this.areaImg );
	}
	if( !this.preImg ){
		this.preImg = K.one( K.DOM.create('<img>') ).css( 'position', 'absolute' );
	}
	this.preImgWrap.append( this.preImg );
	this.preCon.append( this.preImgWrap );

	this.areaCon.show();
	this.preCon.show();

	this.areaW = parseInt( this.areaCon.css( 'width' ), 0 );
	this.areaH = parseInt( this.areaCon.css( 'height' ), 0 );
	this.preW = parseInt( this.preCon.css( 'width' ), 0 );
	this.preH = parseInt( this.preCon.css( 'height' ), 0 );

	this.areaCon.hide();
	this.preCon.hide();

	this.oriInfo = {};
	this.newInfo = {};
};

K.augment( K.imgCrop, K.EventTarget );
K.augment( K.imgCrop, {
	/**
	 * 对指定url的图像进行裁剪
	 * @param {String} url
	 * @param {Function} cb 
	 */
	crop: function( url, cb ){
		var Y = YAHOO,
			Dom = Y.util.Dom,
			Event = Y.util.Event,
			that = this,
			crop = null,
			minCropWidth = 0,
			wrapMarTop = 0,
			cropBugfix = false,
			oriInfo = this.oriInfo;

		// 销毁上一次的裁剪
		this.reset();

		this.areaImg.show();
		this.preImg.show();
	   
		// 添加图片的load事件
		K.Event.on( this.areaImg.getDOMNode(), 'load', function(){

			// ie下若容器为hide，无法正确获取图片尺寸
			that.areaCon.show();
			that.preCon.show();
		
			oriInfo.w = parseInt( that.areaImg.attr( 'width' ), 0 ); 
			oriInfo.h = parseInt( that.areaImg.attr( 'height' ), 0 ); 

			// 调整图片的宽高，以适应容器
			var newInfo = that.newInfo = that.getAreaResize( that.areaW, that.areaH, oriInfo.w, oriInfo.h );
			
			that.areaImg.attr( 'width', newInfo.w );
			that.areaImg.attr( 'height', newInfo.h );

			// 设置用于修改裁剪组件的图片
			// 修复yui crop组件的bug
			resizeMaskImg =	K.DOM.create('<img>');
			resizeMaskImg.src = url;
			resizeMaskImg.width = newInfo.w;
			resizeMaskImg.height = newInfo.h;

			// 确定默认裁剪区域的宽高
			initCropWidth = newInfo.w > newInfo.h ? newInfo.h : newInfo.w;
			initCropWidth = initCropWidth - 5 > 1 ? initCropWidth - 5 : initCropWidth;

			// 初始化组件
			crop = that.preCrop = new YAHOO.widget.ImageCropper( that.areaImg.getDOMNode(), {
				initialXY: [0, 0],
				keyTick: 5,
				shiftKeyTick: 50,
				ratio: true,
				initHeight: initCropWidth,
				initWidth: initCropWidth
			});

			// 调整,解决裁剪handler里面图像依旧显示原图尺寸的问题
			// 修复yui crop组件的bug
			K.one( crop._resizeMaskEl ).css( 'background', 'none' ).append( resizeMaskImg );
			crop.on('moveEvent', function() {
				var region = crop.getCropCoords();
				K.one( resizeMaskImg ).css('margin-top', '-' + region.top + 'px');
				K.one( resizeMaskImg ).css('margin-left', '-' + region.left + 'px');
			});

			//修正当正方形截取框到原始图边界时，会变为不规则的长方形 by yuanxin 09.4.23
			crop._resize.on('endResize', function() {
				//console.debug(arguments);
				var ev = arguments[0];
				if (ev.width != ev.height) {
					//console.debug('need change');
					var adjustXY = Math.min(ev.width, ev.height);

					this.resize(null, adjustXY, adjustXY, 0, 0);
					//console.debug('change to ' +  adjustXY);
					//修正恢复到正方形时不可移动的bug,只绑定一次 by yuyin 09.05.08
					if(!cropBugfix){
						cropBugfix = this.on('dragEvent',function(){
							crop._setConstraints(true);
						})||true;
					}
				}
			});
			
			// 设置图像居中显示
			wrapMarTop = parseInt( ( that.areaH - newInfo.h ) / 2, 0 );
			K.one( crop._wrap ).css( 'margin', wrapMarTop + 'px auto 0px auto' );

			that.resizePreview( crop );

			crop.on('moveEvent', function() {
				that.resizePreview( crop );
			});

			// 取消img的事件绑定
			K.Event.remove( that.areaImg.getDOMNode(), 'load' );

			// 执行回调
			cb && cb();
		
		});

		// 设置图片地址
		// 设置src必须在设置load事件后，否则无法在ie下触发load事件
		this.areaImg.attr( 'src', url );
		this.preImg.attr( 'src', url ); 
	},	
	/**
	 * 根据图片大小，适应容器大小调整图片显示尺寸
	 * @param {Number} conW 容器宽度
	 * @param {Number} conH 容器高度
	 * @return {Object} { w: 宽, h: 高 }
	 */
	getAreaResize: function( conW, conH, imgW, imgH ){
		var width = imgW * 1.0;
		var height = imgH * 1.0;
		if(( width / conW ) > ( height / conH )){
			var new_width = conW;
			var new_height = parseInt( conW * height / width, 0);
		}
		else {
			new_width = parseInt( conH * width / height, 0 );
			new_height = conH;
		}
		
		return {
			w: new_width,
			h: new_height
		};
	},
	/**
	 * 根据裁剪选取修改缩略图
	 * @param {Object} coords 裁剪区域的信息 
	 * 	{ x: 左上角x坐标, y: 左上角y坐标, w: 裁剪区域宽度, h: 裁剪区域高度 }
	 * @param {Number} resW 适应后的图片宽度
	 * @param {Number} resH 适应后的图片高度
	 * @param {Number} preW 预览容器的宽度
	 * @param {Numver} preH 预览容器的高度
	 */
	getPreviewResize: function( coords, resW, resH, preW, preH ){

		// 获取图片的缩放后尺寸（为了适应容器大小而设置的尺寸，并非实际尺寸）
		
		var img_info = {
			width: resW,
			height: resH
		};

		var rx = preW / coords.w;
		var ry = preH / coords.h;
		return {
			w: Math.round(rx * img_info.width),
			h: Math.round(ry * img_info.height),
			left: '-' + Math.round(rx * coords.x),
			top: '-' + Math.round(ry * coords.y)
		};
	},

	/**
	 * 重新设置缩略图的尺寸
	 */
	resizePreview: function( crop ){
		var region = crop.getCropCoords(),
		newPre = this.getPreviewResize({
			x: region.left,
			y: region.top,
			w: region.width,
			h: region.height
		}, this.newInfo.w, this.newInfo.h, this.preW, this.preH );
		
		this.preImg.attr( 'width', newPre.w );
		this.preImg.attr( 'height', newPre.h );
		this.preImg.css( 'left', newPre.left + 'px' );
		this.preImg.css( 'top', newPre.top + 'px' );
	},

	/**
	 * 重置裁剪区域
	 */
	reset: function(){
		if( this.preCrop ){
			this.preCrop.destroy();
			this.preCrop = null;
		}
		if( this.areaImg ){
			this.areaImg.removeAttr( 'src', '' );
			this.areaImg.removeAttr( 'width' );
			this.areaImg.removeAttr( 'height' );
			this.areaImg.hide();
		}
		if( this.preImg ){
			this.preImg.hide();
		}
	},

	/**
	 * 返回当前裁剪图片信息
	 * @return {Object} 
	 */
	getCropImgInfo: function(){
		if( this.preCrop ){
			var region = this.preCrop.getCropCoords();
			return {
				url: this.areaImg.attr( 'src' ),
				x: region.left,
				y: region.top,
				w: region.width,
				h: region.height
			};
		}
		else {
			return false;
		}
	}
});

});
