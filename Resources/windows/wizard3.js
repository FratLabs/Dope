var Defaults = 		require("defines");
var Funcs = 		require("lib/commonFuncs");
var TableFactory = 	require("lib/tableFactory");
var FB = 			require("lib/facebook");
var Profile = 		require("lib/profile");

var profileData = Profile.get();

var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;
win.backgroundColor = "#FFF";

// PRIVATE FUNCTIONS

function _createRow(data) {
	var row = Ti.UI.createTableViewRow({
		className: "class-row",
		hasChild: true
	});
	var subjectLabel = Ti.UI.createLabel({
		left:10,
		width:90,
		wordWrap: false,
		text: data["classSubject"]
	})

	var classLabel = Ti.UI.createLabel({
		left:110,
		width:90,
		wordWrap: false,
		text: data["class"]
	})
	var sectionLabel = Ti.UI.createLabel({
		left:210,
		width:90,
		wordWrap: false,
		text: data["classSection"]
	})
	
	row.subjectLabel = subjectLabel;
	row.sectionLabel = sectionLabel;
	row.classLabel = classLabel;

	row.add(classLabel);
	row.add(sectionLabel);
	row.add(subjectLabel);

	return row;
}

function _saveProfileClasses() {
	for (i in tableData) {
		var rows = tableData[i].rows;
		for (j in rows) {
			var row = rows[j];
			if (row.className == "lb-tf") {
//					Ti.API.log("FIELDNAME: " + row.label.text);
//					Ti.API.log("VALUE: " + row.textField.value);

//				Profile.setField(row.label.text, row.textField.value);		
							
			}
		}
	}
	Profile.save();
}

// BUILDING UI

var nextButton = Ti.UI.createButton({title:"Next"});
var editButton = Ti.UI.createButton({title:"Edit"});

if (win.editProfile == true) {
	win.title = "Classes";
	if (Profile.data.classes && Profile.data.classes.length) {
//		win.rightNavButton = editButton;
	}
} else {
	win.title = "Step 3";
	win.backButtonTitle = 'Step 2';
	win.rightNavButton = nextButton;
}

var addClassButton = Titanium.UI.createButton({
	title: "Add",
	left:10,
	right:10,
	top:0,
	height:45,
	color:"#000",
	font:{fontSize:18,fontWeight:"bold"}	
})

var tableFooterView = Ti.UI.createView({
	left:0,
	right:0,
	height:40
})

tableFooterView.add(addClassButton);

var tableData = [];

var classes = Profile.getField("classes");
for (var i = 0; i < classes.length; i++) {
	var row = _createRow(classes[i]);
	tableData.push(row);
}

var table = Titanium.UI.createTableView({
	data: tableData,
	editable:true,
	editing:true,
	allowsSelectionDuringEditing:true,
	style: Ti.UI.iPhone.TableViewStyle.GROUPED
});

table.setFooterView(tableFooterView);

win.add(table);


// UI EVENT HANDLERS 

win.addEventListener("blur", _saveProfileClasses);	

nextButton.addEventListener("click", function () {
	win.navGroup.parent.close({animated:false});
//	win.navGroup.open(wizard4Window, {animated:true});
})

var addWindow = Ti.UI.createWindow({
	url: '/windows/wizard3Add.js',
	navGroup: win.navGroup,
	parent: win
})

addClassButton.addEventListener("click", function () {
	navGroup.open(addWindow, {animated: true});
});

Ti.App.addEventListener("addClass2Profile", function (e) {
	Ti.API.log("GET GLOBAL EVENT");
	var classes = Profile.getField("classes");
	Ti.API.log(classes);
	if (! classes) {
		classes = [];
	}
	delete e["type"];
	classes.push(e);

	Ti.API.log(e);
	var row = _createRow(e);
	tableData.push(row);
	table.appendRow(row, {animated:true});
	
	Profile.setField("classes", classes);
	Profile.save();
	
});

table.addEventListener("delete", function (e) {
	var classes = Profile.getField("classes");
//	Ti.API.log("delete row");
//	Ti.API.log(e);
	classes.splice(e.index);
	Profile.setField("classes", classes);	
	Profile.save();
})
