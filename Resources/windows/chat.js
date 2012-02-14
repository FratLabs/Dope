
(function() {
	Dope.UI.createChatWindow = function () {
		var win = Ti.UI.createWindow({
			title:"Chat",
			backgroundColor:"#c5ccd4"
		});
		var toolbar = Ti.UI.createToolbar({
			top:0,
			height:44,
		});
		win.add(toolbar);
		var bb1 = Titanium.UI.iOS.createTabbedBar({
		    labels:['Map', 'List', 'Grid'],
		    top:5,
		    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		    height:34,
		    width:"90%"
		});
		win.add(bb1);

		// var tableData = [];
		// var table = Titanium.UI.createTableView({
			// data: tableData,
			// style: Ti.UI.iPhone.TableViewStyle.GROUPED
		// });
// 		
		// win.table = table;
		// win.add(table);		
		
		var chatWin = Dope.UI.createNavigationGroupStack(win);
		
		return chatWin;
	}
})();
