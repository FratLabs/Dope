(function () {
	
	Dope.openWindow = function(currentWindow, window) {
		if (Dope.isAndroid() == false && currentWindow.navGroup) {
			window.navGroup = currentWindow.navGroup
			currentWindow.navGroup.open(window, {animated:true})
		} else {
			window.open({animated:true});
		}
	}
	
	Dope.closeWindow = function (window) {
		if (window.navGroup) {
			window.navGroup.close(window, {animated:true});
		} else {
			window.close({animated:true});
		}
	}

	Dope.closeModalWindow = function (window) {
		if (window.navGroup.parent) {
			window.navGroup.parent.close ({animated:true});
		} else {
			window.close({animated:true});
		}
	}
	Dope.UI.tableHintColor = "#4d545e";
	Dope.UI.tableHintShadowColor = "#dae1eb";
	
	Dope.UI.createNavigationGroupStack = function (win, options) {
		var rootWin = Ti.UI.createWindow({
			navBarHidden: true
		});
		if (options && options.modal) {
			rootWin.modal = true;
			rootWin.modalTransitionStyle = Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL;			
		}
		var navGroup = Ti.UI.iPhone.createNavigationGroup({
			window: win,
			parent: rootWin
		});
		win.navGroup = navGroup;
		rootWin.add(navGroup);
		
		return rootWin;
	}
	
	Dope.UI.createTextFieldRow = function (name, hint, value) {
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

	Dope.UI.createSubmenuWindow = function(parent) {
		var win = Ti.UI.createWindow()
		
		win.title = parent.title;
		
		var tableData = [];
		
		for (var i = 0; i < parent.options.length; i++) {
			var el = Ti.UI.createTableViewRow({
				title: parent.options[i],
				hasCheck: (i == parent.selectedIndex?true:false),
			})	
			el.addEventListener("click", function (e) {
				for (var i = 0; i < tableData.length; i++) {
					if (tableData[i] == this) {
						this.hasCheck = true;
						parent.selectedIndex = i;		
						parent.valueLabel.setText(this.title);
					} else {
						tableData[i].hasCheck = false;
					}
				}
				table.data = tableData;
				setTimeout(function () {
		//			win.leftNavButton.fireEvent("click");
					Dope.closeWindow(win);
				}, 300)
			})
			tableData.push(el);
		}
		
		var table = Titanium.UI.createTableView({
			data: tableData,
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});
		
		win.add(table);
		
		return win;
		
	}
	
	Dope.UI.createSubmenuRow = function(win, name, options, selectedIndex) {
		var row = Titanium.UI.createTableViewRow({
			title: name,
			color: "#358",
			className: "lb-menu",
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

			var optionsWin = Dope.UI.createSubmenuWindow(row);
			Dope.openWindow(win, optionsWin);
		})	
	
		return row;
	}
	
	Dope.UI.createSubmenu2Row = function(win, name, options, selectedIndex) {
		var row = Dope.UI.createSubmenuRow(win, name, options, selectedIndex);
		row.valueLabel.color = "#358";
		row.valueLabel.font = {fontSize:16, fontWeight:"normal"};
		row.valueLabel.textAlign = "right";
		row.color = "#000";
		
		return row;
	}
	
	Dope.UI.createMoreRow = function () {
		var row = Ti.UI.createTableViewRow({
			height:45,
			className: "moreRow",
		});
		var moreLabel = Ti.UI.createLabel({
				width:"100%",
				height:45,
				font: {fontSize:16, fontWeight: "bold"},
				text: "More...",
				textAlign: "center",
		})
		var moreActivity = Ti.UI.createActivityIndicator({
			width:190,
			left:10,
			style: Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
		})
		moreActivity.hide();

		row.indicator = moreActivity;
		row.add(moreActivity);
		row.add(moreLabel);
			
		return row;
	}	
})()
