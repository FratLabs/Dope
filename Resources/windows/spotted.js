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
			style: Ti.UI.iPhone.SystemButtonStyle.BORDERED
		});
		 
		var sendButton = Titanium.UI.createButton({
			title:"Send",
			style: Ti.UI.iPhone.SystemButtonStyle.BAR
		});
		
		var flexSpace = Titanium.UI.createButton({
		    systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});
		
		var cancelButton = Titanium.UI.createButton({
			title:"Cancel",
		    systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
		});
		cancelButton.addEventListener("click", function () {
			Dope.closeModalWindow(win);
		})
		 
		 win.rightNavButton = cancelButton; 

		var textArea = Ti.UI.createTextArea({
			top:10,
			width:300,
			height:140,
			color:"#000",
			font: {fontSize:16, fontWeight:"normal"},
			backgroundColor:"#FFF",
		    borderWidth : 1,
		    borderColor : '#BBB',
		    borderRadius : 10,
	        keyboardToolbar : [cameraButton, gpsButton, flexSpace, sendButton],
//		    keyboardToolbarColor : '#999',
		    keyboardToolbarHeight : 40,
		    suppressReturn:false
		})
		win.add(textArea);
		
		win.textArea = textArea;		
		win.addEventListener("open", function() {
			setTimeout(function() {
				textArea.focus();
			}, 500);
		})
		

		var spottedWindow = Dope.UI.createNavigationGroupStack(win, {modal:true});

		Dope.UI.spottedWindow = spottedWindow;
		
		return spottedWindow;
		
	}
})()
