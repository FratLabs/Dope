var win = Ti.UI.currentWindow;
var navGroup = win.navGroup;

var parent = win.callback;
win.title = parent.title;

Ti.API.log(parent);


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
			navGroup.close(win, {animated:true});
		}, 300)
	})
	tableData.push(el);
		
}

var table = Titanium.UI.createTableView({
	data: tableData,
	style: Ti.UI.iPhone.TableViewStyle.GROUPED
});

win.add(table);