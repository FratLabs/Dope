
(function() {
	Dope.UI.createProfilePhotoFullscreenWindow = function (index, fname) {
		var win = Ti.UI.createWindow({
			title: "Photo"
		})
		
		var pWidth = Ti.Platform.displayCaps.platformWidth;

		var photoContainer = Ti.UI.createScrollView({
			width:  320,
			height: 240,
			contentWidth:1600,
			contentHeight: 1200,
			backgroundColor: "#FFF",
			minZoomScale: 0.2,
			maxZoomScale: 1,
			zoomScale:0.2,
				
		})
		var photoView = Ti.UI.createImageView({
			height:1200,
			width:1600,
			backgroundColor:"#FFF",
		})
		Ti.API.log( Titanium.Filesystem.resourcesDirectory + "images/photo.jpg");
		photoView.image = Titanium.Filesystem.resourcesDirectory +  "images/photo.jpg";

		photoContainer.add(photoView);
		
		var tableData = [];
		var count = 10;
		for (var i = 0; i < count; i++) {
			var row = Ti.UI.createTableViewRow({
				title: "[comment]",
				leftImage: "/images/user.png",
			})
			tableData.push(row);
		}
		
		var table = Ti.UI.createTableView({
			data: tableData,
			headerView: photoContainer,
		});
		
		win.add(table);
//		table.setHeaderView (photoContainer);

		return win;
	}
})()
