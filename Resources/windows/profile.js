var Defaults = require("defines");
var Funcs = require("lib/commonFuncs");
var FB = require("lib/facebook");
var Profile = require("lib/profile");

var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = "Profile";
win.backgroundColor = '#FFF';

// INTERFACE COMPONENTS 

var editButton =  Ti.UI.createButton({title: "Edit"});
var closeButton = Ti.UI.createButton({title:"Close"});

var editWin = Ti.UI.createWindow({
	url:"/windows/wizard2.js",
	navGroup: win.navGroup,
	editProfile: true,
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

var fbButton = Ti.UI.createButton({
	title: "Get info from FB",
	top:100,
	width:200,
	height:40
})
/*var spinner = Ti.UI.createActivityIndicator({
	center: {y:250},
	width:30,
	height:30,
	style: Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN
});*/

// UI EVENT HANDLERS 

closeButton.addEventListener("click", function (e) {
	navGroup.parent.close();
})

editButton.addEventListener("click", function (e) {
	navGroup.open(editWin, {animated: true});
//	w2.open();
})

logoutButton.addEventListener("click", function() {
	
	closeButton.fireEvent("click");

	Ti.API.log("FB loggin out");	
	if (Ti.Facebook.loggedIn)
		Ti.Facebook.logout();
	
	Ti.API.log("clean app login properties")
	Ti.App.Properties.setString("login", "");
	Ti.App.Properties.setString("pass", "");
	Ti.App.Properties.setString("fbData", "");
	Ti.App.Properties.setString("profileData", "");

//	Ti.API.log("close modal window")

	setTimeout(function () {
//		Ti.API.log("Firing relogin event");
		Ti.App.fireEvent("relogin");
	}, 1500);
})

var fbData = false;
fbButton.addEventListener("click", function() {
	if (Ti.Facebook.loggedIn) {
		Ti.API.log("fb logged in");
		FB.getFromServer(function () {
			Ti.API.log("FACEBOOK PROFILE:");
			Ti.API.log(FB.data);
			var fbProfileData = Profile.parseFacebookProfile(FB.data);
			Ti.API.log("fbProfileData: ");
			Ti.API.log(fbProfileData);
			
		});
		

	} else {
		Ti.API.log("fb not logged in");
		Ti.Facebook.authorize();
	}
});


// BUILDING UI

//win.add(wizardButton);
win.add(emailLabel);
win.add(logoutButton);
win.add(fbButton);

//spinner.hide();
//win.add(spinner);

win.leftNavButton =  editButton;
win.rightNavButton = closeButton;

Ti.API.log("logged in state " + Ti.Facebook.loggedIn);



var profileData = Profile.get();
//Ti.API.log("profileData:");
//Ti.API.log(profileData);

//var fbProfileData = Profile.parseFacebookProfile();
//Ti.API.log("fbProfileData:");
//Ti.API.log(fbProfileData);

//Ti.Facebook.authorize();

