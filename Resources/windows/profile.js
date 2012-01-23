var Defaults = require("defines");

var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = "Profile";
win.backgroundColor = '#FFF';


var editButton =  Ti.UI.createButton({title: "Edit"});
var closeButton = Ti.UI.createButton({title:"Close"});

win.leftNavButton =  editButton;
win.rightNavButton = closeButton;

closeButton.addEventListener("click", function (e) {
	win.close();
	
})

var wizardButton = Ti.UI.createButton ({
	top:50,
	width:200,
	height:40,
	title:"Run Wizard"
})

wizardButton.addEventListener("click", function() {
	Ti.API.log("run profile wizard!");
	
	var wizardWindow = Ti.UI.createWindow({
		navBarHidden: true,
		modal : true,
		modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
	});
	
	var wizardStep1Window = Ti.UI.createWindow({
		url: '/windows/wizard1.js',
	});
	
	var wizardNavigationGroup = Ti.UI.iPhone.createNavigationGroup({
	   window: wizardStep1Window
	});
	
	wizardStep1Window.navGroup = wizardNavigationGroup;
	
	wizardWindow.add(wizardNavigationGroup);

	wizardWindow.open();
});

var logoutButton = Ti.UI.createButton ({
	top:100,
	width:200,
	height:40,
	title:"Log Out"
})

logoutButton.addEventListener("click", function() {
	
	Ti.API.log("loggin out");	
	
	Ti.App.Properties.setString("login", "");
	Ti.App.Properties.setString("pass", "");

	closeButton.fireEvent("click");
	setTimeout(function() {
		Ti.App.fireEvent("relogin");
	}, 1000);
})

win.add(wizardButton);
win.add(logoutButton);
