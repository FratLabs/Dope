var Defaults = require("defines");

exports.data = {};

exports.save = function() {
//	Ti.API.log("SAVING Profile.data TO SERVER");
//	Ti.API.log(exports.data);
	Ti.App.Properties.setString("profileData", JSON.stringify(exports.data));		
	// send it to server

	setTimeout(function () { // starting second thread
		var that = this;
	 
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
				
		    },
		    onerror: function(e) {
				alert(e.error);
		    },
		    timeout: Defaults.NETWORK_TIMEOUT * 1000
		});
		
		var url = Defaults.HTTP_SERVER_NAME 
			+ Defaults.PROFILE_SCRIPT_NAME 
			+ "?login="+ Ti.App.Properties.getString("login") 
			+ "&pass=" + Ti.App.Properties.getString("pass")
			+ "&action=save";		 
			
		Ti.API.log("URL:" + url);
		xhr.open("POST", url);
		xhr.send({data: JSON.stringify(exports.data)});	
	}, 0);	
}

exports.get = function() {
	
	if (Ti.App.Properties.hasProperty("profileData") && 
		Ti.App.Properties.getString("profileData").length) {
			
		Ti.API.log("serialized profile string " + Ti.App.Properties.getString("profileData"));
		exports.data = JSON.parse(Ti.App.Properties.getString("profileData"));
	} else {
		exports.data = {empty:true};
	}
		
	return exports.data;	
}
exports.getFromServer = function(options) {
	
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {

    		var data = JSON.parse(this.responseText);
    		if (! data.profile) {
				
    		} else {
	    		exports.data = data.profile;
	    		exports.hash_id = data.hash_id;
				exports.data.hash_id = data.hash_id;
	    		Ti.App.Properties.setString("profileData", JSON.stringify(data.profile));
    		}

//			Ti.API.log(data);

			if (options.success) {
				options.success(this, e);
			}
			
	    },
	    onerror: function(e) {
			if (options.error) {
				options.error(this, e);
			}
	    },
	    timeout: Defaults.NETWORK_TIMEOUT * 1000
	});
	
	var url = Defaults.HTTP_SERVER_NAME 
		+ Defaults.PROFILE_SCRIPT_NAME 
		+ "?login="+ Ti.App.Properties.getString("login") 
		+ "&pass=" + Ti.App.Properties.getString("pass")
		+ "&action=get";		 
		
	Ti.API.log("URL:" + url);
	xhr.open("GET", url);
	xhr.send();	
}

exports.getField = function (name) {
	if (typeof exports.data[name] != "undefined")
		return exports.data[name]
	else
		return "";
}

exports.setField = function (name, value) {
	exports.data[name] = value;
}

exports.getPhotos = function(options) {
	if (! options)
		options = {};
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {

    		var data = JSON.parse(this.responseText);
    		if (! data.photos) {
				
    		} else {
	    		exports.photos = data.photos;
//	    		Ti.App.Properties.setString("profileData", data.profile);
    		}

//			Ti.API.log(data);

			if (options.success) {
				options.success(this, data.photos);
			}
			
	    },
	    onerror: function(e) {
			if (options.error) {
				options.error(this, e);
			}
	    },
	    timeout: Defaults.NETWORK_TIMEOUT * 1000
	});
	
	var url = Defaults.HTTP_SERVER_NAME 
		+ Defaults.PROFILE_SCRIPT_NAME 
		+ "?login="+ Ti.App.Properties.getString("login") 
		+ "&pass=" + Ti.App.Properties.getString("pass")
		+ "&action=getPhotos";		 
		
	Ti.API.log("URL:" + url);
	xhr.open("GET", url);
	xhr.send();		
}

