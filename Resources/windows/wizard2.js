var Defaults = 		require("defines");
var Funcs = 		require("lib/commonFuncs");
var TableFactory = 	require("lib/tableFactory");
var FB = 			require("lib/facebook");
var Profile = 		require("lib/profile");


var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

if (win.editProfile == true) {
	win.title = "Edit Info";
	win.backButtonTitle = 'Profile';
} else {
	win.title = "Step 2";
	win.backButtonTitle = 'Step 1';
	
}
win.backgroundColor = '#FFF';


// PRIVATE FUNCTIONS



// INTERFACE COMPONENTS

var nextButton = Ti.UI.createButton({title:"Next"});

var wizard3Window = Titanium.UI.createWindow({
	url: '/windows/wizard3.js',
	navGroup: win.navGroup
})

// UI EVENT HANDLERS

nextButton.addEventListener("click", function () {
	win.navGroup.open(wizard3Window, {animated:true});

})



// TABLEVIEW DATA SOURCE

var profileData = Profile.get();
Ti.API.log("profileData: " + profileData);
Ti.API.log(profileData);

var tableData = [];

var row1 = TableFactory.getTextFieldRow("Name", "John Doe");
var row2 = TableFactory.getSubmenuRow("Gender", ["Male", "Female", "I'd rather not to say"]);
var row3 = TableFactory.getTextFieldRow("Graduation Year", "2012");
row3.label.width = 150;
row3.textField.left = 150;
row3.textField.right = 10;

var row4 = TableFactory.getTextFieldRow("Major", "bla-bla");
var row5 = TableFactory.getTextFieldRow("Greek", "Alpha-Alpha-Alpha");
var row6 = TableFactory.getSubmenuRow("Relationship", ["Single", "In a relationship", "Random play"]);
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

if (typeof win.editProfile == "undefined") {
	win.rightNavButton = nextButton;
}	

var table = Titanium.UI.createTableView({
	data: tableData,
	style: Ti.UI.iPhone.TableViewStyle.GROUPED
});

win.add(table);
