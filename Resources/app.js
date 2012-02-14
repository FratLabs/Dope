var Defaults = 		require("defines");
var Profile = 		require("/lib/profile");
var FB = 			require("lib/facebook");
//var TableFactory = 	require("lib/tableFactory");
		
var Ti;
		
Ti.include(
	"lib/dope.js",
	"lib/ui.js",
	
	"windows/main.js",
	"windows/login.js",
	"windows/profile.js",
	"windows/partyline.js",
	"windows/scopeout.js",
	"windows/chat.js"
);

Dope.UI.createMainWindow().open();

//Ti.App.Properties.setString("login", "");
//Ti.App.Properties.setString("pass", "");


if (Ti.App.Properties.hasProperty("login") == false || 
	Ti.App.Properties.getString("login").length == 0) {
	
	Dope.UI.createLoginWindow().open({animated:false});
}

if (! Ti.Network.online) {
	alert("Network connection required");
}
