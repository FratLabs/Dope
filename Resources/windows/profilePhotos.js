(function () {
	Dope.UI.createProfilePhotosWindow = function() {

		var pWidth = Ti.Platform.displayCaps.platformWidth;
		var thumbSize = Math.round( (pWidth - (Defaults.PHOTOS_TABLE_PADDING * (Defaults.PHOTOS_IN_LIST+1))) / Defaults.PHOTOS_IN_LIST);
		var initialPos = {x: Defaults.PHOTOS_TABLE_PADDING, y: Defaults.PHOTOS_TABLE_PADDING + 44};
		var pos = initialPos;
		var photoArray = [];
		
		var win = Ti.UI.createWindow({
			title:"Photos",
			translucent: true,
//			barColor:"#000",
			backgroundColor:"#FFF",
			
		})
		win.longClick = false;
		
		function createThumb(photos, i, pos) {
			var thumb = Ti.UI.createImageView({
//				text: "[" + i + "]",
				index: i,
				color:"#FFF",
				backgroundColor:"#000",
//				backgroundColor:"#" + Math.round(Math.random()*9) + "" + Math.round(Math.random()*9) + "" + Math.round(Math.random()*9) ,
				width: thumbSize,
				height: thumbSize,
				top: pos.y,
				left: pos.x,
				textAlign:"center",
				borderColor: "#AAA",
				borderWidth: 1
			})
			var imgSrc = Defaults.HTTP_SERVER_NAME + "/" + photos.thumbFolder + "/" + photos.list[i].thumbName;
			
//			Ti.API.log("imgSrc:" + imgSrc);
			thumb.image = imgSrc;
			
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
		
		function addNewThumb(photos) {
			

			var list = photos.list;
			var newCount = list.length;
			var curCount = list.length-1;
			
			var pos = {x:Defaults.PHOTOS_TABLE_PADDING,y:Defaults.PHOTOS_TABLE_PADDING};
			pos.y = (Math.floor(curCount / Defaults.PHOTOS_IN_LIST)) * (thumbSize+Defaults.PHOTOS_TABLE_PADDING) + Defaults.PHOTOS_TABLE_PADDING + 44;
			pos.x = (curCount - Math.floor(curCount / Defaults.PHOTOS_IN_LIST)*Defaults.PHOTOS_IN_LIST) * (thumbSize+Defaults.PHOTOS_TABLE_PADDING) + Defaults.PHOTOS_TABLE_PADDING;
			Ti.API.log(pos);
			var thumb = createThumb(photos, list.length-1, pos);

			photoArray.push(thumb);
			scrollView.add(thumb);

			footerLabel.top = photoArray[photoArray.length-1].top + Defaults.PHOTOS_TABLE_PADDING + thumbSize;
			scrollView.contentHeight = footerLabel.top + 50;
		}				
		
		function uploadPhoto(data) {
			Profile.uploadPhoto(data, {
				success: function (xhr, photos) {
					Ti.API.log("UPLOADED");
					ind.hide();
					addNewThumb(photos);
				},
				error: function (xhr, e) {
					ind.hide();
					alert(e.error);
				},
				progress: function (xhr, e) {
					ind.value = e.progress;
					Ti.API.log("UPLOAD PROGRESS: "+ e.progress);
				}
			});
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
				
				Profile.deletePhotoWithIndex(win.deletePhoto.index, {
					success: function() {
						
						win.deletePhoto.hide();
						
						var newCoords = {};

//						Ti.API.log("collecting old coords");
						for (var i = win.deletePhoto.index+1; i < photoArray.length; i++) {
							var pp = photoArray[i-1];
							newCoords[i] = {top: pp.top,left: pp.left} 
						}
		
						for (var i = win.deletePhoto.index+1; i < photoArray.length; i++) {
							photoArray[i].index = i-1;
							
							var p = photoArray[i];
//							Ti.API.log(p.index);
							p.animate({
								top:  newCoords[i].top,
								left: newCoords[i].left,
								duration: 200
							});
				
						}
						
						setTimeout(function() {
							for (var i = win.deletePhoto.index+1; i < photoArray.length; i++) {
								var p = photoArray[i];
								p.top = newCoords[i].top;
								p.left = newCoords[i].left;
							}
							photoArray.splice(win.deletePhoto.index, 1);
							if (photoArray.length) {
								footerLabel.top = photoArray[photoArray.length-1].top + Defaults.PHOTOS_TABLE_PADDING + thumbSize;
							} else {
								footerLabel.hide();
							}
						}, 300);

					},
					error: function (xhr, e) {
						Ti.API.log("photos delete: error");
						alert(e.error);	
					}
				});

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
		
					success: function (event) {
						Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
						
						ind.show();
						
						uploadPhoto(event.media);
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
					
					success: function (event) {
						Ti.UI.iPhone.statusBarStyle = Ti.UI.iPhone.StatusBar.DEFAULT;
						ind.show();
						uploadPhoto(event.media);
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
		footerLabel.hide();


		Profile.getPhotos({
			success: function (xhr, photos) {
				Ti.API.log(photos);

				var count = photos.list.length;
				var line = 0;
		
				for (var i = 0; i < count; i++) {
					
					if (line == Defaults.PHOTOS_IN_LIST) {
						pos.y += thumbSize + Defaults.PHOTOS_TABLE_PADDING;
						pos.x = Defaults.PHOTOS_TABLE_PADDING;
						line = 0;
					}
		
					var thumb = createThumb(photos, i, pos);
					line ++;
					pos.x += thumbSize + Defaults.PHOTOS_TABLE_PADDING;		
		
					photoArray.push(thumb);
		
					scrollView.add(thumb);
				}
				if (count > 0) {
					footerLabel.top = photoArray[photoArray.length-1].top + Defaults.PHOTOS_TABLE_PADDING + thumbSize;
					scrollView.contentHeight = footerLabel.top + 50;

					footerLabel.show();
				} else {
					
				}
		
			},
			error: function (xhr, e) {
				Ti.API.log("profile photos: error");
				alert(e.error);	
			}
		
		})
		
		win.add(scrollView);
		scrollView.contentHeight = pos.y + Defaults.PHOTOS_TABLE_PADDING + thumbSize + 50;

		var ind = Titanium.UI.createProgressBar({
		    width:200,
		    height:50,
		    bottom:20,
		    min:0,
		    max:1,
		    value:0,
		    style:Titanium.UI.iPhone.ProgressBarStyle.PLAIN,
		    message:'Uploading image',
		    font:{fontSize:14, fontWeight:'normal'},
		    color:'#000'
		});
		win.add(ind);

		return win;
	}	
})();




