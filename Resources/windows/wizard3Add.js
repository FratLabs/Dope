var Defaults = 		require("defines");
var Funcs = 		require("lib/commonFuncs");
var TableFactory = 	require("lib/tableFactory");
var FB = 			require("lib/facebook");
var Profile = 		require("lib/profile");

var profileData = Profile.get();

var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

win.title = "New class";
win.backgroundColor = "#FFF";

var saveButton = Ti.UI.createButton({title:"Add"});

win.rightNavButton = saveButton;

var tableData = [];

var row1 = TableFactory.getTextFieldRow("Subject", "");
var row2 = TableFactory.getTextFieldRow("Class", "");
var row3 = TableFactory.getTextFieldRow("Section", "");

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
});

saveButton.addEventListener("click", function () {
	if (row1.textField.value.length && 
		row2.textField.value.length && 
		row3.selectedIndex != -1) {
		
		Ti.App.fireEvent("addClass2Profile", {"classSubject": row1.textField.value, "class": row2.textField.value, "classSection": row3.textField.value});

		navGroup.close(win, {animated:true});
		
	} else {
		alert ("You must fill in all fields");
	}
	
})
