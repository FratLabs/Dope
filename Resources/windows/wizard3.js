
(function() {
	Dope.UI.createClassesWindow = function() {
		var win = Ti.UI.createWindow({title:"Classes"})
		
		var profileData = Profile.get();
		
		// PRIVATE FUNCTIONS
		
		function _addClass2Profile (e) {
			Ti.API.log("GET GLOBAL EVENT");
			var classes = Profile.getField("classes");
			if (! classes) {
				classes = [];
			}
			Ti.API.log(classes);
			delete e["type"];
			classes.push(e);
		
			Ti.API.log(e);
			var row = _createRow(e);
			tableData.push(row);
			table.appendRow(row, {animated:true});
			
			Profile.setField("classes", classes);
			Profile.save();
			
		}

		function _createRow(data) {
			var row = Ti.UI.createTableViewRow({
				className: "class-row",
//				hasChild: true
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
		
		var finishButton = Ti.UI.createButton({title:"Finish"});
		
		win.rightNavButton = finishButton;
		
		var addClassButton = Titanium.UI.createButton({
			title: "Add class",
			left:10,
			right:10,
			top:20,
			height:45,
			color:"#000",
			font:{fontSize:18,fontWeight:"bold"}	
		})
		
		var headerView = Ti.UI.createView({
			left:0,
			right:0,
			height:65
		})
		
		headerView.add(addClassButton);
		
		var tableData = [];
		
		var classes = Profile.getField("classes");
		for (var i = 0; i < classes.length; i++) {
			var row = _createRow(classes[i]);
			tableData.push(row);
		}
		
		var table = Titanium.UI.createTableView({
			data: tableData,
			editable:true,
//			editing:true,
			allowsSelectionDuringEditing:true,
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});
		
		table.setHeaderView(headerView);
		

		Ti.include ("windows/wizard3Add.js");
		
		addClassButton.addEventListener("click", function () {
			
			var addClassWindow = Dope.UI.createAddClassWindow(_addClass2Profile);
	
			Dope.openWindow(win, addClassWindow);
		});
		
		win.add(table);

		table.addEventListener("delete", function (e) {
			var classes = Profile.getField("classes");
		//	Ti.API.log("delete row");
		//	Ti.API.log(e);
			classes.splice(e.index);
			Profile.setField("classes", classes);	
			Profile.save();
		})
		// UI EVENT HANDLERS 

		win.addEventListener("blur", _saveProfileClasses);	
//		win.addEventListener("close", _saveProfileClassess);
		
		finishButton.addEventListener("click", function () {
			
			Dope.closeModalWindow(win);
		})
		
		return win;
	}
})()







