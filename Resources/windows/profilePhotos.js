var Defaults = 		require("defines");
var Funcs = 		require("lib/commonFuncs");
var TableFactory = 	require("lib/tableFactory");
var FB = 			require("lib/facebook");
var Profile = 		require("lib/profile");


var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;


Titanium.UI.iPhone.statusBarStyle = Titanium.UI.iPhone.StatusBar.TRANSLUCENT_BLACK;
win.barColor = "#000";
win.translucent = true;
win.title = "Photos";
win.backgroundColor = '#FFF';

var cameraButton = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.CAMERA,
	width:60
});

var editButton = Ti.UI.createButton({title:"Edit"});
win.rightNavButton = editButton;


cameraButton.addEventListener('click', function()
{
	Titanium.UI.createAlertDialog({title:'Button', message:'CAMERA'}).show();
});

// used to evenly distribute items on the toolbar
var flexSpace = Titanium.UI.createButton({
	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

win.toolbar = [flexSpace, cameraButton, flexSpace];