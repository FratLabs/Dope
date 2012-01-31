var Defaults = require("defines");


exports.universalResize = function (blob, targetWidth, targetHeight) {

	var deltaW = 0;
	var deltaH = 0;
	var w = targetWidth;
	var h = targetHeight;
	
	if (blob.width > blob.height) {
		w = w * (blob.width / blob.height);
		deltaW = (w - targetWidth) / 2 * -1;
	} else {
		h = h * (blob.height / blob.width);
		deltaH = (h - targetHeight) / 2 * -1;
	}
	
	Ti.API.log("h: " + blob.height + " w: " + blob.width);
	Ti.API.log("resultingH: " + h + " resultingW: " + w);
	Ti.API.log("deltaH: " + deltaH + " deltaW: " + deltaW);
	
    var i1 = Ti.UI.createImageView({
    	image: blob,
    	width: w,
    	height: h,
    	top: deltaH,
    	left: deltaW,
    });
    var i2 = Ti.UI.createView({
    	width: targetWidth,
    	height: targetHeight,
    })
    i2.add(i1);
    
    return i2.toImage();
}
