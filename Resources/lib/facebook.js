var Defaults = require("defines");

Ti.Facebook.appid = Defaults.FB_ID;
Ti.Facebook.permissions = Defaults.FB_PERM;

exports.data = {};

exports.downloadPic = function (data_id, type, success_callback) {
//	Ti.API.log("created httpclient");
	var resize = false;
	if (typeof type == "undefined") {
		type = "large";
	}
	if (type == "large")
		resize = true;		


	var pictureUrl = "http://graph.facebook.com/" + data_id + "/picture?type=" + type;	        
	Ti.API.log("pictureUrl: " + pictureUrl);

	var httpClient = Ti.Network.createHTTPClient({
	    timeout: Defaults.NETWORK_TIMEOUT * 1000,
	    onerror: function(e) {
	    	Ti.API.log(e);
	        alert(e.error);
	    },
	    onload: function(e) {
			Ti.API.log("picture downloaded");
			var blob = httpClient.responseData;
//			Ti.API.log("data length " + blob.length);
			
			var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory ,'wiz1.jpg');
			if (! f.exists())
				f.createFile();
	
			if (resize)
				blob = Dope.Utils.imageUniversalResize(blob, Defaults.MAX_PHOTO_WIDTH, Defaults.MAX_PHOTO_HEIGHT);	
					        
	        f.write(blob);
	        Profile.uploadAvatar(blob);
	        
	        if (typeof success_callback != "undefined") 
	        	success_callback(blob);
	    }
	});

	httpClient.open("GET", pictureUrl);
	httpClient.send();			
}
exports.getFromLocal = function () {
	if (Ti.App.Properties.hasProperty("dataFromFacebook") && 
		Ti.App.Properties.getString("dataFromFacebook").length) {
		exports.data = JSON.parse(Ti.App.Properties.getString("dataFromFacebook"))
	} else {
		exports.data = {empty:true}
	}
	return exports.data;		
}

exports.getFromServer = function(callback) {
	Ti.API.log("requesting profile data from facebook");
 	Titanium.Facebook.requestWithGraphPath('me', {}, 'GET', function(e) {
	    if (e.success) {
	        Ti.API.log("storing the data for future");
	        var data = JSON.parse(e.result);

	        Ti.App.Properties.setString("dataFromFacebook", e.result);
			exports.data = data;
			
			exports.downloadPic(data.id, "large", function (blob) {
				if (typeof callback != "undefined") {
					callback(blob, "success");
				}
			});

	    } else if (e.error) {
			if (typeof spinner != "undefined")
				spinner.hide();
	        alert(e.error);
	    } else {
			if (typeof spinner != "undefined")
				spinner.hide();
	        alert('Unknown response');
	    }
	});

}

