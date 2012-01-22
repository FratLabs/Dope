var Defaults = require("defines");

var win = Ti.UI.currentWindow;

win.title = "Partyline";
win.backgroundColor = '#FFF';


Ti.API.log("im here, partyline loaded");
var profileButton = Ti.UI.createButton({title:'Profile'});
win.rightNavButton = profileButton;

profileButton.addEventListener("click", function (e) {
	var profileWindow = Ti.UI.createWindow({
		modal : true,
		url: '/windows/profile.js',
		modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
	});
	profileWindow.open();
})
