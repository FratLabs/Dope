
(function() {
	
	Dope.UI.createProfileSettingsPasswordWindow = function () {
		var win = Ti.UI.createWindow({
			title: "Change Password",
		});

		var spinner = Ti.UI.createActivityIndicator({width:60});	
		
		var changeButton = Ti.UI.createButton({
			title:"Change"
		})
		win.rightNavButton = changeButton;
		
		var tableData = [];
	
		var passField = Ti.UI.createTextField({
			height:44,
			left:10,
			right:10,
			font:{fontSize:16, fontWeight:"normal"},
			passwordMask:true,
			hintText: "Old Password",
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE
		});

		var passNewField = Ti.UI.createTextField({
			height:44,
			left:10,
			right:10,
			font:{fontSize:16, fontWeight:"normal"},
			passwordMask:true,
			hintText: "New Password",
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE
		});
		
		var passConfirmField = Ti.UI.createTextField({
			height:44,
			left:10,
			right:10,
			font:{fontSize:16, fontWeight:"normal"},
			passwordMask:true,
			hintText: "Confirm Password",
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE
		});

		var section1 = Ti.UI.createTableViewSection();
		var passRow = Ti.UI.createTableViewRow();
		passRow.add(passField);
		
		section1.add(passRow);

		var section2 = Ti.UI.createTableViewSection();
		
		var passNewRow = Ti.UI.createTableViewRow();
		var passConfirmRow = Ti.UI.createTableViewRow();
		
		passNewRow.add(passNewField);
		passConfirmRow.add(passConfirmField);

		section2.add(passNewRow);
		section2.add(passConfirmRow);
				
		tableData.push(section1);
		tableData.push(section2);
				
		var table = Titanium.UI.createTableView({
			data: tableData,
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});

		changeButton.addEventListener("click", function() {
			spinner.show();
			win.rightNavButton = spinner;
		});

		win.oldPass = passField;
		win.newPass = passNewField;
		win.confirmPass = passConfirmField;

		win.add(table);

		return win;
	}
})()
