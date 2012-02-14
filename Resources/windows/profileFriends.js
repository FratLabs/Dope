
(function () {
	Dope.UI.createProfileFriendsWindow = function() {
		var win = Ti.UI.createWindow({
			title: "Friends",
			
		})
		var addButton = Ti.UI.createButton({
			title:"Add",
			systemButton:Titanium.UI.iPhone.SystemButton.ADD,
		});
		
		win.rightNavButton = addButton;
		
		var tableData = [];
		
		var count = 15;
		for (var i = 0; i < count; i ++) {
			var row = Ti.UI.createTableViewRow({
				title:"[username]",
				leftImage: "/images/user.png",
			})
			tableData.push(row);			
		}
		
		
		var table = Ti.UI.createTableView({
			data: tableData,
		});
		win.add(table);
		
		return win;
		
	}
})()