exports.deletePhotoWithIndex = function (index, options) {
	if (! options)
		options = {};
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {

    		var data = JSON.parse(this.responseText);
    		if (! data.photos) {
				
    		} else {
	    		exports.photos = data.photos;
    		}

//			Ti.API.log(data);

			if (options.success) {
				options.success(this, data.photos);
			}
			
	    },
	    onerror: function(e) {
			if (options.error) {
				options.error(this, e);
			}
	    },
	    timeout: Defaults.NETWORK_TIMEOUT * 1000
	});
	
	var url = Defaults.HTTP_SERVER_NAME 
		+ Defaults.PROFILE_SCRIPT_NAME 
		+ "?login="+ Ti.App.Properties.getString("login") 
		+ "&pass=" + Ti.App.Properties.getString("pass")
		+ "&action=delPhoto"
		+ "&index="+index;		 
		
	Ti.API.log("URL:" + url);
	xhr.open("GET", url);
	xhr.send();	
}

exports.uploadPhoto = function (data, options) {
	if (! options)
		options = {};
	Ti.API.log(options);
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {

    		var data = JSON.parse(this.responseText);

//			Ti.API.log(data);
    		if (! data.photos) {
				
    		} else {
	    		exports.photos = data.photos;
    		}
    		
			if (options.success) {
				options.success(this, data.photos);
			}
			
	    },
	    onerror: function(e) {
			if (options.error) {
				options.error(this, e);
			}
	    },
	    onsendstream: function (e) {
			if (options.progress) {
				options.progress(this, e);
			}
	    },
	    timeout: Defaults.NETWORK_TIMEOUT * 10000
	});
	
	var url = Defaults.HTTP_SERVER_NAME 
		+ Defaults.PROFILE_SCRIPT_NAME 
		+ "?login="+ Ti.App.Properties.getString("login") 
		+ "&pass=" + Ti.App.Properties.getString("pass")
		+ "&action=savePhoto";
		
	Ti.API.log("URL:" + url);
	xhr.open("POST", url);
	xhr.send({"photo":data});		
}

exports.uploadAvatar = function (data) {
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
    		var data = JSON.parse(this.responseText);
	    },
	    onerror: function(e) {
	    },
	    timeout: Defaults.NETWORK_TIMEOUT * 10000
	});
	
	var url = Defaults.HTTP_SERVER_NAME 
		+ Defaults.PROFILE_SCRIPT_NAME 
		+ "?login="+ Ti.App.Properties.getString("login") 
		+ "&pass=" + Ti.App.Properties.getString("pass")
		+ "&action=saveAvatar";
		
	Ti.API.log("URL:" + url);
	xhr.open("POST", url);
	xhr.send({"avatar": data});		
}

function _saveImageToProfile (event) {
	var cropRect = event.cropRect;
	var image = event.media;

	var p1 = Ti.UI.createImageView({
		width:200,
		height:200
	})
	p1.image = image;

	Ti.API.info('PHOTO GALLERY SUCCESS cropRect.x ' + cropRect.x + ' cropRect.y ' + cropRect.y  + ' cropRect.height ' + cropRect.height + ' cropRect.width ' + cropRect.width);

	// resizing pic from camera (iPhone only)
	var blob = p1.toImage();
	blob = blob.imageAsResized (Defaults.MAX_PHOTO_WIDTH, Defaults.MAX_PHOTO_HEIGHT);

//	Ti.API.log("save picture to temp");
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory ,'wiz1.jpg');
	if (! f.exists())
		f.createFile();
    f.write(blob);
    
    exports.uploadAvatar(blob);

	Titanium.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
	return blob;
}

