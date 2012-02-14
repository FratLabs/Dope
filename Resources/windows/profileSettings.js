
(function() {
	Dope.UI.createProfileSettingsWindow = function () {
		var win = Ti.UI.createWindow({title:"Settings"});
		
		var tableData = [];
		
		var row1 = Ti.UI.createTableViewRow({title:"Change Password", hasChild:true});
		
		var section1 = Ti.UI.createTableViewSection();
		section1.add(row1);
		
		
		var row2 = Ti.UI.createTableViewRow({title:"Privacy Settings", hasChild:true});
		var row3 = Ti.UI.createTableViewRow({title:"Social Networks", hasChild:true});
		
		var section2 = Ti.UI.createTableViewSection();
		section2.add(row2);
		section2.add(row3);
		
		var section3 = Ti.UI.createTableViewSection();
		var row4 = Ti.UI.createTableViewRow({title:"Support", hasChild:true});
		var row5 = Ti.UI.createTableViewRow({title:"Privacy Policy", hasChild:true});
		var row6 = Ti.UI.createTableViewRow({title:"Terms of Use", hasChild:true});
	
		section3.add(row4);
		section3.add(row5);
		section3.add(row6);
		
		
		row1.addEventListener("click", function () {
			Ti.include("windows/profileSettingsPassword.js");
			
			var passwordWindow = Dope.UI.createProfileSettingsPasswordWindow();
			
			Dope.openWindow(win, passwordWindow);
		})
		
		row2.addEventListener("click", function () {
			Ti.include("windows/profileSettingsPrivacy.js");

			var privacyWindow = Dope.UI.createProfileSettingsPrivacyWindow();
			
			Dope.openWindow(win, privacyWindow);
		})
		
		row3.addEventListener("click", function () {
			Ti.include("windows/profileSettingsSocial.js");

			var socialWindow = Dope.UI.createProfileSettingsSocialWindow();
			
			Dope.openWindow(win, socialWindow);
		})

		Ti.include("windows/htmlFile.js");

		row6.addEventListener("click", function(e) {
			var termsWin = Dope.UI.createHTMLViewWindow(this.title, "termsofuse.txt");	

			Dope.openWindow(win, termsWin);		
		})
		
		row5.addEventListener("click", function(e) {
			var policyWin = Dope.UI.createHTMLViewWindow(this.title, "privacypolicy.txt");	

			Dope.openWindow(win, policyWin);		

		})

		tableData.push(section1);
		tableData.push(section2);
		tableData.push(section3);
		
		var table = Titanium.UI.createTableView({
			data: tableData,
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});
		
		win.table = table;
		win.add(table);
		
		return win;
	}
})()
