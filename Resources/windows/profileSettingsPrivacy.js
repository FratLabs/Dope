
(function() {
	
	Dope.UI.createProfileSettingsPrivacyWindow = function () {
		var win = Ti.UI.createWindow({
			title: "Privacy Settings",
		});

		function _selectPrivacyLevel() {
			if (win.selectedPrivacy) {
				win.selectedPrivacy.hasCheck = false;
				win.selectedPrivacy.color = "#000";
			}
			if (win.showCustom) {
				tableData.pop();
				table.data = tableData;
				win.showCustom = false;
			}

			this.hasCheck = true;
			this.color = "#358";
			
			win.selectedPrivacy = this;
		}

		var privacyOptions = ["Everyone", "College", "Friends", "None"];
		
		var section1 = Ti.UI.createTableViewSection();
		var section2 = Ti.UI.createTableViewSection();

		section1.headerTitle = "Account visibility level";

		var optRow1 = Ti.UI.createTableViewRow({title:privacyOptions[0], hasCheck:true, color:"#358"})
		var optRow2 = Ti.UI.createTableViewRow({title:privacyOptions[1]})
		var optRow3 = Ti.UI.createTableViewRow({title:privacyOptions[2]})
		var optRow4 = Ti.UI.createTableViewRow({title:privacyOptions[3]})
		var optRow5 = Ti.UI.createTableViewRow({title:"Custom"});
		
		win.selectedPrivacy = optRow1;
		
		optRow1.addEventListener("click", _selectPrivacyLevel);
		optRow2.addEventListener("click", _selectPrivacyLevel);
		optRow3.addEventListener("click", _selectPrivacyLevel);
		optRow4.addEventListener("click", _selectPrivacyLevel);
		
		optRow5.addEventListener("click", function() {
			if (! win.showCustom) {
				tableData.push(section2);
				table.data = tableData;
			}
			if (win.selectedPrivacy) {
				win.selectedPrivacy.hasCheck = false;
				win.selectedPrivacy.color = "#000";
			}

			this.hasCheck = true;
			this.color = "#358";
			
			win.showCustom = true;
			win.selectedPrivacy = this;
		})

		section1.add(optRow1);
		section1.add(optRow2);
		section1.add(optRow3);
		section1.add(optRow4);
		section1.add(optRow5);
		
		var row1 = Dope.UI.createSubmenu2Row(win, "Show my location", privacyOptions, 0);
		var row2 = Dope.UI.createSubmenu2Row(win, "Available to chat", privacyOptions, 0);
		var row3 = Dope.UI.createSubmenu2Row(win, "Scope out status", privacyOptions, 0);
		var row4 = Dope.UI.createSubmenu2Row(win, "Photos", privacyOptions, 0);
		var row5 = Dope.UI.createSubmenu2Row(win, "Friends", privacyOptions, 0);
		var row6 = Dope.UI.createSubmenu2Row(win, "Personal info", privacyOptions, 0);
		
		var tableData = [];
		
		section2.add(row1);
		section2.add(row2);
		section2.add(row3);
		section2.add(row4);
		section2.add(row5);
		section2.add(row6);
		
		section2.opacity = 0;
		section2.visible = false;
		
		tableData.push(section1);
		
//		tableData.push(section2);
		
		var table = Titanium.UI.createTableView({
			data: tableData,
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});

		win.add(table);		

		return win;
	}
})()