exports.updateAvatar = function (options) {
	var optionsDialogNoFB = ['Take a photo','Pick from camera roll', "Cancel"];
	var optionsDialogFB = ['Take a photo','Pick from camera roll', "Pick from Facebook", "Cancel"]

	if (FB.data.id) {
		options["facebook"] = true;
	}

	var actionSheet = Titanium.UI.createOptionDialog({
		options: (options.facebook?optionsDialogFB:optionsDialogNoFB),
		cancel:(options.facebook?3:2)
	});	
	
	actionSheet.addEventListener("click", function (event) {
//		Ti.API.log("clicked button in actionsheet " + event.index);	
		if (event.index == 0) {
	
			Titanium.Media.showCamera({
	
				saveToPhotoGallery: true,
				allowEditing: true,
				mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
				success: function (event) {
					var blob = _saveImageToProfile(event);
					
					if (options.success) {
						options.success(blob);
					}
				},
				cancel:function() {
					Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
				},
				error: function(error) {
					// create alert
					var a = Titanium.UI.createAlertDialog({title:'Camera'});
			
					// set message
					if (error.code == Titanium.Media.NO_CAMERA) {
						a.setMessage('No camera');
					} else {
						a.setMessage('Unexpected error: ' + error.code);
					}
			
					// show alert
					a.show();
					Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
				},
			});	
		
		} else if (event.index == 1) {
			Ti.Media.openPhotoGallery({
				allowEditing: true,
				mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
				success: function (event) {
					var blob = _saveImageToProfile(event);
					
					if (options.success) {
						options.success(blob);
					}
				},
				cancel: function() {
					Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
				},
				error: function(error) {
					Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
				},
			});
		} else if (event.index == 2 && actionSheet.options.length == 4) {
//			spinner.show();
			if (options.downloadStarted)
				options.downloadStarted();
				
			if (! FB.data.id) {
				Ti.Facebook.authorize();
				function f () {
					FB.getFromServer(function (blob) {
						options.success(blob);
					});
					Ti.Facebook.removeEventListener("login", f);			
				}		
				Ti.Facebook.addEventListener('login', f)
			} else {
				FB.downloadPic(FB.data.id, "large", options.success);
			}
		}
	})
	actionSheet.show();	
}

exports.updateLocation = function (lon, lat, options) {

	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {

    		var data = JSON.parse(this.responseText);

//			Ti.API.log(data);
    		
			if (options.success) {
				options.success(this, data);
			}
			
	    },
	    onerror: function(e) {
			if (options.error) {
				options.error(this, e);
			}
	    },
	    timeout: Defaults.NETWORK_TIMEOUT * 10000
	});
	
	var url = Defaults.HTTP_SERVER_NAME 
		+ Defaults.PROFILE_SCRIPT_NAME 
		+ "?login="+ Ti.App.Properties.getString("login") 
		+ "&pass=" + Ti.App.Properties.getString("pass")
		+ "&action=updateLocation";
		
	Ti.API.log("URL:" + url);
	xhr.open("POST", url);
	xhr.send({"lon":lon, "lat":lat});	
	
}

exports.parseFacebookProfile = function (fb) {
	if (typeof fb == "undefined") {
		if (Ti.App.Properties.hasProperty("dataFromFacebook") && 
			Ti.App.Properties.getString("dataFromFacebook").length ) {
			
			var fbData = JSON.parse(Ti.App.Properties.getString("dataFromFacebook"));
		} else {
			var fbData = {empty:true};		
		}
	} else {
		var fbData = fb;
	}
	var profileData = {};
	
	profileData["Name"] = fbData["name"];
	
	if (fbData["gender"] == "male") {
		profileData["Gender"] = 0;
	} else if (fbData["gender"] == "female") {
		profileData["Gender"] = 1;
	}
	
	// relationship_statuses
	// Single, In a relationship, Engaged, Married, It's complicated, In an open relationship, Widowed, Separated, Divorced, In a civil union, In a domestic partnership
	
	if (fbData["relationship_status"] == "Married" || 
		fbData["relationship_status"] == "In a relationship") {
		
		profileData["Relationship"] = 1;		
	
	} else if (fbData["relationship_status"] == "Single") {
		
		profileData["Relationship"] = 0;
		
	}

//	Ti.API.log(profileData);
	exports.data = profileData;
	exports.save(profileData);

	return profileData;
}

