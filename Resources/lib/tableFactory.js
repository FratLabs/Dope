var Profile = require("lib/profile");

exports.getTextFieldRow = function (name, hint, value) {
	var row = Ti.UI.createTableViewRow({
		height:"auto",
		className: "lb-tf",
		selectionStyle: Ti.UI.iPhone.TableViewCellSelectionStyle.NONE,
	});
	
	var label = Ti.UI.createLabel({
		height:44,
		width: 90,
		top:0,
		left:10,
		//backgroundColor:"#FF0",
		//textAlign:"right",
		color:"#358",
		font: {fontSize: 16, fontWeight:"bold"},
		text: name
	});
	if (typeof value == "undefined") {
		var tmp = Profile.getField(name);
		if (tmp.length) {
			value = tmp;
//			Ti.API.log("Profile getField:" + value);
		}
	} 
	//&& typeof profileData[name] != "undefined") 
//		value = profileData[name];
		
	var textField = Ti.UI.createTextField({
		value: value,
		hintText: hint,
		height:44,
		left:100,
		right:0,
		font: {fontSize: 16, fontWeight: "bold"},
		color: "#000",
		//backgroundColor: "#EEE",
		clearButtonMode: Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
	});
	row.label = label;
	row.textField = textField;

	row.add(label);
	row.add(textField);
	
	return row;
}


exports.getSubmenuRow = function(name, options, selectedIndex) {
	var row = Titanium.UI.createTableViewRow({
		title: name,
		color: "#358",
		hasChild: true
	});
	
	var label = Ti.UI.createLabel({
		text: "",
		right: 10,
		top: 0,
		height: 44,
		left: 100,
		textAlign: "left",
		font: {fontSize:16, fontWeight:"bold"},
		
	});
	if (typeof selectedIndex == "undefined") {
		selectedIndex = Profile.getField(name);
//		Ti.API.log("Profile getField:" + selectedIndex);
	} 

	if (selectedIndex >= 0) {
		label.text = options[selectedIndex];
	}
	row.valueLabel = label;
	row.options = options;
	row.selectedIndex = selectedIndex;
	row.add(label);


	row.addEventListener("click", function () {
		Ti.API.log("clicked row with submenu");

		var optWindow = Ti.UI.createWindow({
			className: "optionsWindow",
			url: "/windows/options.js",
			callback: row,
			navGroup: win.navGroup,
		});

		navGroup.open(optWindow, {animated: true})
	})	
	return row;
}
