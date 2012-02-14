var Dope = {
	datetime: {},
    UI: {},
    __isLargeScreen: undefined,
    __isAndroid: undefined,
    navGroup: undefined
};

(function() {
	Dope.extend = function(obj) {
	    var args = Array.prototype.slice.call(arguments, 1);
	    for (var i = 0; i < args.length; i++) {
	    	var source = args[i];
	      	for (var prop in source) {
	        	if (source[prop] !== void 0) obj[prop] = source[prop];
	      	}
	    }
	    return obj;
	};
	
	Dope.isLargeScreen = function() {
		if (Dope.__isLargeScreen === undefined) {
			Dope.__isLargeScreen = (Ti.Platform.displayCaps.platformWidth >= 600);
		}
		return Dope.__isLargeScreen;
	};
	
	Dope.isAndroid = function() {
		if (Dope.__isAndroid === undefined) {
			Dope.__isAndroid = (Ti.Platform.osname == 'android');
		}
		return Dope.__isAndroid;
	}
	
	Dope.cleanSpecialChars = function(str) {
  		if (str == null) {
    		return '';
  		}
  		if (typeof str === 'string') {
    		return  str
      			.replace(/&quot;/g,'"')
      			.replace(/\&amp\;/g,"&")
      			.replace(/&lt;/g,"<")
      			.replace(/&gt;/g,">")
      			.replace(/&#039;/g, "'");
  		}
  		return '';
	};
	
	Dope.Utils = {};
	
	Dope.Utils.imageUniversalResize = function (blob, targetWidth, targetHeight) {

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

})();