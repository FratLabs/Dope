(function () {
	Dope.UI.createProfilePhotosWindow = function() {

		var win = Ti.UI.createWindow({
			title:"Photos",
			translucent: true,
//			barColor:"#000",
			backgroundColor:"#FFF",
			
		})
		win.longClick = false;
		
		function createThumb(i, pos) {
			var thumb = Ti.UI.createLabel({
				text: "[" + i + "]",
				index: i,
				color:"#FFF",
				backgroundColor:"#" + Math.round(Math.random()*9) + "" + Math.round(Math.random()*9) + "" + Math.round(Math.random()*9) ,
				width: thumbSize,
				height: thumbSize,
				top: pos.y,
				left: pos.x,
				textAlign:"center",
				borderColor: "#AAA",
				borderWidth: 1
			})
			thumb.addEventListener("touchstart", function() {
				this.opacity = 0.5;
			})
			thumb.addEventListener("touchend", function() {
				this.opacity = 1;
				if (! win.longClick) {
					Ti.include("windows/profilePhotoFullscreen.js");
					var photoFullscreenWindow = Dope.UI.createProfilePhotoFullscreenWindow(thumb.index);

					Dope.openWindow(win, photoFullscreenWindow);
				}
				win.longClick = false;
			})
			thumb.addEventListener("touchcancel", function() {
				this.opacity = 1;
				win.longClick = false;
			})
			thumb.addEventListener("longpress", function() {
				win.deletePhoto = this;
				actionSheet2.show();
				win.longClick = true;
			})	
			return thumb;
		}

		var cameraButton = Titanium.UI.createButton({
			title:"Add",
			systemButton:Titanium.UI.iPhone.SystemButton.ADD,
		});
		
		var optionsDialog = ['Take a photo','Pick from camera roll', "Cancel"];
		
		var actionSheet = Titanium.UI.createOptionDialog({
			options: optionsDialog,
			cancel:2
		});
		var actionSheet2 = Titanium.UI.createOptionDialog({
			options: ["Delete Photo", "Cancel"],
			destructive:0,
			cancel:1
		});
		actionSheet2.addEventListener("click", function (event) {
			win.deletePhoto.opacity = 1;
			if (event.index == 0) {
				Ti.API.log("photo to delete: " + win.deletePhoto.index);
				
				win.deletePhoto.hide();
				
				var newCoords = {};

//				Ti.API.log(photoArray);

				Ti.API.log("collecting old coords");
				for (var i = win.deletePhoto.index+1; i < photoArray.length; i++) {
					var pp = photoArray[i-1];
					newCoords[i] = {top: pp.top,left: pp.left} 
				}
				Ti.API.log(newCoords);
				
//				Ti.API.log("old length:" + photoArray.length);

				for (var i = win.deletePhoto.index+1; i < photoArray.length; i++) {
					photoArray[i].index = i-1;
					photoArray[i].text = "["+(i-1)+"]";
					
					var p = photoArray[i];
					Ti.API.log(p.index);
					p.animate({
						top:  newCoords[i].top,
						left: newCoords[i].left,
						duration: 200
					});
//					p.top = newCoords[i].top;
//					p.left = newCoords[i].left;
//					photoArray[i-1] = p;					
				}
				
				setTimeout(function() {
					for (var i = win.deletePhoto.index+1; i < photoArray.length; i++) {
						var p = photoArray[i];
						p.top = newCoords[i].top;
						p.left = newCoords[i].left;
					}
					photoArray.splice(win.deletePhoto.index, 1);

					footerLabel.top = photoArray[photoArray.length-1].top + Defaults.PHOTOS_TABLE_PADDING + thumbSize;

				}, 300);

//				win.deletePhoto = null;
			}
		});

		cameraButton.addEventListener('click', function()
		{
//			Titanium.UI.createAlertDialog({title:'Button', message:'CAMERA'}).show();
			actionSheet.show();
		});
		
		actionSheet.addEventListener("click", function (event) {
			Ti.API.log("clicked button in actionsheet " + event.index);	
			if (event.index == 0) {
		
				Titanium.Media.showCamera({
		
					saveToPhotoGallery: true,
//					allowEditing: true,
					mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
		
					success: function () {
						Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
					}, 
					cancel: function() {
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
//					allowEditing: true,
					mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
					
					success: function () {
						Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
						
					}, 
					cancel: function() {
						Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
					},
					error: function(error) {
						Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
					},
				});
			} else {

			}
		})
		
		win.rightNavButton = cameraButton;

		var scrollView = Ti.UI.createScrollView({
			contentWidth:'auto',
    		contentHeight:'auto',
    		top:0,
    		showVerticalScrollIndicator:false,
    	});

		var pWidth = Ti.Platform.displayCaps.platformWidth;
		var thumbSize = Math.round( (pWidth - (Defaults.PHOTOS_TABLE_PADDING * (Defaults.PHOTOS_IN_LIST+1))) / Defaults.PHOTOS_IN_LIST);
		var pos = {x: Defaults.PHOTOS_TABLE_PADDING, y: Defaults.PHOTOS_TABLE_PADDING + 44};
		
		var count = 27;
		var line = 0;
		var photoArray = [];

		for (var i = 0; i < count; i++) {
			
			if (line == Defaults.PHOTOS_IN_LIST) {
				pos.y += thumbSize + Defaults.PHOTOS_TABLE_PADDING;
				pos.x = Defaults.PHOTOS_TABLE_PADDING;
				line = 0;
			}

			var thumb = createThumb(i, pos);
			line ++;
			pos.x += thumbSize + Defaults.PHOTOS_TABLE_PADDING;		

			photoArray.push(thumb);

			scrollView.add(thumb);
		}

		if (count > 0) {
			var footerLabel = Ti.UI.createLabel({
				height:40,
				width:200,
				textAlign:"center",
				color:"#000",
				font: {fontSize:14, fontWeight:"normal"},
				top: pos.y + Defaults.PHOTOS_TABLE_PADDING + thumbSize,
				text: "Long tap to delete"
			}) 
			scrollView.add(footerLabel);
		} else {
			
		}
		
		win.add(scrollView);
		scrollView.contentHeight = pos.y + Defaults.PHOTOS_TABLE_PADDING + thumbSize + 50;


		return win;
	}	
})();




