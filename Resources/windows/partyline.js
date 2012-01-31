var Defaults = 	require("defines");
var Profile = 	require("lib/profile");

var win = Ti.UI.currentWindow;

win.title = "Partyline";
win.backgroundColor = '#FFF';


Ti.API.log("partyline Tab Loaded");
var profileButton = Ti.UI.createButton({title:'Profile'});
win.rightNavButton = profileButton;

var profileWindow = Ti.UI.createWindow({
	navBarHidden: true,
	modal : true,
	modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
});
var profileGeneralWindow = Ti.UI.createWindow({
	url: '/windows/profile.js',
})
var profileNavigationGroup = Ti.UI.iPhone.createNavigationGroup({
   window: profileGeneralWindow,
   parent: profileWindow,
});

var profileSpinner = Ti.UI.createActivityIndicator({width:60});

profileGeneralWindow.navGroup = profileNavigationGroup;
profileWindow.add(profileNavigationGroup);

// GLOBAL EVENT HANDLERS

profileButton.addEventListener("click", function (e) {
	var profileData = Profile.get();
	if (profileData.empty) {
		
		win.rightNavButton = profileSpinner;
		profileSpinner.show();
		
		Profile.getFromServer({
			success: function () {
				win.rightNavButton = profileButton;		
				profileWindow.open();
			}, 
			error: function (e) {
			
			}			
		});
	} else {
		profileWindow.open();
	}
})
