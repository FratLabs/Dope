
(function() {
	Dope.UI.createAddClassWindow = function (callback) {
	
		var win = Ti.UI.createWindow({title:"New Class"});
//		var profileData = Profile.get();
		
		var saveButton = Ti.UI.createButton({title:"Add"});
		win.rightNavButton = saveButton;
		win.callback = callback;
		
		var tableData = [];
		
		var row1 = Dope.UI.createTextFieldRow("Subject", "");
		var row2 = Dope.UI.createTextFieldRow("Class", "");
		var row3 = Dope.UI.createSubmenuRow(win, "Section", ["Mathematics","History","Biology", "Literature"], -1);
		//var row3 = TableFactory.getTextFieldRow("Section", "");
		
		tableData.push(row1);
		tableData.push(row2);
		tableData.push(row3);
		
		var table = Titanium.UI.createTableView({
			data: tableData,
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});
		
		win.add(table);

		
		win.addEventListener("open", function () {
			row1.textField.focus();
//			row1.textField.value = "";
//			row2.textField.value = "";
//			row3.valueLabel.text = "";
		});
		
		saveButton.addEventListener("click", function () {
			if (row1.textField.value.length && 
				row2.textField.value.length && 
				row3.selectedIndex != -1) {
				
				win.callback({"classSubject": row1.textField.value, "class": row2.textField.value, "classSection": row3.selectedIndex});
		
				Dope.closeWindow(win);
				
			} else {
				alert ("You must fill in all fields");
			}
			
		})
		
		return win;
		
	}
})();


