(function() {
	Dope.UI.createProfileEditWindow = function () {
		var win = Ti.UI.createWindow();
		
		win.title = "Personal Info";

		var nextButton = Ti.UI.createButton({title:"Next"});
		
		// UI EVENT HANDLERS
		
		nextButton.addEventListener("click", function () {
			Ti.include ("windows/wizard3.js");
			
			var classesWindow = Dope.UI.createClassesWindow();
			
			Dope.openWindow(win, classesWindow);
		})
		
		
		
		// TABLEVIEW DATA SOURCE
		
		var profileData = Profile.get();
		if (profileData.empty) {
			Ti.API.log("empty profile in local storage, trying to get local FB data");
			profileData = Profile.parseFacebookProfile();
		}
		
		var tableData = [];
		
		var row1 = Dope.UI.createTextFieldRow("Name", "John Doe");
		var row2 = Dope.UI.createSubmenuRow(win, "Gender", ["Male", "Female", "I'd rather not to say"]);
		var row3 = Dope.UI.createTextFieldRow("Graduation Year", "2012");
		row3.label.width = 150;
		row3.textField.left = 150;
		row3.textField.right = 10;
		
		var row4 = Dope.UI.createTextFieldRow("Major", "bla-bla");
		var row5 = Dope.UI.createTextFieldRow("Greek", "Alpha-Alpha-Alpha");
		var row6 = Dope.UI.createSubmenuRow(win, "Relationship", ["Single", "In a relationship", "Random play"]);
		row6.valueLabel.left = 130;
		row6.valueLabel.right = 10;
		
		var section1 = Ti.UI.createTableViewSection();
		section1.headerTitle = "Personal Info";
		
		section1.add(row1);
		section1.add(row2);
		
		var section2 = Ti.UI.createTableViewSection();
		section2.headerTitle = "Education";
		
		section2.add(row3);
		section2.add(row4);
		section2.add(row5);
		
		//var section3 = Ti.UI.createTableViewSection();
		//section3.headerTitle = "Activities";
		
		tableData.push(section1);
		tableData.push(section2);
		//tableData.push(section3);
		
		var section4 = Ti.UI.createTableViewSection();
		
		section4.add(row6);
		
		tableData.push(section4);
		
		// BUILDING UI
		
		win.rightNavButton = nextButton;

		win._saveProfile = function () {
			Ti.API.log("SAVING profile from FORM");
			for (i in win.table.data) {
				var rows = win.table.data[i].rows;
				for (j in rows) {
					var row = rows[j];
					if (row.className == "lb-tf") {
						Profile.setField(row.label.text, row.textField.value);		
									
					} else if (row.className == "lb-menu") {
						Profile.setField(row.title, row.selectedIndex);					
					}
				}
			}
			Profile.save();			
		}
		win.addEventListener("blur", win._saveProfile);
		
		var table = Titanium.UI.createTableView({
			data: tableData,
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});
		
		win.table = table;
		var footerView = Ti.UI.createView({
			height:60
		})
		table.setFooterView(footerView);
		
		win.add(table);
		return win;
	}
})()

