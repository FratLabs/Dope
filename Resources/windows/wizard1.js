var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = "Profile Wizard";
win.backgroundColor = '#FFF';

var l1 = Ti.UI.createLabel({
	top:50,
	width:160,
	height:'auto',
	color:'#666',
	font: { fontSize:15, fontWeight: "bold" },
	text: 'Photo'
});

var p1 = Ti.UI.createImageView({
	top:70,
	width:160,
	height:160,
	backgroundColor:"#666",
})


var actionSheet = Titanium.UI.createOptionDialog({
	options: ['Take a photo','Pick from camera roll', "Cancel"],
	cancel:2
});

var wizard2Window = Titanium.UI.createWindow({
	url: '/windows/wizard2.js',
	navGroup: win.navGroup
})

var nextButton = Ti.UI.createButton({title:"Next"});
nextButton.addEventListener("click", function () {
	win.navGroup.open(wizard2Window, {animated:true});

})
win.rightNavButton = nextButton;

var leftButton = Ti.UI.createButton({
	width:1,
	backgroundImage: "none",
	enabled: false,
});

win.leftNavButton = leftButton;

function saveImageToProfile(event) {
	var cropRect = event.cropRect;
	var image = event.media;

	// set image view
	Ti.API.debug('Our type was: '+event.mediaType);

	p1.image = image;

	Titanium.API.info('PHOTO GALLERY SUCCESS cropRect.x ' + cropRect.x + ' cropRect.y ' + cropRect.y  + ' cropRect.height ' + cropRect.height + ' cropRect.width ' + cropRect.width);

//	navGroup.parent.fullscreen = false;
//	Titanium.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
	navGroup.parent.show();
	
}

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
	}
})

p1.addEventListener("click", function() {
	actionSheet.show();
})

function updateLoginStatus() {
	alert('Logged In = ' + Titanium.Facebook.loggedIn);
}

// capture
Titanium.Facebook.addEventListener('login', updateLoginStatus);
Titanium.Facebook.addEventListener('logout', updateLoginStatus);

Titanium.Facebook.appid = "134793934930";
Titanium.Facebook.permissions = ['publish_stream', 'read_stream'];

win.add(Titanium.Facebook.createLoginButton({
	style:Ti.Facebook.BUTTON_STYLE_WIDE,
	bottom:30
}));

win.add(l1);
win.add(p1);


