(function() {
	Dope.UI.createSpottedWindow = function () {
		var win = Ti.UI.createWindow({
			title:"Spotted",
			backgroundColor:"#c5ccd4",
		});
		var cameraButton = Titanium.UI.createButton({
		    systemButton : Titanium.UI.iPhone.SystemButton.CAMERA,
		});
		var gpsButton = Titanium.UI.createButton({
		    title: "[GPS]",
			style: Ti.UI.iPhone.SystemButton.BORDERED
		});
		 

		
		var flexSpace = Titanium.UI.createButton({
		    systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		
		var cancelButton = Titanium.UI.createButton({
			title:"^",
			top:150,
			height:40,
			width:40,
			right:10,
		    systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
		});
	
		var sendButton = Titanium.UI.createButton({
			title:"Publish",
			style: Ti.UI.iPhone.SystemButton.OK
		});
		
		cancelButton.addEventListener("click", function () {
		//	Dope.closeModalWindow(win);
			win.textArea.blur();
			this.hide();
		})
		 
//		win.leftNavButton = cancelButton; 
		win.rightNavButton = sendButton;

		var textArea = Ti.UI.createTextArea({
			top:10,
			width:300,
			height:180,
			color:"#000",
			font: {fontSize:16, fontWeight:"normal"},
			backgroundColor:"#FFF",
		    borderWidth : 1,
		    borderColor : '#BBB',
		    borderRadius : 10,
//	        keyboardToolbar : [cameraButton, gpsButton, flexSpace],
//		    keyboardToolbarColor : '#999',
//		    keyboardToolbarHeight : 40,
		    suppressReturn:false
		})
		textArea.addEventListener("focus", function () {
			cancelButton.show();
		})
		
		win.add(textArea);

		cancelButton.hide();
		win.add(cancelButton);
		
		win.textArea = textArea;		
		win.addEventListener("open", function() {
//			setTimeout(function() {
//				textArea.focus();
//			}, 500);
		})
		

		var spottedWindow = Dope.UI.createNavigationGroupStack(win);

		Dope.UI.spottedWindow = spottedWindow;
		
		return spottedWindow;
		
	}
})()
