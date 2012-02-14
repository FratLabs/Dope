(function () {
	Dope.UI.createPartylineWindow = function () {

		var win = Ti.UI.createWindow({
			title: "Partyline",
			backgroundColor: "#FFF"		
		});
		
		//Ti.API.log("partyline Tab Loaded");
		var profileButton = Ti.UI.createButton({title:'Profile'});
		win.rightNavButton = profileButton;
		
		var spottedButton = Ti.UI.createButton({title:"Spotted"});
		win.leftNavButton = spottedButton;

		// var profileWindow = Ti.UI.createWindow({
			// navBarHidden: true,
			// modal : true,
			// modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
		// });
		
		// var profileGeneralWindow = Ti.UI.createWindow({
			// url: '/windows/profile.js',
		// })
		// var profileNavigationGroup = Ti.UI.iPhone.createNavigationGroup({
		   // window: profileGeneralWindow,
		   // parent: profileWindow,
		// });
		
		
		// profileGeneralWindow.navGroup = profileNavigationGroup;
		// profileWindow.add(profileNavigationGroup);

		var profileSpinner = Ti.UI.createActivityIndicator({width:60});
		
		var tableData = [];
		
		var section1 = Ti.UI.createTableViewSection();
		section1.setHeaderTitle("What's Hot");
		
		var hotData = [
			{"img":"/images/user.png", "title":"[Place 1]"},
			{"img":"/images/user.png", "title":"[Place 2]"}
		];
		for (var i = 0; i < hotData.length; i++) {
			var row = Ti.UI.createTableViewRow({
				title: hotData[i].title,
		//		leftImage: hotData[i].img
			});
			section1.add(row);
		}
		var section2 = Ti.UI.createTableViewSection();
		section2.setHeaderTitle("Gossip");
		
		var gossipData = [
			{"img":"/images/user.png", "title":"Lorem ipsum dolor sit amet, consectetur adipiscing elit"},
			{"img":"/images/user.png", "title":"Maecenas porttitor nisi eu turpis fringilla rutrum"},
			{"img":"/images/user.png", "title":"Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Cura"},
			{"img":"/images/user.png", "title":"Fusce commodo ligula a leo egestas et pharetra tellus pretium"},
			{"img":"/images/user.png", "title":"Praesent ullamcorper eleifend elit, sit amet mollis tellus venenatis eu"},
			{"img":"/images/user.png", "title":"Lorem ipsum dolor sit amet, consectetur adipiscing elit"},
			{"img":"/images/user.png", "title":"Maecenas porttitor nisi eu turpis fringilla rutrum"},
			{"img":"/images/user.png", "title":"Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Cura"},
			{"img":"/images/user.png", "title":"Fusce commodo ligula a leo egestas et pharetra tellus pretium"},
			{"img":"/images/user.png", "title":"Praesent ullamcorper eleifend elit, sit amet mollis tellus venenatis eu"}
		];
		var gossipDataMore = true;
		var gossipDataOffset = 0;
		for (var i = 0; i < gossipData.length && i < Defaults.MAX_GOSSIP_LINES; i++) {
			var row = Ti.UI.createTableViewRow({
				title: gossipData[i].title,
				leftImage: gossipData[i].img,
		//		height:44
			});
			section2.add(row);
		}
		
		if (gossipDataMore) {
			var moreGossipRow = Dope.UI.createMoreRow();
			
			moreGossipRow.addEventListener("click", function () {
				moreGossipRow.indicator.show();
			})
			
			section2.add(moreGossipRow);
		}
		
		tableData.push(section1);
		tableData.push(section2);
		
		var table = Titanium.UI.createTableView({
			data: tableData,
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});
		
		spottedButton.addEventListener("click", function (e) {
			Ti.include("windows/spotted.js");
			var spottedWindow = Dope.UI.createSpottedWindow();
			spottedWindow.open();
		});
			
		profileButton.addEventListener("click", function (e) {
			var profileData = Profile.get();
			if (profileData.empty) {
				
				win.rightNavButton = profileSpinner;
				profileSpinner.show();
				
				Profile.getFromServer({
					success: function (xhr) {
						win.rightNavButton = profileButton;		
						Ti.API.log("profile: success");
						var profileWindow = Dope.UI.createProfileWindow();
						profileWindow.open();
					}, 
					error: function (xhr, e) {
						Ti.API.log("profile: error");
						win.rightNavButton = profileButton;
						alert(e.error);		
					}			
				});
			} else {
				var profileWindow = Dope.UI.createProfileWindow();
				profileWindow.open();
			//	profileWindow.open();
			}
		})
		
		//BUILDING UI
		win.add(table);
		
		Titanium.UI.iPhone.statusBarStyle = Titanium.UI.iPhone.StatusBar.DEFAULT;
		
		
		var partylineWindow = Dope.UI.createNavigationGroupStack (win);
			
		var profileBadge = Ti.UI.createLabel({
			top:2,
			right:2,
			width:18,
			height:18,
			backgroundColor:"#900",
			borderColor:"#FFF",
			borderWidth:2,
			borderRadius:9,
			textAlign:"center",
			text:"1",
			font:{fontSize:11, fontWeight:"bold"},
			color:"#FFF",
			
		})
//		profileBadge.hide();
		partylineWindow.profileBadge = profileBadge;
		partylineWindow.add(profileBadge);

			
		Dope.UI.partylineWindow = partylineWindow;
		
		return partylineWindow;
	}
})()
