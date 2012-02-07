var Defaults = 	require("defines");
var Funcs = 	require("lib/commonFuncs");
var FB = 		require("lib/facebook");
var Profile = 	require("lib/profile");


// PRIVATE FUNCTIONS

function saveImageToProfile (event) {
	var cropRect = event.cropRect;
	var image = event.media;

	// set image view
//	Ti.API.debug('Our type was: '+event.mediaType);

	p1.image = image;

	Ti.API.info('PHOTO GALLERY SUCCESS cropRect.x ' + cropRect.x + ' cropRect.y ' + cropRect.y  + ' cropRect.height ' + cropRect.height + ' cropRect.width ' + cropRect.width);


	// resizing pic from camera (iPhone only)
	var blob = p1.toImage();
	blob = blob.imageAsResized (Defaults.MAX_PHOTO_WIDTH, Defaults.MAX_PHOTO_HEIGHT);

	Ti.API.log("save picture to temp");
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory ,'wiz1.jpg');
	if (! f.exists())
		f.createFile();
    f.write(blob);
	        	
//	navGroup.parent.fullscreen = false;
//	Titanium.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
	navGroup.parent.show();
}

function profilePicCallback(blob) {
	p1.image = blob;
	spinner.hide();
	
	Profile.parseFacebookProfile(FB.data)
}

// INTERFACE COMPONENTS

var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = "Profile Wizard";
win.backgroundColor = '#FFF';

var l1 = Ti.UI.createLabel({
	top:50,
	width:200,
	height:'auto',
	color:'#666',
	font: { fontSize:15, fontWeight: "bold" },
	text: 'Photo'
});

var p1 = Ti.UI.createImageView({
	top:70,
	width:200,
	height:200,
	backgroundColor:"#666",
})
var spinner = Ti.UI.createActivityIndicator({
	center: {y:300},
	width:30,
	height:30,
	style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK
});

var optionsDialogNoFB = ['Take a photo','Pick from camera roll', "Cancel"];
var optionsDialogFB = ['Take a photo','Pick from camera roll', "Pick from Facebook", "Cancel"]
var actionSheet = Titanium.UI.createOptionDialog({
	options: optionsDialogNoFB,
	cancel:2
});

var wizard2Window = Titanium.UI.createWindow({
	url: '/windows/wizard2.js',
	navGroup: win.navGroup
})

var nextButton = Ti.UI.createButton({title:"Next"});

var leftButton = Ti.UI.createButton({
	width:1,
	backgroundImage: "none",
	enabled: false,
});

// UI EVENT HANDLERS

nextButton.addEventListener("click", function () {
	Ti.API.log("store the data");
	win.navGroup.open(wizard2Window, {animated:true});

})


actionSheet.addEventListener("click", function (event) {
	Ti.API.log("clicked button in actionsheet " + event.index);	
	if (event.index == 0) {

		Titanium.Media.showCamera({

			saveToPhotoGallery: true,
			allowEditing: true,
			mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],

			success: saveImageToProfile, 

			cancel:function() {
				navGroup.parent.fullscreen = false;
				Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
				navGroup.parent.show();
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
				navGroup.parent.fullscreen = false;
				Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
				navGroup.parent.show();
			},
		});	
	
	} else if (event.index == 1) {
		navGroup.parent.hide();
		Ti.Media.openPhotoGallery({
			allowEditing: true,
			mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
			
			success: saveImageToProfile,
			cancel: function() {
				navGroup.parent.fullscreen = false;
				Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
				navGroup.parent.show();
			},
			error: function(error) {
				navGroup.parent.fullscreen = false;
				Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
				navGroup.parent.show();
			},
		});
	} else if (event.index == 2 && actionSheet.options.length == 4) {
		spinner.show();
		FB.downloadPic(FB.data.id, "large", profilePicCallback);
	}
})

p1.addEventListener("click", function() {
	actionSheet.show();
})


// FACEBOOK EVENT HANDLERS

//Ti.Facebook.addEventListener('logout', updateLoginStatus);

Ti.Facebook.addEventListener('login', function(e) {
//	alert('Logged In = ' + Titanium.Facebook.loggedIn);
    if (e.success) {
    	
    	spinner.show ();
		FB.getFromServer(profilePicCallback);  
    	
    	actionSheet.options = optionsDialogFB;
    	actionSheet.cancel = 3;
    } else if (e.error) {
        alert(e.error);
    } else if (e.cancelled) {
//        alert("Cancelled");
    }
});

/*
if (Titanium.Facebook.loggedIn) {
	
	spinner.show();
	
	FB.getFromServer(profilePicCallback);
	
	actionSheet.options = optionsDialogFB;
	actionSheet.cancel = 3;
}
*/

win.add(Titanium.Facebook.createLoginButton({
	style:Ti.Facebook.BUTTON_STYLE_WIDE,
	bottom:30
}));


//spinner.hide();
win.add(l1);
win.add(p1);
win.add(spinner);

win.rightNavButton = nextButton;
win.leftNavButton = leftButton;



