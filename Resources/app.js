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
	url: '/windows/scopeout.js'
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



Ti.App.addEventListener("loggedIn", function (e) {
	alert ("closing modal window");
	loginWindow.close();
})

Ti.App.addEventListener("startProfileWizard", function (e) {
	alert ("start Profile Wizard");
	
	var wizardWindow = Ti.UI.createWindow({
		navBarHidden: true,
		modal : true,
		modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
	});
	var wizardStep1Window = Ti.UI.createWindow({
		url: 'windows/wizard1.js'
	});
	var wizNavigationGroup = Ti.UI.iPhone.createNavigationGroup({
		window: wizardStep1Window
	});
	
	wizardStep1Window.navGroup = wizNavigationGroup;
	wizardWindow.add(wizNavigationGroup);
	
	wizardWindow.open();
})


var loginWindow = Ti.UI.createWindow({
	navBarHidden: true,
	modal : true,
	modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
});

var loginWelcomeWindow = Ti.UI.createWindow({
	url: 'windows/login.js',
});

var loginNavigationGroup = Ti.UI.iPhone.createNavigationGroup({
   window: loginWelcomeWindow
});

loginWelcomeWindow.navGroup = loginNavigationGroup;

loginWindow.add(loginNavigationGroup);

if (! Ti.App.Properties.getString("login").length ) {
	loginWindow.open();
}
