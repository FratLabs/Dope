
(function () {

	Dope.UI.createWizardWindow = function() {
		var win = Ti.UI.createWindow({
			title: "Profile Wizard",
			backgroundColor:"#c5ccd4",
			
		})	

		var nextButton = Ti.UI.createButton({
			title:"Next",
			enabled: false
		});
		
		var leftButton = Ti.UI.createButton({
			width:1,
			backgroundImage: "none",
			enabled: false,
		});
		
		nextButton.addEventListener("click", function () {
			Ti.API.log("store the data");
			//win.navGroup.open(wizard2Window, {animated:true});
		
		})

		win.rightNavButton = nextButton;
		win.leftNavButton = leftButton;
				
		// INTERFACE COMPONENTS
		
		var l1 = Ti.UI.createLabel({
			text: "Photo",
			top:45,
			width:190,
			height:'auto',
			font: { fontSize:20, fontWeight: "bold" },
			color: Dope.UI.tableHintColor,
			shadowColor: Dope.UI.tableHintShadowColor,
			shadowOffset: {x:0,y:2},
		});
		
		var p1 = Ti.UI.createImageView({
			
			top:70,
			width:200,
			height:200,
			backgroundColor:"#FFF",
		    borderWidth : 1,
		    borderColor : '#BBB',
		    borderRadius : 10,
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

		function saveImageToProfile (event) {
			var cropRect = event.cropRect;
			var image = event.media;
		
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
		    Profile.uploadAvatar(blob);
			        	
		//	navGroup.parent.fullscreen = false;
			Titanium.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
//			navGroup.parent.show();
			nextButton.enabled = true;

		}
// 		
		function profilePicCallback(blob) {
			p1.image = blob;

			nextButton.enabled = true;
			
			Profile.parseFacebookProfile(FB.data)

			spinner.hide();
		}
// 		
		actionSheet.addEventListener("click", function (event) {
			Ti.API.log("clicked button in actionsheet " + event.index);	
			if (event.index == 0) {
		
				Titanium.Media.showCamera({
		
					saveToPhotoGallery: true,
					allowEditing: true,
					mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
					success: saveImageToProfile, 
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
					
					success: saveImageToProfile,
					cancel: function() {
						Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
					},
					error: function(error) {
						Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
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
// 		
// 				
		win.add(Titanium.Facebook.createLoginButton({
			style:Ti.Facebook.BUTTON_STYLE_WIDE,
			bottom:30
		}));
// 		
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
// 		
		nextButton.addEventListener("click", function() {
			Ti.include("windows/wizard2.js");
			
			var editWin = Dope.UI.createProfileEditWindow();
			editWin.backButtonTitle = "Step 1";

//			editWin.rightNavButton = null;
			
			Dope.openWindow(win, editWin);
		});

		win.add(l1);
		win.add(p1);
		win.add(spinner);		
		
		return win;
	}
})()
