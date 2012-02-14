(function () {
 	Dope.UI.createProfileWindow = function () {
 		if (! Dope.UI.profileWindow) {
			var profileData = Profile.get();
		// 	
		// 	
			var win = Ti.UI.createWindow({
				title: "Profile",
				backgroundColor: "#FFF",
			});
			// INTERFACE COMPONENTS 
		
			var editButton =  Ti.UI.createButton({title: "Edit"});
			var closeButton = Ti.UI.createButton({title:"Close"});
			
			// var editWin = Ti.UI.createWindow({
				// url:"/windows/wizard2.js",
				// navGroup: win.navGroup,
				// editProfile: true,
			// })
		// 	
			// var classesWin = Titanium.UI.createWindow({
				// url: '/windows/wizard3.js',
				// navGroup: win.navGroup,
				// editProfile: true
			// })
		// 	
			// var photosWin = Titanium.UI.createWindow({
				// url: '/windows/profilePhotos.js',
				// navGroup: win.navGroup,
			// })
		// 	
		// 	
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
				backgroundColor:"#FFF",
				borderColor:"#BBB",
				borderWidth:1
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
				backgroundColor:"#DDD",
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
			var requestsRow = Ti.UI.createTableViewRow({
				title: "Requests",
				hasChild: true	
			});
			var requestsLabel = Ti.UI.createLabel({
				text:"1 person",
				textAlign:"right",
				color:"#358",
				right:10,
				left:100,
				font: {fontSize:16, fontWeight:"normal"}
			})
			requestsRow.add(requestsLabel);
			requestsRow.secondaryLabel = requestsLabel;
			
			var settingsRow = Ti.UI.createTableViewRow({
				title: "Settings",
				hasChild: true	
			});
			
			var logoutRow = Ti.UI.createTableViewRow({
				backgroundColor: "#933",
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
			section2.add(requestsRow);
			
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

				var optionsDialog = ['Take a photo','Pick from camera roll', "Pick from Facebook", "Cancel"];
		
				var actionSheet = Titanium.UI.createOptionDialog({
					options: optionsDialog,
					cancel:3
				});


				actionSheet.addEventListener("click", function (e) {
					
				});
				actionSheet.show();
						
			})
			
			closeButton.addEventListener("click", function (e) {
				Dope.closeModalWindow(win);
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
				Ti.App.Properties.setString("dataFromFacebook", "");
			
			//	Ti.API.log("close modal window")
			
				closeButton.fireEvent("click");
			
				setTimeout(function () {
					Ti.API.log("Firing relogin event");
					Ti.App.fireEvent("relogin");
				}, 1000);
			})
			

			photosRow.addEventListener("click", function() {
				Ti.include("windows/profilePhotos.js");
				
				var photosWin = Dope.UI.createProfilePhotosWindow();
				
				Dope.openWindow(win, photosWin);
			});
			
			editButton.addEventListener("click", function (e) {
				Ti.include("windows/wizard2.js");
				
				var editWin = Dope.UI.createProfileEditWindow();
				editWin.rightNavButton = null;
				
				Dope.openWindow(win, editWin);
			})

			classesRow.addEventListener("click", function() {
				Ti.include("windows/wizard3.js");
				
				var classesWin = Dope.UI.createClassesWindow();
				classesWin.rightNavButton = null;
				
				Dope.openWindow(win, classesWin);
			});
			
			activityRow.addEventListener("click", function() {
				Ti.include("windows/profileActivity.js");
				
				var activityWin = Dope.UI.createProfileActivityWindow();
				Dope.openWindow(win, activityWin);
			});
						
			friendsRow.addEventListener("click", function() {
				Ti.include("windows/profileFriends.js");
				
				var friendsWin = Dope.UI.createProfileFriendsWindow();
				
				Dope.openWindow(win, friendsWin);
			});
			
			requestsRow.addEventListener("click", function() {
				Ti.include("windows/profileRequests.js");
				
				var requestsWin = Dope.UI.createProfileRequestsWindow();
				
				Dope.openWindow(win, requestsWin);
			});

			settingsRow.addEventListener("click", function() {
				Ti.include("windows/profileSettings.js");
				
				var settingsWin = Dope.UI.createProfileSettingsWindow();
				
				Dope.openWindow(win, settingsWin);
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
				profileRow.emailLabel.setText(Ti.App.Properties.getString("login"));
				
				table.updateRow(profileRowIndex, profileRow);
			});	 		
			
			var profileWindow = Dope.UI.createNavigationGroupStack(win, {modal:true});
			Dope.UI.profileWindow = profileWindow;
			
	 		return profileWindow;
		} else {
			return Dope.UI.profileWindow;
		}
 	}
	

})()
