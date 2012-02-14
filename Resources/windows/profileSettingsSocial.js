
(function() {
	
	Dope.UI.createProfileSettingsSocialWindow = function () {
		var win = Ti.UI.createWindow({
			title: "Social Networks",
		});
		
		var tableData = [];

		var table = Titanium.UI.createTableView({
			data: tableData,
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});

		win.add(table);		

		return win;
	}
})()