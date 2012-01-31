//var NavigationController = require('/lib/NavigationController').NavigationController;

Ti.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Ti.UI.createTabGroup();

//
// create base UI tab and root window
//
var winParty = Ti.UI.createWindow({
	url: '/windows/partyline.js'
});

var winScope = Ti.UI.createWindow({
	url: '/windows/scopeout.js',
});
var winChat = Ti.UI.createWindow({
	url: '/windows/chat.js'
});

var tabParty = Ti.UI.createTab({
	icon : 'KS_nav_ui.png',
	title : 'Partyline',
	window : winParty
});

var tabScope = Ti.UI.createTab({
	icon : 'KS_nav_ui.png',
	title : 'Scope Out',
	window : winScope
});
var tabChat = Ti.UI.createTab({
	icon : 'KS_nav_ui.png',
	title : 'Chat',
	window : winChat
});

//
//  add tabs
//
tabGroup.addTab(tabParty);
tabGroup.addTab(tabScope);
tabGroup.addTab(tabChat);

// open tab group
tabGroup.open();

var loginWindow = Ti.UI.createWindow({
	navBarHidden: true,
	modal : true,
	modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
});

var loginWelcomeWindow = Ti.UI.createWindow({
	url: 'windows/login.js',
	backgroundColor: "#999"
});

var loginNavigationGroup = Ti.UI.iPhone.createNavigationGroup({
   window: loginWelcomeWindow
});

loginWelcomeWindow.navGroup = loginNavigationGroup;

loginWindow.add(loginNavigationGroup);

if (Ti.App.Properties.hasProperty("login") == false || 
	Ti.App.Properties.getString("login").length == 0) {
	
	loginWindow.open();
}

// GLOBAL CUSTOM EVENT LISTENERS

Ti.App.addEventListener("loggedIn", function (e) {
	Ti.API.log("loggedIn");
	loginWindow.close();
})

Ti.App.addEventListener("relogin", function (e) {
	Ti.API.log("relogin fired");
	loginWindow.open();
})
