var Defaults = require("defines");

var win = Ti.UI.currentWindow;

win.title = "Partyline";
win.backgroundColor = '#FFF';


Ti.API.log("partyline Tab Loaded");
var profileButton = Ti.UI.createButton({title:'Profile'});
win.rightNavButton = profileButton;

var profileWindow = Ti.UI.createWindow({
	modal : true,
	url: '/windows/profile.js',
	modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
});

Ti.App.addEventListener("openProfile", function (event) {
	setTimeout(function () {
		profileWindow.open();
	}, 1000)
})

profileButton.addEventListener("click", function (e) {
	profileWindow.open();
})
