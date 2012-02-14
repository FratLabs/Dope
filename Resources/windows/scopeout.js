
(function() {
	Dope.UI.createScopeoutWindow = function () {
		var win = Ti.UI.createWindow({title:"Scope out"});
		
		var tableData = [];
		var table = Titanium.UI.createTableView({
			data: tableData,
			style: Ti.UI.iPhone.TableViewStyle.GROUPED
		});
		
		win.table = table;
		win.add(table);		
		
		var scopeoutWin = Dope.UI.createNavigationGroupStack(win);
		
		return scopeoutWin;
	}
})();
