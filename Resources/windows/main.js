(function () {
	Dope.UI.createMainWindow = function () {
		
		// create tab group
		var tabGroup = Ti.UI.createTabGroup();
		
		//
		// create base UI tab and root window
		
		var winParty = Dope.UI.createPartylineWindow();
		var winSpotted = Dope.UI.createSpottedWindow();
		
		var winScope = Dope.UI.createScopeoutWindow();
		var winChat = Dope.UI.createChatWindow();
		
		
		
		
		
		var winProfile = Dope.UI.createProfileWindow();
		
		var tabParty = Ti.UI.createTab({
			icon : 'KS_nav_ui.png',
			title : 'Stream',
			window : winParty
		});
		var tabSpotted = Ti.UI.createTab({
			icon : 'KS_nav_ui.png',
			title : 'Spotted',
			window : winSpotted
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
		var tabProfile = Ti.UI.createTab({
			icon : 'KS_nav_ui.png',
			title : 'Profile',
			window : winProfile
		});
		
		//
		//  add tabs
		//
		tabGroup.addTab(tabParty);
		tabGroup.addTab(tabSpotted);
		tabGroup.addTab(tabScope);
		tabGroup.addTab(tabChat);
		tabGroup.addTab(tabProfile);
		
		// open tab group

		
		Ti.UI.setBackgroundColor('#000');
		
		// GLOBAL CUSTOM EVENT LISTENERS
		
		Ti.App.addEventListener("loggedIn", function (e) {
			Ti.API.log("loggedIn");

		})
		
		Ti.App.addEventListener("relogin", function (e) {
			Ti.API.log("relogin fired");

			Ti.include ("windows/login.js");
			
			Dope.UI.createLoginWindow().open({animated:true});
		})
				
		Dope.UI.mainWindow = tabGroup;

		return tabGroup;
	}
})()
