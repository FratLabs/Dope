var Defaults = require("defines");
var Funcs = require("lib/commonFuncs");
var FB = require("lib/facebook");
var Profile = require("lib/profile");

var profileData = Profile.get();


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

var classesWin = Titanium.UI.createWindow({
	url: '/windows/wizard3.js',
	navGroup: win.navGroup,
	editProfile: true
})

var photosWin = Titanium.UI.createWindow({
	url: '/windows/profilePhotos.js',
	navGroup: win.navGroup,
})


var emailLabel = Ti.UI.createLabel({
	top:40,
	height:30,
	left:70,
	right:0,
	color:"#000",
	font:{fontSize:15,fontWeight:"bold"},
	textAlign: "left",
	text: Ti.App.Properties.getString("login")
})

var nameLabel = Ti.UI.createLabel({
	top:10,
	height:30,
	left:70,
	right:0,
	color:"#000",
	font:{fontSize:20,fontWeight:"bold"},
	textAlign: "left",
//	text: "[FULLNAME]"
	text: Profile.getField("Name")
})

var profileImage = Ti.UI.createImageView({
	top:10,
	left:10,
	width:50,
	height: 50,
	backgroundColor:"#CCC"
})

var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory ,'wiz1.jpg');
if (f.exists()) {
	profileImage.image = f.read();
} else {
	Titanium.API.error("Cant find profile pic");
}

var facebookRow = Ti.UI.createTableViewRow({
	title: "**Get Facebook Info**"
});

// TABLEVIEW DATA SOURCE

var tableData = [];

var profileRow = Ti.UI.createTableViewRow({
	height:120,
	backgroundColor:"#EEE",
	selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
})

var photosRow = Ti.UI.createTableViewRow({
	title: "Photos",
	hasChild: true	
});
var classesRow = Ti.UI.createTableViewRow({
	title: "Classes",
	hasChild: true	
});

var activityRow = Ti.UI.createTableViewRow({
	title: "Activity",
	hasChild: true	
});
var friendsRow = Ti.UI.createTableViewRow({
	title: "Friends",
	hasChild: true	
});

var settingsRow = Ti.UI.createTableViewRow({
	title: "Settings",
	hasChild: true	
});

var logoutRow = Ti.UI.createTableViewRow({
	backgroundColor: "#F33",
});

logoutRow.add(
	Ti.UI.createLabel({
		text:"Log Out",
		width:"100%",
		height:44,
		textAlign:"center",
		color: "#FFF",
		shadowColor:"#333",
		shadowOffset: {x:0,y:-1},
		font: {fontSize:18, fontWeight:"bold"}
	})
);

profileRow.add(emailLabel);
profileRow.add(nameLabel);
profileRow.add(profileImage);

profileRow.name = "profileRow";
profileRow.nameLabel = nameLabel;
profileRow.profileImage = profileImage;
profileRow.emailLabel = emailLabel;

var section1 = Ti.UI.createTableViewSection();

section1.add(profileRow);
section1.add(photosRow);
section1.add(classesRow);

var section2 = Ti.UI.createTableViewSection();

section2.add(activityRow);
section2.add(friendsRow);

var section3 = Ti.UI.createTableViewSection();

section3.add(settingsRow);
section3.add(facebookRow);

var section4 = Ti.UI.createTableViewSection();

section4.add(logoutRow);

tableData.push(section1);
tableData.push(section2);

tableData.push(section3);

tableData.push(section4);


var table = Titanium.UI.createTableView({
	data: tableData,
	style: Ti.UI.iPhone.TableViewStyle.GROUPED
});

win.add(table);

// UI EVENT HANDLERS 

profileImage.addEventListener("click", function () {
	alert("*actionsheet to change profile photo*");
})

closeButton.addEventListener("click", function (e) {
	navGroup.parent.close();
})

editButton.addEventListener("click", function (e) {
	navGroup.open(editWin, {animated: true});
//	w2.open();
})

logoutRow.addEventListener("click", function() {
	Ti.API.log("FB loggin out");	
	if (Ti.Facebook.loggedIn)
		Ti.Facebook.logout();
	
	Ti.API.log("clean app login properties")
	Ti.App.Properties.setString("login", "");
	Ti.App.Properties.setString("pass", "");
	Ti.App.Properties.setString("fbData", "");
	Ti.App.Properties.setString("profileData", "");

//	Ti.API.log("close modal window")

	closeButton.fireEvent("click");

	setTimeout(function () {
//		Ti.API.log("Firing relogin event");
		Ti.App.fireEvent("relogin");
	}, 1500);
})

photosRow.addEventListener("click", function() {
	navGroup.open(photosWin, {animated: true});
});

classesRow.addEventListener("click", function() {
	navGroup.open(classesWin, {animated: true});
});


var fbData = false;
facebookRow.addEventListener("click", function() {
	if (Ti.Facebook.loggedIn) {
		Ti.API.log("fb logged in");
		FB.getFromServer(function () {
			Ti.API.log("FACEBOOK PROFILE:");
			Ti.API.log(FB.data);
			var fbProfileData = Profile.parseFacebookProfile();
			Ti.API.log("fbProfileData: ");
			Ti.API.log(fbProfileData);
		});
	} else {
		Ti.API.log("fb not logged in");
		Ti.Facebook.authorize();
	}
});


// BUILDING UI

//spinner.hide();
//win.add(spinner);

win.leftNavButton =  editButton;
win.rightNavButton = closeButton;

Ti.API.log("logged in state " + Ti.Facebook.loggedIn);

//Ti.API.log("profileData:");
//Ti.API.log(profileData);

//var fbProfileData = Profile.parseFacebookProfile();
//Ti.API.log("fbProfileData:");
//Ti.API.log(fbProfileData);

//Ti.Facebook.authorize();

win.addEventListener("focus", function () {
	Titanium.UI.iPhone.statusBarStyle = Titanium.UI.iPhone.StatusBar.DEFAULT;

	var profileRowIndex = table.getIndexByName("profileRow");
	var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory ,'wiz1.jpg');
	if (f.exists()) {	
		profileRow.profileImage.image = f.read();
	}
//	Profile.get();
	profileRow.nameLabel.setText(Profile.getField("Name"));
	table.updateRow(profileRowIndex, profileRow);
});
