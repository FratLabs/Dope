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

var emailLabel = Ti.UI.createLabel({
	top:20,
	width:200,
	height:30,
	color:"#000",
	font:{fontSize:15,fontWeight:"bold"},
	textAlign: "center",
	text: Ti.App.Properties.getString("login")
})

var logoutButton = Ti.UI.createButton ({
	bottom:20,
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

//win.add(wizardButton);
win.add(emailLabel);
win.add(logoutButton);
