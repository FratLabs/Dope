
(function() {
	Dope.UI.createChatWindow = function () {
		var win = Ti.UI.createWindow({
			title:"Chat",
			backgroundColor:"#c5ccd4"
		});
		var toolbar = Ti.UI.createToolbar({
			top:-1,
			height:44,
		});
		win.add(toolbar);
		var bb1 = Titanium.UI.iOS.createTabbedBar({
		    labels:['Map', 'List', 'Grid'],
		    index:0,
		    top:7,
		    style:Titanium.UI.iPhone.SystemButtonStyle.BAR,
		    height:30,
		    width:"70%"
		});
		win.add(bb1);
		var mapview = Titanium.Map.createView({
			top:43,
		    mapType: Titanium.Map.STANDARD_TYPE,
		    animate:true,
		    regionFit:true,
		    userLocation:true,
		});
		 
		win.add(mapview);


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
