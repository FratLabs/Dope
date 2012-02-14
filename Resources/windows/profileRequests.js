
(function () {
	Dope.UI.createProfileRequestsWindow = function() {
		var win = Ti.UI.createWindow({
			title: "Requests",
			
		})
		
		var tableData = [];
		
		
		var table = Ti.UI.createTableView({
			data: tableData,
		});
		win.add(table);
		
		return win;
	}
})()
